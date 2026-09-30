import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";

import { announcementTypeEnum } from "./enums";

export const announcements = pgTable(
  "announcements",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Type of announcement.
    type: announcementTypeEnum("type").notNull().default("general"),

    // Optional internal/display title.
    // The actual announcement shown to customers
    // is the uploaded image.
    title: text("title"),

    // Cloudinary secure URL.
    imageUrl: text("image_url").notNull(),

    // Cloudinary public ID.
    // Required so the image can be deleted later.
    imagePublicId: text("image_public_id").notNull(),

    // Optional call-to-action.
    ctaText: text("cta_text"),

    ctaUrl: text("cta_url"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },

  (table) => ({
    typeIdx: index("announcements_type_idx").on(table.type),

    createdAtIdx: index("announcements_created_at_idx").on(table.createdAt),
  })
);
