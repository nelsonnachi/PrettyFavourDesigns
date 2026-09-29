import { NextRequest } from "next/server";

import {
  and,
  desc,
  eq,
  ilike,
  or,
} from "drizzle-orm";

import { contactMessages } from "@/db/schema";
import { db } from "@/db/drizzle";

import {
  handleApiError,
} from "@/lib/APIs/api-errors";

import {
  requireAdmin,
} from "@/lib/APIs/auth";

export const runtime = "nodejs";

// ============================================================
// GET /api/admin/contact-messages
// ============================================================

export async function GET(
  req: NextRequest,
) {
  try {
    await requireAdmin();

    const searchParams =
      req.nextUrl.searchParams;

    // ==========================================================
    // PAGINATION
    // ==========================================================

    const rawPage = Number(
      searchParams.get("page"),
    );

    const rawLimit = Number(
      searchParams.get("limit"),
    );

    const page = Math.max(
      Number.isFinite(rawPage)
        ? rawPage
        : 1,
      1,
    );

    const limit = Math.min(
      Math.max(
        Number.isFinite(rawLimit)
          ? rawLimit
          : 12,
        1,
      ),
      100,
    );

    const offset =
      (page - 1) * limit;

    // ==========================================================
    // SEARCH
    // ==========================================================

    const search =
      searchParams
        .get("search")
        ?.trim() || undefined;

    // ==========================================================
    // READ STATUS
    // ==========================================================

    const isReadParam =
      searchParams.get("isRead");

    let isRead:
      | boolean
      | undefined;

    if (
      isReadParam === "true"
    ) {
      isRead = true;
    } else if (
      isReadParam === "false"
    ) {
      isRead = false;
    }

    // ==========================================================
    // SORT
    // ==========================================================

    const sort =
      searchParams.get("sort") ===
      "oldest"
        ? "oldest"
        : "newest";

    // ==========================================================
    // RELATIONS V2 WHERE
    //
    // IMPORTANT:
    // db.query.* uses Relations v2 object syntax.
    // Do NOT pass SQL<unknown> here.
    // ==========================================================

    const where = {
      ...(search
        ? {
            OR: [
              {
                name: {
                  ilike: `%${search}%`,
                },
              },
              {
                email: {
                  ilike: `%${search}%`,
                },
              },
              {
                subject: {
                  ilike: `%${search}%`,
                },
              },
              {
                message: {
                  ilike: `%${search}%`,
                },
              },
            ],
          }
        : {}),

      ...(isRead !== undefined
        ? {
            isRead,
          }
        : {}),
    };

    // ==========================================================
    // GET MESSAGES
    //
    // DRIZZLE RELATIONS V2
    //
    // No leftJoin()
    // No select().from()
    // No manual row mapping
    // ==========================================================

    const messages =
      await db.query.contactMessages.findMany({
        where,

        columns: {
          id: true,
          userId: true,
          name: true,
          email: true,
          phone: true,
          subject: true,
          message: true,
          isRead: true,
          createdAt: true,
        },

        with: {
          user: {
            columns: {
              id: true,
              clerkId: true,
              email: true,
              firstName: true,
              lastName: true,
              imageUrl: true,
              phone: true,
            },
          },
        },

        orderBy: {
          createdAt:
            sort === "oldest"
              ? "asc"
              : "desc",
        },

        limit,

        offset,
      });

    // ==========================================================
    // COUNT
    //
    // $count() is part of the SQL query builder, so its
    // condition remains an SQL expression.
    //
    // This is intentionally separate from Relations v2
    // "where" above.
    // ==========================================================

    const countConditions = [];

    if (search) {
      const searchCondition =
        or(
          ilike(
            contactMessages.name,
            `%${search}%`,
          ),

          ilike(
            contactMessages.email,
            `%${search}%`,
          ),

          ilike(
            contactMessages.subject,
            `%${search}%`,
          ),

          ilike(
            contactMessages.message,
            `%${search}%`,
          ),
        );

      if (searchCondition) {
        countConditions.push(
          searchCondition,
        );
      }
    }

    if (isRead !== undefined) {
      countConditions.push(
        eq(
          contactMessages.isRead,
          isRead,
        ),
      );
    }

    const countWhere =
      countConditions.length > 0
        ? and(...countConditions)
        : undefined;

    const total =
      await db.$count(
        contactMessages,
        countWhere,
      );

    // ==========================================================
    // RESPONSE
    // ==========================================================

    return Response.json({
      success: true,

      data: messages,

      pagination: {
        page,
        limit,
        total,

        totalPages:
          Math.ceil(
            total / limit,
          ),
      },
    });
  } catch (error) {
    console.error(
      "GET /api/admin/contact-messages error:",
      error,
    );

    return handleApiError(error);
  }
}