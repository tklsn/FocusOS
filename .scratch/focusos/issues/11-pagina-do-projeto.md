# 11: Página do projeto com tarefas

**What to build:** A página de um projeto lista suas tarefas e permite adicionar tarefa direto nele.

**Blocked by:** 05, 10

**Status:** done

- [x] Tarefas ganham project_id opcional (nulo = Inbox)
- [x] Adicionar tarefa pelo campo da página cria já no projeto, com status todo
- [x] Lista ordenável por arrastar ou teclado (sort_order)
- [x] Estado vazio acolhedor

## Comments

### Follow-up from implementation of 10 (2026-10-08)

- [x] Os projetos na barra lateral (`app/components/nav/Areas.vue`) apontam para `/areas/<area>#project-<id>` e não têm estado ativo. Com a página do projeto, trocar o destino para ela e marcar o item ativo; na página da área, o nome do projeto também deve levar até lá.

### Implementação 2026-10-08 (agente, a pedido)

- `server/db/schema.ts`: `tasks` ganhou `project_id` (opcional, `ON DELETE SET NULL`) e `sort_order`; migração `20261008212834_legal_synch`, já aplicada no banco de dev.
- `POST /api/tasks` aceita `project_id`: confere que o projeto é do usuário (404 se não for), cria com status `todo` no fim da lista. Sem `project_id` nada muda: vai para a Inbox.
- `GET /api/tasks?project_id=` lista as tarefas do projeto na ordem manual. `PUT /api/projects/:id/tasks/order` recebe os ids na nova ordem e grava `sort_order`; ids de outro usuário ou projeto são ignorados.
- `app/pages/projects/[id].vue`: nome do projeto, link para a área, campo de captura (o mesmo `TaskFastAddInput`, agora com `project-id`), lista com edição de título e notas e exclusão com "Desfazer". Skeleton, erro, "Projeto não encontrado" e estado vazio ("Projeto sem tarefas por enquanto.").
- Ordenação: cada item tem botões "Mover para cima" e "Mover para baixo", que funcionam por teclado e por clique. Arrastar com o mouse não foi implementado; o critério pede arrastar ou teclado.
- Decisão de produto: excluir um projeto, ou uma área com seus projetos, não apaga as tarefas. As não concluídas voltam para a Inbox (`TaskService.moveToInbox`); o toast e o diálogo de exclusão avisam disso.
- Navegação: projetos na barra lateral levam a `/projects/<id>` e ficam ativos; na página da área cada projeto tem o botão "Abrir projeto".
- `app/components/task/InboxItem.vue` virou `app/components/task/Item.vue` (`<TaskItem>`), usado pela Inbox e pela página do projeto.
- Teste da API contra o servidor de dev, com script descartável: criar no projeto (status, ordem), listar, reordenar, captura sem projeto, retorno à Inbox ao excluir projeto e área, e isolamento de um segundo usuário. Lint, `pnpm fmt:check` e `pnpm build` passam.
- A UI não foi aberta em navegador: falta a confirmação visual do humano (página do projeto, adicionar tarefa, mover pelo teclado mantendo o foco, excluir e desfazer, links da barra lateral).
