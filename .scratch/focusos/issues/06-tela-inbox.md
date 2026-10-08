# 06: Tela Inbox

**What to build:** A Inbox lista tudo o que foi capturado e ainda não foi triado.

**Blocked by:** 05

**Status:** done

- [x] Lista só as tarefas do usuário com status inbox, mais recentes primeiro
- [x] Vazia, mostra "Tudo capturado. Respire."
- [x] Estado de carregamento
- [x] Link na navegação com contador discreto (neutro, sem vermelho)

## Comments

### Implementação 2026-10-05 (agente, a pedido)

- `GET /api/tasks?status=inbox`: filtro validado com zod contra `TASK_STATUSES` (exportado de `server/db/schema.ts`), rota passa a usar `getCurrentUser(event)`; sem query, comportamento da Home inalterado.
- `app/composables/useInboxTasks.ts`: `useFetch` com `key: "inbox-tasks"`, compartilhado entre página, badge da sidebar e `FastAddInput` (badge atualiza ao capturar na Home).
- `app/pages/inbox/index.vue`: Skeletons em `status === 'pending'`, lista `ul` (título + data discreta), `Empty` com "Tudo capturado. / Respire."
- `nav/Main.vue` + `app/Sidebar.vue`: `badge?: number` via `SidebarMenuBadge` (neutro, some quando 0).
- Smoke test da API ok: lista filtrada, 400 para status inválido, captura aparece no badge. Falta confirmação visual do humano na UI (`pnpm dev` com `APP_MODE=local`) para fechar o ticket.
- Nota de ambiente: o arquivo `.data/focusos.db` não existia; foi recriado com `npx drizzle-kit migrate` e o usuário local se cria no boot do dev (`APP_MODE=local`).

### Review 2026-10-08: changes requested

Os quatro critérios estão atendidos no código (filtro por `status=inbox` com `user_id` vindo de `getCurrentUser`, ordenação `desc(created_at)`, texto do estado vazio, skeleton, badge neutro que some em 0). Faltam três itens para fechar:

- [x] Erro de rede vira estado vazio falso: se o `GET /api/tasks?status=inbox` falhar, `tasks` fica `undefined` e a tela mostra "Tudo capturado. Respire." com tarefas existindo no banco (`app/pages/inbox/index.vue:41`). Adicionar um ramo `v-else-if="error"` com mensagem neutra e botão "Tentar de novo" (`refresh`).
- [x] `pnpm fmt:check` falha em arquivos deste ticket: `app/composables/useDateUtils.ts` (6 linhas em branco no topo, indentação), `app/pages/inbox/index.vue`, `app/pages/index.vue`. Rodar `pnpm fmt`.

Não bloqueantes:

- [x] `app/components/task/FastAddInput.vue:37`: o `await refreshInbox()` segura o toast e a limpeza do campo por uma ida ao servidor; atrito na captura. Tirar o `await`. Como o componente só precisa do refresh, `refreshNuxtData("inbox-tasks")` evita instanciar o `useFetch` ali.
- [x] `app/composables/useDateUtils.ts`: não guarda estado, então não precisa ser composable. Uma função `formatCreatedAt` em `app/utils/` é auto-importada e dispensa o `const { formatCreatedAt } = useDateUtils()` em cada página.
- [x] `app/components/nav/Main.vue:24`: o badge é só o número; leitor de tela lê "Inbox 3". Um `<span class="sr-only">tarefas na Inbox</span>` resolve.
- [x] O skeleton substitui a lista a cada refresh (`status === 'pending'`, `app/pages/inbox/index.vue:17`). Hoje não aparece porque a captura só existe na Home; vai piscar com o modal global. Encaminhado ao ticket 07.
- [x] `server/api/tasks/index.post.ts:9` continua em `findFirst()` + `user!.id` e sem validar `title` no servidor, enquanto o GET já migrou para `getCurrentUser`. Encaminhado ao ticket 08.

Fora do ticket, sem ação: a Home (`app/pages/index.vue`) ganhou a mesma lista da Inbox e mostra tarefas de todos os status; o conteúdo de "Hoje" é assunto dos tickets 16 e 19. A marcação da lista está duplicada nas duas páginas; extrair um componente quando o 08 mexer nos itens.

### Correções 2026-10-08 (agente, a pedido)

- Itens do review acima aplicados, inclusive os encaminhados a 07 e 08. Resta só a confirmação visual do humano.
- Home: a lista foi removida. Ela mostrava todas as tarefas do usuário, de qualquer status, o que contradiz o princípio 2 do spec ("só Hoje e a próxima ação") e duplicava a Inbox. A Home volta ao estado vazio com a captura; a lista de hoje entra no ticket 16 (`scheduled_for`) e as próximas ações no 19. O evento `added-task` do `FastAddInput` ficou sem ouvinte e saiu junto.
- `formatCreatedAt` agora vive em `app/utils/formatCreatedAt.ts`; `useDateUtils` foi removido.
- Smoke test da API: POST com título vazio ou sem body retorna 400, POST válido grava com trim, GET com status inválido retorna 400. Lint sem erros; `pnpm fmt:check` limpo nos arquivos do ticket (os que restam são anteriores a ele).
