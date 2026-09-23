import { NextRequest } from "next/server";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import {
  products,
  wishlistItems,
} from "@/db/schema";

import {
  ApiError,
  handleApiError,
} from "@/lib/APIs/api-errors";

import {
  requireUser,
} from "@/lib/APIs/auth";

import {
  addWishlistSchema,
} from "@/lib/validations";

export const runtime = "nodejs";

// ============================================================
// GET /api/wishlist
// ============================================================
//
// Get the current user's wishlist.
//
// ============================================================

export async function GET(
  req: NextRequest,
) {
  try {
    // ========================================================
    // REQUIRE USER
    // ========================================================

    const user = await requireUser();

    // ========================================================
    // GET WISHLIST
    // ========================================================

    const items =
      await db
        .select({
          id:
            wishlistItems.id,

          productId:
            wishlistItems.productId,

          createdAt:
            wishlistItems.createdAt,

          product: {
            id:
              products.id,

            name:
              products.name,

            slug:
              products.slug,

            sku:
              products.sku,

            price:
              products.price,

            compareAtPrice:
              products.compareAtPrice,

            status:
              products.status,

            isFeatured:
              products.isFeatured,

            isNewArrival:
              products.isNewArrival,

            isBestSeller:
              products.isBestSeller,

            averageRating:
              products.averageRating,

            ratingCount:
              products.ratingCount,

            soldCount:
              products.soldCount,
          },
        })
        .from(wishlistItems)
        .innerJoin(
          products,
          eq(
            wishlistItems.productId,
            products.id,
          ),
        )
        .where(
          eq(
            wishlistItems.userId,
            user.id,
          ),
        )
        .orderBy(
          desc(
            wishlistItems.createdAt,
          ),
        );

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data: items,

      count: items.length,
    });
  } catch (error) {
    console.error(
      "GET /api/wishlist error:",
      error,
    );

    return handleApiError(error);
  }
}

// ============================================================
// POST /api/wishlist
// ============================================================
//
// Add a product to the current user's wishlist.
//
// Body:
//
// {
//   "productId": "product-uuid"
// }
//
// ============================================================

export async function POST(
  req: NextRequest,
) {
  try {
    // ========================================================
    // REQUIRE USER
    // ========================================================

    const user = await requireUser();

    // ========================================================
    // REQUEST BODY
    // ========================================================

    const body =
      await req.json();

    // ========================================================
    // VALIDATE
    // ========================================================

    const input =
      addWishlistSchema.parse(body);

    // ========================================================
    // CHECK PRODUCT
    // ========================================================

    const productResult =
      await db
        .select({
          id:
            products.id,

          status:
            products.status,

          deletedAt:
            products.deletedAt,
        })
        .from(products)
        .where(
          eq(
            products.id,
            input.productId,
          ),
        )
        .limit(1);

    const product =
      productResult[0];

    if (!product) {
      throw new ApiError(
        "Product not found",
        404,
      );
    }

    // ========================================================
    // PRODUCT MUST BE ACTIVE
    // ========================================================

    if (
      product.status !== "active" ||
      product.deletedAt !== null
    ) {
      throw new ApiError(
        "Product is not available",
        404,
      );
    }

    // ========================================================
    // CHECK EXISTING WISHLIST ITEM
    // ========================================================

    const existingResult =
      await db
        .select({
          id:
            wishlistItems.id,
        })
        .from(wishlistItems)
        .where(
          and(
            eq(
              wishlistItems.userId,
              user.id,
            ),

            eq(
              wishlistItems.productId,
              input.productId,
            ),
          ),
        )
        .limit(1);

    const existing =
      existingResult[0];

    // ========================================================
    // ALREADY IN WISHLIST
    // ========================================================

    if (existing) {
      return Response.json({
        success: true,

        data: existing,

        message:
          "Product is already in your wishlist",
      });
    }

    // ========================================================
    // ADD TO WISHLIST
    // ========================================================

    const [item] =
      await db
        .insert(wishlistItems)
        .values({
          userId:
            user.id,

          productId:
            input.productId,
        })
        .returning();

    if (!item) {
      throw new ApiError(
        "Unable to add product to wishlist",
        500,
      );
    }

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json(
      {
        success: true,

        data: item,

        message:
          "Product added to wishlist",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "POST /api/wishlist error:",
      error,
    );

    return handleApiError(error);
  }
}