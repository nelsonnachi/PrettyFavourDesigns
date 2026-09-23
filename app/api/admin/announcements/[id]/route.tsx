import { NextRequest } from "next/server";

import { eq } from "drizzle-orm";



import { db } from "@/db/drizzle";

import {
  ApiError,
  handleApiError,
} from "@/lib/APIs/api-errors";

import { requireAdmin } from "@/lib/APIs/auth";

import {
  updateAnnouncementSchema,
} from "@/lib/validations";
import { announcements } from "@/db/schema";

export const runtime = "nodejs";

// ============================================================
// TYPES
// ============================================================

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// ============================================================
// GET /api/admin/announcements/[id]
// ============================================================

export async function GET(
  req: NextRequest,
  context: RouteContext,
) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    if (!id) {
      throw new ApiError(
        "Announcement ID is required",
        400,
      );
    }

    const announcement =
      await db.query.announcements.findFirst({
        where: {
          id,
        },
      });

    if (!announcement) {
      throw new ApiError(
        "Announcement not found",
        404,
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

    return Response.json({
      success: true,

      data: {
        ...announcement,
        campaignStatus,
      },
    });
  } catch (error) {
    console.error(
      "GET /api/admin/announcements/[id] error:",
      error,
    );

    return handleApiError(error);
  }
}

// ============================================================
// PATCH /api/admin/announcements/[id]
// ============================================================

export async function PATCH(
  req: NextRequest,
  context: RouteContext,
) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    if (!id) {
      throw new ApiError(
        "Announcement ID is required",
        400,
      );
    }

    // ========================================================
    // FIND EXISTING
    // ========================================================

    const existing =
      await db.query.announcements.findFirst({
        where: {
          id,
        },
      });

    if (!existing) {
      throw new ApiError(
        "Announcement not found",
        404,
      );
    }

    // ========================================================
    // BODY
    // ========================================================

    const body = await req.json();

    // ========================================================
    // VALIDATE
    // ========================================================

    const input =
      updateAnnouncementSchema.parse(body);

    // ========================================================
    // EFFECTIVE DATES
    // ========================================================

    const eventAt =
      input.eventAt !== undefined
        ? input.eventAt
        : existing.eventAt;

    const expiresAt =
      input.expiresAt !== undefined
        ? input.expiresAt
        : existing.expiresAt;

    // ========================================================
    // VALIDATE DATE ORDER
    // ========================================================

    if (
      eventAt &&
      expiresAt &&
      expiresAt <= eventAt
    ) {
      throw new ApiError(
        "Expiration date must be after the event start date",
        422,
      );
    }

    // ========================================================
    // BUILD UPDATE
    // ========================================================

    const values: Partial<
      typeof announcements.$inferInsert
    > = {};

    if (input.type !== undefined) {
      values.type = input.type;
    }

    if (input.title !== undefined) {
      values.title = input.title;
    }

    if (input.description !== undefined) {
      values.description =
        input.description;
    }

    if (input.imageUrl !== undefined) {
      values.imageUrl =
        input.imageUrl;
    }

    if (
      input.imagePublicId !== undefined
    ) {
      values.imagePublicId =
        input.imagePublicId;
    }

    if (input.ctaText !== undefined) {
      values.ctaText =
        input.ctaText;
    }

    if (input.ctaUrl !== undefined) {
      values.ctaUrl =
        input.ctaUrl;
    }

    if (input.eventAt !== undefined) {
      values.eventAt =
        input.eventAt;
    }

    if (input.expiresAt !== undefined) {
      values.expiresAt =
        input.expiresAt;
    }

    // ========================================================
    // PUBLISH / UNPUBLISH
    // ========================================================

    if (input.isPublished !== undefined) {
      values.isPublished =
        input.isPublished;

      if (input.isPublished) {
        values.publishedAt =
          existing.publishedAt ??
          new Date();
      } else {
        values.publishedAt = null;
      }
    }

    // ========================================================
    // UPDATED AT
    // ========================================================

    values.updatedAt = new Date();

    // ========================================================
    // UPDATE
    // ========================================================

    const [updated] = await db
      .update(announcements)
      .set(values)
      .where(
        eq(
          announcements.id,
          id,
        ),
      )
      .returning();

    if (!updated) {
      throw new ApiError(
        "Announcement update failed",
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

    if (!updated.isPublished) {
      campaignStatus = "draft";
    } else if (
      updated.eventAt &&
      now < updated.eventAt
    ) {
      campaignStatus = "upcoming";
    } else if (
      updated.expiresAt &&
      now >= updated.expiresAt
    ) {
      campaignStatus = "expired";
    } else {
      campaignStatus = "active";
    }

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data: {
        ...updated,
        campaignStatus,
      },

      message:
        "Announcement updated successfully",
    });
  } catch (error) {
    console.error(
      "PATCH /api/admin/announcements/[id] error:",
      error,
    );

    return handleApiError(error);
  }
}

// ============================================================
// DELETE /api/admin/announcements/[id]
// ============================================================

export async function DELETE(
  req: NextRequest,
  context: RouteContext,
) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    if (!id) {
      throw new ApiError(
        "Announcement ID is required",
        400,
      );
    }

    // ========================================================
    // FIND EXISTING
    // ========================================================

    const existing =
      await db.query.announcements.findFirst({
        where: {
          id,
        },
      });

    if (!existing) {
      throw new ApiError(
        "Announcement not found",
        404,
      );
    }

    // ========================================================
    // DELETE
    // ========================================================

    await db
      .delete(announcements)
      .where(
        eq(
          announcements.id,
          id,
        ),
      );

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      message:
        "Announcement deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/announcements/[id] error:",
      error,
    );

    return handleApiError(error);
  }
}