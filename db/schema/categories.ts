import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  integer,
  index,
} from "drizzle-orm/pg-core";

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    name: text("name").notNull().unique(),

    slug: text("slug").notNull().unique(),

    description: text("description"),

    position: integer("position")
      .notNull()
      .default(0),

    isActive: boolean("is_active")
      .notNull()
      .default(true),

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
    activeIdx: index(
      "categories_active_idx",
    ).on(table.isActive),

    positionIdx: index(
      "categories_position_idx",
    ).on(table.position),
  }),
);