# 02: Banco local e usuário local

**What to build:** Ao abrir o app pela primeira vez, o banco local é criado com as migrations e um usuário local é criado automaticamente, sem cadastro nem login. Toda rota de servidor passa a saber quem é o "usuário atual".

**Blocked by:** 01

**Status:** ready-for-human

- [ ] db0 configurado com conector SQLite; banco em `.data/` no dev (gitignored) e caminho configurável (o ticket 41 aponta para `userData`)
- [ ] Runner de migrations: arquivos SQL numerados aplicados em ordem no boot, registrados em `_migrations`, idempotente (ADR 0001)
- [ ] Tabela de usuários via migration (id, email nullable, hash de senha nullable, display_name, timezone, settings, created_at); email e senha ficam para a versão web
- [ ] No boot, se não existe usuário, cria o usuário local (timezone do sistema)
- [ ] Helper de servidor "usuário atual" usado por toda rota: no desktop devolve o usuário local; na versão web passará a devolver o usuário da sessão (ticket 52) sem mudar as rotas
- [ ] Nunca aceitar `user_id` vindo do cliente
- [ ] Rotas de API rejeitam requisições cujo `Host` não seja o do próprio servidor local ou cujo `Origin`, quando presente, seja de outro site (proteção contra sites abertos no navegador chamando `127.0.0.1`)
- [ ] Rota simples (ex.: `GET /api/me`) devolve o usuário atual, para verificar
