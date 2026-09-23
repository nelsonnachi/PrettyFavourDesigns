import { NextRequest } from "next/server";

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
    // 1. REQUIRE AUTHENTICATED USER
    // ========================================================

    const user = await requireUser();

    // ========================================================
    // 2. READ REQUEST BODY
    // ========================================================

    const body = await req.json();

    // ========================================================
    // 3. VALIDATE REQUEST
    // ========================================================

    const input = createRatingSchema.parse(body);

    // ========================================================
    // 4. FIND PRODUCT
    // ========================================================
    //
    // Latest Drizzle relational query builder.
    //
    // ========================================================

    const product = await db.query.products.findFirst({
      where: {
        id: input.productId,
      },

      columns: {
        id: true,
        status: true,
      },
    });

    // ========================================================
    // 5. MAKE SURE PRODUCT EXISTS
    // ========================================================

    if (!product) {
      throw new ApiError("Product not found", 404);
    }

    // ========================================================
    // 6. PRODUCT MUST BE ACTIVE
    // ========================================================

    if (product.status !== "active") {
      throw new ApiError("This product is not available for rating", 400);
    }

    // ========================================================
    // 7. CHECK EXISTING RATING
    // ========================================================

    const existingRating = await db.query.ratings.findFirst({
      where: {
        productId: input.productId,

        userId: user.id,
      },

      columns: {
        id: true,
      },
    });

    // ========================================================
    // 8. PREVENT DUPLICATE RATING
    // ========================================================

    if (existingRating) {
      throw new ApiError("You have already rated this product", 409);
    }

    // ========================================================
    // 9. CREATE RATING
    // ========================================================

    const [createdRating] = await db
      .insert(ratings)
      .values({
        productId: input.productId,

        userId: user.id,

        rating: input.rating,
      })
      .returning();

    // ========================================================
    // 10. MAKE SURE CREATION SUCCEEDED
    // ========================================================

    if (!createdRating) {
      throw new ApiError("Rating creation failed", 500);
    }

    // ========================================================
    // 11. GET ALL PRODUCT RATINGS
    // ========================================================
    //
    // Latest Drizzle relational query builder.
    //
    // We only need the rating value here.
    //
    // ========================================================

    const productRatings = await db.query.ratings.findMany({
      where: {
        productId: input.productId,
      },

      columns: {
        rating: true,
      },
    });

    // ========================================================
    // 12. CALCULATE RATING SUMMARY
    // ========================================================

    let totalRating = 0;

    for (const item of productRatings) {
      totalRating += item.rating;
    }

    const ratingCount = productRatings.length;

    const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

    // ========================================================
    // 13. UPDATE PRODUCT RATING SUMMARY
    // ========================================================

    await db
      .update(products)
      .set({
        averageRating: averageRating.toFixed(2),

        ratingCount,

        updatedAt: new Date(),
      })
      .where(
        // Core mutation operator is still
        // correct for UPDATE queries.
        //
        // This is not a relational read.
        //
        (products.id as any).eq
          ? (products.id as any).eq(input.productId)
          : undefined,
      );

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json(
      {
        success: true,

        data: createdRating,

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
