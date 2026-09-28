# 47: Tools MCP ler_onde_parei e atualizar_onde_parei

**What to build:** Um agente lê e atualiza a nota "onde eu parei" de um projeto, por exemplo ao fim de uma sessão de código.

**Blocked by:** 12, 43

**Status:** ready-for-human

- [ ] Leitura devolve a nota e quando foi editada
- [ ] Atualização substitui a nota e atualiza a data de edição
- [ ] Projeto de outro usuário ou inexistente devolve o mesmo erro "não encontrado"
- [ ] Descrição da tool clara o bastante para um agente saber quando usá-la
- [ ] Entrada validada com zod; erro de validação volta com mensagem útil
- [ ] Usa o usuário do token, nunca um argumento; testado com duas contas (uma não enxerga a outra)
- [ ] Reusa a mesma função de servidor da rota da UI, sem duplicar regra de negócio
