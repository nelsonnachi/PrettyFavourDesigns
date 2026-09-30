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
// GET CURRENT ANNOUNCEMENT
// ============================================================

export async function GET() {
  try {
    await requireAdmin();

    const announcement = await db.query.announcements.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: {
        announcement: announcement ?? null,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// CREATE / REPLACE ANNOUNCEMENT
// ============================================================

export async function POST(request: NextRequest) {
  let uploadedPublicId: string | null = null;

  try {
    await requireAdmin();

    const formData = await request.formData();

    const image = formData.get("image");
    const typeValue = formData.get("type");
    const titleValue = formData.get("title");
    const ctaTextValue = formData.get("ctaText");
    const ctaUrlValue = formData.get("ctaUrl");

    // --------------------------------------------------------
    // Validate image
    // --------------------------------------------------------

    if (!(image instanceof File)) {
      throw new ApiError("Announcement image is required", 400);
    }

    if (image.size === 0) {
      throw new ApiError("Announcement image cannot be empty", 400);
    }

    if (!image.type.startsWith("image/")) {
      throw new ApiError("Announcement file must be an image", 400);
    }

    // --------------------------------------------------------
    // Validate type
    // --------------------------------------------------------

    const type =
      typeof typeValue === "string" && typeValue.trim()
        ? typeValue.trim()
        : "general";

    if (
      !announcementTypeEnum.enumValues.includes(
        type as (typeof announcementTypeEnum.enumValues)[number],
      )
    ) {
      throw new ApiError("Invalid announcement type", 400);
    }

    // --------------------------------------------------------
    // Validate optional fields
    // --------------------------------------------------------

    const title =
      typeof titleValue === "string" && titleValue.trim()
        ? titleValue.trim()
        : null;

    const ctaText =
      typeof ctaTextValue === "string" && ctaTextValue.trim()
        ? ctaTextValue.trim()
        : null;

    const ctaUrl =
      typeof ctaUrlValue === "string" && ctaUrlValue.trim()
        ? ctaUrlValue.trim()
        : null;

    // --------------------------------------------------------
    // Upload new image to Cloudinary
    // --------------------------------------------------------

    const uploadedImage = await uploadImageToCloudinary(
      image,
      "shoppfd/announcements",
    );

    uploadedPublicId = uploadedImage.publicId;

    // --------------------------------------------------------
    // Get current announcement
    // --------------------------------------------------------

    const existingAnnouncement = await db.query.announcements.findFirst({
      orderBy: { createdAt: "desc" },
    });

    // --------------------------------------------------------
    // Replace database announcement
    // --------------------------------------------------------

    let newAnnouncement;

    try {
      [newAnnouncement] = await db.transaction(async (tx) => {
        // Delete the existing announcement.
        if (existingAnnouncement) {
          await tx
            .delete(announcements)
            .where(eq(announcements.id, existingAnnouncement.id));
        }

        // Insert the new announcement.
        return tx
          .insert(announcements)
          .values({
            type: type as (typeof announcementTypeEnum.enumValues)[number],
            title,
            imageUrl: uploadedImage.url,
            imagePublicId: uploadedImage.publicId,
            ctaText,
            ctaUrl,
          })
          .returning();
      });
    } catch (databaseError) {
      // The image was already uploaded to Cloudinary.
      // If the database operation fails, clean up
      // that newly uploaded image.
      try {
        await deleteImageFromCloudinary(uploadedPublicId);
      } catch (cleanupError) {
        console.error(
          "Failed to clean up uploaded announcement image:",
          cleanupError,
        );
      }

      throw databaseError;
    }

    // --------------------------------------------------------
    // Delete previous Cloudinary image
    // --------------------------------------------------------

    if (existingAnnouncement?.imagePublicId) {
      try {
        await deleteImageFromCloudinary(existingAnnouncement.imagePublicId);
      } catch (cloudinaryError) {
        // Do not fail the successful announcement
        // creation because old image cleanup failed.
        console.error(
          "Failed to delete previous announcement image from Cloudinary:",
          cloudinaryError,
        );
      }
    }

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        message: existingAnnouncement
          ? "Announcement replaced successfully"
          : "Announcement created successfully",
        data: {
          announcement: newAnnouncement,
        },
      },
      {
        status: existingAnnouncement ? 200 : 201,
      },
    );
  } catch (error) {
    return handleApiError(error);
  }
}