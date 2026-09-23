import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  eq,
  and,
} from "drizzle-orm";

import { db } from "@/db/drizzle";

import {
  carts,
  cartItems,
} from "@/db/schema/carts";

import {
  ApiError,
  handleApiError,
} from "@/lib/APIs/api-errors";

import {
  updateCartItemSchema,
  cartItemIdParamSchema,
} from "@/lib/validations";

import {
  getOrCreateCart,
} from "@/lib/APIs/cart";

// ============================================================
// UPDATE CART ITEM
// ============================================================

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const { cart } =
      await getOrCreateCart();

    const params =
      await context.params;

    const { id } =
      cartItemIdParamSchema.parse(
        params,
      );

    const body =
      await request.json();

    const data =
      updateCartItemSchema.parse(
        body,
      );

    const item =
      await db.query.cartItems.findFirst({
        where: {
          id,
          cartId: cart.id,
        },

        columns: {
          id: true,
          quantity: true,
          productId: true,
          variantId: true,
        },

        with: {
          product: {
            columns: {
              status: true,
              deletedAt: true,
            },
          },

          variant: {
            columns: {
              stock: true,
              reservedStock: true,
            },
          },
        },
      });

    if (!item) {
      throw new ApiError(
        "Cart item not found",
        404,
      );
    }

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

    if (
      item.product.deletedAt ||
      item.product.status !== "active"
    ) {
      throw new ApiError(
        "This product is no longer available",
        400,
      );
    }

    const availableStock =
      Math.max(
        item.variant.stock -
          item.variant.reservedStock,
        0,
      );

    if (
      data.quantity >
      availableStock
    ) {
      throw new ApiError(
        `Only ${availableStock} item${
          availableStock === 1
            ? ""
            : "s"
        } available`,
        400,
      );
    }

    const updatedResult =
      await db
        .update(cartItems)
        .set({
          quantity:
            data.quantity,

          updatedAt:
            new Date(),
        })
        .where(
          and(
            eq(
              cartItems.id,
              id,
            ),
            eq(
              cartItems.cartId,
              cart.id,
            ),
          ),
        )
        .returning();

    const updatedItem =
      updatedResult[0];

    if (!updatedItem) {
      throw new ApiError(
        "Failed to update cart item",
        500,
      );
    }

    await db
      .update(carts)
      .set({
        updatedAt:
          new Date(),
      })
      .where(
        eq(
          carts.id,
          cart.id,
        ),
      );

    return NextResponse.json({
      success: true,

      message:
        "Cart item updated successfully",

      data: updatedItem,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// DELETE CART ITEM
// ============================================================

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const { cart } =
      await getOrCreateCart();

    const params =
      await context.params;

    const { id } =
      cartItemIdParamSchema.parse(
        params,
      );

    const result =
      await db
        .delete(cartItems)
        .where(
          and(
            eq(
              cartItems.id,
              id,
            ),
            eq(
              cartItems.cartId,
              cart.id,
            ),
          ),
        )
        .returning();

    const deletedItem =
      result[0];

    if (!deletedItem) {
      throw new ApiError(
        "Cart item not found",
        404,
      );
    }

    await db
      .update(carts)
      .set({
        updatedAt:
          new Date(),
      })
      .where(
        eq(
          carts.id,
          cart.id,
        ),
      );

    return NextResponse.json({
      success: true,

      message:
        "Item removed from cart",
    });
  } catch (error) {
    return handleApiError(error);
  }
}