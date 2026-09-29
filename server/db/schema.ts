import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text().primaryKey(),
  username: text().notNull().unique(),
  name: text().notNull(),
  email: text().notNull().unique(),
  email_verified: integer({ mode: "boolean" }).default(false),
  created_at: text().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const accounts = sqliteTable(
  "accounts",
  {
    id: text().primaryKey(),
    user_id: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text().notNull(),
    provider_account_id: text().notNull(),
    password: text(),
    created_at: text().default(sql`CURRENT_TIMESTAMP`),
    updated_at: text()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    unique().on(t.provider, t.provider_account_id),
    index("idx_accounts_user_id").on(t.user_id),
  ],
);
