import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db/drizzle";

import { ApiError, handleApiError } from "@/lib/APIs/api-errors";

import type { AnnouncementType } from "@/lib/query/announcements/announcements-types";

export const runtime = "nodejs";

const VALID_TYPES: AnnouncementType[] = ["general", "sale", "event", "class"];

// ============================================================
// GET CURRENT PUBLIC ANNOUNCEMENT
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const typeParam = request.nextUrl.searchParams.get("type");

    // ========================================================
    // VALIDATE OPTIONAL TYPE FILTER
    // ========================================================

    let type: AnnouncementType | undefined;

    if (typeParam) {
      if (!VALID_TYPES.includes(typeParam as AnnouncementType)) {
        throw new ApiError("Invalid announcement type", 400);
      }

      type = typeParam as AnnouncementType;
    }

    // ========================================================
    // GET CURRENT ANNOUNCEMENT
    // ========================================================

    const announcement = await db.query.announcements.findFirst({
      where: type ? { type } : undefined,
      orderBy: { createdAt: "desc" },
    });

    // ========================================================
    // PUBLIC RESPONSE
    // ========================================================
    //
    // Do NOT expose imagePublicId to the storefront.
    //
    // ========================================================

    const publicAnnouncement = announcement
      ? {
          id: announcement.id,
          type: announcement.type,
          title: announcement.title,
          imageUrl: announcement.imageUrl,
          ctaText: announcement.ctaText,
          ctaUrl: announcement.ctaUrl,
          createdAt: announcement.createdAt,
        }
      : null;

    return NextResponse.json({
      success: true,
      data: {
        announcement: publicAnnouncement,
      },
    });
  } catch (error) {
    console.error("GET /api/announcements error:", error);

    return handleApiError(error);
  }
}