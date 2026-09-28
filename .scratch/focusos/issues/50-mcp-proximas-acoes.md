# 50: Tool MCP proximas_acoes

**What to build:** Um agente consulta a próxima ação de cada projeto ativo.

**Blocked by:** 19, 43

**Status:** ready-for-human

- [ ] Devolve projeto, tarefa e "quando/onde vou fazer" de cada próxima ação
- [ ] Projetos sem próxima ação aparecem sinalizados, sem tom de cobrança
- [ ] Descrição da tool clara o bastante para um agente saber quando usá-la
- [ ] Entrada validada com zod; erro de validação volta com mensagem útil
- [ ] Usa o usuário do token, nunca um argumento; testado com duas contas (uma não enxerga a outra)
- [ ] Reusa a mesma função de servidor da rota da UI, sem duplicar regra de negócio
