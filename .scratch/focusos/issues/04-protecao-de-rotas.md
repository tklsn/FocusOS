# 04: Proteção de rotas

**What to build:** Nada do app é acessível sem sessão: páginas redirecionam para o login e a API responde 401.

**Blocked by:** 03

**Status:** ready-for-human

- [ ] Qualquer página exceto o login redireciona para `/login` sem sessão
- [ ] Logado, abrir `/login` leva para a Home
- [ ] Toda rota de API (exceto auth) exige sessão e responde 401 sem ela
- [ ] Regra documentada: o user_id vem sempre da sessão, nunca do cliente
