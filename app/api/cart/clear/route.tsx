import { NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";

import { carts, cartItems } from "@/db/schema/carts";

import {
  handleApiError,
} from "@/lib/APIs/api-errors";

import { getOrCreateCart } from "@/lib/APIs/cart";

// ============================================================
// DELETE ENTIRE CART
// ============================================================

export async function DELETE(_request: NextRequest) {
  try {
    // --------------------------------------------------------
    // Get current cart
    // --------------------------------------------------------

    const { cart } = await getOrCreateCart();

    // --------------------------------------------------------
    // Delete all items belonging to the current cart
    // --------------------------------------------------------

    await db
      .delete(cartItems)
      .where(eq(cartItems.cartId, cart.id));

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
      message: "Cart cleared successfully",
      data: {
        cartId: cart.id,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}