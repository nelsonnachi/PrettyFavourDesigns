import { NextRequest } from "next/server";

import {
  desc,
  eq,
} from "drizzle-orm";

import {
  ratings,
  users,
} from "@/db/schema";

import { db } from "@/db/drizzle";

import {
  handleApiError,
} from "@/lib/APIs/api-errors";

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
// GET /api/ratings/[productId]
// ============================================================
//
// Returns all ratings for a product.
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

    const { productId } =
      await context.params;

    // ========================================================
    // GET RATINGS
    // ========================================================

    const productRatings =
      await db
        .select({
          id:
            ratings.id,

          rating:
            ratings.rating,

          createdAt:
            ratings.createdAt,

          updatedAt:
            ratings.updatedAt,

          user: {
            id:
              users.id,

            firstName:
              users.firstName,

            lastName:
              users.lastName,

            imageUrl:
              users.imageUrl,
          },
        })
        .from(ratings)
        .innerJoin(
          users,
          eq(
            ratings.userId,
            users.id,
          ),
        )
        .where(
          eq(
            ratings.productId,
            productId,
          ),
        )
        .orderBy(
          desc(
            ratings.createdAt,
          ),
        );

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data: productRatings,
    });
  } catch (error) {
    console.error(
      "GET /api/ratings/[productId] error:",
      error,
    );

    return handleApiError(error);
  }
}