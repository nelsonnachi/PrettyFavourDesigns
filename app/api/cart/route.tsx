import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";

import { carts, cartItems } from "@/db/schema/carts";

import { ApiError, handleApiError } from "@/lib/APIs/api-errors";

import { addToCartSchema } from "@/lib/validations";

import { getOrCreateCart } from "@/lib/APIs/cart";

// ============================================================
// GET CART
// ============================================================

export async function GET() {
  try {
    const { cart } = await getOrCreateCart();

    const items = await db.query.cartItems.findMany({
      where: {
        cartId: cart.id,
      },

      columns: {
        id: true,
        quantity: true,
      },

      with: {
        product: {
          columns: {
            id: true,
            name: true,
            slug: true,
            sku: true,
            price: true,
          },

          with: {
            images: {
              columns: {
                url: true,
              },

              where: {
                isPrimary: true,
              },

              limit: 1,
            },
          },
        },

        variant: {
          columns: {
            id: true,
            sku: true,
            stock: true,
            reservedStock: true,
          },
        },
      },
    });

    let subtotal = 0;
    let totalItems = 0;

    const formattedItems = items.map((item) => {
      if (!item.product) {
        throw new ApiError(
          "Product associated with this cart item was not found",
          404,
        );
      }

      if (!item.variant) {
        throw new ApiError(
          "Product variant associated with this cart item was not found",
          404,
        );
      }

      const price = Number(item.product.price);

      const itemSubtotal = price * item.quantity;

      subtotal += itemSubtotal;
      totalItems += item.quantity;

      const availableStock = Math.max(
        item.variant.stock - item.variant.reservedStock,
        0,
      );

      return {
        id: item.id,

        quantity: item.quantity,

        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          sku: item.product.sku,
          price,
          imageUrl: item.product.images[0]?.url ?? null,
        },

        variant: {
          id: item.variant.id,
          sku: item.variant.sku,
          stock: item.variant.stock,
          reservedStock: item.variant.reservedStock,
          availableStock,
        },

        subtotal: itemSubtotal,
      };
    });

    return NextResponse.json({
      success: true,

      data: {
        id: cart.id,
        items: formattedItems,
        totalItems,
        subtotal,
        itemCount: formattedItems.length,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// ADD TO CART
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const { cart } = await getOrCreateCart();

    const body = await request.json();

    const data = addToCartSchema.parse(body);

    const variant = await db.query.productVariants.findFirst({
      where: {
        id: data.variantId,
        productId: data.productId,
      },

      columns: {
        id: true,
        productId: true,
        stock: true,
        reservedStock: true,
      },

      with: {
        product: {
          columns: {
            id: true,
            name: true,
            price: true,
            status: true,
            deletedAt: true,
          },
        },
      },
    });

    if (!variant) {
      throw new ApiError(
        "Product variant not found",
        404,
      );
    }

    if (!variant.product) {
      throw new ApiError(
        "Product associated with this variant was not found",
        404,
      );
    }

    if (variant.product.deletedAt) {
      throw new ApiError(
        "This product is no longer available",
        400,
      );
    }

    if (variant.product.status !== "active") {
      throw new ApiError(
        "This product is not available for purchase",
        400,
      );
    }

    const availableStock = Math.max(
      variant.stock - variant.reservedStock,
      0,
    );

    if (availableStock <= 0) {
      throw new ApiError(
        "This product variant is out of stock",
        400,
      );
    }

    if (data.quantity > availableStock) {
      throw new ApiError(
        `Only ${availableStock} item${
          availableStock === 1 ? "" : "s"
        } available`,
        400,
      );
    }

    const existingItem =
      await db.query.cartItems.findFirst({
        where: {
          cartId: cart.id,
          variantId: data.variantId,
        },

        columns: {
          id: true,
          quantity: true,
        },
      });

    // ========================================================
    // EXISTING CART ITEM
    // ========================================================

    if (existingItem) {
      const newQuantity =
        existingItem.quantity + data.quantity;

      if (newQuantity > 50) {
        throw new ApiError(
          "You can only have up to 50 of this item in your cart",
          400,
        );
      }

      if (newQuantity > availableStock) {
        throw new ApiError(
          `Only ${availableStock} item${
            availableStock === 1 ? "" : "s"
          } available`,
          400,
        );
      }

      const result = await db
        .update(cartItems)
        .set({
          quantity: newQuantity,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existingItem.id))
        .returning();

      await db
        .update(carts)
        .set({
          updatedAt: new Date(),
        })
        .where(eq(carts.id, cart.id));

      return NextResponse.json({
        success: true,

        message: "Cart updated successfully",

        data: result[0],
      });
    }

    // ========================================================
    // NEW CART ITEM
    // ========================================================

    const result = await db
      .insert(cartItems)
      .values({
        cartId: cart.id,
        productId: data.productId,
        variantId: data.variantId,
        quantity: data.quantity,
      })
      .returning();

    const newItem = result[0];

    if (!newItem) {
      throw new ApiError(
        "Failed to add item to cart",
        500,
      );
    }

    await db
      .update(carts)
      .set({
        updatedAt: new Date(),
      })
      .where(eq(carts.id, cart.id));

    return NextResponse.json(
      {
        success: true,

        message: "Item added to cart",

        data: newItem,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return handleApiError(error);
  }
}