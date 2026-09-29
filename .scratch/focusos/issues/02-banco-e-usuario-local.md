# 02: Banco local e usuário local

**What to build:** Ao abrir o app pela primeira vez, o banco local é criado com as migrations e um usuário local é criado automaticamente, sem cadastro nem login. Toda rota de servidor passa a saber quem é o "usuário atual".

**Blocked by:** 01

**Status:** done

- [x] Drizzle configurado com `node:sqlite`; banco em `.data/` no dev (gitignored) e caminho configurável via `DB_FILE_NAME` (o ticket 41 aponta para `userData`)
- [x] Migrations geradas pelo drizzle-kit em `server/db/migrations/`, aplicadas no boot pelo migrator do Drizzle, idempotente (ADR 0005)
- [x] Tabela de usuários via migration (id, email nullable, hash de senha nullable, display_name, timezone, settings, created_at); email e senha ficam para a versão web
- [x] No boot, se não existe usuário, cria o usuário local (timezone do sistema)
- [x] Helper de servidor "usuário atual" usado por toda rota: no desktop devolve o usuário local; na versão web passará a devolver o usuário da sessão (ticket 52) sem mudar as rotas
- [x] Nunca aceitar `user_id` vindo do cliente
- [x] Rotas de API rejeitam requisições cujo `Host` não seja o do próprio servidor local ou cujo `Origin`, quando presente, seja de outro site (proteção contra sites abertos no navegador chamando `127.0.0.1`)
- [x] Rota simples (ex.: `GET /api/me`) devolve o usuário atual, para verificar
