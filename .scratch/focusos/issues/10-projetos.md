# 10: Projetos dentro de áreas

**What to build:** Dentro de cada área o usuário cria projetos, listados na navegação sob a área.

**Blocked by:** 09

**Status:** done

- [x] Tabela de projetos via migration (inclui description e status, padrão ativo)
- [x] Criar, renomear e excluir projeto
- [x] Projetos aparecem agrupados por área na navegação
- [x] Excluir área com projetos pede decisão explícita
- [x] Estados vazios e de carregamento definidos onde houver lista ou busca

## Comments

### Follow-up from implementation of 09 (2026-10-08)

- [x] Os itens de área na barra lateral (`app/components/nav/Areas.vue`) apontam para `/areas#area-<id>` e não têm estado ativo. Quando os projetos entrarem sob cada área, dar a eles um destino próprio e marcar o item ativo.
- [x] `DELETE /api/areas/:id` exclui direto. Com projetos, a exclusão precisa da decisão explícita pedida neste ticket antes de chegar ao servidor.

### Implementação 2026-10-08 (agente, a pedido)

- `server/db/schema.ts`: tabela `projects` (id, user_id, area_id, name, description, status com padrão `active`, created_at); migração `20261008212359_good_warbound`, já aplicada no banco de dev. `description` existe na tabela, ainda sem campo na UI.
- Rotas `GET`/`POST /api/projects` e `PATCH`/`DELETE /api/projects/:id`: usuário vem de `getCurrentUser(event)`; criar em área de outro usuário responde 404, assim como editar ou excluir projeto alheio.
- `app/pages/areas/[id].vue`: página da área com seus projetos. Criar pelo campo no topo, renomear no próprio item, excluir com "Desfazer" por 5 segundos. Skeleton na primeira carga, estado vazio ("Nenhum projeto nesta área ainda."), estado de erro e "Área não encontrada".
- Navegação (`app/components/nav/Areas.vue`): cada área leva à sua página e fica marcada como ativa; os projetos aparecem aninhados sob a área.
- Excluir área com projetos: a página de áreas abre um diálogo dizendo quantos projetos vão junto, com "Manter área" e "Excluir área e projetos". O servidor também exige a decisão: `DELETE /api/areas/:id` responde 409 se a área tem projetos, e só apaga com `?cascade=true`. Área sem projetos continua com o "Desfazer".
- Fora do diálogo ficou a opção de mover os projetos para outra área antes de excluir; hoje a escolha é excluir tudo ou manter.
- Teste da API contra o servidor de dev, com script descartável: criar, renomear, validações (400), ordem, excluir, 409 e cascade na área, e 404 para área e projeto de um segundo usuário. Lint, `pnpm fmt:check` e `pnpm build` passam.
- A UI não foi aberta em navegador: falta a confirmação visual do humano (página da área, criar e renomear projeto, excluir e desfazer, projetos na barra lateral, diálogo de exclusão da área).
- Os projetos na barra lateral levam a `/areas/<area>#project-<id>`, porque a página do projeto é do ticket 11. Encaminhado.
