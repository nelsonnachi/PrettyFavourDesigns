import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const newsletterSubscribers =
  pgTable(
    "newsletter_subscribers",
    {
      id: uuid("id")
        .primaryKey()
        .defaultRandom(),

      email: text("email")
        .notNull()
        .unique(),

      isSubscribed: boolean(
        "is_subscribed",
      )
        .notNull()
        .default(true),

      subscribedAt: timestamp(
        "subscribed_at",
        {
          withTimezone: true,
        },
      )
        .notNull()
        .defaultNow(),

      unsubscribedAt: timestamp(
        "unsubscribed_at",
        {
          withTimezone: true,
        },
      ),
    },

    (table) => ({
      subscribedIdx: index(
        "newsletter_subscribed_idx",
      ).on(table.isSubscribed),
    }),
  );


