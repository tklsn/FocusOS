# 52: Login e logout (versão web)

**Milestone:** versão web, depois do MVP desktop (ADR 0003)

**What to build:** Na versão web, quem já tem conta entra com email e senha; um botão de sair encerra a sessão.

**Blocked by:** 51

**Status:** ready-for-human

- [ ] Tela de login e cadastro na mesma página, com abas
- [ ] Credencial errada mostra mensagem genérica (não revela se o email existe)
- [ ] Helper "usuário atual" (ticket 02) devolve o usuário da sessão no modo web
- [ ] Menu de usuário na barra lateral com nome e Sair; Sair encerra a sessão e volta ao login

## Comments

### Follow-up from review of 01 (2026-09-28)

- [ ] `app/components/nav/User.vue` ainda tem os dados de exemplo do shadcn (Upgrade to Pro, Billing, Notifications); reaproveitar para o menu de usuário com Sair, removendo o que não se aplica, ou apagar antes
