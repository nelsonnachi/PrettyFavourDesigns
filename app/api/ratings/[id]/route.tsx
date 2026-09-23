import { NextRequest } from "next/server";

import { eq, sql } from "drizzle-orm";

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
    // REQUIRE USER
    // ========================================================

    const user = await requireUser();

    // ========================================================
    // PARAMS
    // ========================================================

    const { id } = await context.params;

    const params = ratingIdParamSchema.parse({
      id,
    });

    // ========================================================
    // FIND RATING
    // ========================================================

    const existingRating = await db.query.ratings.findFirst({
      where: {
        id: params.id,
      },
    });

    if (!existingRating) {
      throw new ApiError("Rating not found", 404);
    }

    // ========================================================
    // MAKE SURE USER OWNS RATING
    // ========================================================

    if (existingRating.userId !== user.id) {
      throw new ApiError("You can only update your own rating", 403);
    }

    // ========================================================
    // BODY
    // ========================================================

    const body = await req.json();

    // ========================================================
    // VALIDATE
    // ========================================================

    const input = updateRatingSchema.parse(body);

    // ========================================================
    // UPDATE RATING
    // ========================================================

    const [updatedRating] = await db
      .update(ratings)
      .set({
        rating: input.rating,

        updatedAt: new Date(),
      })
      .where(eq(ratings.id, params.id))
      .returning();

    if (!updatedRating) {
      throw new ApiError("Rating update failed", 500);
    }

    // ========================================================
    // RECALCULATE PRODUCT RATING
    // ========================================================

    const ratingStats = await db
      .select({
        average: sql<string>`AVG(${ratings.rating})`,

        count: sql<number>`COUNT(${ratings.id})`,
      })
      .from(ratings)
      .where(eq(ratings.productId, existingRating.productId));

    const average = Number(ratingStats[0]?.average ?? 0);

    const count = Number(ratingStats[0]?.count ?? 0);

    // ========================================================
    // UPDATE PRODUCT
    // ========================================================

    await db
      .update(products)
      .set({
        averageRating: average.toFixed(2),

        ratingCount: count,

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
    // REQUIRE USER
    // ========================================================

    const user = await requireUser();

    // ========================================================
    // PARAMS
    // ========================================================

    const { id } = await context.params;

    const params = ratingIdParamSchema.parse({
      id,
    });

    // ========================================================
    // FIND RATING
    // ========================================================

    const existingRating = await db.query.ratings.findFirst({
      where: {
        id: params.id,
      },
    });

    if (!existingRating) {
      throw new ApiError("Rating not found", 404);
    }

    // ========================================================
    // MAKE SURE USER OWNS RATING
    // ========================================================

    if (existingRating.userId !== user.id) {
      throw new ApiError("You can only delete your own rating", 403);
    }

    // ========================================================
    // DELETE RATING
    // ========================================================

    await db.delete(ratings).where(eq(ratings.id, params.id));

    // ========================================================
    // RECALCULATE PRODUCT RATING
    // ========================================================

    const ratingStats = await db
      .select({
        average: sql<string>`AVG(${ratings.rating})`,

        count: sql<number>`COUNT(${ratings.id})`,
      })
      .from(ratings)
      .where(eq(ratings.productId, existingRating.productId));

    const average = Number(ratingStats[0]?.average ?? 0);

    const count = Number(ratingStats[0]?.count ?? 0);

    // ========================================================
    // UPDATE PRODUCT
    // ========================================================

    await db
      .update(products)
      .set({
        averageRating: average.toFixed(2),

        ratingCount: count,

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
