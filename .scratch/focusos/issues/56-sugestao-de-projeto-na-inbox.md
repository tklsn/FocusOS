# 56: Sugestão de projeto na Inbox

**What to build:** Cada item da Inbox mostra, quando o modelo tem segurança, uma sugestão "Mover para X?" que o usuário aceita com um toque. Nada é movido sozinho.

**Blocked by:** 55

**Status:** ready-for-human

- [ ] Rota de servidor devolve a sugestão para uma tarefa: usa o usuário atual, monta as opções só com os projetos ativos dele mais "nenhum", e ignora qualquer projeto vindo do cliente
- [ ] Sugestão aparece só acima do limiar de margem; abaixo dele o item fica como hoje
- [ ] Um toque ou uma tecla aceita; o seletor manual de projeto continua disponível
- [ ] Aceitar usa o mesmo caminho do ticket 14 (status `todo`, fim da lista do projeto)
- [ ] Calcular a sugestão não atrasa a captura nem trava a lista; aparece quando ficar pronta
- [ ] Sem modelo ativo, nenhuma mudança visível na Inbox
- [ ] Sugestão recusada ou ignorada não gera aviso, contador nem cobrança

## Comments

### Contexto 2026-10-08 (agente)

- Decisão de produto: sugestão antes de automação. Uma tarefa movida em silêncio para o projeto errado some da Inbox e quebra a confiança na captura.
- O prompt inclui, por projeto, o nome, a área, a nota "onde eu parei" e algumas tarefas já triadas, conforme o que o ticket 54 mostrar que melhora o acerto.
