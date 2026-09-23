import { NextRequest } from "next/server";

import { products } from "@/db/schema";

import { db } from "@/db/drizzle";

import { ApiError, handleApiError } from "@/lib/APIs/api-errors";

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
// GET /api/products/[slug]
// ============================================================

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    // ========================================================
    // PARAMS
    // ========================================================

    const { slug } = await context.params;

    if (!slug) {
      throw new ApiError("Product slug is required", 400);
    }

    // ========================================================
    // FIND PRODUCT
    // ========================================================

    const product = await db.query.products.findFirst({
      where: {
        slug,

        deletedAt: {
          isNull: true,
        },

        status: "active",
      },

      columns: {
        id: true,

        name: true,

        slug: true,

        sku: true,

        description: true,

        categoryId: true,

        price: true,

        compareAtPrice: true,

        status: true,

        isFeatured: true,

        isNewArrival: true,

        isBestSeller: true,

        averageRating: true,

        ratingCount: true,

        soldCount: true,

        metaTitle: true,

        metaDescription: true,

        createdAt: true,

        updatedAt: true,

        costPrice: false,

        deletedAt: false,
      },

      with: {
        // ==================================================
        // CATEGORY
        // ==================================================

        category: {
          columns: {
            id: true,

            name: true,

            slug: true,
          },
        },

        // ==================================================
        // PRODUCT IMAGES
        // ==================================================

        images: {
          orderBy: {
            position: "asc",
          },

          columns: {
            id: true,

            url: true,

            publicId: false,

            position: true,

            isPrimary: true,

            createdAt: true,
          },
        },

        // ==================================================
        // COLOR VARIANTS
        // ==================================================

        variants: {
          columns: {
            id: true,

            productId: true,

            colorId: true,

            sku: true,

            stock: true,

            reservedStock: true,

            createdAt: true,

            updatedAt: true,
          },

          with: {
            color: true,
          },
        },
      },
    });

    // ========================================================
    // PRODUCT NOT FOUND
    // ========================================================

    if (!product) {
      throw new ApiError("Product not found", 404);
    }

    // ========================================================
    // FORMAT VARIANTS
    // ========================================================

    const variants = product.variants.map((variant) => ({
      id: variant.id,

      productId: variant.productId,

      colorId: variant.colorId,

      sku: variant.sku,

      color: variant.color,

      availableStock: Math.max(variant.stock - variant.reservedStock, 0),

      inStock: variant.stock > variant.reservedStock,
    }));

    // ========================================================
    // CHECK PRODUCT STOCK
    // ========================================================

    const hasAvailableStock = variants.some((variant) => variant.inStock);

    // ========================================================
    // PUBLIC PRODUCT RESPONSE
    // ========================================================

    const data = {
      id: product.id,

      name: product.name,

      slug: product.slug,

      sku: product.sku,

      description: product.description,

      categoryId: product.categoryId,

      category: product.category,

      price: product.price,

      compareAtPrice: product.compareAtPrice,

      status: product.status,

      isFeatured: product.isFeatured,

      isNewArrival: product.isNewArrival,

      isBestSeller: product.isBestSeller,

      averageRating: product.averageRating,

      ratingCount: product.ratingCount,

      soldCount: product.soldCount,

      metaTitle: product.metaTitle,

      metaDescription: product.metaDescription,

      images: product.images,

      variants,

      hasAvailableStock,

      createdAt: product.createdAt,

      updatedAt: product.updatedAt,
    };

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data,
    });
  } catch (error) {
    console.error("GET /api/products/[slug] error:", error);
 
    return handleApiError(error);
  }
}
