import { NextRequest, NextResponse } from "next/server";

import { and, count, desc, eq, ilike, or } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { orders } from "@/db/schema/orders";
import { users } from "@/db/schema/users";

import { requireAdmin } from "@/lib/APIs/auth";
import { handleApiError } from "@/lib/APIs/api-errors";

export const runtime = "nodejs";

// ============================================================
// GET ADMIN ORDERS
// ============================================================

export async function GET(req: NextRequest) {
  try {
    // --------------------------------------------------------
    // 1. Require admin
    // --------------------------------------------------------

    await requireAdmin();

    // --------------------------------------------------------
    // 2. Query parameters
    // --------------------------------------------------------

    const searchParams = req.nextUrl.searchParams;

    const pageParam = Number(searchParams.get("page") ?? "1");

    const limitParam = Number(searchParams.get("limit") ?? "10");

    const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

    const limit =
      Number.isInteger(limitParam) && limitParam > 0 && limitParam <= 100
        ? limitParam
        : 10;

    const offset = (page - 1) * limit;

    const search = searchParams.get("search")?.trim() ?? "";

    const status = searchParams.get("status") ?? "";

    const paymentStatus = searchParams.get("paymentStatus") ?? "";

    const paymentMethod = searchParams.get("paymentMethod") ?? "";

    // --------------------------------------------------------
    // 3. Build filters
    // --------------------------------------------------------

    const filters = [];

    if (search) {
      filters.push(
        or(
          ilike(orders.orderNumber, `%${search}%`),
          ilike(users.email, `%${search}%`),
          ilike(users.firstName, `%${search}%`),
          ilike(users.lastName, `%${search}%`),
        ),
      );
    }

    if (status) {
      filters.push(
        eq(
          orders.status,
          status as
            | "pending"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled",
        ),
      );
    }

    if (paymentStatus) {
      filters.push(
        eq(
          orders.paymentStatus,
          paymentStatus as
            | "pending"
            | "paid"
            | "failed"
            | "refunded"
            | "partially_refunded",
        ),
      );
    }

    if (paymentMethod) {
      filters.push(
        eq(
          orders.paymentMethod,
          paymentMethod as "paystack" | "cash_on_delivery",
        ),
      );
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    // --------------------------------------------------------
    // 4. Count
    // --------------------------------------------------------

    const countResult = await db
      .select({
        count: count(),
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .where(whereClause);

    const total = Number(countResult[0]?.count ?? 0);

    // --------------------------------------------------------
    // 5. Get orders
    // --------------------------------------------------------

    const results = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,

        status: orders.status,

        paymentStatus: orders.paymentStatus,
        paymentMethod: orders.paymentMethod,

        subtotal: orders.subtotal,
        shippingFee: orders.shippingFee,
        discount: orders.discount,
        total: orders.total,

        notes: orders.notes,

        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,

        user: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
        },
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .where(whereClause)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset);

    // --------------------------------------------------------
    // 6. Return
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,
      message: "Admin orders retrieved successfully",
      data: {
        orders: results,

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
