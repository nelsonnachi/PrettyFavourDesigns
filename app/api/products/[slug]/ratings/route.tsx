import { NextRequest } from "next/server";

import { desc, eq } from "drizzle-orm";

import { ratings, users } from "@/db/schema";

import { db } from "@/db/drizzle";

import { handleApiError } from "@/lib/APIs/api-errors";

export const runtime = "nodejs";

// ============================================================
// TYPES
// ============================================================

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

// ============================================================
// GET /api/products/[slug]/ratings
// ============================================================
//
// Returns all ratings for a product using the product slug.
//
// ============================================================

export async function GET(
  req: NextRequest,
  context: RouteContext,
) {
  try {
    // ========================================================
    // PARAMS
    // ========================================================

    const { slug } = await context.params;

    // ========================================================
    // FIND PRODUCT
    // ========================================================

    const product = await db.query.products.findFirst({
      where: {
        slug,
      },
      columns: {
        id: true,
      },
    });

    if (!product) {
      return Response.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        },
      );
    }

    // ========================================================
    // GET RATINGS
    // ========================================================

    const productRatings = await db
      .select({
        id: ratings.id,

        rating: ratings.rating,

        createdAt: ratings.createdAt,

        updatedAt: ratings.updatedAt,

        user: {
          id: users.id,

          firstName: users.firstName,

          lastName: users.lastName,

          imageUrl: users.imageUrl,
        },
      })
      .from(ratings)
      .innerJoin(users, eq(ratings.userId, users.id))
      .where(eq(ratings.productId, product.id))
      .orderBy(desc(ratings.createdAt));

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data: productRatings,
    });
  } catch (error) {
    console.error(
      "GET /api/products/[slug]/ratings error:",
      error,
    );

    return handleApiError(error);
  }
}