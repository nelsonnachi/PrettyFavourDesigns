import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { carts, cartItems } from "@/db/schema/carts";

import { ApiError, handleApiError } from "@/lib/APIs/api-errors";
import { getOrCreateCart } from "@/lib/APIs/cart";

// ============================================================
// DELETE ALL CART ITEMS
// ============================================================

export async function DELETE() {
  try {
    const { cart } = await getOrCreateCart();

    // --------------------------------------------------------
    // Remove all items + bump cart timestamp atomically
    // --------------------------------------------------------

    await db.transaction(async (tx) => {
      await tx.delete(cartItems).where(eq(cartItems.cartId, cart.id));

      await tx.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cart.id));
    });

    return NextResponse.json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    return handleApiError(error);
  }
}