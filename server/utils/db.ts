import "dotenv/config";
import { drizzle } from "drizzle-orm/node-sqlite";
import { migrate } from "drizzle-orm/node-sqlite/migrator";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";

const path = process.env.DB_FILE_NAME ?? ".data/focusos.db";

mkdirSync(dirname(path), { recursive: true });
const sqlite = new DatabaseSync(path);
export const db = drizzle({ client: sqlite });

migrate(db, {
  migrationsFolder: process.env.DB_MIGRATIONS_DIR ?? "server/db/migrations",
});
