# 61: Backup do banco antes de migrar

**What to build:** Quando uma versão nova abre com migrations pendentes, o app copia o banco antes de aplicá-las, para que um update com problema não custe os dados do usuário.

**Blocked by:** 41

**Status:** in-review

- [x] Só copia se houver migration pendente; abrir o app sem mudança de schema não cria arquivo
- [x] A cópia fica ao lado do banco, com data e hora no nome (ex.: `focusos.db.2026-10-26T14-03-00.bak`), e é feita antes da primeira migration rodar
- [x] Ficam as 3 cópias mais recentes; as mais antigas são apagadas
- [x] Se a cópia falhar, as migrations não rodam e o erro aparece (o app não segue com o banco sem backup)
- [x] Banco novo (primeiro uso) não gera cópia
- [x] Teste com `node:test` em banco temporário: com migration pendente gera uma cópia, sem pendência não gera, e a rotação mantém 3

## Comments

### Nota do PO (2026-10-26)

- Decisão em `docs/adr/0006-releases-e-auto-update.md`: as migrations só andam para frente (ADR 0005), então a cópia é o único caminho de volta.
- Lugar natural: `server/utils/db.ts`, antes do `migrate()`. Pendência = arquivos da pasta de migrations que não estão em `__drizzle_migrations`.
- Copiar com o banco fechado ou via `VACUUM INTO`, para não pegar o arquivo no meio de uma escrita do WAL.
- Restaurar uma cópia é manual por enquanto (trocar o arquivo com o app fechado). Tela de restaurar não entra.
- Precisa estar `done` antes da primeira release com auto-update (ticket 62).

### Implementação 2026-10-26 (agente, a pedido)

- `server/db/backup.ts` (`backupBeforeMigrate`), chamada em `server/utils/db.ts` antes do `migrate()`. Pendência = há mais pastas com `migration.sql` do que linhas em `__drizzle_migrations`; sem essa tabela, é banco novo e não há cópia.
- A cópia sai por `VACUUM INTO`, consistente mesmo com WAL. O nome leva a hora em UTC (`focusos.db.2026-10-27T02-41-21.bak`), e ficam as 3 mais recentes.
- `tests/db-backup.test.ts`, com 4 testes: banco novo, pendente/sem pendência, rotação de 3 e falha da cópia lançando antes do migrate. `node --import tsx --test tests/*.test.ts` passa 19 de 19.
- Conferido no `.app` empacotado: um banco com uma migration a menos abriu, ganhou a cópia `.bak` e ficou com as 10 migrations.
