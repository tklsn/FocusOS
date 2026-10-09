# 13: Status do projeto

**What to build:** Um projeto pode ser pausado ou concluído; esses somem da navegação principal sem serem apagados.

**Blocked by:** 10

**Status:** done

- [x] Alternar entre ativo, pausado e concluído
- [x] Navegação mostra só ativos; pausados e concluídos ficam numa seção recolhida
- [x] Reativar funciona

## Comments

### Implementação 2026-10-08 (agente, a pedido)

- `PATCH /api/projects/:id` aceita `status` (`active`, `paused`, `done`), validado contra `PROJECT_STATUSES`.
- `app/pages/projects/[id].vue`: seletor de status ao lado do nome do projeto (select nativo, funciona por teclado). Reativar é escolher "Ativo".
- Navegação (`app/components/nav/Areas.vue`): sob cada área só aparecem projetos ativos; os demais ficam na seção recolhida "Pausados e concluídos", que só existe quando há algum.
- Na página da área todos os projetos continuam listados, com a etiqueta "Pausado" ou "Concluído".
- Teste da API contra o servidor de dev com script descartável; lint, `pnpm fmt:check` e `pnpm build` passam. A UI não foi aberta em navegador: falta a confirmação visual do humano (pausar, concluir, ver a seção recolhida, reativar).
