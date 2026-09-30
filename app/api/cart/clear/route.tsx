import { NextRequest, NextResponse } from "next/server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";

import { carts, cartItems } from "@/db/schema/carts";

import { ApiError, handleApiError } from "@/lib/APIs/api-errors";

import { cartItemIdParamSchema } from "@/lib/validations";

import { getOrCreateCart } from "@/lib/APIs/cart";

// ============================================================
// DELETE CART ITEM
// ============================================================

export async function DELETE(
  _request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    // --------------------------------------------------------
    // Get current cart
    // --------------------------------------------------------

    const { cart } = await getOrCreateCart();

    // --------------------------------------------------------
    // Get route params
    // --------------------------------------------------------

    const params = await context.params;

    const { id } = cartItemIdParamSchema.parse(params);

    // --------------------------------------------------------
    // Delete only an item belonging to
    // the current cart.
    // --------------------------------------------------------

    const deletedItems = await db
      .delete(cartItems)
      .where(and(eq(cartItems.id, id), eq(cartItems.cartId, cart.id)))
      .returning({
        id: cartItems.id,
        quantity: cartItems.quantity,
      });

    const deletedItem = deletedItems[0];

    // --------------------------------------------------------
    // Item was not found in current cart
    // --------------------------------------------------------

    if (!deletedItem) {
      throw new ApiError("Cart item not found", 404);
    }

    // --------------------------------------------------------
    // Update cart timestamp
    // --------------------------------------------------------

    await db
      .update(carts)
      .set({
        updatedAt: new Date(),
      })
      .where(eq(carts.id, cart.id));

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,

      message: "Item removed from cart",

      data: {
        id: deletedItem.id,
        quantity: deletedItem.quantity,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
