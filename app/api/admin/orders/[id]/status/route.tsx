import { NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { orders } from "@/db/schema/orders";

import { requireAdmin } from "@/lib/APIs/auth";
import { handleApiError } from "@/lib/APIs/api-errors";

import {
  orderIdParamSchema,
  updateOrderStatusSchema,
} from "@/lib/validations/orders";

export const runtime = "nodejs";

// ============================================================
// UPDATE ORDER STATUS
// ============================================================

export async function PATCH(
  req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    // --------------------------------------------------------
    // 1. Require admin
    // --------------------------------------------------------

    await requireAdmin();

    // --------------------------------------------------------
    // 2. Validate ID
    // --------------------------------------------------------

    const { id } = await context.params;

    const { id: orderId } = orderIdParamSchema.parse({ id });

    // --------------------------------------------------------
    // 3. Validate body
    // --------------------------------------------------------

    const body = await req.json();

    const { status } = updateOrderStatusSchema.parse(body);

    // --------------------------------------------------------
    // 4. Check order exists
    // --------------------------------------------------------

    const existingResult = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    const existingOrder = existingResult[0];

    if (!existingOrder) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        {
          status: 404,
        },
      );
    }

    // --------------------------------------------------------
    // 5. Update status
    // --------------------------------------------------------

    const updatedResult = await db
      .update(orders)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning();

    const updatedOrder = updatedResult[0];

    // --------------------------------------------------------
    // 6. Return
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      data: {
        order: updatedOrder,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
