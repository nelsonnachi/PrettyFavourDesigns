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
    // --------------------------------------------------------
    // Get or create cart
    // --------------------------------------------------------

    const { cart } =
      await getOrCreateCart();

    // --------------------------------------------------------
    // Get route params
    // --------------------------------------------------------

    const params =
      await context.params;

    const { id } =
      cartItemIdParamSchema.parse(
        params,
      );

    // --------------------------------------------------------
    // Read request body
    // --------------------------------------------------------

    const body =
      await request.json();

    // --------------------------------------------------------
    // Validate quantity
    // --------------------------------------------------------

    const data =
      updateCartItemSchema.parse(
        body,
      );

    // --------------------------------------------------------
    // Find cart item
    // --------------------------------------------------------

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
          // --------------------------------------------------
          // PRODUCT
          // --------------------------------------------------

          product: {
            columns: {
              status: true,
              deletedAt: true,
            },
          },

          // --------------------------------------------------
          // VARIANT
          // --------------------------------------------------

          variant: {
            columns: {
              stock: true,
              reservedStock: true,
            },

            // ------------------------------------------------
            // COLOR
            // ------------------------------------------------

            with: {
              color: {
                columns: {
                  id: true,
                  name: true,
                  hexCode: true,
                  isActive: true,
                },
              },
            },
          },
        },
      });

    // --------------------------------------------------------
    // Cart item must exist
    // --------------------------------------------------------

    if (!item) {
      throw new ApiError(
        "Cart item not found",
        404,
      );
    }

    // --------------------------------------------------------
    // Product must exist
    // --------------------------------------------------------

    if (!item.product) {
      throw new ApiError(
        "Product associated with this cart item was not found",
        404,
      );
    }

    // --------------------------------------------------------
    // Variant must exist
    // --------------------------------------------------------

    if (!item.variant) {
      throw new ApiError(
        "Product variant associated with this cart item was not found",
        404,
      );
    }

    // --------------------------------------------------------
    // Color must exist
    // --------------------------------------------------------

    if (!item.variant.color) {
      throw new ApiError(
        "Product color associated with this cart item was not found",
        404,
      );
    }

    // --------------------------------------------------------
    // Product availability
    // --------------------------------------------------------

    if (
      item.product.deletedAt ||
      item.product.status !==
        "active"
    ) {
      throw new ApiError(
        "This product is no longer available",
        400,
      );
    }

    // --------------------------------------------------------
    // Color availability
    // --------------------------------------------------------

    if (
      !item.variant.color.isActive
    ) {
      throw new ApiError(
        "This product color is no longer available",
        400,
      );
    }

    // --------------------------------------------------------
    // Calculate available stock
    // --------------------------------------------------------

    const availableStock =
      Math.max(
        item.variant.stock -
          item.variant.reservedStock,
        0,
      );

    // --------------------------------------------------------
    // Check requested quantity
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // Update cart item
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // Make sure update succeeded
    // --------------------------------------------------------

    if (!updatedItem) {
      throw new ApiError(
        "Failed to update cart item",
        500,
      );
    }

    // --------------------------------------------------------
    // Update cart timestamp
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

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
    // --------------------------------------------------------
    // Get or create cart
    // --------------------------------------------------------

    const { cart } =
      await getOrCreateCart();

    // --------------------------------------------------------
    // Get route params
    // --------------------------------------------------------

    const params =
      await context.params;

    const { id } =
      cartItemIdParamSchema.parse(
        params,
      );

    // --------------------------------------------------------
    // Delete cart item
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // Make sure item existed
    // --------------------------------------------------------

    if (!deletedItem) {
      throw new ApiError(
        "Cart item not found",
        404,
      );
    }

    // --------------------------------------------------------
    // Update cart timestamp
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,

      message:
        "Item removed from cart",
    });
  } catch (error) {
    return handleApiError(error);
  }
}