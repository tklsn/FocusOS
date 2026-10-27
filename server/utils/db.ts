import "dotenv/config";
import { drizzle } from "drizzle-orm/node-sqlite";
import { migrate } from "drizzle-orm/node-sqlite/migrator";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { backupBeforeMigrate } from "../db/backup";

const path = process.env.DB_FILE_NAME ?? ".data/focusos.db";
const migrationsFolder =
  process.env.DB_MIGRATIONS_DIR ?? "server/db/migrations";

mkdirSync(dirname(path), { recursive: true });
const sqlite = new DatabaseSync(path);
export const db = drizzle({ client: sqlite });

backupBeforeMigrate(sqlite, path, migrationsFolder);
migrate(db, { migrationsFolder });
