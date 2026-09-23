import { z } from "zod";

// ============================================================
// ANNOUNCEMENT TYPE
// ============================================================

export const announcementTypeSchema = z.enum([
  "general",
  "sale",
  "event",
  "class",
]);

// ============================================================
// CREATE ANNOUNCEMENT
// ============================================================

export const createAnnouncementSchema = z
  .object({
    type: announcementTypeSchema.default("general"),

    title: z.string().trim().min(2, "Announcement title is required").max(200),

    description: z.string().trim().max(5000).optional(),

    imageUrl: z.string().url("Invalid image URL").optional(),

    imagePublicId: z.string().trim().max(500).optional(),

    ctaText: z.string().trim().max(100).optional(),

    ctaUrl: z.string().trim().max(500).optional(),

    eventAt: z.coerce.date().optional(),

    expiresAt: z.coerce.date().optional(),

    isPublished: z.boolean().optional().default(false),
  })
  .refine(
    (data) => {
      if (!data.eventAt || !data.expiresAt) {
        return true;
      }

      return data.expiresAt > data.eventAt;
    },
    {
      message: "Expiration date must be after the event start date",
      path: ["expiresAt"],
    }
  );

// ============================================================
// UPDATE ANNOUNCEMENT
// ============================================================

export const updateAnnouncementSchema = z.object({
  type: announcementTypeSchema.optional(),

  title: z
    .string()
    .trim()
    .min(2, "Announcement title is required")
    .max(200)
    .optional(),

  description: z.string().trim().max(5000).optional(),

  imageUrl: z.string().url("Invalid image URL").optional(),

  imagePublicId: z.string().trim().max(500).optional(),

  ctaText: z.string().trim().max(100).optional(),

  ctaUrl: z.string().trim().max(500).optional(),

  eventAt: z.coerce.date().optional(),

  expiresAt: z.coerce.date().optional(),

  isPublished: z.boolean().optional(),
});

// ============================================================
// ANNOUNCEMENT PARAMS
// ============================================================

export const announcementIdParamSchema = z.object({
  id: z.string().uuid("Invalid announcement ID"),
});
