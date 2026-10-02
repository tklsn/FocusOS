import {
  index,
  integer,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";
import { ulid } from "ulid";

export const users = sqliteTable("users", {
  id: text({
    length: 26,
  })
    .$defaultFn(() => ulid())
    .primaryKey(),
  username: text().notNull().unique(),
  name: text().notNull(),
  email: text().notNull().unique(),
  email_verified: integer({ mode: "boolean" }).default(false),
  created_at: integer({ mode: "timestamp_ms" })
    .$defaultFn(() => new Date())
    .notNull(),
  updated_at: integer({ mode: "timestamp_ms" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
});

export const accounts = sqliteTable(
  "accounts",
  {
    id: text({
      length: 26,
    })
      .$defaultFn(() => ulid())
      .primaryKey(),
    user_id: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text().notNull(),
    provider_account_id: text().notNull(),
    password: text(),
    created_at: integer({ mode: "timestamp_ms" })
      .$defaultFn(() => new Date())
      .notNull(),
    updated_at: integer({ mode: "timestamp_ms" })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    unique().on(t.provider, t.provider_account_id),
    index("idx_accounts_user_id").on(t.user_id),
  ],
);

export const tasks = sqliteTable(
  "tasks",
  {
    id: text({
      length: 26,
    })
      .$defaultFn(() => ulid())
      .primaryKey(),
    user_id: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text().notNull(),
    status: text({
      enum: ["inbox", "todo", "doing", "done"],
    })
      .notNull()
      .default("inbox"),
    created_at: integer({ mode: "timestamp_ms" })
      .$defaultFn(() => new Date())
      .notNull(),
    updated_at: integer({ mode: "timestamp_ms" })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [index("idx_tasks_user_id_status").on(t.user_id, t.status)],
);
