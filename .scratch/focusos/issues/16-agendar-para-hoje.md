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

### Nota do PO para o sprint 02 (2026-10-09)

- "Fazer hoje" só grava `scheduled_for`; status e projeto não mudam. Tarefa da Inbox agendada para hoje aparece em Hoje e continua na Inbox até ser triada.
- "Hoje" é o dia do relógio da máquina; guardar `scheduled_for` como data local (texto ISO, sem hora). O timezone do usuário entra com o ticket 35.
- A Home já mostra uma próxima ação em destaque (ticket 19). As tarefas de hoje entram abaixo dela e da captura, em lista curta, com o estado vazio atual quando não houver nem ação nem tarefa.
- A ação "fazer hoje" precisa existir na Inbox, na página do projeto e nas próximas ações da Home.
