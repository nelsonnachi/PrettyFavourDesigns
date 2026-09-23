import { NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";

import { orders } from "@/db/schema/orders";

import { requireUser } from "@/lib/APIs/auth";
import { handleApiError } from "@/lib/APIs/api-errors";

export const runtime = "nodejs";

// ============================================================
// GET CUSTOMER ORDERS
// ============================================================

export async function GET(req: NextRequest) {
  try {
    // --------------------------------------------------------
    // 1. Require authenticated customer
    // --------------------------------------------------------

    const user = await requireUser();

    // --------------------------------------------------------
    // 2. Read pagination
    // --------------------------------------------------------

    const searchParams = req.nextUrl.searchParams;

    const pageParam = Number(searchParams.get("page") ?? "1");
    const limitParam = Number(searchParams.get("limit") ?? "10");

    const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

    const limit =
      Number.isInteger(limitParam) && limitParam > 0 && limitParam <= 50
        ? limitParam
        : 10;

    const offset = (page - 1) * limit;

    // --------------------------------------------------------
    // 3. Get total order count
    // --------------------------------------------------------

    const total = await db.$count(orders, eq(orders.userId, user.id));

    // --------------------------------------------------------
    // 4. Get customer orders with related items
    //
    // Drizzle Relational Queries v2
    // --------------------------------------------------------

    const customerOrders = await db.query.orders.findMany({
      where: {
        userId: user.id,
      },

      columns: {
        id: true,
        orderNumber: true,

        status: true,

        paymentStatus: true,
        paymentMethod: true,

        subtotal: true,
        shippingFee: true,
        discount: true,
        total: true,

        createdAt: true,
        updatedAt: true,
      },

      with: {
        items: {
          columns: {
            id: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      limit,
      offset,
    });

    // --------------------------------------------------------
    // 5. Format orders
    // --------------------------------------------------------

    const formattedOrders = customerOrders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,

      status: order.status,

      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,

      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      discount: order.discount,
      total: order.total,

      itemCount: order.items.length,

      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    // --------------------------------------------------------
    // 6. Return response
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,
      message: "Orders retrieved successfully",

      data: {
        orders: formattedOrders,

        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
