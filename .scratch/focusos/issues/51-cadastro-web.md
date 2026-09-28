# 51: Cadastro com email e senha (versão web)

**Milestone:** versão web, depois do MVP desktop (ADR 0003)

**What to build:** Na versão web, uma pessoa nova cria conta com email e senha e já entra logada na Home.

**Blocked by:** 02

**Status:** ready-for-human

- [ ] `nuxt-auth-utils` configurado; senha guardada só como hash
- [ ] Email único; email duplicado mostra erro amigável; senha curta é rejeitada no servidor
- [ ] Após cadastro a sessão é criada e o usuário cai na Home
- [ ] Modo web habilitado por configuração; no desktop o usuário local continua sem cadastro
