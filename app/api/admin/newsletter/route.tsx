import { NextRequest } from "next/server";

import {
  and,
  asc,
  desc,
  eq,
  ilike,
  type SQL,
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
    // ========================================================
    // REQUIRE ADMIN
    // ========================================================

    await requireAdmin();

    // ========================================================
    // QUERY PARAMETERS
    // ========================================================

    const searchParams =
      req.nextUrl.searchParams;

    const page = Math.max(
      Number(
        searchParams.get("page"),
      ) || 1,
      1,
    );

    const limit = Math.min(
      Math.max(
        Number(
          searchParams.get("limit"),
        ) || 10,
        1,
      ),
      100,
    );

    const search =
      searchParams
        .get("search")
        ?.trim() || undefined;

    const isSubscribedParam =
      searchParams.get(
        "isSubscribed",
      );

    const isSubscribed =
      isSubscribedParam === null
        ? undefined
        : isSubscribedParam === "true";

    const sort =
      searchParams.get("sort") ||
      "newest";

    const offset =
      (page - 1) * limit;

    // ========================================================
    // CONDITIONS
    // ========================================================

    const conditions: SQL[] = [];

    // ========================================================
    // SEARCH
    // ========================================================

    if (search) {
      conditions.push(
        ilike(
          newsletterSubscribers.email,
          `%${search}%`,
        ),
      );
    }

    // ========================================================
    // SUBSCRIPTION STATUS
    // ========================================================

    if (
      isSubscribed !==
      undefined
    ) {
      conditions.push(
        eq(
          newsletterSubscribers.isSubscribed,
          isSubscribed,
        ),
      );
    }

    // ========================================================
    // WHERE
    // ========================================================

    const whereCondition =
      conditions.length > 0
        ? and(...conditions)
        : undefined;

    // ========================================================
    // ORDER
    // ========================================================

    const orderBy =
      sort === "oldest"
        ? asc(
            newsletterSubscribers.subscribedAt,
          )
        : desc(
            newsletterSubscribers.subscribedAt,
          );

    // ========================================================
    // GET SUBSCRIBERS
    // ========================================================

    const subscribers =
      await db
        .select({
          id:
            newsletterSubscribers.id,

          email:
            newsletterSubscribers.email,

          isSubscribed:
            newsletterSubscribers.isSubscribed,

          subscribedAt:
            newsletterSubscribers.subscribedAt,

          unsubscribedAt:
            newsletterSubscribers.unsubscribedAt,
        })
        .from(
          newsletterSubscribers,
        )
        .where(
          whereCondition,
        )
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);

    // ========================================================
    // COUNT
    // ========================================================

    const total =
      await db.$count(
        newsletterSubscribers,
        whereCondition,
      );

    // ========================================================
    // RESPONSE
    // ========================================================

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