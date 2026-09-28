# 44: Tool MCP capturar_tarefa

**What to build:** Um agente captura uma tarefa, que aparece na Inbox do usuário como se tivesse sido digitada na captura rápida.

**Blocked by:** 05, 43

**Status:** ready-for-human

- [ ] Entrada: título obrigatório e notas opcionais
- [ ] Resultado devolve o id e o título criados
- [ ] Descrição da tool clara o bastante para um agente saber quando usá-la
- [ ] Entrada validada com zod; erro de validação volta com mensagem útil
- [ ] Usa o usuário do token, nunca um argumento; testado com duas contas (uma não enxerga a outra)
- [ ] Reusa a mesma função de servidor da rota da UI, sem duplicar regra de negócio
