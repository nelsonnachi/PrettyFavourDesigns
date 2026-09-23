import { NextResponse } from "next/server";

import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";
import crypto from "crypto";

import { cartItems } from "@/db/schema/carts";
import { productVariants } from "@/db/schema/products";
import { orders, orderItems } from "@/db/schema/orders";
import { orderShippingAddresses } from "@/db/schema/order-shipping-addresses";
import { addresses } from "@/db/schema/addresses";
import { payments } from "@/db/schema/payments";

import { requireUser } from "@/lib/APIs/auth";

import { ApiError, handleApiError } from "@/lib/APIs/api-errors";

import { checkoutSchema } from "@/lib/validations/checkout";

import { getOrCreateCart } from "@/lib/APIs/cart";

// ============================================================
// CHECKOUT
// ============================================================

export async function POST(request: Request) {
  try {
    // ========================================================
    // 1. REQUIRE AUTHENTICATED USER
    // ========================================================

    const user = await requireUser();

    // ========================================================
    // 2. VALIDATE REQUEST
    // ========================================================

    const body = await request.json();

    const data = checkoutSchema.parse(body);

    // ========================================================
    // 3. GET CUSTOMER CART
    // ========================================================

    const cartResult = await getOrCreateCart();

    const cart = cartResult.cart;

    // ========================================================
    // 4. GET CART WITH RELATIONS
    // ========================================================

    const cartWithItems = await db.query.carts.findFirst({
      where: {
        id: cart.id,
      },

      with: {
        items: {
          with: {
            product: {
              with: {
                images: true,
              },
            },

            variant: {
              with: {
                color: true,
              },
            },
          },
        },
      },
    });

    // ========================================================
    // 5. MAKE SURE CART EXISTS
    // ========================================================

    if (!cartWithItems) {
      throw new ApiError("Cart not found", 404);
    }

    // ========================================================
    // 6. MAKE SURE CART IS NOT EMPTY
    // ========================================================

    if (cartWithItems.items.length === 0) {
      throw new ApiError("Your cart is empty", 400);
    }

    // ========================================================
    // 7. VERIFY SHIPPING ADDRESS
    // ========================================================

    const addressResult = await db
      .select()
      .from(addresses)
      .where(
        and(eq(addresses.id, data.addressId), eq(addresses.userId, user.id)),
      )
      .limit(1);

    const shippingAddress = addressResult[0];

    if (!shippingAddress) {
      throw new ApiError("Shipping address not found", 404);
    }

    // ========================================================
    // 8. CALCULATE SUBTOTAL
    // ========================================================

    let subtotal = 0;

    for (const item of cartWithItems.items) {
      // Every sellable item must have a variant.
      if (!item.variant) {
        throw new ApiError(
          `No variant was selected for "${item.product.name}"`,
          400,
        );
      }

      // Every variant must have a color.
      if (!item.variant.color) {
        throw new ApiError(
          `No color was selected for "${item.product.name}"`,
          400,
        );
      }

      const price = Number(item.product.price);

      const quantity = item.quantity;

      subtotal += price * quantity;
    }

    // ========================================================
    // 9. SHIPPING FEE
    // ========================================================

    const shippingFee = 0;

    // ========================================================
    // 10. DISCOUNT
    // ========================================================

    const discount = 0;

    // ========================================================
    // 11. TOTAL
    // ========================================================

    const total = subtotal + shippingFee - discount;

    // ========================================================
    // 12. GENERATE ORDER NUMBER
    // ========================================================

    const orderNumber = `SHP-${Date.now()}-${crypto
      .randomUUID()
      .slice(0, 8)
      .toUpperCase()}`;

    // ========================================================
    // 13. GENERATE PAYMENT REFERENCE
    // ========================================================
    //
    // This payment is created ONCE here.
    //
    // The Paystack initialization endpoint will reuse
    // this reference instead of creating another payment.
    //
    // ========================================================

    const paymentReference = `SHOPPFD-${orderNumber}-${crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 12)
      .toUpperCase()}`;

    // ========================================================
    // 14. DATABASE TRANSACTION
    // ========================================================

    const checkoutResult = await db.transaction(async (tx) => {
      // ====================================================
      // CREATE ORDER
      // ====================================================

      const orderResult = await tx
        .insert(orders)
        .values({
          orderNumber,

          userId: user.id,

          status: "pending",

          paymentStatus: "pending",

          paymentMethod: data.paymentMethod,

          subtotal: subtotal.toFixed(2),

          shippingFee: shippingFee.toFixed(2),

          discount: discount.toFixed(2),

          total: total.toFixed(2),

          notes: data.notes,
        })
        .returning();

      const createdOrder = orderResult[0];

      if (!createdOrder) {
        throw new ApiError("Failed to create order", 500);
      }

      // ====================================================
      // CREATE ONE PAYMENT
      // ====================================================

      const paymentResult = await tx
        .insert(payments)
        .values({
          orderId: createdOrder.id,

          provider:
            data.paymentMethod === "paystack" ? "paystack" : "cash_on_delivery",

          reference: paymentReference,

          amount: total.toFixed(2),

          currency: "NGN",

          status: "pending",
        })
        .returning();

      const createdPayment = paymentResult[0];

      if (!createdPayment) {
        throw new ApiError("Failed to create payment", 500);
      }

      // ====================================================
      // CREATE SHIPPING ADDRESS SNAPSHOT
      // ====================================================

      await tx.insert(orderShippingAddresses).values({
        orderId: createdOrder.id,

        firstName: shippingAddress.firstName,

        lastName: shippingAddress.lastName,

        phone: shippingAddress.phone,

        addressLine1: shippingAddress.addressLine1,

        addressLine2: shippingAddress.addressLine2,

        city: shippingAddress.city,

        state: shippingAddress.state,

        country: shippingAddress.country,

        postalCode: shippingAddress.postalCode,
      });

      // ====================================================
      // PROCESS CART ITEMS
      // ====================================================

      for (const item of cartWithItems.items) {
        const product = item.product;

        const variant = item.variant;

        if (!variant) {
          throw new ApiError(
            `No variant was selected for "${product.name}"`,
            400,
          );
        }

        const color = variant.color;

        if (!color) {
          throw new ApiError(
            `No color was selected for "${product.name}"`,
            400,
          );
        }

        // ==================================================
        // PRICE
        // ==================================================

        const price = Number(product.price);

        const quantity = item.quantity;

        const itemTotal = price * quantity;

        // ==================================================
        // PRIMARY IMAGE
        // ==================================================

        let productImageUrl: string | null = null;

        for (const image of product.images) {
          if (image.isPrimary) {
            productImageUrl = image.url;
            break;
          }
        }

        // ==================================================
        // CREATE ORDER ITEM
        // ==================================================

        await tx.insert(orderItems).values({
          orderId: createdOrder.id,

          productId: product.id,

          variantId: variant.id,

          productName: product.name,

          productSku: product.sku,

          variantSku: variant.sku,

          colorName: color.name,

          productImageUrl,

          quantity,

          unitPrice: price.toFixed(2),

          totalPrice: itemTotal.toFixed(2),
        });

        // ==================================================
        // RESERVE STOCK
        // ==================================================

        const updatedVariant = await tx
          .update(productVariants)
          .set({
            reservedStock: sql<number>`
              ${productVariants.reservedStock} + ${quantity}
            `,

            updatedAt: new Date(),
          })
          .where(
            and(
              eq(productVariants.id, variant.id),

              sql`
                ${productVariants.stock}
                -
                ${productVariants.reservedStock}
                >= ${quantity}
              `,
            ),
          )
          .returning();

        // ==================================================
        // STOCK UNAVAILABLE
        // ==================================================

        if (updatedVariant.length === 0) {
          throw new ApiError(
            `${product.name} (${color.name}) does not have enough stock`,
            409,
          );
        }
      }

      // ====================================================
      // CLEAR CART
      // ====================================================

      await tx.delete(cartItems).where(eq(cartItems.cartId, cart.id));

      // ====================================================
      // RETURN CHECKOUT RESULT
      // ====================================================

      return {
        order: createdOrder,

        payment: createdPayment,
      };
    });

    // ========================================================
    // 15. SUCCESS RESPONSE
    // ========================================================

    return NextResponse.json(
      {
        success: true,

        message: "Checkout completed successfully",

        data: {
          order: checkoutResult.order,

          payment: {
            id: checkoutResult.payment.id,

            reference: checkoutResult.payment.reference,

            amount: checkoutResult.payment.amount,

            currency: checkoutResult.payment.currency,

            status: checkoutResult.payment.status,
          },
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
