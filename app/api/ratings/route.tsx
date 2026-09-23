import { NextRequest } from "next/server";

import { eq, sql } from "drizzle-orm";

import { products, ratings } from "@/db/schema";

import { db } from "@/db/drizzle";

import { ApiError, handleApiError } from "@/lib/APIs/api-errors";

import { requireUser } from "@/lib/APIs/auth";

import { createRatingSchema } from "@/lib/validations";

export const runtime = "nodejs";

// ============================================================
// POST /api/ratings
// ============================================================
//
// Create a rating for a product.
//
// Body:
//
// {
//   "productId": "...",
//   "rating": 5
// }
//
// ============================================================

export async function POST(req: NextRequest) {
  try {
    // ========================================================
    // REQUIRE AUTHENTICATED USER
    // ========================================================

    const user = await requireUser();

    // ========================================================
    // REQUEST BODY
    // ========================================================

    const body = await req.json();

    // ========================================================
    // VALIDATE
    // ========================================================

    const input = createRatingSchema.parse(body);

    // ========================================================
    // FIND PRODUCT
    // ========================================================

    const product = await db.query.products.findFirst({
      where: {
        id: input.productId,
      },
    });

    if (!product) {
      throw new ApiError("Product not found", 404);
    }

    // ========================================================
    // PRODUCT MUST BE ACTIVE
    // ========================================================

    if (product.status !== "active") {
      throw new ApiError("This product is not available for rating", 400);
    }

    // ========================================================
    // CHECK EXISTING RATING
    // ========================================================

    const existingRating = await db.query.ratings.findFirst({
      where: {
        productId: input.productId,
        userId: user.id,
      },
    });

    if (existingRating) {
      throw new ApiError("You have already rated this product", 409);
    }

    // ========================================================
    // CREATE RATING
    // ========================================================

    const [rating] = await db
      .insert(ratings)
      .values({
        productId: input.productId,

        userId: user.id,

        rating: input.rating,
      })
      .returning();

    if (!rating) {
      throw new ApiError("Rating creation failed", 500);
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
      .where(eq(ratings.productId, input.productId));

    const average = Number(ratingStats[0]?.average ?? 0);

    const count = Number(ratingStats[0]?.count ?? 0);

    // ========================================================
    // UPDATE PRODUCT RATING SUMMARY
    // ========================================================

    await db
      .update(products)
      .set({
        averageRating: average.toFixed(2),

        ratingCount: count,

        updatedAt: new Date(),
      })
      .where(eq(products.id, input.productId));

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json(
      {
        success: true,

        data: rating,

        message: "Rating submitted successfully",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST /api/ratings error:", error);

    return handleApiError(error);
  }
}
