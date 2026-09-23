import { NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { orders } from "@/db/schema/orders";

import { requireUser } from "@/lib/APIs/auth";
import { ApiError, handleApiError } from "@/lib/APIs/api-errors";

import { orderIdParamSchema } from "@/lib/validations/orders";

export const runtime = "nodejs";

// ============================================================
// CANCEL CUSTOMER ORDER
// ============================================================

export async function PATCH(
  _req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    // --------------------------------------------------------
    // 1. Authenticate
    // --------------------------------------------------------

    const user = await requireUser();

    // --------------------------------------------------------
    // 2. Validate order ID
    // --------------------------------------------------------

    const { id } = await context.params;

    const { id: orderId } = orderIdParamSchema.parse({
      id,
    });

    // --------------------------------------------------------
    // 3. Find customer's order
    //
    // Drizzle Relational Queries v2
    // --------------------------------------------------------

    const order = await db.query.orders.findFirst({
      where: {
        id: orderId,
        userId: user.id,
      },
    });

    // --------------------------------------------------------
    // 4. Order not found
    // --------------------------------------------------------

    if (!order) {
      throw new ApiError("Order not found", 404);
    }

    // --------------------------------------------------------
    // 5. Only pending / processing orders can be cancelled
    // --------------------------------------------------------

    if (
      order.status !== "pending" &&
      order.status !== "processing"
    ) {
      throw new ApiError(
        `Order cannot be cancelled because it is already ${order.status}`,
        400,
      );
    }

    // --------------------------------------------------------
    // 6. Do not cancel already paid orders automatically
    //
    // A paid order may require refund handling.
    // --------------------------------------------------------

    if (order.paymentStatus === "paid") {
      throw new ApiError(
        "Paid orders cannot be cancelled through this endpoint. Please contact support.",
        400,
      );
    }

    // --------------------------------------------------------
    // 7. Cancel order
    // --------------------------------------------------------

    const [updatedOrder] = await db
      .update(orders)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id))
      .returning();

    // --------------------------------------------------------
    // 8. Return
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
      data: {
        order: updatedOrder,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}