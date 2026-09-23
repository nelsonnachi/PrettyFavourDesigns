import { NextRequest } from "next/server";

import {
  and,
  asc,
  desc,
  eq,
  exists,
  gte,
  ilike,
  isNull,
  lte,
  notExists,
  or,
  sql,
  type SQL,
} from "drizzle-orm";

import { products, productVariants } from "@/db/schema";

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
// IMPORTANT:
//
// All filters are applied inside PostgreSQL BEFORE:
//
// - pagination
// - counting
//
// This keeps:
//
// data
// pagination.total
// pagination.totalPages
//
// consistent with each other.
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

    const conditions: SQL[] = [];

    // --------------------------------------------------------
    // ONLY ACTIVE PRODUCTS
    // --------------------------------------------------------

    conditions.push(eq(products.status, "active"));

    // --------------------------------------------------------
    // DO NOT SHOW SOFT-DELETED PRODUCTS
    // --------------------------------------------------------

    conditions.push(isNull(products.deletedAt));

    // --------------------------------------------------------
    // SEARCH
    // --------------------------------------------------------

    if (query.search) {
      const searchCondition = or(
        ilike(products.name, `%${query.search}%`),

        ilike(products.description, `%${query.search}%`),

        ilike(products.sku, `%${query.search}%`),
      );

      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    // --------------------------------------------------------
    // CATEGORY
    // --------------------------------------------------------

    if (query.categoryId) {
      conditions.push(eq(products.categoryId, query.categoryId));
    }

    // --------------------------------------------------------
    // COLOR
    // --------------------------------------------------------
    //
    // IMPORTANT:
    //
    // We check for the color in PostgreSQL BEFORE
    // pagination.
    //
    // A product matches when at least one variant
    // has the selected color.
    //
    // --------------------------------------------------------

    if (query.colorId) {
      const colorExists = exists(
        db
          .select({
            id: productVariants.id,
          })
          .from(productVariants)
          .where(
            and(
              eq(productVariants.productId, products.id),

              eq(productVariants.colorId, query.colorId),
            ),
          ),
      );

      conditions.push(colorExists);
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

    // --------------------------------------------------------
    // IN STOCK
    // --------------------------------------------------------
    //
    // A product is considered in stock when at least
    // one color has available stock:
    //
    // stock > reservedStock
    //
    // --------------------------------------------------------

    if (query.inStock === true) {
      const stockExists = exists(
        db
          .select({
            id: productVariants.id,
          })
          .from(productVariants)
          .where(
            and(
              eq(productVariants.productId, products.id),

              sql`
                ${productVariants.stock}
                >
                ${productVariants.reservedStock}
              `,
            ),
          ),
      );

      conditions.push(stockExists);
    }

    // --------------------------------------------------------
    // OUT OF STOCK
    // --------------------------------------------------------
    //
    // No variant has available stock.
    //
    // --------------------------------------------------------

    if (query.inStock === false) {
      const stockDoesNotExist = notExists(
        db
          .select({
            id: productVariants.id,
          })
          .from(productVariants)
          .where(
            and(
              eq(productVariants.productId, products.id),

              sql`
                ${productVariants.stock}
                >
                ${productVariants.reservedStock}
              `,
            ),
          ),
      );

      conditions.push(stockDoesNotExist);
    }

    // ========================================================
    // FINAL WHERE CONDITION
    // ========================================================

    const whereCondition =
      conditions.length > 0 ? and(...conditions) : undefined;

    // ========================================================
    // ORDER BY
    // ========================================================

    let orderBy: SQL;

    switch (query.sort) {
      case "oldest":
        orderBy = asc(products.createdAt);
        break;

      case "price_asc":
        orderBy = asc(products.price);
        break;

      case "price_desc":
        orderBy = desc(products.price);
        break;

      case "name_asc":
        orderBy = asc(products.name);
        break;

      case "name_desc":
        orderBy = desc(products.name);
        break;

      case "rating":
        orderBy = desc(products.averageRating);
        break;

      case "best_selling":
        orderBy = desc(products.soldCount);
        break;

      case "newest":
      default:
        orderBy = desc(products.createdAt);
        break;
    }

    // ========================================================
    // GET PRODUCTS
    // ========================================================
    //
    // IMPORTANT:
    //
    // At this point ALL filters have already been applied.
    //
    // Therefore pagination is now correct.
    //
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
    // FORMAT PUBLIC RESPONSE
    // ========================================================

    const data = rows.map((product) => ({
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
    //
    // IMPORTANT:
    //
    // This uses the EXACT SAME whereCondition as
    // the product query.
    //
    // Therefore total now respects:
    //
    // - search
    // - category
    // - color
    // - price
    // - stock
    // - featured
    // - new arrival
    // - best seller
    // - active status
    // - deletedAt
    //
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
