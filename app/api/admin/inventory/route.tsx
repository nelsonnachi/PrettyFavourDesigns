import { NextRequest } from "next/server";

import { db } from "@/db/drizzle";
import { requireAdmin } from "@/lib/APIs/auth";

export const runtime = "nodejs";

// ============================================================
// TYPES
// ============================================================

type StockStatus =
  | "all"
  | "in_stock"
  | "low_stock"
  | "out_of_stock";

type Sort =
  | "recent"
  | "oldest"
  | "stock_asc"
  | "stock_desc"
  | "name_asc"
  | "name_desc";

// ============================================================
// HELPERS
// ============================================================

function getStockStatus(
  availableStock: number,
):
  | "in_stock"
  | "low_stock"
  | "out_of_stock" {
  if (availableStock <= 0) {
    return "out_of_stock";
  }

  if (availableStock <= 5) {
    return "low_stock";
  }

  return "in_stock";
}

function matchesStockStatus(
  availableStock: number,
  stockStatus: StockStatus,
) {
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
}

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

    const rawPage = Number(
      searchParams.get("page") ?? "1",
    );

    const rawLimit = Number(
      searchParams.get("limit") ?? "20",
    );

    const page =
      Number.isFinite(rawPage) && rawPage > 0
        ? Math.floor(rawPage)
        : 1;

    const limit =
      Number.isFinite(rawLimit) &&
      rawLimit > 0
        ? Math.min(Math.floor(rawLimit), 100)
        : 20;

    // ========================================================
    // FILTERS
    // ========================================================

    const search =
      searchParams
        .get("search")
        ?.trim()
        .toLowerCase() ?? "";

    const requestedStockStatus =
      searchParams.get("stockStatus") ??
      "all";

    const stockStatus: StockStatus =
      requestedStockStatus === "in_stock" ||
      requestedStockStatus === "low_stock" ||
      requestedStockStatus === "out_of_stock"
        ? requestedStockStatus
        : "all";

    const requestedSort =
      searchParams.get("sort") ?? "recent";

    const sort: Sort =
      requestedSort === "oldest" ||
      requestedSort === "stock_asc" ||
      requestedSort === "stock_desc" ||
      requestedSort === "name_asc" ||
      requestedSort === "name_desc"
        ? requestedSort
        : "recent";

    // ========================================================
    // FETCH INVENTORY
    // ========================================================
    //
    // We intentionally use the Drizzle relational query API.
    //
    // No leftJoin.
    // No rightJoin.
    // No raw SQL.
    // No sql`concat(...)`.
    //
    // ========================================================

    const variants =
      await db.query.productVariants.findMany({
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
          product: {
            columns: {
              id: true,
              name: true,
              slug: true,
              sku: true,
              status: true,
              description: true,
              price: true,
              costPrice: true,
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
      });

    // ========================================================
    // TRANSFORM
    // ========================================================

    const inventoryItems = variants
      .map((variant) => {
        const availableStock = Math.max(
          variant.stock -
            variant.reservedStock,
          0,
        );

        const computedStockStatus =
          getStockStatus(availableStock);

        return {
          id: variant.id,

          productId: variant.productId,

          colorId: variant.colorId,

          sku: variant.sku,

          stock: variant.stock,

          reservedStock:
            variant.reservedStock,

          availableStock,

          stockStatus:
            computedStockStatus,

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

            description:
              variant.product.description,

            price: variant.product.price,

            costPrice:
              variant.product.costPrice,
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

      // ======================================================
      // SEARCH
      // ======================================================

      .filter((item) => {
        if (!search) {
          return true;
        }

        const searchableValues = [
          item.sku,
          item.product.name,
          item.product.sku,
          item.product.slug,
          item.color.name,
        ];

        return searchableValues.some(
          (value) =>
            value
              ?.toLowerCase()
              .includes(search),
        );
      })

      // ======================================================
      // STOCK STATUS
      // ======================================================

      .filter((item) =>
        matchesStockStatus(
          item.availableStock,
          stockStatus,
        ),
      );

    // ========================================================
    // SORT
    // ========================================================

    inventoryItems.sort(
      (a, b) => {
        switch (sort) {
          // --------------------------------------------------
          // OLDEST
          // --------------------------------------------------

          case "oldest":
            return (
              new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime()
            );

          // --------------------------------------------------
          // STOCK ASC
          // --------------------------------------------------

          case "stock_asc":
            return (
              a.availableStock -
              b.availableStock
            );

          // --------------------------------------------------
          // STOCK DESC
          // --------------------------------------------------

          case "stock_desc":
            return (
              b.availableStock -
              a.availableStock
            );

          // --------------------------------------------------
          // NAME ASC
          // --------------------------------------------------

          case "name_asc":
            return a.product.name.localeCompare(
              b.product.name,
            );

          // --------------------------------------------------
          // NAME DESC
          // --------------------------------------------------

          case "name_desc":
            return b.product.name.localeCompare(
              a.product.name,
            );

          // --------------------------------------------------
          // RECENT
          // --------------------------------------------------

          case "recent":
          default:
            return (
              new Date(b.updatedAt).getTime() -
              new Date(a.updatedAt).getTime()
            );
        }
      },
    );

    // ========================================================
    // TOTAL
    // ========================================================

    const total =
      inventoryItems.length;

    const totalPages =
      total === 0
        ? 0
        : Math.ceil(total / limit);

    // ========================================================
    // PAGINATE AFTER FILTERING
    // ========================================================
    //
    // This is important.
    //
    // Previously the database query applied limit/offset
    // BEFORE stockStatus filtering. That could produce:
    //
    // page 1 -> only 3 matching items
    // page 2 -> more matching items
    //
    // even though the pagination said something else.
    //
    // We now filter and sort first, then paginate.
    //
    // ========================================================

    const offset =
      (page - 1) * limit;

    const paginatedItems =
      inventoryItems.slice(
        offset,
        offset + limit,
      );

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data: paginatedItems,

      pagination: {
        page,

        limit,

        total,

        totalPages,

        hasNextPage:
          page < totalPages,

        hasPreviousPage:
          page > 1 &&
          page <= totalPages,
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