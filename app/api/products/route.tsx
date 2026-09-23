import { NextRequest } from "next/server";

import { and, asc, desc, eq, gte, ilike, isNull, lte, or } from "drizzle-orm";

import { products, productImages, productVariants } from "@/db/schema";

import { db } from "@/db/drizzle";

import { handleApiError } from "@/lib/APIs/api-errors";

import { productFiltersSchema } from "@/lib/validations";

export const runtime = "nodejs";

// ============================================================
// GET /api/products
// ============================================================
//
// Public product listing.
//
// Only active products are returned.
//
// Supports:
// - search
// - categoryId
// - colorId
// - minPrice
// - maxPrice
// - inStock
// - isFeatured
// - isNewArrival
// - isBestSeller
// - pagination
// - sorting
//
// ============================================================

export async function GET(req: NextRequest) {
  try {
    // ========================================================
    // QUERY PARAMETERS
    // ========================================================

    const searchParams = Object.fromEntries(req.nextUrl.searchParams);

    // ========================================================
    // VALIDATE QUERY
    // ========================================================

    const query = productFiltersSchema.parse({
      ...searchParams,

      page: searchParams.page ? Number(searchParams.page) : undefined,

      limit: searchParams.limit ? Number(searchParams.limit) : undefined,

      minPrice: searchParams.minPrice
        ? Number(searchParams.minPrice)
        : undefined,

      maxPrice: searchParams.maxPrice
        ? Number(searchParams.maxPrice)
        : undefined,

      inStock:
        searchParams.inStock === undefined
          ? undefined
          : searchParams.inStock === "true",

      isFeatured:
        searchParams.isFeatured === undefined
          ? undefined
          : searchParams.isFeatured === "true",

      isNewArrival:
        searchParams.isNewArrival === undefined
          ? undefined
          : searchParams.isNewArrival === "true",

      isBestSeller:
        searchParams.isBestSeller === undefined
          ? undefined
          : searchParams.isBestSeller === "true",
    });

    const offset = (query.page - 1) * query.limit;

    // ========================================================
    // FILTER CONDITIONS
    // ========================================================

    const conditions = [];

    // --------------------------------------------------------
    // ONLY ACTIVE PRODUCTS
    // --------------------------------------------------------

    conditions.push(eq(products.status, "active"));

    // --------------------------------------------------------
    // DO NOT SHOW DELETED PRODUCTS
    // --------------------------------------------------------

    conditions.push(isNull(products.deletedAt));
    // --------------------------------------------------------
    // SEARCH
    // --------------------------------------------------------

    if (query.search) {
      conditions.push(
        or(
          ilike(products.name, `%${query.search}%`),

          ilike(products.description, `%${query.search}%`),

          ilike(products.sku, `%${query.search}%`),
        ),
      );
    }

    // --------------------------------------------------------
    // CATEGORY
    // --------------------------------------------------------

    if (query.categoryId) {
      conditions.push(eq(products.categoryId, query.categoryId));
    }

    // --------------------------------------------------------
    // PRICE
    // --------------------------------------------------------

    if (query.minPrice !== undefined) {
      conditions.push(gte(products.price, String(query.minPrice)));
    }

    if (query.maxPrice !== undefined) {
      conditions.push(lte(products.price, String(query.maxPrice)));
    }

    // --------------------------------------------------------
    // FEATURED
    // --------------------------------------------------------

    if (query.isFeatured === true) {
      conditions.push(eq(products.isFeatured, true));
    }

    // --------------------------------------------------------
    // NEW ARRIVAL
    // --------------------------------------------------------

    if (query.isNewArrival === true) {
      conditions.push(eq(products.isNewArrival, true));
    }

    // --------------------------------------------------------
    // BEST SELLER
    // --------------------------------------------------------

    if (query.isBestSeller === true) {
      conditions.push(eq(products.isBestSeller, true));
    }

    // ========================================================
    // WHERE CONDITION
    // ========================================================

    const whereCondition =
      conditions.length > 0 ? and(...conditions) : undefined;

    // ========================================================
    // ORDER BY
    // ========================================================

    const orderBy =
      query.sort === "newest"
        ? desc(products.createdAt)
        : query.sort === "oldest"
          ? asc(products.createdAt)
          : query.sort === "price_asc"
            ? asc(products.price)
            : query.sort === "price_desc"
              ? desc(products.price)
              : query.sort === "name_asc"
                ? asc(products.name)
                : query.sort === "name_desc"
                  ? desc(products.name)
                  : query.sort === "rating"
                    ? desc(products.averageRating)
                    : desc(products.soldCount);

    // ========================================================
    // GET PRODUCTS
    // ========================================================

    const productRows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        sku: products.sku,
        description: products.description,
        categoryId: products.categoryId,

        price: products.price,
        compareAtPrice: products.compareAtPrice,

        status: products.status,

        isFeatured: products.isFeatured,
        isNewArrival: products.isNewArrival,
        isBestSeller: products.isBestSeller,

        averageRating: products.averageRating,
        ratingCount: products.ratingCount,
        soldCount: products.soldCount,

        metaTitle: products.metaTitle,
        metaDescription: products.metaDescription,

        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .where(whereCondition)
      .orderBy(orderBy)
      .limit(query.limit)
      .offset(offset);

    // ========================================================
    // LOAD RELATIONS
    // ========================================================

    const rows = [];

    for (const product of productRows) {
      const productWithRelations = await db.query.products.findFirst({
        where: {
          id: product.id,
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
          category: {
            columns: {
              id: true,
              name: true,
              slug: true,
            },
          },

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

      if (productWithRelations) {
        rows.push(productWithRelations);
      }
    }

    // ========================================================
    // COLOR FILTER
    // ========================================================

    let filteredRows = rows;

    if (query.colorId) {
      filteredRows = filteredRows.filter((product) =>
        product.variants.some((variant) => variant.colorId === query.colorId),
      );
    }

    // ========================================================
    // IN STOCK FILTER
    // ========================================================

    if (query.inStock !== undefined) {
      filteredRows = filteredRows.filter((product) => {
        const hasAvailableStock = product.variants.some(
          (variant) => variant.stock > variant.reservedStock,
        );

        return query.inStock ? hasAvailableStock : !hasAvailableStock;
      });
    }

    // ========================================================
    // FORMAT PUBLIC RESPONSE
    // ========================================================

    const data = filteredRows.map((product) => ({
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

      variants: product.variants.map((variant) => ({
        id: variant.id,

        productId: variant.productId,

        colorId: variant.colorId,

        sku: variant.sku,

        color: variant.color,

        availableStock: Math.max(variant.stock - variant.reservedStock, 0),

        inStock: variant.stock > variant.reservedStock,
      })),

      createdAt: product.createdAt,

      updatedAt: product.updatedAt,
    }));

    // ========================================================
    // COUNT
    // ========================================================

    const total = await db.$count(products, whereCondition);

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data,

      pagination: {
        page: query.page,

        limit: query.limit,

        total,

        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    console.error("GET /api/products error:", error);

    return handleApiError(error);
  }
}
