# 16: Agendar para hoje e tela Hoje

**What to build:** O usuário agenda uma tarefa para hoje e ela aparece na Home, onde pode ser concluída.

**Blocked by:** 11, 15

**Status:** ready-for-human

- [ ] Tarefas ganham scheduled_for
- [ ] Ação "fazer hoje" em qualquer tarefa; ação para tirar de hoje
- [ ] Home lista as tarefas de hoje, considerando o timezone do usuário
- [ ] Concluir na Home funciona
- [ ] Estado vazio acolhedor

## Comments

### Follow-up from review of 01 (2026-09-28)

- [ ] A data da Home (`app/pages/index.vue`) é calculada uma vez no carregamento; com o app aberto o dia todo fica errada após a meia-noite. Usar data reativa (ex.: `useNow`), que também serve para decidir o que é "hoje"
