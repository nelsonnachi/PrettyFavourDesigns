import { NextResponse } from "next/server";

import { and, eq, sql } from "drizzle-orm";

import crypto from "crypto";

import { db } from "@/db/drizzle";

import { carts, cartItems } from "@/db/schema/carts";

import { products, productVariants } from "@/db/schema/products";

import { orders, orderItems } from "@/db/schema/orders";

import { orderShippingAddresses } from "@/db/schema/order-shipping-addresses";

import { addresses } from "@/db/schema/addresses";

import { payments } from "@/db/schema/payments";

import { requireUser } from "@/lib/APIs/auth";

import { ApiError, handleApiError } from "@/lib/APIs/api-errors";

import { checkoutSchema } from "@/lib/validations/checkout";

import { getOrCreateCart } from "@/lib/APIs/cart";

import {
  checkDiscount,
  recordDiscountUsage,
  type DiscountItem,
} from "@/lib/APIs/discount";

// ============================================================
// TYPES
// ============================================================

type DbError = {
  code?: string;
};

// ============================================================
// HELPERS
// ============================================================

function createOrderNumber() {
  return `SHP-${Date.now()}-${crypto
    .randomUUID()
    .replace(/-/g, "")
    .slice(0, 8)
    .toUpperCase()}`;
}

function createPaymentReference(
  paymentMethod: "paystack" | "cash_on_delivery",
  orderNumber: string,
) {
  const prefix = paymentMethod === "paystack" ? "SHOPPFD" : "COD";

  return `${prefix}-${orderNumber}-${crypto
    .randomUUID()
    .replace(/-/g, "")
    .slice(0, 12)
    .toUpperCase()}`;
}

// ============================================================
// MONEY HELPER
// ============================================================

function round2(amount: number) {
  return Math.round(amount * 100) / 100;
}

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
    // 2. READ REQUEST BODY
    // ========================================================

    const body = await request.json();

    // ========================================================
    // 3. VALIDATE REQUEST
    // ========================================================

    const data = checkoutSchema.parse(body);

    // ========================================================
    // 4. CHECK EXISTING CHECKOUT
    // ========================================================

    const existingOrderResult = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.checkoutIdempotencyKey, data.idempotencyKey),
          eq(orders.userId, user.id),
        ),
      )
      .limit(1);

    const existingOrder = existingOrderResult[0];

    if (existingOrder) {
      const existingPaymentResult = await db
        .select()
        .from(payments)
        .where(eq(payments.orderId, existingOrder.id))
        .limit(1);

      const existingPayment = existingPaymentResult[0];

      return NextResponse.json({
        success: true,

        message: "Checkout already exists",

        data: {
          order: existingOrder,

          payment: existingPayment
            ? {
                id: existingPayment.id,
                reference: existingPayment.reference,
                amount: existingPayment.amount,
                currency: existingPayment.currency,
                status: existingPayment.status,
              }
            : null,

          alreadyCreated: true,
        },
      });
    }

    // ========================================================
    // 5. GET OR CREATE CART
    // ========================================================

    const cartResult = await getOrCreateCart();

    const cartId = cartResult.cart.id;

    // ========================================================
    // 6. CREATE CHECKOUT TRANSACTION
    // ========================================================

    try {
      const checkoutResult = await db.transaction(async (tx) => {
        const now = new Date();

        // ==================================================
        // 6A. LOCK CART
        // ==================================================

        const lockedCartResult = await tx
          .select()
          .from(carts)
          .where(eq(carts.id, cartId))
          .for("update")
          .limit(1);

        const lockedCart = lockedCartResult[0];

        if (!lockedCart) {
          throw new ApiError("Cart not found", 404);
        }

        // ==================================================
        // 6B. READ CART ITEMS INSIDE TRANSACTION
        // ==================================================

        const cartWithItems = await tx.query.carts.findFirst({
          where: {
            id: lockedCart.id,
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

        if (!cartWithItems) {
          throw new ApiError("Cart not found", 404);
        }

        if (cartWithItems.items.length === 0) {
          throw new ApiError("Your cart is empty", 400);
        }

        // ==================================================
        // 6C. GET SHIPPING ADDRESS INSIDE TRANSACTION
        // ==================================================

        const addressResult = await tx
          .select()
          .from(addresses)
          .where(
            and(
              eq(addresses.id, data.addressId),
              eq(addresses.userId, user.id),
            ),
          )
          .limit(1);

        const shippingAddress = addressResult[0];

        if (!shippingAddress) {
          throw new ApiError("Shipping address not found", 404);
        }

        // ==================================================
        // 6D. VALIDATE CART + CALCULATE SUBTOTAL
        // ==================================================

        let subtotal = 0;

        // These are the exact items that the discount engine
        // will use for the server-side discount calculation.
        const discountItems: DiscountItem[] = [];

        for (const item of cartWithItems.items) {
          // ------------------------------------------------
          // PRODUCT
          // ------------------------------------------------

          if (!item.product) {
            throw new ApiError("A product in your cart no longer exists", 400);
          }

          const product = item.product;

          // ------------------------------------------------
          // PRODUCT STATUS
          // ------------------------------------------------

          if (product.status !== "active") {
            throw new ApiError(`"${product.name}" is no longer available`, 400);
          }

          // ------------------------------------------------
          // SOFT DELETED PRODUCT
          // ------------------------------------------------

          if (product.deletedAt) {
            throw new ApiError(`"${product.name}" is no longer available`, 400);
          }

          // ------------------------------------------------
          // VARIANT
          // ------------------------------------------------

          if (!item.variant) {
            throw new ApiError(
              `No variant was selected for "${product.name}"`,
              400,
            );
          }

          const variant = item.variant;

          // ------------------------------------------------
          // VARIANT BELONGS TO PRODUCT
          // ------------------------------------------------

          if (variant.productId !== product.id) {
            throw new ApiError(`Invalid variant for "${product.name}"`, 400);
          }

          // ------------------------------------------------
          // COLOR
          // ------------------------------------------------

          if (!variant.color) {
            throw new ApiError(
              `No color was selected for "${product.name}"`,
              400,
            );
          }

          const color = variant.color;

          // ------------------------------------------------
          // COLOR ACTIVE
          // ------------------------------------------------

          if (!color.isActive) {
            throw new ApiError(
              `The selected color for "${product.name}" is unavailable`,
              400,
            );
          }

          // ------------------------------------------------
          // QUANTITY
          // ------------------------------------------------

          if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
            throw new ApiError(`Invalid quantity for "${product.name}"`, 400);
          }

          // ------------------------------------------------
          // PRICE
          // ------------------------------------------------

          const price = Number(product.price);

          if (!Number.isFinite(price) || price < 0) {
            throw new ApiError(`Invalid price for "${product.name}"`, 500);
          }

          // ------------------------------------------------
          // SUBTOTAL
          // ------------------------------------------------

          subtotal += price * item.quantity;

          // ------------------------------------------------
          // DISCOUNT ITEM
          // ------------------------------------------------
          //
          // We use the exact same product/category/price/
          // quantity information that the discount preview uses.
          //

          discountItems.push({
            productId: product.id,
            categoryId: product.categoryId,
            price,
            quantity: item.quantity,
          });
        }

        subtotal = round2(subtotal);

        // ==================================================
        // 6E. CALCULATE DISCOUNT ON THE SERVER
        // ==================================================
        //
        // IMPORTANT:
        //
        // We NEVER trust the discount amount from the frontend.
        //
        // The frontend only sends:
        //
        //     discountCode: "SAVE10"
        //
        // The server checks the actual discount again using
        // the actual cart contents.
        //

        let discountAmount = 0;

        let discountId: string | null = null;

        if (data.discountCode) {
          const discountResult = await checkDiscount(tx, {
            code: data.discountCode,
            userId: user.id,
            items: discountItems,
          });

          discountAmount = discountResult.discountAmount;

          discountId = discountResult.discount.id;
        }

        discountAmount = round2(discountAmount);

        // ==================================================
        // 6F. CALCULATE FINAL TOTAL
        // ==================================================

        const shippingFee = 0;

        const total = round2(subtotal + shippingFee - discountAmount);

        if (!Number.isFinite(total) || total <= 0) {
          throw new ApiError("Invalid checkout total", 400);
        }

        // ==================================================
        // 6G. CREATE IDENTIFIERS
        // ==================================================

        const orderNumber = createOrderNumber();

        const paymentReference = createPaymentReference(
          data.paymentMethod,
          orderNumber,
        );

        // ==================================================
        // 6H. CREATE ORDER
        // ==================================================

        const orderResult = await tx
          .insert(orders)
          .values({
            orderNumber,

            checkoutIdempotencyKey: data.idempotencyKey,

            userId: user.id,

            status: "pending",

            paymentStatus: "pending",

            paymentMethod: data.paymentMethod,

            subtotal: subtotal.toFixed(2),

            shippingFee: shippingFee.toFixed(2),

            // THIS IS NOW THE REAL SERVER-CALCULATED DISCOUNT
            discount: discountAmount.toFixed(2),

            // THIS IS THE DISCOUNTED TOTAL
            total: total.toFixed(2),

            notes: data.notes ?? null,

            createdAt: now,

            updatedAt: now,
          })
          .returning();

        const createdOrder = orderResult[0];

        if (!createdOrder) {
          throw new ApiError("Failed to create order", 500);
        }

        // ==================================================
        // 6I. CREATE PAYMENT
        // ==================================================
        //
        // IMPORTANT:
        //
        // payment.amount is the FINAL DISCOUNTED TOTAL.
        //
        // Paystack/payment processing must use this amount.
        //

        const paymentResult = await tx
          .insert(payments)
          .values({
            orderId: createdOrder.id,

            provider:
              data.paymentMethod === "paystack"
                ? "paystack"
                : "cash_on_delivery",

            reference: paymentReference,

            // FINAL DISCOUNTED AMOUNT
            amount: total.toFixed(2),

            currency: "NGN",

            status: "pending",

            createdAt: now,

            updatedAt: now,
          })
          .returning();

        const createdPayment = paymentResult[0];

        if (!createdPayment) {
          throw new ApiError("Failed to create payment", 500);
        }

        // ==================================================
        // 6J. RECORD DISCOUNT USAGE
        // ==================================================
        //
        // This happens inside the SAME transaction.
        //
        // If recording the usage fails, the order and payment
        // are rolled back too.
        //

        if (discountId) {
          await recordDiscountUsage(tx, {
            discountId,

            userId: user.id,

            orderId: createdOrder.id,

            discountAmount,
          });
        }

        // ==================================================
        // 6K. CREATE SHIPPING SNAPSHOT
        // ==================================================

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

          createdAt: now,
        });

        // ==================================================
        // 6L. CREATE ORDER ITEMS + RESERVE STOCK
        // ==================================================

        for (const item of cartWithItems.items) {
          const product = item.product;

          const variant = item.variant;

          if (!product || !variant) {
            throw new ApiError("Invalid cart item", 400);
          }

          const color = variant.color;

          if (!color) {
            throw new ApiError(
              `No color was selected for "${product.name}"`,
              400,
            );
          }

          const price = Number(product.price);

          const quantity = item.quantity;

          const itemTotal = price * quantity;

          const primaryImage = product.images.find((image) => image.isPrimary);

          // ----------------------------------------------
          // CREATE ORDER ITEM
          // ----------------------------------------------

          await tx.insert(orderItems).values({
            orderId: createdOrder.id,

            productId: product.id,

            variantId: variant.id,

            productName: product.name,

            productSku: product.sku,

            variantSku: variant.sku,

            colorName: color.name,

            productImageUrl: primaryImage?.url ?? null,

            quantity,

            // Original product price
            unitPrice: price.toFixed(2),

            // Original item total
            totalPrice: itemTotal.toFixed(2),

            createdAt: now,
          });

          // ----------------------------------------------
          // RESERVE STOCK ATOMICALLY
          // ----------------------------------------------

          const updatedVariant = await tx
            .update(productVariants)
            .set({
              reservedStock: sql`
                ${productVariants.reservedStock}
                + ${quantity}
              `,

              updatedAt: now,
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

          if (updatedVariant.length === 0) {
            throw new ApiError(
              `${product.name} (${color.name}) does not have enough stock`,
              409,
            );
          }
        }

        // ==================================================
        // 6M. CLEAR CART
        // ==================================================

        await tx.delete(cartItems).where(eq(cartItems.cartId, lockedCart.id));

        // ==================================================
        // 6N. RETURN CREATED RECORDS
        // ==================================================

        return {
          order: createdOrder,

          payment: createdPayment,

          discount: {
            id: discountId,

            code: data.discountCode ?? null,

            amount: discountAmount,
          },
        };
      });

      // ======================================================
      // 7. SUCCESS RESPONSE
      // ======================================================

      return NextResponse.json(
        {
          success: true,

          message: "Checkout completed successfully",

          data: {
            order: checkoutResult.order,

            payment: {
              id: checkoutResult.payment.id,

              reference: checkoutResult.payment.reference,

              // FINAL DISCOUNTED PAYMENT AMOUNT
              amount: checkoutResult.payment.amount,

              currency: checkoutResult.payment.currency,

              status: checkoutResult.payment.status,
            },

            discount: checkoutResult.discount,

            alreadyCreated: false,
          },
        },
        {
          status: 201,
        },
      );
    } catch (error) {
      // ======================================================
      // 8. HANDLE IDEMPOTENCY RACE
      // ======================================================

      const dbError = error as DbError;

      if (dbError.code === "23505") {
        const existingOrderResult = await db
          .select()
          .from(orders)
          .where(
            and(
              eq(orders.checkoutIdempotencyKey, data.idempotencyKey),

              eq(orders.userId, user.id),
            ),
          )
          .limit(1);

        const existingOrder = existingOrderResult[0];

        if (existingOrder) {
          const existingPaymentResult = await db
            .select()
            .from(payments)
            .where(eq(payments.orderId, existingOrder.id))
            .limit(1);

          const existingPayment = existingPaymentResult[0];

          return NextResponse.json({
            success: true,

            message: "Checkout already exists",

            data: {
              order: existingOrder,

              payment: existingPayment
                ? {
                    id: existingPayment.id,

                    reference: existingPayment.reference,

                    amount: existingPayment.amount,

                    currency: existingPayment.currency,

                    status: existingPayment.status,
                  }
                : null,

              alreadyCreated: true,
            },
          });
        }
      }

      throw error;
    }
  } catch (error) {
    // ========================================================
    // 9. HANDLE API ERROR
    // ========================================================

    return handleApiError(error);
  }
}
