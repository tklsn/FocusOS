# 46: Tool MCP listar_areas_e_projetos

**What to build:** Um agente descobre as áreas e os projetos do usuário, com ids para usar nas outras tools.

**Blocked by:** 10, 43

**Status:** ready-for-human

- [ ] Devolve áreas com seus projetos, incluindo status do projeto
- [ ] Opção para incluir ou não projetos pausados e concluídos (padrão: só ativos)
- [ ] Descrição da tool clara o bastante para um agente saber quando usá-la
- [ ] Entrada validada com zod; erro de validação volta com mensagem útil
- [ ] Usa o usuário do token, nunca um argumento; testado com duas contas (uma não enxerga a outra)
- [ ] Reusa a mesma função de servidor da rota da UI, sem duplicar regra de negócio
