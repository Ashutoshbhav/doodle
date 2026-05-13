import { pgTable, text, timestamp, uuid, index } from "drizzle-orm/pg-core";

export const waitlist = pgTable(
  "waitlist",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    name: text("name"),
    source: text("source").notNull().default("hero"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  },
  (t) => [
    index("waitlist_email_idx").on(t.email),
    index("waitlist_created_at_idx").on(t.createdAt),
  ],
);
