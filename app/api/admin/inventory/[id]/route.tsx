import { NextRequest } from "next/server";

import { db } from "@/db/drizzle";
import { requireAdmin } from "@/lib/APIs/auth";

export const runtime = "nodejs";

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

    const { id } =
      await context.params;

    // ========================================================
    // FIND VARIANT
    // ========================================================

    const variant =
      await db.query.productVariants.findFirst(
        {
          where: {
            id,
          },

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

            inventoryMovements: {
              columns: {
                id: true,
                quantityChange: true,
                reason: true,
                createdAt: true,
              },

              with: {
                user: {
                  columns: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },

                order: {
                  columns: {
                    id: true,
                    orderNumber: true,
                  },
                },
              },

              orderBy: (
                movements,
                { desc },
              ) =>
                desc(
                  movements.createdAt,
                ),

              limit: 50,
            },
          },
        },
      );

    // ========================================================
    // NOT FOUND
    // ========================================================

    if (!variant) {
      return Response.json(
        {
          success: false,
          message:
            "Inventory item not found",
        },
        {
          status: 404,
        },
      );
    }

    // ========================================================
    // AVAILABLE STOCK
    // ========================================================

    const availableStock =
      Math.max(
        variant.stock -
          variant.reservedStock,
        0,
      );

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data: {
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

        movements:
          variant.inventoryMovements.map(
            (movement) => ({
              id: movement.id,

              quantityChange:
                movement.quantityChange,

              reason: movement.reason,

              createdAt:
                movement.createdAt.toISOString(),

              user: movement.user
                ? {
                    id: movement.user.id,
                    firstName:
                      movement.user.firstName,
                    lastName:
                      movement.user.lastName,
                    email:
                      movement.user.email,
                  }
                : null,

              order: movement.order
                ? {
                    id: movement.order.id,
                    orderNumber:
                      movement.order.orderNumber,
                  }
                : null,
            }),
          ),
      },
    });
  } catch (error) {
    console.error(
      "GET /api/admin/inventory/[id] error:",
      error,
    );

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