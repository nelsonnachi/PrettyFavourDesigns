import { NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { announcements } from "@/db/schema/announcements";
import { announcementTypeEnum } from "@/db/schema/enums";
import { requireAdmin } from "@/lib/APIs/auth";
import { ApiError, handleApiError } from "@/lib/APIs/api-errors";
import { uploadImageToCloudinary } from "@/lib/cloudinary/upload";
import { deleteImageFromCloudinary } from "@/lib/cloudinary/delete";


// ============================================================
// PARAMS
// ============================================================

interface AnnouncementRouteContext {
  params: Promise<{
    id: string;
  }>;
}

// ============================================================
// GET ONE ANNOUNCEMENT
// ============================================================

export async function GET(
  _request: NextRequest,
  context: AnnouncementRouteContext,
) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    const announcement = await db.query.announcements.findFirst({
      where: { id },
    });

    if (!announcement) {
      throw new ApiError("Announcement not found", 404);
    }

    return NextResponse.json({
      success: true,
      data: {
        announcement,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// UPDATE ANNOUNCEMENT
// ============================================================

export async function PATCH(
  request: NextRequest,
  context: AnnouncementRouteContext,
) {
  let uploadedPublicId: string | null = null;

  try {
    await requireAdmin();

    const { id } = await context.params;

    // --------------------------------------------------------
    // Find existing announcement
    // --------------------------------------------------------

    const existingAnnouncement = await db.query.announcements.findFirst({
      where: { id },
    });

    if (!existingAnnouncement) {
      throw new ApiError("Announcement not found", 404);
    }

    // --------------------------------------------------------
    // Read multipart form data
    // --------------------------------------------------------

    const formData = await request.formData();

    const image = formData.get("image");
    const typeValue = formData.get("type");
    const titleValue = formData.get("title");
    const ctaTextValue = formData.get("ctaText");
    const ctaUrlValue = formData.get("ctaUrl");

    // --------------------------------------------------------
    // Determine updated values
    // --------------------------------------------------------

    const type =
      typeof typeValue === "string" && typeValue.trim()
        ? typeValue.trim()
        : existingAnnouncement.type;

    if (
      !announcementTypeEnum.enumValues.includes(
        type as (typeof announcementTypeEnum.enumValues)[number],
      )
    ) {
      throw new ApiError("Invalid announcement type", 400);
    }

    const title =
      titleValue === null
        ? existingAnnouncement.title
        : typeof titleValue === "string" && titleValue.trim()
          ? titleValue.trim()
          : null;

    const ctaText =
      ctaTextValue === null
        ? existingAnnouncement.ctaText
        : typeof ctaTextValue === "string" && ctaTextValue.trim()
          ? ctaTextValue.trim()
          : null;

    const ctaUrl =
      ctaUrlValue === null
        ? existingAnnouncement.ctaUrl
        : typeof ctaUrlValue === "string" && ctaUrlValue.trim()
          ? ctaUrlValue.trim()
          : null;

    // --------------------------------------------------------
    // Upload replacement image if provided
    // --------------------------------------------------------

    let imageUrl = existingAnnouncement.imageUrl;
    let imagePublicId = existingAnnouncement.imagePublicId;

    if (image instanceof File) {
      if (image.size === 0) {
        throw new ApiError("Announcement image cannot be empty", 400);
      }

      if (!image.type.startsWith("image/")) {
        throw new ApiError("Announcement file must be an image", 400);
      }

      const uploadedImage = await uploadImageToCloudinary(
        image,
        "shoppfd/announcements",
      );

      uploadedPublicId = uploadedImage.publicId;
      imageUrl = uploadedImage.url;
      imagePublicId = uploadedImage.publicId;
    }

    // --------------------------------------------------------
    // Update database
    // --------------------------------------------------------

    let updatedAnnouncement;

    try {
      const result = await db
        .update(announcements)
        .set({
          type: type as (typeof announcementTypeEnum.enumValues)[number],
          title,
          imageUrl,
          imagePublicId,
          ctaText,
          ctaUrl,
          updatedAt: new Date(),
        })
        .where(eq(announcements.id, id))
        .returning();

      updatedAnnouncement = result[0];
    } catch (databaseError) {
      // If a new image was uploaded but the
      // database update failed, clean it up.
      if (uploadedPublicId) {
        try {
          await deleteImageFromCloudinary(uploadedPublicId);
        } catch (cleanupError) {
          console.error(
            "Failed to clean up replacement announcement image:",
            cleanupError,
          );
        }
      }

      throw databaseError;
    }

    if (!updatedAnnouncement) {
      throw new ApiError("Announcement could not be updated", 500);
    }

    // --------------------------------------------------------
    // Delete previous image if it was replaced
    // --------------------------------------------------------

    if (
      uploadedPublicId &&
      existingAnnouncement.imagePublicId &&
      existingAnnouncement.imagePublicId !== uploadedPublicId
    ) {
      try {
        await deleteImageFromCloudinary(existingAnnouncement.imagePublicId);
      } catch (cloudinaryError) {
        console.error(
          "Failed to delete previous announcement image:",
          cloudinaryError,
        );
      }
    }

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,
      message: "Announcement updated successfully",
      data: {
        announcement: updatedAnnouncement,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// DELETE ANNOUNCEMENT
// ============================================================

export async function DELETE(
  _request: NextRequest,
  context: AnnouncementRouteContext,
) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    // --------------------------------------------------------
    // Find announcement
    // --------------------------------------------------------

    const announcement = await db.query.announcements.findFirst({
      where: { id },
    });

    if (!announcement) {
      throw new ApiError("Announcement not found", 404);
    }

    // --------------------------------------------------------
    // Delete database record
    // --------------------------------------------------------

    await db.delete(announcements).where(eq(announcements.id, id));

    // --------------------------------------------------------
    // Delete Cloudinary image
    // --------------------------------------------------------

    try {
      await deleteImageFromCloudinary(announcement.imagePublicId);
    } catch (cloudinaryError) {
      console.error(
        "Failed to delete announcement image from Cloudinary:",
        cloudinaryError,
      );
    }

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,
      message: "Announcement deleted successfully",
      data: {
        id,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}