# 08: Editar e excluir item da Inbox

**What to build:** Um item da Inbox pode ter o título e as notas editados ou ser excluído.

**Blocked by:** 06

**Status:** done

- [x] Edição inline do título e campo de notas
- [x] Excluir oferece desfazer por alguns segundos em vez de confirmação modal
- [x] Usuário não consegue editar nem excluir tarefa de outro usuário (testado com duas contas)

## Comments

### Follow-up from review of 06 (2026-10-08)

- [x] Antes de criar as rotas de edição e exclusão, alinhar `server/api/tasks/index.post.ts:9` ao helper: trocar `findFirst()` + `user!.id` por `getCurrentUser(event)` e validar `title` com zod no servidor (string não vazia após trim). Toda rota de tarefa pega o usuário do helper, nunca do cliente. (resolvido em 2026-10-08, junto com o 06)

### Implementação 2026-10-08 (agente, a pedido)

- `server/db/schema.ts`: coluna `notes` (texto, opcional) em `tasks`; migração `20261008205750_mixed_black_queen`, já aplicada no banco de dev com `npx drizzle-kit migrate`.
- `PATCH /api/tasks/:id` e `DELETE /api/tasks/:id`: usuário vem de `getCurrentUser(event)`, e o `where` do serviço filtra por `id` e `user_id`. Tarefa de outro usuário responde 404, igual a tarefa inexistente. PATCH valida com zod: `title` não vazio após trim, `notes` vazio vira `null`, corpo sem campos dá 400.
- `app/components/task/InboxItem.vue`: título editável no próprio item (salva ao sair do campo ou com Enter, Esc desfaz, título vazio volta ao anterior); botão de notas abre um textarea que salva ao sair do campo; botão de excluir neutro, sem vermelho.
- Excluir com desfazer (`app/pages/inbox/index.vue`): o item some da lista e do contador na hora, e um toast "Tarefa excluída" oferece "Desfazer" por 5 segundos. O `DELETE` só vai ao servidor quando o toast fecha. Limite conhecido, marcado com `ponytail:` no código: fechar o app dentro desses 5 segundos mantém a tarefa.
- Critério das duas contas: testado em 2026-10-08 com um script descartável que criou um segundo usuário com uma tarefa direto no banco e tentou editar e excluir pela API; resultado 404 e linha intacta. O script também cobriu edição, validação e exclusão da tarefa própria. Foi removido a pedido; vira teste automatizado quando o repo tiver framework de teste.
- Lint, `pnpm fmt:check` e `pnpm build` passam. A UI não foi aberta em navegador: falta a confirmação visual do humano (editar título e notas, excluir, desfazer, teclado) para fechar o ticket.

### Aceite 2026-10-09

- O humano confirmou os itens que dependiam da conferência dele (uso da tela no app). Registrado pelo agente a pedido; o agente não repetiu essa conferência.
