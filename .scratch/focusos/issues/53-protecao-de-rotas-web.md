# 53: Proteção de rotas (versão web)

**Milestone:** versão web, depois do MVP desktop (ADR 0003)

**What to build:** Na versão web, nada do app é acessível sem sessão: páginas redirecionam para o login e a API responde 401.

**Blocked by:** 52

**Status:** ready-for-human

- [ ] Qualquer página exceto o login redireciona para `/login` sem sessão
- [ ] Logado, abrir `/login` leva para a Home
- [ ] Toda rota de API (exceto auth e `/mcp`) exige sessão e responde 401 sem ela; `/mcp` continua com token próprio (ticket 43)
- [ ] No desktop nada disso se aplica: o usuário local entra direto
