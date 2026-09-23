import { NextRequest } from "next/server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";

import { products, wishlistItems } from "@/db/schema";

import { ApiError, handleApiError } from "@/lib/APIs/api-errors";

import { requireUser } from "@/lib/APIs/auth";

import { wishlistProductParamSchema } from "@/lib/validations";

export const runtime = "nodejs";

// ============================================================
// TYPES
// ============================================================

interface RouteContext {
  params: Promise<{
    productId: string;
  }>;
}

// ============================================================
// GET /api/wishlist/[productId]
// ============================================================
//
// Check whether a product is in the current user's wishlist.
//
// ============================================================

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    // ========================================================
    // REQUIRE USER
    // ========================================================

    const user = await requireUser();

    // ========================================================
    // PARAMS
    // ========================================================

    const { productId } = await context.params;

    // ========================================================
    // VALIDATE PARAM
    // ========================================================

    const input = wishlistProductParamSchema.parse({
      productId,
    });

    // ========================================================
    // FIND WISHLIST ITEM
    // ========================================================

    const result = await db
      .select({
        id: wishlistItems.id,

        productId: wishlistItems.productId,

        createdAt: wishlistItems.createdAt,
      })
      .from(wishlistItems)
      .where(
        and(
          eq(wishlistItems.userId, user.id),

          eq(wishlistItems.productId, input.productId),
        ),
      )
      .limit(1);

    const item = result[0];

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data: {
        isInWishlist: Boolean(item),

        item: item ?? null,
      },
    });
  } catch (error) {
    console.error("GET /api/wishlist/[productId] error:", error);

    return handleApiError(error);
  }
}

// ============================================================
// DELETE /api/wishlist/[productId]
// ============================================================
//
// Remove a product from the current user's wishlist.
//
// ============================================================

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    // ========================================================
    // REQUIRE USER
    // ========================================================

    const user = await requireUser();

    // ========================================================
    // PARAMS
    // ========================================================

    const { productId } = await context.params;

    // ========================================================
    // VALIDATE PARAM
    // ========================================================

    const input = wishlistProductParamSchema.parse({
      productId,
    });

    // ========================================================
    // CHECK PRODUCT
    // ========================================================

    const productResult = await db
      .select({
        id: products.id,
      })
      .from(products)
      .where(eq(products.id, input.productId))
      .limit(1);

    const product = productResult[0];

    if (!product) {
      throw new ApiError("Product not found", 404);
    }

    // ========================================================
    // DELETE WISHLIST ITEM
    // ========================================================

    const deleted = await db
      .delete(wishlistItems)
      .where(
        and(
          eq(wishlistItems.userId, user.id),

          eq(wishlistItems.productId, input.productId),
        ),
      )
      .returning({
        id: wishlistItems.id,
      });

    // ========================================================
    // ITEM NOT FOUND
    // ========================================================

    if (deleted.length === 0) {
      throw new ApiError("Product is not in your wishlist", 404);
    }

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      message: "Product removed from wishlist",
    });
  } catch (error) {
    console.error("DELETE /api/wishlist/[productId] error:", error);

    return handleApiError(error);
  }
}
