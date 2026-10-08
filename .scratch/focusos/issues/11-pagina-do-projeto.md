# 11: Página do projeto com tarefas

**What to build:** A página de um projeto lista suas tarefas e permite adicionar tarefa direto nele.

**Blocked by:** 05, 10

**Status:** ready-for-human

- [ ] Tarefas ganham project_id opcional (nulo = Inbox)
- [ ] Adicionar tarefa pelo campo da página cria já no projeto, com status todo
- [ ] Lista ordenável por arrastar ou teclado (sort_order)
- [ ] Estado vazio acolhedor

## Comments

### Follow-up from implementation of 10 (2026-10-08)

- [ ] Os projetos na barra lateral (`app/components/nav/Areas.vue`) apontam para `/areas/<area>#project-<id>` e não têm estado ativo. Com a página do projeto, trocar o destino para ela e marcar o item ativo; na página da área, o nome do projeto também deve levar até lá.
