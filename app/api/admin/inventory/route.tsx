import { NextRequest } from "next/server";

import { db } from "@/db/drizzle";
import { requireAdmin } from "@/lib/APIs/auth";

export const runtime = "nodejs";

// ============================================================
// GET INVENTORY
// ============================================================

export async function GET(
  req: NextRequest,
) {
  try {
    await requireAdmin();

    const searchParams =
      req.nextUrl.searchParams;

    // ========================================================
    // PAGINATION
    // ========================================================

    const page = Math.max(
      Number(searchParams.get("page") ?? "1"),
      1,
    );

    const limit = Math.min(
      Math.max(
        Number(
          searchParams.get("limit") ?? "20",
        ),
        1,
      ),
      100,
    );

    const offset =
      (page - 1) * limit;

    // ========================================================
    // FILTERS
    // ========================================================

    const search =
      searchParams
        .get("search")
        ?.trim() ?? "";

    const stockStatus =
      searchParams.get(
        "stockStatus",
      ) ?? "all";

    const sort =
      searchParams.get(
        "sort",
      ) ?? "recent";

    // ========================================================
    // SEARCH FILTER
    // ========================================================

    const searchFilter =
      search.length > 0
        ? {
            OR: [
              {
                sku: {
                  ilike: `%${search}%`,
                },
              },
              {
                product: {
                  name: {
                    ilike: `%${search}%`,
                  },
                },
              },
              {
                product: {
                  sku: {
                    ilike: `%${search}%`,
                  },
                },
              },
              {
                color: {
                  name: {
                    ilike: `%${search}%`,
                  },
                },
              },
            ],
          }
        : undefined;

    // ========================================================
    // FETCH INVENTORY
    // ========================================================

    const variants =
      await db.query.productVariants.findMany(
        {
          where: searchFilter,

          columns: {
            id: true,
            sku: true,
            stock: true,
            reservedStock: true,
            createdAt: true,
            updatedAt: true,
          },

          with: {
            product: {
              columns: {
                id: true,
                name: true,
                slug: true,
                sku: true,
                status: true,
              },
            },

            color: {
              columns: {
                id: true,
                name: true,
                hexCode: true,
                isActive: true,
              },
            },
          },

          orderBy: (
            productVariants,
            { asc, desc },
          ) => {
            switch (sort) {
              case "oldest":
                return asc(
                  productVariants.createdAt,
                );

              case "stock_asc":
                return asc(
                  productVariants.stock,
                );

              case "stock_desc":
                return desc(
                  productVariants.stock,
                );

              case "name_asc":
                return asc(
                  productVariants.id,
                );

              case "name_desc":
                return desc(
                  productVariants.id,
                );

              case "recent":
              default:
                return desc(
                  productVariants.updatedAt,
                );
            }
          },

          limit,
          offset,
        },
      );

    // ========================================================
    // FILTER STOCK STATUS
    // ========================================================
    //
    // We intentionally calculate available stock from:
    //
    // stock - reservedStock
    //
    // We don't store another "availableStock" column.
    //
    // ========================================================

    const inventoryItems =
      variants
        .map((variant) => {
          const availableStock =
            Math.max(
              variant.stock -
                variant.reservedStock,
              0,
            );

          return {
            id: variant.id,

            sku: variant.sku,

            stock: variant.stock,

            reservedStock:
              variant.reservedStock,

            availableStock,

            createdAt:
              variant.createdAt.toISOString(),

            updatedAt:
              variant.updatedAt.toISOString(),

            product: {
              id: variant.product.id,
              name: variant.product.name,
              slug: variant.product.slug,
              sku: variant.product.sku,
              status: variant.product.status,
            },

            color: {
              id: variant.color.id,
              name: variant.color.name,
              hexCode:
                variant.color.hexCode,
              isActive:
                variant.color.isActive,
            },
          };
        })
        .filter((item) => {
          switch (stockStatus) {
            case "in_stock":
              return item.availableStock > 5;

            case "low_stock":
              return (
                item.availableStock > 0 &&
                item.availableStock <= 5
              );

            case "out_of_stock":
              return (
                item.availableStock <= 0
              );

            case "all":
            default:
              return true;
          }
        });

    // ========================================================
    // TOTAL
    // ========================================================
    //
    // This currently uses the same relational query pattern
    // without introducing joins or raw SQL.
    //
    // ========================================================

    const matchingVariants =
      await db.query.productVariants.findMany(
        {
          where: searchFilter,

          columns: {
            id: true,
            stock: true,
            reservedStock: true,
          },
        },
      );

    const total =
      matchingVariants.filter(
        (variant) => {
          const availableStock =
            Math.max(
              variant.stock -
                variant.reservedStock,
              0,
            );

          switch (stockStatus) {
            case "in_stock":
              return availableStock > 5;

            case "low_stock":
              return (
                availableStock > 0 &&
                availableStock <= 5
              );

            case "out_of_stock":
              return availableStock <= 0;

            case "all":
            default:
              return true;
          }
        },
      ).length;

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data: inventoryItems,

      pagination: {
        page,
        limit,
        total,
        totalPages:
          Math.ceil(total / limit),

        hasNextPage:
          page <
          Math.ceil(total / limit),

        hasPreviousPage:
          page > 1,
      },
    });
  } catch (error) {
    console.error(
      "GET /api/admin/inventory error:",
      error,
    );

    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch inventory",
      },
      {
        status: 500,
      },
    );
  }
}