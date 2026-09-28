# 02: Cadastro com email e senha

**What to build:** Uma pessoa nova cria conta com email e senha e já entra logada na Home.

**Blocked by:** 01

**Status:** ready-for-human

- [ ] Tabela de usuários criada via migration (id, email único, hash de senha, display_name, timezone, settings, created_at)
- [ ] Senha guardada só como hash
- [ ] Email duplicado mostra erro amigável; senha curta é rejeitada no servidor
- [ ] Após cadastro a sessão é criada e o usuário cai na Home
- [ ] Banco SQLite fica em `.data/` (gitignored)
