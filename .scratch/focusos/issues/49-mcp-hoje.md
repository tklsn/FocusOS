# 49: Tools MCP listar_hoje e agendar_para_hoje

**What to build:** Um agente vê as tarefas de hoje do usuário, já com rollover aplicado, e pode agendar uma tarefa para hoje.

**Blocked by:** 17, 43

**Status:** ready-for-human

- [ ] `listar_hoje` devolve as mesmas tarefas que a Home, no timezone do usuário, sem nenhuma marca de atraso
- [ ] `agendar_para_hoje` tem o mesmo efeito da ação "fazer hoje" na UI
- [ ] Descrição da tool clara o bastante para um agente saber quando usá-la
- [ ] Entrada validada com zod; erro de validação volta com mensagem útil
- [ ] Usa o usuário do token, nunca um argumento; testado com duas contas (uma não enxerga a outra)
- [ ] Reusa a mesma função de servidor da rota da UI, sem duplicar regra de negócio
