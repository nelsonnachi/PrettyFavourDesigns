import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

import { users } from "./users";

export const contactMessages = pgTable(
  "contact_messages",
  {
    id: uuid("id")
      .primaryKey()
      .defaultRandom(),

    userId: uuid("user_id").references(
      () => users.id,
      {
        onDelete: "set null",
      },
    ),

    name: text("name")
      .notNull(),

    email: text("email")
      .notNull(),

    phone: text("phone"),

    subject: text("subject"),

    message: text("message")
      .notNull(),

    isRead: boolean("is_read")
      .notNull()
      .default(false),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },

  (table) => ({
    readIdx: index(
      "contact_messages_read_idx",
    ).on(table.isRead),

    createdAtIdx: index(
      "contact_messages_created_at_idx",
    ).on(table.createdAt),
  }),
);


