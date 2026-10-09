# 14: Triagem: Inbox para projeto

**What to build:** Da Inbox, o usuário manda um item para um projeto em um ou dois toques.

**Blocked by:** 06, 11

**Status:** done

- [x] Ação rápida em cada item abre seletor de projeto com busca
- [x] Ao mover, status vira todo e o item sai da Inbox
- [x] Funciona por teclado

## Comments

### Implementação 2026-10-08 (agente, a pedido)

- `PATCH /api/tasks/:id` aceita `project_id`: confere que tarefa e projeto são do usuário (404 se não forem), põe a tarefa no fim da lista do projeto e muda o status para `todo`.
- `app/components/task/ProjectPicker.vue`: botão "Mover para projeto" em cada item da Inbox abre um seletor com busca, com os projetos ativos agrupados por área. Dois toques: abrir e escolher.
- Teclado: o campo de busca recebe o foco ao abrir, setas percorrem a lista, Enter move, Esc fecha.
- Ao mover, o item sai da Inbox na hora e um toast diz para qual projeto foi. Não há "Desfazer" para o movimento.
- Depois de mover, o foco do teclado não vai para o item seguinte da lista; volta ao início da página.
- Sem projetos ativos, o seletor mostra "Nenhum projeto ativo ainda. Crie um dentro de uma área."
- Teste da API contra o servidor de dev com script descartável; lint, `pnpm fmt:check` e `pnpm build` passam. A UI não foi aberta em navegador: falta a confirmação visual do humano (mover pelo mouse e pelo teclado, busca, tarefa aparecendo no projeto).

### Aceite 2026-10-09

- O humano confirmou os itens que dependiam da conferência dele (uso da tela no app). Registrado pelo agente a pedido; o agente não repetiu essa conferência.
