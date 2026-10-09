# 19: Próximas ações na Home

**What to build:** A Home mostra as próximas ações dos projetos ativos, com um botão grande "Iniciar Foco" na primeira.

**Blocked by:** 16, 18

**Status:** done

- [x] Seção de próximas ações só de projetos ativos
- [x] Botão "Iniciar Foco" destacado (por enquanto pode apontar para uma rota placeholder)
- [x] Lista curta: o restante fica recolhido
- [x] Estados vazios e de carregamento definidos onde houver lista ou busca

## Comments

### Implementação 2026-10-08 (agente, a pedido)

- Feito antes do ticket 16: a Home ainda não tem a lista de tarefas de hoje, só a seção de próximas ações.
- `GET /api/tasks/next-actions`: uma tarefa por projeto ativo. É a marcada como próxima ação ou, sem marcação, a primeira não concluída da lista (mesma regra da sugestão do ticket 18). Marcadas vêm antes; depois, projetos mais antigos primeiro.
- Home: seção "Próximas ações" com caixa para concluir, título, link para o projeto e botão "Iniciar Foco" na primeira. Mostra três; o restante abre com "Mostrar mais N".
- "Iniciar Foco" leva a `/focus?task=<id>`, página provisória (`app/pages/focus.vue`) até o ticket 21.
- Estados: skeleton no carregamento, erro com "Tentar de novo", vazio com "Hoje está livre."
- Projetos pausados ou concluídos não entram; conferido no teste da API, junto com o isolamento de outro usuário. Falta a confirmação visual do humano.

### Redesenho da Home 2026-10-08 (agente, a pedido)

- A Home passou a seguir o princípio "uma próxima ação por vez": a primeira próxima ação ocupa a tela, com o título em destaque, o projeto, o trecho de "Onde você parou" do projeto (quando existe) e os botões "Iniciar Foco" e "Concluir".
- As demais ficam todas recolhidas em "Depois, em outros N projetos" (antes apareciam três). Cada uma tem "Focar" e "Concluir".
- O cabeçalho grande "Hoje" virou uma linha discreta com a data; o título da tarefa é o maior texto da página. A captura continua sempre visível, abaixo da ação.
- Estado vazio ganhou o botão "Triar a Inbox (N)" quando há itens na Inbox.
- Só componentes shadcn-vue já instalados (`Button`, `Item`, `Collapsible`, `Empty`, `Skeleton`, `Kbd`) e os tokens atuais; nenhuma cor ou fonte nova. Lint, `pnpm fmt:check` e `pnpm build` passam; a tela não foi aberta em navegador.
