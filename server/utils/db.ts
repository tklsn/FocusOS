import { drizzle } from "drizzle-orm/node-sqlite";
import { DatabaseSync } from "node:sqlite";

const path = process.env.DB_FILE_NAME ?? ".data/focusos.db";

import "dotenv/config";

const sqlite = new DatabaseSync(path);
export const db = drizzle({ client: sqlite });
