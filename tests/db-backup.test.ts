import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { test } from "node:test";
import { drizzle } from "drizzle-orm/node-sqlite";
import { migrate } from "drizzle-orm/node-sqlite/migrator";
import { backupBeforeMigrate } from "../server/db/backup";

const MIGRATIONS = "server/db/migrations";

// Banco migrado até a penúltima migration, para sobrar uma pendente.
function setup() {
  const dir = mkdtempSync(join(tmpdir(), "focusos-backup-"));
  const older = join(dir, "migrations");
  cpSync(MIGRATIONS, older, { recursive: true });
  const all = readdirSync(older).sort();
  rmSync(join(older, all.at(-1)!), { recursive: true });

  const path = join(dir, "focusos.db");
  const sqlite = new DatabaseSync(path);
  migrate(drizzle({ client: sqlite }), { migrationsFolder: older });
  return { dir, path, sqlite };
}

const backups = (dir: string) =>
  readdirSync(dir).filter((file) => file.endsWith(".bak"));

test("banco novo não gera cópia", () => {
  const dir = mkdtempSync(join(tmpdir(), "focusos-backup-"));
  const sqlite = new DatabaseSync(join(dir, "focusos.db"));
  assert.equal(
    backupBeforeMigrate(sqlite, join(dir, "focusos.db"), MIGRATIONS),
    undefined,
  );
  assert.deepEqual(backups(dir), []);
});

test("com migration pendente gera uma cópia legível; sem pendência não gera", () => {
  const { dir, path, sqlite } = setup();
  const target = backupBeforeMigrate(sqlite, path, MIGRATIONS);
  assert.ok(target);
  const copy = new DatabaseSync(target);
  assert.ok(
    copy.prepare("SELECT count(*) AS n FROM __drizzle_migrations").get(),
  );

  migrate(drizzle({ client: sqlite }), { migrationsFolder: MIGRATIONS });
  assert.equal(backupBeforeMigrate(sqlite, path, MIGRATIONS), undefined);
  assert.equal(backups(dir).length, 1);
});

test("mantém só as 3 cópias mais recentes", () => {
  const { dir, path, sqlite } = setup();
  for (let day = 1; day <= 5; day++) {
    backupBeforeMigrate(sqlite, path, MIGRATIONS, new Date(2026, 9, day, 12));
  }
  assert.deepEqual(
    backups(dir).map((file) => file.slice(11, 21)),
    ["2026-10-03", "2026-10-04", "2026-10-05"],
  );
});

test("se a cópia falha, lança antes de migrar", () => {
  const { sqlite } = setup();
  assert.throws(() =>
    backupBeforeMigrate(
      sqlite,
      "/caminho/que/nao/existe/focusos.db",
      MIGRATIONS,
    ),
  );
});
