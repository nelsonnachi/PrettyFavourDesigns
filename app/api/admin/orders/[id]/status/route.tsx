import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { orders } from "@/db/schema/orders";

import { requireAdmin } from "@/lib/APIs/auth";
import { handleApiError } from "@/lib/APIs/api-errors";
import { completeCashOnDeliveryPayment } from "@/lib/APIs/payments/complete-cod-payment";

import {
  orderIdParamSchema,
  updateOrderStatusSchema,
} from "@/lib/validations/orders";

export const runtime = "nodejs";

export async function PATCH(
  req: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    // ============================================================
    // ADMIN AUTH
    // ============================================================

    await requireAdmin();

    // ============================================================
    // PARAMS
    // ============================================================

    const { id } = await context.params;

    const { id: orderId } = orderIdParamSchema.parse({
      id,
    });

    // ============================================================
    // REQUEST BODY
    // ============================================================

    const body = await req.json();

    const { status } = updateOrderStatusSchema.parse(body);

    // ============================================================
    // GET ORDER
    // ============================================================

    const existingOrder = await db.query.orders.findFirst({
      where: {
        id: orderId,
      },

      columns: {
        id: true,
        status: true,
        paymentStatus: true,
        paymentMethod: true,
      },
    });

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

    // ============================================================
    // CASH ON DELIVERY → DELIVERED
    // ============================================================
    //
    // Do NOT manually update paymentStatus here.
    //
    // completeCashOnDeliveryPayment() is already responsible for:
    //
    // - payment.status = "paid"
    // - payment.paidAt
    // - payment.gatewayResponse
    // - order.paymentStatus = "paid"
    // - order.status = "delivered"
    // - stock deduction
    // - reserved stock release
    // - product soldCount
    // - inventory movement
    //
    // ============================================================

    if (
      status === "delivered" &&
      existingOrder.paymentMethod === "cash_on_delivery"
    ) {
      const result = await completeCashOnDeliveryPayment({
        orderId,
      });

      return NextResponse.json({
        success: true,
        message: "COD order delivered and payment completed successfully",
        data: {
          order: result.order,
          payment: result.payment,
        },
      });
    }

    // ============================================================
    // NORMAL ORDER STATUS UPDATE
    // ============================================================

    const updatedResult = await db
      .update(orders)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning();

    const updatedOrder = updatedResult[0];

    if (!updatedOrder) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update order status",
        },
        {
          status: 500,
        },
      );
    }

    // ============================================================
    // RESPONSE
    // ============================================================

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