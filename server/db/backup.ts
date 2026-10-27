import { existsSync, readdirSync, rmSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import type { DatabaseSync } from "node:sqlite";

const KEEP = 3;

// Migrations só andam para frente (ADR 0005); a cópia é o caminho de volta de um update (ADR 0006).
// Devolve o caminho da cópia, ou undefined quando não havia o que migrar.
export function backupBeforeMigrate(
  sqlite: DatabaseSync,
  path: string,
  migrationsFolder: string,
  now = new Date(),
) {
  const hasTable = sqlite
    .prepare(
      "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = '__drizzle_migrations'",
    )
    .get();
  // Sem a tabela é banco novo: nada a proteger.
  if (!hasTable) return;

  const applied = sqlite
    .prepare("SELECT count(*) AS n FROM __drizzle_migrations")
    .get() as {
    n: number;
  };
  const local = readdirSync(migrationsFolder).filter((dir) =>
    existsSync(join(migrationsFolder, dir, "migration.sql")),
  ).length;
  if (local <= applied.n) return;

  const stamp = now.toISOString().slice(0, 19).replaceAll(":", "-");
  const target = `${path}.${stamp}.bak`;
  // VACUUM INTO gera uma cópia consistente mesmo com WAL; se falhar, lança e o migrate não roda.
  sqlite.prepare("VACUUM INTO ?").run(target);

  const prefix = `${basename(path)}.`;
  const old = readdirSync(dirname(path))
    .filter((file) => file.startsWith(prefix) && file.endsWith(".bak"))
    .sort()
    .slice(0, -KEEP);
  for (const file of old) rmSync(join(dirname(path), file));

  return target;
}
