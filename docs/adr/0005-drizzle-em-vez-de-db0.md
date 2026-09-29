# 0005: Drizzle em vez de db0

**Status:** aceito (2026-09-29). Substitui a 0001.

## Contexto

A 0001 escolheu db0 com SQL à mão para não acoplar a um driver e evitar o `drizzle-kit`. Na prática, manter tipos de linha e migrations à mão custou mais do que o acoplamento. O Drizzle 1.0 tem driver para `node:sqlite`, então o motivo principal da 0001 (não precisar de rebuild nativo no Electron) continua atendido.

## Decisão

Usar o **Drizzle ORM** com o driver `drizzle-orm/node-sqlite` (`DatabaseSync` do `node:sqlite`).

- **Schema:** `server/db/schema.ts`. Os tipos das linhas vêm de `$inferSelect`/`$inferInsert`.
- **Migrations:** geradas pelo `drizzle-kit generate` em `server/db/migrations/` e commitadas. Aplicadas no boot pelo `migrate()` de `drizzle-orm/node-sqlite/migrator`, que registra o que já rodou em `__drizzle_migrations`. Só para frente.
- **Boot síncrono:** `node:sqlite` e o migrator são síncronos. Abrir o banco, migrar e garantir o usuário local acontecem quando `server/utils/db.ts` é carregado, antes de qualquer rota responder. Não há plugin Nitro async.
- **Caminhos:** `DB_FILE_NAME` (padrão `.data/focusos.db`) e `DB_MIGRATIONS_DIR` (padrão `server/db/migrations`). O migrator lê a pasta do disco, então no Electron (ticket 41) ela vai como recurso empacotado.

## Alternativas descartadas

- **db0 com SQL à mão (0001):** tipos e migrations mantidos manualmente.
- **Prisma:** engine pesada e pouco amigável ao empacotamento no Electron.

## Consequências

- `drizzle-kit` vira dev dependency e faz parte do fluxo: mudou o schema, roda `pnpm db:generate`.
- A web (ADR 0003) pode trocar de driver (libsql/Postgres). Postgres exige outro dialeto no schema, não só outro conector.
- A pasta de migrations precisa ser distribuída junto com o servidor no build desktop.
