import { NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";

import { orders, orderItems } from "@/db/schema/orders";

import { payments } from "@/db/schema/payments";

import { users } from "@/db/schema/users";

import { requireAdmin } from "@/lib/APIs/auth";
import { handleApiError } from "@/lib/APIs/api-errors";

import { orderIdParamSchema } from "@/lib/validations/orders";

export const runtime = "nodejs";

// ============================================================
// GET ADMIN ORDER
// ============================================================

export async function GET(
  _req: NextRequest,
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
    // 3. Get order + customer
    // --------------------------------------------------------

    const result = await db
      .select({
        order: orders,

        customer: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          phone: users.phone,
        },
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .where(eq(orders.id, orderId))
      .limit(1);

    const resultRow = result[0];

    if (!resultRow) {
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
    // 4. Items
    // --------------------------------------------------------

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    // --------------------------------------------------------
    // 5. Payment
    // --------------------------------------------------------

    const paymentResult = await db
      .select({
        id: payments.id,
        provider: payments.provider,
        reference: payments.reference,
        amount: payments.amount,
        currency: payments.currency,
        status: payments.status,
        gatewayResponse: payments.gatewayResponse,
        paidAt: payments.paidAt,
        createdAt: payments.createdAt,
        updatedAt: payments.updatedAt,
      })
      .from(payments)
      .where(eq(payments.orderId, orderId))
      .limit(1);

    const payment = paymentResult[0] ?? null;

    // --------------------------------------------------------
    // 6. Return
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,
      message: "Admin order retrieved successfully",
      data: {
        order: resultRow.order,
        customer: resultRow.customer,
        items,
        payment,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
    