# 0001: db0 em vez de Drizzle

**Status:** substituído pela 0005 (2026-09-29)

## Contexto

O FocusOS roda como site (multiusuário) e como app desktop (SQLite local no Electron). O acesso a dados precisa trocar de conector por ambiente sem reescrever queries, e o app desktop não deve depender de módulos nativos que exigem rebuild para a versão de Node do Electron.

## Decisão

Usar o **db0** (unjs) pela integração de banco do Nitro (`useDatabase()`), com SQL escrito à mão via template `sql` (parâmetros sempre interpolados pelo template, nunca por concatenação de strings).

- **Conector:** configurado por ambiente no `nuxt.config.ts` (`nitro.database`). Preferência para SQLite: o conector baseado em `node:sqlite` (nativo do Node, sem rebuild no Electron). Reserva: `better-sqlite3` com rebuild para o Electron. Confirmar na implementação qual conector a versão do db0 oferece.
- **Migrations:** arquivos SQL numerados (`0001_*.sql`, …) aplicados em ordem no boot do servidor; tabela `_migrations` registra os já aplicados. Idempotente, só para frente (sem down).
- **Tipos:** tipos TypeScript das linhas escritos à mão ao lado das queries; validação de entrada com zod nas rotas.

## Alternativas descartadas

- **Drizzle ORM:** schema tipado e migrations geradas, mas acopla a um driver por dialeto e adiciona `drizzle-kit`. Para um modelo de dados pequeno, SQL direto é suficiente.
- **Prisma:** engine pesada e pouco amigável ao empacotamento no Electron.

## Consequências

- Sem geração de migrations: toda mudança de schema é um novo arquivo SQL escrito à mão.
- Sem tipos derivados do schema: manter os tipos das linhas em sincronia é responsabilidade de quem escreve a query.
- Trocar SQLite por Postgres/libsql na web é trocar o conector, desde que o SQL use o subconjunto comum.
