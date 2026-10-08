# 08: Editar e excluir item da Inbox

**What to build:** Um item da Inbox pode ter o título e as notas editados ou ser excluído.

**Blocked by:** 06

**Status:** ready-for-human

- [ ] Edição inline do título e campo de notas
- [ ] Excluir oferece desfazer por alguns segundos em vez de confirmação modal
- [ ] Usuário não consegue editar nem excluir tarefa de outro usuário (testado com duas contas)

## Comments

### Follow-up from review of 06 (2026-10-08)

- [x] Antes de criar as rotas de edição e exclusão, alinhar `server/api/tasks/index.post.ts:9` ao helper: trocar `findFirst()` + `user!.id` por `getCurrentUser(event)` e validar `title` com zod no servidor (string não vazia após trim). Toda rota de tarefa pega o usuário do helper, nunca do cliente. (resolvido em 2026-10-08, junto com o 06)
