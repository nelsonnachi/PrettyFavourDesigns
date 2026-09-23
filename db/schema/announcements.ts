import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";

import { announcementTypeEnum } from "./enums";

export const announcements = pgTable(
  "announcements",
  {
    id: uuid("id")
      .primaryKey()
      .defaultRandom(),

    type: announcementTypeEnum(
      "type",
    )
      .notNull()
      .default("general"),

    title: text("title")
      .notNull(),

    description: text(
      "description",
    ),

    imageUrl: text("image_url"),

    imagePublicId: text(
      "image_public_id",
    ),

    ctaText: text("cta_text"),

    ctaUrl: text("cta_url"),

    // The exact date/time the event begins.
    eventAt: timestamp("event_at", {
      withTimezone: true,
    }),

    // When this announcement should stop
    // appearing.
    expiresAt: timestamp(
      "expires_at",
      {
        withTimezone: true,
      },
    ),

    isPublished: boolean(
      "is_published",
    )
      .notNull()
      .default(false),

    publishedAt: timestamp(
      "published_at",
      {
        withTimezone: true,
      },
    ),

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
    publishedIdx: index(
      "announcements_published_idx",
    ).on(table.isPublished),

    eventIdx: index(
      "announcements_event_idx",
    ).on(table.eventAt),

    expiresIdx: index(
      "announcements_expires_idx",
    ).on(table.expiresAt),
  }),
);

