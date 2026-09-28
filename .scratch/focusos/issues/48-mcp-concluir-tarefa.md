# 48: Tool MCP concluir_tarefa

**What to build:** Um agente marca uma tarefa como concluída.

**Blocked by:** 15, 43

**Status:** ready-for-human

- [ ] Mesmo efeito de concluir pela UI (status e data de conclusão)
- [ ] Concluir tarefa já concluída não dá erro
- [ ] Micro-recompensa não é disparada por MCP (só na UI)
- [ ] Descrição da tool clara o bastante para um agente saber quando usá-la
- [ ] Entrada validada com zod; erro de validação volta com mensagem útil
- [ ] Usa o usuário do token, nunca um argumento; testado com duas contas (uma não enxerga a outra)
- [ ] Reusa a mesma função de servidor da rota da UI, sem duplicar regra de negócio
