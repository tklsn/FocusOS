# 10: Projetos dentro de áreas

**What to build:** Dentro de cada área o usuário cria projetos, listados na navegação sob a área.

**Blocked by:** 09

**Status:** ready-for-human

- [ ] Tabela de projetos via migration (inclui description e status, padrão ativo)
- [ ] Criar, renomear e excluir projeto
- [ ] Projetos aparecem agrupados por área na navegação
- [ ] Excluir área com projetos pede decisão explícita
- [ ] Estados vazios e de carregamento definidos onde houver lista ou busca

## Comments

### Follow-up from implementation of 09 (2026-10-08)

- [ ] Os itens de área na barra lateral (`app/components/nav/Areas.vue`) apontam para `/areas#area-<id>` e não têm estado ativo. Quando os projetos entrarem sob cada área, dar a eles um destino próprio e marcar o item ativo.
- [ ] `DELETE /api/areas/:id` exclui direto. Com projetos, a exclusão precisa da decisão explícita pedida neste ticket antes de chegar ao servidor.
