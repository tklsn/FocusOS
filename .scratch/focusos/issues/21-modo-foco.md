# 21: Modo Foco

**What to build:** "Iniciar Foco" abre uma tela cheia com uma única tarefa e o botão Concluir.

**Blocked by:** 15, 19

**Status:** ready-for-human

- [ ] Tela cheia sem navegação nem outras tarefas
- [ ] Mostra título, notas e "quando/onde"
- [ ] Concluir marca a tarefa e volta à Home
- [ ] Esc ou botão sair volta sem alterar nada

## Comments

### Nota do PO para o sprint 02 (2026-10-09)

- `app/pages/focus.vue` é uma página provisória criada no ticket 19; a Home já aponta para `/focus?task=<id>`. Este ticket a substitui.
- A tela cheia precisa esconder a barra lateral e o cabeçalho do layout. No desktop sem barra de título (ticket 40), manter uma área para arrastar a janela e não cobrir os botões dela.
- Tarefa inexistente, de outro usuário ou já concluída: voltar à Home com mensagem neutra.

### Follow-up from review of 20 (2026-10-12)

O ticket 20 foi fechado com estes itens abertos:

- [x] Limite de tamanho no servidor para `implementation_intention`: acrescentar `.max(200)` ao schema zod (`server/api/tasks/[id]/index.patch.ts:14`). Hoje o limite só existe no `maxlength` do campo.
- [x] `pnpm fmt:check` falha em `server/db/migrations/20261012034452_messy_bruce_banner/snapshot.json`. Rodar `pnpm fmt`.
- [x] Na página do projeto, Enter salva e o blur seguinte pode mandar um segundo PATCH igual. O Enter deve só tirar o foco do campo (`app/pages/projects/[id].vue:247`).

Os três itens acima foram resolvidos em 2026-10-12, no refactor de legibilidade feito pelo agente a pedido (ver `sprints/02.md`): `.max(200)` conferido pela API (201 caracteres responde 400), `pnpm fmt:check` passa, e o Enter agora só tira o foco do campo.
