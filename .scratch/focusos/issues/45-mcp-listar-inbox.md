# 45: Tool MCP listar_inbox

**What to build:** Um agente lê os itens da Inbox do usuário.

**Blocked by:** 06, 43

**Status:** ready-for-human

- [ ] Devolve id, título, notas e data de criação, mais recentes primeiro
- [ ] Inbox vazia devolve lista vazia, sem erro
- [ ] Descrição da tool clara o bastante para um agente saber quando usá-la
- [ ] Entrada validada com zod; erro de validação volta com mensagem útil
- [ ] Usa o usuário do token, nunca um argumento; testado com duas contas (uma não enxerga a outra)
- [ ] Reusa a mesma função de servidor da rota da UI, sem duplicar regra de negócio
