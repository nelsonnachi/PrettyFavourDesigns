import { NextRequest } from "next/server";

import {
  and,
  eq,
  ilike,
} from "drizzle-orm";

import { db } from "@/db/drizzle";

import {
  newsletterSubscribers,
} from "@/db/schema";

import {
  handleApiError,
} from "@/lib/APIs/api-errors";

import {
  requireAdmin,
} from "@/lib/APIs/auth";

export const runtime = "nodejs";

// ============================================================
// GET /api/admin/newsletter
// ============================================================
//
// Query parameters:
//
// ?page=1
// ?limit=10
// ?search=john
// ?isSubscribed=true
// ?sort=newest
//
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
          : 10,
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
    // SUBSCRIPTION STATUS
    // ==========================================================

    const isSubscribedParam =
      searchParams.get(
        "isSubscribed",
      );

    let isSubscribed:
      | boolean
      | undefined;

    if (
      isSubscribedParam === "true"
    ) {
      isSubscribed = true;
    } else if (
      isSubscribedParam === "false"
    ) {
      isSubscribed = false;
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
    //
    // db.query.* uses the Relations v2 object syntax.
    //
    // Do NOT create:
    //
    // const whereCondition = and(...)
    //
    // and then pass that SQL object to db.query.
    // ==========================================================

    const where = {
      ...(search
        ? {
            email: {
              ilike: `%${search}%`,
            },
          }
        : {}),

      ...(isSubscribed !== undefined
        ? {
            isSubscribed,
          }
        : {}),
    };

    // ==========================================================
    // GET SUBSCRIBERS
    //
    // DRIZZLE RELATIONS V2
    // ==========================================================

    const subscribers =
      await db.query.newsletterSubscribers.findMany(
        {
          where,

          columns: {
            id: true,
            email: true,
            isSubscribed: true,
            subscribedAt: true,
            unsubscribedAt: true,
          },

          orderBy: {
            subscribedAt:
              sort === "oldest"
                ? "asc"
                : "desc",
          },

          limit,

          offset,
        },
      );

    // ==========================================================
    // COUNT
    //
    // $count() uses the SQL query builder, so SQL conditions
    // are correct here.
    // ==========================================================

    const countConditions = [];

    if (search) {
      countConditions.push(
        ilike(
          newsletterSubscribers.email,
          `%${search}%`,
        ),
      );
    }

    if (
      isSubscribed !== undefined
    ) {
      countConditions.push(
        eq(
          newsletterSubscribers.isSubscribed,
          isSubscribed,
        ),
      );
    }

    const countWhere =
      countConditions.length > 0
        ? and(...countConditions)
        : undefined;

    const total =
      await db.$count(
        newsletterSubscribers,
        countWhere,
      );

    // ==========================================================
    // RESPONSE
    // ==========================================================

    return Response.json({
      success: true,

      data: subscribers,

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
      "GET /api/admin/newsletter error:",
      error,
    );

    return handleApiError(error);
  }
}