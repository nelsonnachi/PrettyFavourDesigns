import { NextRequest } from "next/server";

import { and, eq, ilike, or, type SQL } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema/users";
import { requireAdmin, requireSuperAdmin } from "@/lib/APIs/auth";

import { ApiError } from "@/lib/APIs/api-errors";
import { adminUsersQuerySchema, createUserSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const query = adminUsersQuerySchema.parse(params);

    const offset = (query.page - 1) * query.limit;
    const search = query.search ? `%${query.search}%` : null;

    // ----------------------------------------------------------
    // WHERE (RQB v2 object syntax) -> used by findMany
    // ----------------------------------------------------------
    const where = {
      ...(query.status === "active" && { isBanned: false }),
      ...(query.status === "banned" && { isBanned: true }),
      ...(query.role !== "all" && { role: query.role }),
      ...(search && {
        OR: [
          { email: { ilike: search } },
          { firstName: { ilike: search } },
          { lastName: { ilike: search } },
          { phone: { ilike: search } },
        ],
      }),
    };

    // ----------------------------------------------------------
    // Same filters as SQL -> used by db.$count (not part of RQB)
    // ----------------------------------------------------------
    const conditions: (SQL | undefined)[] = [];

    if (query.status === "active") conditions.push(eq(users.isBanned, false));
    if (query.status === "banned") conditions.push(eq(users.isBanned, true));
    if (query.role !== "all") conditions.push(eq(users.role, query.role));
    if (search) {
      conditions.push(
        or(
          ilike(users.email, search),
          ilike(users.firstName, search),
          ilike(users.lastName, search),
          ilike(users.phone, search),
        ),
      );
    }

    // ----------------------------------------------------------
    // ORDER BY (object syntax; key order = priority)
    // ----------------------------------------------------------
    const orderByMap = {
      newest: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
      name_asc: { firstName: "asc", lastName: "asc" },
      name_desc: { firstName: "desc", lastName: "desc" },
    } as const;

    const orderBy = orderByMap[query.sort];

    // ----------------------------------------------------------
    // FETCH
    // ----------------------------------------------------------
    const [data, total] = await Promise.all([
      db.query.users.findMany({
        where,
        columns: {
          id: true,
          clerkId: true,
          email: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
          phone: true,
          isBanned: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy,
        limit: query.limit,
        offset,
      }),

      db.$count(users, conditions.length > 0 ? and(...conditions) : undefined),
    ]);

    const totalPages = Math.ceil(total / query.limit);

    return Response.json({
      success: true,
      data,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPreviousPage: query.page > 1,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(
        { success: false, message: error.message },
        { status: error.statusCode },
      );
    }

    console.error("GET /api/admin/users:", error);

    return Response.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 },
    );
  }
}