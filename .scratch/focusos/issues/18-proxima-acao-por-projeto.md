# 18: Próxima ação por projeto

**What to build:** Cada projeto destaca exatamente uma próxima ação.

**Blocked by:** 11

**Status:** done

- [x] Tarefas ganham is_next_action
- [x] Marcar uma tarefa desmarca a anterior do mesmo projeto (garantido no servidor)
- [x] Próxima ação aparece em destaque no topo da página do projeto
- [x] Concluir a próxima ação sugere escolher a seguinte, sem obrigar

## Comments

### Implementação 2026-10-08 (agente, a pedido)

- `tasks` ganhou `is_next_action`, com índice único parcial em `project_id` (no máximo uma por projeto, garantido pelo banco).
- `PATCH /api/tasks/:id` aceita `is_next_action`: dentro de uma transação, desmarca a anterior do projeto e marca a nova. Tarefa sem projeto, concluída ou de outro usuário responde 404.
- Concluir uma tarefa tira a marca dela; excluir o projeto também (as tarefas voltam para a Inbox sem a marca).
- Página do projeto: bloco "Próxima ação" acima da captura, com caixa para concluir. Botão de estrela em cada tarefa marca e desmarca.
- Decisão de produto: sem tarefa marcada, o bloco mostra a primeira da lista como "Sugestão de próxima ação", com o botão "Definir como próxima ação". É assim que o critério "sugere escolher a seguinte, sem obrigar" foi atendido: ao concluir a marcada, a seguinte da lista aparece como sugestão.
- Teste da API com script descartável (troca de marca, índice único, 404). Falta a confirmação visual do humano.

### Aceite 2026-10-09

- O humano confirmou os itens que dependiam da conferência dele (uso da tela no app). Registrado pelo agente a pedido; o agente não repetiu essa conferência.
