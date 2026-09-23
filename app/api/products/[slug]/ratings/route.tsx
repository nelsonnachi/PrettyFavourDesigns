import { NextRequest } from "next/server";

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
// Public endpoint.
//
// Returns all ratings belonging to a product.
//
// The product is identified using its slug.
//
// ============================================================

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    // ========================================================
    // 1. GET PARAMS
    // ========================================================

    const { slug } = await context.params;

    // ========================================================
    // 2. FIND PRODUCT
    // ========================================================

    const product = await db.query.products.findFirst({
      where: {
        slug,
      },

      columns: {
        id: true,
      },
    });

    // ========================================================
    // 3. PRODUCT NOT FOUND
    // ========================================================

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
    // 4. GET PRODUCT RATINGS
    // ========================================================
    //
    // Latest Drizzle relational query builder.
    //
    // No:
    //
    // .select()
    // .from()
    // .innerJoin()
    //
    // Instead, we use:
    //
    // db.query.ratings.findMany()
    //
    // with:
    //
    // user
    //
    // ========================================================

    const productRatings = await db.query.ratings.findMany({
      where: {
        productId: product.id,
      },

      columns: {
        id: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
      },

      with: {
        user: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data: productRatings,
    });
  } catch (error) {
    console.error("GET /api/products/[slug]/ratings error:", error);

    return handleApiError(error);
  }
}
