import { NextRequest } from "next/server";

import { db } from "@/db/drizzle";
import { requireAdmin } from "@/lib/APIs/auth";

export const runtime = "nodejs";

// ============================================================
// TYPES
// ============================================================

type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

// ============================================================
// HELPERS
// ============================================================

function getStockStatus(availableStock: number): StockStatus {
  if (availableStock <= 0) {
    return "out_of_stock";
  }

  if (availableStock <= 5) {
    return "low_stock";
  }

  return "in_stock";
}

// ============================================================
// GET INVENTORY ITEM
// ============================================================

export async function GET(
  _req: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    await requireAdmin();

    // ========================================================
    // PARAMS
    // ========================================================

    const { id } = await context.params;

    // ========================================================
    // VALIDATE ID
    // ========================================================

    if (!id) {
      return Response.json(
        {
          success: false,
          message: "Inventory item ID is required",
        },
        {
          status: 400,
        },
      );
    }

    // ========================================================
    // FIND INVENTORY ITEM
    // ========================================================
    //
    // Modern Drizzle relational query.
    //
    // No leftJoin.
    // No raw SQL.
    //
    // ========================================================

    const variant = await db.query.productVariants.findFirst({
      where: {
        id,
      },

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
        // ==================================================
        // PRODUCT
        // ==================================================

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

        // ==================================================
        // COLOR
        // ==================================================

        color: {
          columns: {
            id: true,
            name: true,
            hexCode: true,
            isActive: true,
          },
        },

        // ==================================================
        // INVENTORY MOVEMENTS
        // ==================================================

        inventoryMovements: {
          columns: {
            id: true,
            quantityChange: true,
            reason: true,
            createdAt: true,
          },

          with: {
            // ==============================================
            // USER
            // ==============================================

            user: {
              columns: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },

            // ==============================================
            // ORDER
            // ==============================================

            order: {
              columns: {
                id: true,
                orderNumber: true,
              },
            },
          },

          orderBy: (movements, { desc }) => desc(movements.createdAt),

          limit: 50,
        },
      },
    });

    // ========================================================
    // NOT FOUND
    // ========================================================

    if (!variant) {
      return Response.json(
        {
          success: false,
          message: "Inventory item not found",
        },
        {
          status: 404,
        },
      );
    }

    // ========================================================
    // AVAILABLE STOCK
    // ========================================================

    const availableStock = Math.max(variant.stock - variant.reservedStock, 0);

    // ========================================================
    // STOCK STATUS
    // ========================================================

    const stockStatus = getStockStatus(availableStock);

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data: {
        // ====================================================
        // INVENTORY
        // ====================================================

        id: variant.id,

        productId: variant.productId,

        colorId: variant.colorId,

        sku: variant.sku,

        stock: variant.stock,

        reservedStock: variant.reservedStock,

        availableStock,

        stockStatus,

        createdAt: variant.createdAt.toISOString(),

        updatedAt: variant.updatedAt.toISOString(),

        // ====================================================
        // PRODUCT
        // ====================================================

        product: {
          id: variant.product.id,

          name: variant.product.name,

          slug: variant.product.slug,

          sku: variant.product.sku,

          status: variant.product.status,

          description: variant.product.description,

          price: variant.product.price,

          costPrice: variant.product.costPrice,
        },

        // ====================================================
        // COLOR
        // ====================================================

        color: {
          id: variant.color.id,

          name: variant.color.name,

          hexCode: variant.color.hexCode,

          isActive: variant.color.isActive,
        },

        // ====================================================
        // MOVEMENTS
        // ====================================================

        movements: variant.inventoryMovements.map((movement) => ({
          id: movement.id,

          quantityChange: movement.quantityChange,

          reason: movement.reason,

          createdAt: movement.createdAt.toISOString(),

          // ==============================================
          // USER
          // ==============================================

          user: movement.user
            ? {
                id: movement.user.id,

                firstName: movement.user.firstName,

                lastName: movement.user.lastName,

                email: movement.user.email,
              }
            : null,

          // ==============================================
          // ORDER
          // ==============================================

          order: movement.order
            ? {
                id: movement.order.id,

                orderNumber: movement.order.orderNumber,
              }
            : null,
        })),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/inventory/[id] error:", error);

    return Response.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch inventory item",
      },
      {
        status: 500,
      },
    );
  }
}
