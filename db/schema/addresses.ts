import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

import { users } from "./users";

export const addresses = pgTable(
  "addresses",
  {
    id: uuid("id")
      .primaryKey()
      .defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    firstName: text("first_name")
      .notNull(),

    lastName: text("last_name")
      .notNull(),

    phone: text("phone")
      .notNull(),

    addressLine1: text(
      "address_line_1",
    ).notNull(),

    addressLine2: text(
      "address_line_2",
    ),

    city: text("city")
      .notNull(),

    state: text("state")
      .notNull(),

    country: text("country")
      .notNull()
      .default("Nigeria"),

    postalCode: text("postal_code"),

    isDefault: boolean("is_default")
      .notNull()
      .default(false),

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
    // --------------------------------------------------------
    // User addresses lookup
    // --------------------------------------------------------

    userIdx: index(
      "addresses_user_idx",
    ).on(table.userId),

    // --------------------------------------------------------
    // Only ONE default address per user
    // --------------------------------------------------------

    oneDefaultPerUserIdx: uniqueIndex(
      "addresses_one_default_per_user_idx",
    )
      .on(table.userId)
      .where(
        sql`${table.isDefault} = true`,
      ),
  }),
);