import { NextRequest } from "next/server";

import {
  and,
  asc,
  eq,
  gt,
  isNull,
  or,
  lte
} from "drizzle-orm";

import { announcements } from "@/db/schema";

import { db } from "@/db/drizzle";

import {
  handleApiError,
} from "@/lib/APIs/api-errors";

export const runtime = "nodejs";

// ============================================================
// GET /api/announcements
// ============================================================
//
// Returns announcements that:
//
// 1. Are published
// 2. Have not expired
// 3. Have an event date in the past OR no event date
//
// Optional query:
//
// ?type=sale
//
// ============================================================

export async function GET(
  req: NextRequest,
) {
  try {
    // ========================================================
    // QUERY PARAMETERS
    // ========================================================

    const searchParams =
      req.nextUrl.searchParams;

    const type =
      searchParams.get("type") ||
      undefined;

    // ========================================================
    // CURRENT DATE
    // ========================================================

    const now = new Date();

    // ========================================================
    // CONDITIONS
    // ========================================================

    const conditions = [
      // Must be published
      eq(
        announcements.isPublished,
        true,
      ),

      // Event must either:
      // - have no event date
      // - already have started
      or(
        isNull(
          announcements.eventAt,
        ),
        lte(
          announcements.eventAt,
          now,
        ),
      ),

      // Announcement must either:
      // - have no expiration date
      // - expire in the future
      or(
        isNull(
          announcements.expiresAt,
        ),
        gt(
          announcements.expiresAt,
          now,
        ),
      ),
    ];

    // ========================================================
    // TYPE FILTER
    // ========================================================

    if (type) {
      conditions.push(
        eq(
          announcements.type,
          type as
            | "general"
            | "sale"
            | "event"
            | "class",
        ),
      );
    }

    // ========================================================
    // GET ANNOUNCEMENTS
    // ========================================================

    const rows =
      await db
        .select({
          id: announcements.id,

          type: announcements.type,

          title: announcements.title,

          description:
            announcements.description,

          imageUrl:
            announcements.imageUrl,

          ctaText:
            announcements.ctaText,

          ctaUrl:
            announcements.ctaUrl,

          eventAt:
            announcements.eventAt,

          expiresAt:
            announcements.expiresAt,

          publishedAt:
            announcements.publishedAt,

          createdAt:
            announcements.createdAt,
        })
        .from(announcements)
        .where(
          and(...conditions),
        )
        .orderBy(
          asc(
            announcements.eventAt,
          ),
          asc(
            announcements.createdAt,
          ),
        );

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data: rows,
    });
  } catch (error) {
    console.error(
      "GET /api/announcements error:",
      error,
    );

    return handleApiError(error);
  }
}