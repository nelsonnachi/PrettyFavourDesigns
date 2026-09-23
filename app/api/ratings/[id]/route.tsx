import { NextRequest } from "next/server";

import { eq } from "drizzle-orm";

import { products, ratings } from "@/db/schema";

import { db } from "@/db/drizzle";

import { ApiError, handleApiError } from "@/lib/APIs/api-errors";

import { requireUser } from "@/lib/APIs/auth";

import { ratingIdParamSchema, updateRatingSchema } from "@/lib/validations";

export const runtime = "nodejs";

// ============================================================
// TYPES
// ============================================================

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// ============================================================
// PATCH /api/ratings/[id]
// ============================================================

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    // ========================================================
    // 1. REQUIRE USER
    // ========================================================

    const user = await requireUser();

    // ========================================================
    // 2. GET PARAMS
    // ========================================================

    const params = await context.params;

    const { id } = ratingIdParamSchema.parse(params);

    // ========================================================
    // 3. FIND RATING
    // ========================================================

    const existingRating = await db.query.ratings.findFirst({
      where: {
        id,
      },

      columns: {
        id: true,
        productId: true,
        userId: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // ========================================================
    // 4. MAKE SURE RATING EXISTS
    // ========================================================

    if (!existingRating) {
      throw new ApiError("Rating not found", 404);
    }

    // ========================================================
    // 5. MAKE SURE USER OWNS RATING
    // ========================================================

    if (existingRating.userId !== user.id) {
      throw new ApiError("You can only update your own rating", 403);
    }

    // ========================================================
    // 6. READ BODY
    // ========================================================

    const body = await req.json();

    // ========================================================
    // 7. VALIDATE BODY
    // ========================================================

    const input = updateRatingSchema.parse(body);

    // ========================================================
    // 8. UPDATE RATING
    // ========================================================

    const [updatedRating] = await db
      .update(ratings)
      .set({
        rating: input.rating,

        updatedAt: new Date(),
      })
      .where(eq(ratings.id, id))
      .returning();

    // ========================================================
    // 9. MAKE SURE UPDATE SUCCEEDED
    // ========================================================

    if (!updatedRating) {
      throw new ApiError("Rating update failed", 500);
    }

    // ========================================================
    // 10. GET ALL PRODUCT RATINGS
    // ========================================================

    const productRatings = await db.query.ratings.findMany({
      where: {
        productId: existingRating.productId,
      },

      columns: {
        rating: true,
      },
    });

    // ========================================================
    // 11. RECALCULATE SUMMARY
    // ========================================================

    let totalRating = 0;

    for (const item of productRatings) {
      totalRating += item.rating;
    }

    const ratingCount = productRatings.length;

    const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

    // ========================================================
    // 12. UPDATE PRODUCT SUMMARY
    // ========================================================

    await db
      .update(products)
      .set({
        averageRating: averageRating.toFixed(2),

        ratingCount,

        updatedAt: new Date(),
      })
      .where(eq(products.id, existingRating.productId));

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data: updatedRating,

      message: "Rating updated successfully",
    });
  } catch (error) {
    console.error("PATCH /api/ratings/[id] error:", error);

    return handleApiError(error);
  }
}

// ============================================================
// DELETE /api/ratings/[id]
// ============================================================

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    // ========================================================
    // 1. REQUIRE USER
    // ========================================================

    const user = await requireUser();

    // ========================================================
    // 2. GET PARAMS
    // ========================================================

    const params = await context.params;

    const { id } = ratingIdParamSchema.parse(params);

    // ========================================================
    // 3. FIND RATING
    // ========================================================

    const existingRating = await db.query.ratings.findFirst({
      where: {
        id,
      },

      columns: {
        id: true,
        productId: true,
        userId: true,
      },
    });

    // ========================================================
    // 4. MAKE SURE RATING EXISTS
    // ========================================================

    if (!existingRating) {
      throw new ApiError("Rating not found", 404);
    }

    // ========================================================
    // 5. MAKE SURE USER OWNS RATING
    // ========================================================

    if (existingRating.userId !== user.id) {
      throw new ApiError("You can only delete your own rating", 403);
    }

    // ========================================================
    // 6. DELETE RATING
    // ========================================================

    const [deletedRating] = await db
      .delete(ratings)
      .where(eq(ratings.id, id))
      .returning({
        id: ratings.id,
      });

    // ========================================================
    // 7. MAKE SURE DELETE SUCCEEDED
    // ========================================================

    if (!deletedRating) {
      throw new ApiError("Rating deletion failed", 500);
    }

    // ========================================================
    // 8. GET REMAINING RATINGS
    // ========================================================

    const productRatings = await db.query.ratings.findMany({
      where: {
        productId: existingRating.productId,
      },

      columns: {
        rating: true,
      },
    });

    // ========================================================
    // 9. RECALCULATE SUMMARY
    // ========================================================

    let totalRating = 0;

    for (const item of productRatings) {
      totalRating += item.rating;
    }

    const ratingCount = productRatings.length;

    const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

    // ========================================================
    // 10. UPDATE PRODUCT SUMMARY
    // ========================================================

    await db
      .update(products)
      .set({
        averageRating: averageRating.toFixed(2),

        ratingCount,

        updatedAt: new Date(),
      })
      .where(eq(products.id, existingRating.productId));

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      message: "Rating deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/ratings/[id] error:", error);

    return handleApiError(error);
  }
}
