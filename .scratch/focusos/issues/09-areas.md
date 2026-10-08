# 09: Áreas da vida

**What to build:** O usuário organiza a vida em áreas (ex.: Trabalho, Pesquisa, Mestrado, Pessoal), com nome, cor e ícone.

**Blocked by:** 02

**Status:** done

- [x] Tabela de áreas via migration
- [x] Criar, renomear, mudar cor e ícone e excluir área
- [x] No primeiro acesso, sugere as quatro áreas padrão com um clique (sem criar automaticamente)
- [x] Áreas aparecem na navegação lateral
- [x] Estado vazio acolhedor

## Comments

### Implementação 2026-10-08 (agente, a pedido)

- `server/db/schema.ts`: tabela `areas` (id, user_id, name, color, icon, sort_order, created_at); migração `20261008210934_friendly_sabra`, já aplicada no banco de dev com `npx drizzle-kit migrate`.
- Cores e ícones são listas fechadas em `shared/utils/areas.ts` (8 cores suaves, 12 ícones lucide), usadas pelo schema, pela validação zod (`server/utils/area-schema.ts`) e pela UI.
- Rotas `GET`/`POST /api/areas` e `PATCH`/`DELETE /api/areas/:id`: usuário vem de `getCurrentUser(event)`, serviço filtra por `id` e `user_id`; área de outro usuário responde 404.
- `app/pages/areas/index.vue`: criar pelo campo no topo, renomear no próprio item, cor e ícone por um popover com opções navegáveis por teclado, excluir com "Desfazer" por 5 segundos. Skeleton na primeira carga e estado de erro com "Tentar de novo".
- Estado vazio: "Nenhuma área ainda." com o botão "Usar áreas sugeridas", que cria Trabalho, Pesquisa, Mestrado e Pessoal em um clique. Nada é criado automaticamente.
- Navegação: grupo "Áreas" na barra lateral (`app/components/nav/Areas.vue`) com ícone colorido e nome de cada área, mais o item "Gerenciar áreas".
- O toast de desfazer virou `app/utils/toastUndo.ts`, usado pela Inbox e pelas Áreas.
- `sort_order` existe na tabela, mas não há reordenação: a lista sai por ordem de criação.
- Teste da API contra o servidor de dev, com script descartável: criação com e sem cor/ícone, ordem, edição, 400 para cor, ícone, nome vazio e corpo vazio, exclusão, e 404 ao editar ou excluir área de um segundo usuário. Lint, `pnpm fmt:check` e `pnpm build` passam.
- A UI não foi aberta em navegador: falta a confirmação visual do humano (criar, sugeridas, renomear, popover de cor e ícone por teclado, excluir e desfazer, grupo na barra lateral).
- Os itens de área na barra lateral levam a `/areas#area-<id>`, porque a página da área ainda não existe. Encaminhado ao ticket 10.
