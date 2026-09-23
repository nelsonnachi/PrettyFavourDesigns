import { NextRequest, NextResponse } from "next/server";

import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";

import { users } from "@/db/schema/users";
import { orders } from "@/db/schema/orders";

import { requireAdmin } from "@/lib/APIs/auth";

import { handleApiError } from "@/lib/APIs/api-errors";

import { adminUsersQuerySchema } from "@/lib/validations";

// ============================================================
// GET ADMIN USERS
// ============================================================

export async function GET(request: NextRequest) {
  try {
    // ========================================================
    // 1. REQUIRE ADMIN
    // ========================================================

    await requireAdmin();

    // ========================================================
    // 2. GET QUERY PARAMETERS
    // ========================================================

    const searchParams = request.nextUrl.searchParams;

    const query = {
      page: searchParams.get("page") ?? undefined,

      limit: searchParams.get("limit") ?? undefined,

      search: searchParams.get("search") ?? "",

      status: searchParams.get("status") ?? undefined,

      role: searchParams.get("role") ?? undefined,

      sort: searchParams.get("sort") ?? undefined,
    };

    // ========================================================
    // 3. VALIDATE QUERY PARAMETERS
    // ========================================================

    const data = adminUsersQuerySchema.parse(query);

    // ========================================================
    // 4. PAGINATION
    // ========================================================

    const offset = (data.page - 1) * data.limit;

    // ========================================================
    // 5. BUILD FILTERS
    // ========================================================

    const filters = [];

    // ========================================================
    // SEARCH
    // ========================================================

    if (data.search) {
      const searchTerm = `%${data.search}%`;

      filters.push(
        or(
          ilike(users.email, searchTerm),

          ilike(users.firstName, searchTerm),

          ilike(users.lastName, searchTerm),

          ilike(users.phone, searchTerm),

          sql`
            concat(
              coalesce(${users.firstName}, ''),
              ' ',
              coalesce(${users.lastName}, '')
            ) ILIKE ${searchTerm}
          `,
        ),
      );
    }

    // ========================================================
    // STATUS
    // ========================================================

    if (data.status === "active") {
      filters.push(eq(users.isBanned, false));
    }

    if (data.status === "banned") {
      filters.push(eq(users.isBanned, true));
    }

    // ========================================================
    // ROLE
    // ========================================================

    if (data.role !== "all") {
      filters.push(eq(users.role, data.role));
    }

    // ========================================================
    // COMBINE FILTERS
    // ========================================================

    const whereCondition = filters.length > 0 ? and(...filters) : undefined;

    // ========================================================
    // 6. GET TOTAL USER COUNT
    // ========================================================

    const countResult = await db
      .select({
        count: count(users.id),
      })
      .from(users)
      .where(whereCondition);

    const total = Number(countResult[0]?.count ?? 0);

    // ========================================================
    // 7. SORTING
    // ========================================================

    let orderBy;

    switch (data.sort) {
      case "oldest":
        orderBy = asc(users.createdAt);
        break;

      case "name_asc":
        orderBy = asc(
          sql`
            concat(
              coalesce(${users.firstName}, ''),
              ' ',
              coalesce(${users.lastName}, '')
            )
          `,
        );
        break;

      case "name_desc":
        orderBy = desc(
          sql`
            concat(
              coalesce(${users.firstName}, ''),
              ' ',
              coalesce(${users.lastName}, '')
            )
          `,
        );
        break;

      case "newest":
      default:
        orderBy = desc(users.createdAt);
        break;
    }

    // ========================================================
    // 8. GET USERS
    // ========================================================

    const result = await db
      .select({
        id: users.id,

        email: users.email,

        firstName: users.firstName,

        lastName: users.lastName,

        imageUrl: users.imageUrl,

        phone: users.phone,

        role: users.role,

        isBanned: users.isBanned,

        createdAt: users.createdAt,

        updatedAt: users.updatedAt,

        orderCount: count(orders.id),

        totalSpent: sql<string>`
            coalesce(
              sum(${orders.total}),
              0
            )
          `,
      })

      .from(users)

      .leftJoin(orders, eq(orders.userId, users.id))

      .where(whereCondition)

      .groupBy(users.id)

      .orderBy(orderBy)

      .limit(data.limit)

      .offset(offset);

    // ========================================================
    // 9. PAGINATION
    // ========================================================

    const totalPages = Math.ceil(total / data.limit);

    // ========================================================
    // 10. FORMAT USERS
    // ========================================================

    const formattedUsers = result.map((user) => ({
      id: user.id,

      email: user.email,

      firstName: user.firstName,

      lastName: user.lastName,

      imageUrl: user.imageUrl,

      phone: user.phone,

      role: user.role,

      isBanned: user.isBanned,

      createdAt: user.createdAt,

      updatedAt: user.updatedAt,

      orderCount: Number(user.orderCount),

      totalSpent: user.totalSpent ?? "0",
    }));

    // ========================================================
    // 11. RETURN RESPONSE
    // ========================================================

    return NextResponse.json({
      success: true,

      data: {
        users: formattedUsers,

        pagination: {
          page: data.page,

          limit: data.limit,

          total,

          totalPages,

          hasNextPage: data.page < totalPages,

          hasPreviousPage: data.page > 1,
        },
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
