# 15: Concluir tarefa

**What to build:** Qualquer tarefa pode ser marcada como concluída onde aparecer.

**Blocked by:** 11

**Status:** done

- [x] Marcar como concluída grava completed_at e status done
- [x] Desmarcar volta ao estado anterior
- [x] Concluídas aparecem numa seção recolhida do projeto
- [x] Nenhuma métrica de falha é exibida

## Comments

### Implementação 2026-10-08 (agente, a pedido)

- `tasks` ganhou `completed_at`; migração `20261009021145_careless_satana` (junto com as colunas do ticket 18), já aplicada no banco de dev.
- `PATCH /api/tasks/:id` aceita `done`: `true` grava status `done` e `completed_at`; `false` reabre e limpa a data.
- "Estado anterior" ao reabrir é deduzido: `todo` se a tarefa tem projeto, `inbox` se não tem. O status `doing` ainda não é usado; quando for, será preciso guardar o status antigo.
- Caixa de seleção em todo `TaskItem` (Inbox e projeto) e nas linhas da Home. Concluir mostra um toast com "Desfazer".
- Página do projeto: concluídas saem da lista principal e vão para a seção recolhida "Concluídas (N)", mais recentes primeiro; desmarcar ali devolve a tarefa à lista.
- Uma tarefa concluída na Inbox (sem projeto) não aparece em nenhuma tela depois que o toast some; só o "Desfazer" a traz de volta.
- Nenhuma contagem, porcentagem ou marca de atraso foi adicionada.
- Teste da API com script descartável; lint, `pnpm fmt:check` e `pnpm build` passam. A UI não foi aberta em navegador: falta a confirmação visual do humano.
