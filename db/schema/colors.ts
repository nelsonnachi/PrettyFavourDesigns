import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";

export const colors = pgTable(
  "colors",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    name: text("name").notNull().unique(),

    hexCode: text("hex_code"),

    isActive: boolean("is_active").notNull().default(true),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },

  (table) => ({
    activeIdx: index("colors_active_idx").on(table.isActive),
  })
);
