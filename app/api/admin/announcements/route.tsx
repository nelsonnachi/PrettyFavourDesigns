import { NextRequest } from "next/server";

import {
  and,
  asc,
  desc,
  eq,
  ilike,
  or,
  type SQL,
} from "drizzle-orm";



import { db } from "@/db/drizzle";

import {
  ApiError,
  handleApiError,
} from "@/lib/APIs/api-errors";

import { requireAdmin } from "@/lib/APIs/auth";

import {
  createAnnouncementSchema,
} from "@/lib/validations";
import { announcements } from "@/db/schema";

export const runtime = "nodejs";

// ============================================================
// GET /api/admin/announcements
// ============================================================

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = req.nextUrl.searchParams;

    // ========================================================
    // PAGINATION
    // ========================================================

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1,
    );

    const limit = Math.min(
      Math.max(
        Number(searchParams.get("limit")) || 10,
        1,
      ),
      100,
    );

    const offset = (page - 1) * limit;

    // ========================================================
    // FILTERS
    // ========================================================

    const search =
      searchParams.get("search")?.trim() || undefined;

    const type =
      searchParams.get("type") || undefined;

    const isPublishedParam =
      searchParams.get("isPublished");

    const isPublished =
      isPublishedParam === null
        ? undefined
        : isPublishedParam === "true";

    const sort =
      searchParams.get("sort") || "newest";

    // ========================================================
    // CONDITIONS
    // ========================================================

    const conditions: SQL[] = [];

    // ========================================================
    // SEARCH
    // ========================================================

    if (search) {
      const searchCondition = or(
        ilike(
          announcements.title,
          `%${search}%`,
        ),

        ilike(
          announcements.description,
          `%${search}%`,
        ),

        ilike(
          announcements.ctaText,
          `%${search}%`,
        ),
      );

      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    // ========================================================
    // TYPE
    // ========================================================

    if (
      type === "general" ||
      type === "sale" ||
      type === "event" ||
      type === "class"
    ) {
      conditions.push(
        eq(
          announcements.type,
          type,
        ),
      );
    }

    // ========================================================
    // PUBLISHED
    // ========================================================

    if (isPublished !== undefined) {
      conditions.push(
        eq(
          announcements.isPublished,
          isPublished,
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
    // SORT
    // ========================================================

    const orderBy =
      sort === "oldest"
        ? asc(announcements.createdAt)
        : desc(announcements.createdAt);

    // ========================================================
    // GET ANNOUNCEMENTS
    // ========================================================

    const rows = await db
      .select()
      .from(announcements)
      .where(whereCondition)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // ========================================================
    // COUNT
    // ========================================================

    const total = await db.$count(
      announcements,
      whereCondition,
    );

    // ========================================================
    // ADD CAMPAIGN STATUS
    // ========================================================

    const now = new Date();

    const data = rows.map((announcement) => {
      let campaignStatus:
        | "draft"
        | "upcoming"
        | "active"
        | "expired";

      if (!announcement.isPublished) {
        campaignStatus = "draft";
      } else if (
        announcement.eventAt &&
        now < announcement.eventAt
      ) {
        campaignStatus = "upcoming";
      } else if (
        announcement.expiresAt &&
        now >= announcement.expiresAt
      ) {
        campaignStatus = "expired";
      } else {
        campaignStatus = "active";
      }

      return {
        ...announcement,
        campaignStatus,
      };
    });

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit,
        ),
      },
    });
  } catch (error) {
    console.error(
      "GET /api/admin/announcements error:",
      error,
    );

    return handleApiError(error);
  }
}

// ============================================================
// POST /api/admin/announcements
// ============================================================

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    // ========================================================
    // BODY
    // ========================================================

    const body = await req.json();

    // ========================================================
    // VALIDATE
    // ========================================================

    const input =
      createAnnouncementSchema.parse(body);

    // ========================================================
    // PUBLISHED DATE
    // ========================================================

    const isPublished =
      input.isPublished ?? false;

    const publishedAt = isPublished
      ? new Date()
      : null;

    // ========================================================
    // CREATE
    // ========================================================

    const [announcement] = await db
      .insert(announcements)
      .values({
        type: input.type,

        title: input.title,

        description:
          input.description,

        imageUrl:
          input.imageUrl,

        imagePublicId:
          input.imagePublicId,

        ctaText:
          input.ctaText,

        ctaUrl:
          input.ctaUrl,

        eventAt:
          input.eventAt,

        expiresAt:
          input.expiresAt,

        isPublished,

        publishedAt,
      })
      .returning();

    if (!announcement) {
      throw new ApiError(
        "Announcement creation failed",
        500,
      );
    }

    // ========================================================
    // CAMPAIGN STATUS
    // ========================================================

    const now = new Date();

    let campaignStatus:
      | "draft"
      | "upcoming"
      | "active"
      | "expired";

    if (!announcement.isPublished) {
      campaignStatus = "draft";
    } else if (
      announcement.eventAt &&
      now < announcement.eventAt
    ) {
      campaignStatus = "upcoming";
    } else if (
      announcement.expiresAt &&
      now >= announcement.expiresAt
    ) {
      campaignStatus = "expired";
    } else {
      campaignStatus = "active";
    }

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json(
      {
        success: true,

        data: {
          ...announcement,
          campaignStatus,
        },

        message:
          "Announcement created successfully",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "POST /api/admin/announcements error:",
      error,
    );

    return handleApiError(error);
  }
}