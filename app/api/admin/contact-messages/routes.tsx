import { NextRequest } from "next/server";

import { and, asc, desc, eq, ilike, or, type SQL } from "drizzle-orm";

import { contactMessages, users } from "@/db/schema";

import { db } from "@/db/drizzle";

import { handleApiError } from "@/lib/APIs/api-errors";

import { requireAdmin } from "@/lib/APIs/auth";

export const runtime = "nodejs";

// ============================================================
// GET /api/admin/contact-messages
// ============================================================
//
// Query parameters:
//
// ?page=1
// &limit=10
// &search=john
// &isRead=true
// &sort=newest
//
// ============================================================

export async function GET(req: NextRequest) {
  try {
    // ========================================================
    // REQUIRE ADMIN
    // ========================================================

    await requireAdmin();

    // ========================================================
    // QUERY PARAMETERS
    // ========================================================

    const searchParams = req.nextUrl.searchParams;

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);

    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 10, 1),
      100,
    );

    const search = searchParams.get("search")?.trim() || undefined;

    const isReadParam = searchParams.get("isRead");

    const isRead = isReadParam === null ? undefined : isReadParam === "true";

    const sort = searchParams.get("sort") || "newest";

    const offset = (page - 1) * limit;

    // ========================================================
    // CONDITIONS
    // ========================================================

    const conditions: SQL[] = [];

    // ========================================================
    // SEARCH
    // ========================================================

    if (search) {
      const searchCondition = or(
        ilike(contactMessages.name, `%${search}%`),

        ilike(contactMessages.email, `%${search}%`),

        ilike(contactMessages.subject, `%${search}%`),

        ilike(contactMessages.message, `%${search}%`),
      );

      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    // ========================================================
    // READ STATUS
    // ========================================================

    if (isRead !== undefined) {
      conditions.push(eq(contactMessages.isRead, isRead));
    }

    // ========================================================
    // WHERE CONDITION
    // ========================================================

    const whereCondition =
      conditions.length > 0 ? and(...conditions) : undefined;

    // ========================================================
    // ORDER
    // ========================================================

    const orderBy =
      sort === "oldest"
        ? asc(contactMessages.createdAt)
        : desc(contactMessages.createdAt);

    // ========================================================
    // GET CONTACT MESSAGES
    // ========================================================

    const messageRows = await db
      .select()
      .from(contactMessages)
      .where(whereCondition)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // ========================================================
    // LOAD USER RELATIONS
    // ========================================================

    const messages = [];

    for (const message of messageRows) {
      let user = null;

      if (message.userId) {
        const userRow = await db.query.users.findFirst({
          where: {
            id: message.userId,
          },

          columns: {
            id: true,
            clerkId: true,
            email: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        });

        if (userRow) {
          user = userRow;
        }
      }

      messages.push({
        ...message,
        user,
      });
    }

    // ========================================================
    // COUNT
    // ========================================================

    const total = await db.$count(contactMessages, whereCondition);

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data: messages,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/contact-messages error:", error);

    return handleApiError(error);
  }
}
