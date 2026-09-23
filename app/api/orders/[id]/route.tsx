import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db/drizzle";

import { orders } from "@/db/schema/orders";

import { requireUser } from "@/lib/APIs/auth";
import { handleApiError } from "@/lib/APIs/api-errors";

import { orderIdParamSchema } from "@/lib/validations/orders";

export const runtime = "nodejs";

// ============================================================
// GET SINGLE ORDER
// ============================================================

export async function GET(
  _req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    // --------------------------------------------------------
    // 1. Require authenticated user
    // --------------------------------------------------------

    const user = await requireUser();

    // --------------------------------------------------------
    // 2. Get order ID from URL
    // --------------------------------------------------------

    const { id } = await context.params;

    const { id: orderId } = orderIdParamSchema.parse({
      id,
    });

    // --------------------------------------------------------
    // 3. Find order with related items and payments
    // --------------------------------------------------------

    const order = await db.query.orders.findFirst({
      where: {
        id: orderId,
        userId: user.id,
      },

      with: {
        items: true,

        payments: {
          columns: {
            id: true,
            provider: true,
            reference: true,
            amount: true,
            currency: true,
            status: true,
            paidAt: true,
            createdAt: true,
          },

          limit: 1,
        },
      },
    });

    // --------------------------------------------------------
    // 4. Order not found
    // --------------------------------------------------------

    if (!order) {
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
    // 5. Get first payment
    // --------------------------------------------------------

    const payment = order.payments[0] ?? null;

    // --------------------------------------------------------
    // 6. Return order
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,
      message: "Order retrieved successfully",

      data: {
        order: {
          id: order.id,
          orderNumber: order.orderNumber,

          status: order.status,

          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,

          subtotal: order.subtotal,
          shippingFee: order.shippingFee,
          discount: order.discount,
          total: order.total,

          notes: order.notes,

          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        },

        items: order.items,

        payment,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
