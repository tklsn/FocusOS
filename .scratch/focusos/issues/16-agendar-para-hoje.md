# 16: Agendar para hoje e tela Hoje

**What to build:** O usuário marca tarefas com "Fazer hoje" e a Home passa a mostrar essas tarefas, uma por vez: a primeira em destaque e as outras recolhidas. Quando nenhuma tarefa está marcada para hoje, a Home sugere a próxima ação de um projeto, como já faz.

**Blocked by:** 11, 15

**Status:** in-review

## Termos

- **Tarefa de hoje:** tarefa não concluída que o usuário marcou com "Fazer hoje" no dia atual.
- **Destaque:** o bloco grande da Home, que mostra uma tarefa só (título, projeto, "Onde você parou", "Iniciar Foco", "Concluir").
- **Sugestão:** próxima ação de um projeto ativo que ainda não é tarefa de hoje. Vem do `GET /api/tasks/next-actions` (ticket 19).

## Critérios

### Marcar e desmarcar

- [x] Tarefas ganham `scheduled_for`
- [x] A ação "Fazer hoje" e a ação para tirar de hoje existem em três lugares: Inbox, página do projeto e Home
- [x] "Fazer hoje" só grava `scheduled_for`. Status e projeto não mudam: uma tarefa da Inbox marcada para hoje continua na Inbox

### Home com tarefas de hoje

- [x] O destaque mostra a primeira tarefa de hoje
- [x] As demais tarefas de hoje ficam recolhidas em "Depois, hoje: N", cada uma com "Focar" e "Concluir"
- [x] A ordem é a de marcação: a tarefa marcada primeiro aparece primeiro
- [x] "Focar" numa tarefa recolhida a leva para o destaque. Hoje esse botão abre `/focus`; com este ticket ele passa a trocar o destaque

### Home sem tarefas de hoje

- [x] O destaque mostra a primeira sugestão, com o botão "Fazer hoje"
- [x] Sem tarefa de hoje e sem sugestão, a Home mostra um estado vazio acolhedor

### Nos dois casos

- [x] As sugestões que não estão no destaque ficam num bloco recolhido próprio, cada uma com "Fazer hoje"
- [x] "Concluir" funciona no destaque e nos itens recolhidos
- [ ] "Hoje" é o dia do relógio da máquina, e a Home muda de dia à meia-noite com o app aberto, sem recarregar
- [ ] Carregamento e erro continuam como os atuais (skeleton; erro com "Tentar de novo")

## Fora do escopo

- Reordenar as tarefas de hoje à mão.
- Guardar o destaque trocado com "Focar": a troca vale só para a sessão.
- Trazer para hoje o que ficou de dias anteriores (ticket 17).
- Timezone do usuário (ticket 35).

## Comments

### Follow-up from review of 01 (2026-09-28)

- [ ] A data da Home (`app/pages/index.vue`) é calculada uma vez no carregamento; com o app aberto o dia todo fica errada após a meia-noite. Usar data reativa (ex.: `useNow`), que também serve para decidir o que é "hoje"

### Nota do PO para o sprint 02 (2026-10-09)

- "Fazer hoje" só grava `scheduled_for`; status e projeto não mudam. Tarefa da Inbox agendada para hoje aparece em Hoje e continua na Inbox até ser triada.
- "Hoje" é o dia do relógio da máquina. ~~Guardar `scheduled_for` como data local (texto ISO, sem hora).~~ Formato revisto no esclarecimento de 2026-10-11. O timezone do usuário entra com o ticket 35.
- ~~A Home já mostra uma próxima ação em destaque (ticket 19). As tarefas de hoje entram abaixo dela e da captura, em lista curta.~~ Substituído pela reescrita abaixo.
- A ação "fazer hoje" precisa existir na Inbox, na página do projeto e nas próximas ações da Home.

### Reescrita do ticket 2026-10-09 (PO)

- **Por que mudou.** O critério original pedia "Home lista as tarefas de hoje". Depois do redesenho da Home (ticket 19), uma lista aberta ao lado da ação em destaque traria de volta a tela cheia de itens e criaria duas fontes disputando a mesma tela: "hoje" e "próximas ações".
- **O que o ticket resolve.** Hoje o destaque é escolhido por regra automática (ação marcada primeiro, projeto mais antigo primeiro); com muitos projetos ativos, o usuário não controla o que aparece. "Fazer hoje" passa a ser esse controle.
- **Uma fila só.** As tarefas de hoje alimentam o destaque; as próximas ações dos projetos (endpoint do ticket 19) deixam de ser a fonte principal e viram sugestões.
- **Ordem.** ~~Para manter a ordem de marcação é preciso guardar o momento em que a tarefa foi agendada, além da data (por exemplo, uma coluna de data e hora).~~ Resolvido com uma coluna só; ver o esclarecimento de 2026-10-11. Reordenar à mão fica fora deste ticket.
- **"Focar"** numa tarefa recolhida troca o destaque naquela sessão; não precisa persistir.
- **O conjunto "hoje" continua necessário** mesmo sem lista aberta: é a base do rollover (17), da capacidade do dia (26), do Modo Zumbi (34) e do `listar_hoje` no MCP (49).
- O follow-up da data reativa (review do 01) virou critério: "muda à meia-noite com o app aberto".

### Esclarecimento 2026-10-11 (PO)

- A descrição e os critérios foram reorganizados por situação da Home (com e sem tarefas de hoje) e ganharam a seção de termos. Nenhum comportamento mudou em relação à reescrita de 2026-10-09.
- **Formato de `scheduled_for`.** O schema gravou a coluna como data e hora (`timestamp_ms`), não como texto ISO. Uma coluna só atende às duas necessidades se guardar o momento em que o usuário marcou a tarefa: é tarefa de hoje quando esse momento cai dentro do dia local, e a ordem de marcação é a ordem crescente dele. Tirar de hoje grava `null`.
- **"Focar" muda de função.** Na Home atual, "Focar" num item recolhido abre `/focus?task=<id>`. Pela reescrita, passa a trocar o destaque; para entrar no Foco o usuário usa "Iniciar Foco" no destaque.

### Review 2026-10-12: changes requested

Corrigido pelo agente na mesma conversa, a pedido do humano:

- [x] `app/pages/index.vue`: o template ainda usava `now`, `later`, `status` e `refresh`, removidos do script; a Home quebrava ao abrir. Template ligado a `highlight`, `pending`, `refreshHome` e aos dois blocos recolhidos ("Depois, hoje: N" e "Sugestões: N"); "Focar" passou a gravar `focusedId`.
- [x] `server/services/task.service.ts` (`findToday`): a data ia como parâmetro de `sql` cru, sem a conversão da coluna, e a consulta falhava. Trocado por `gte`/`lt`; `not(eq())` virou `ne`.
- [x] `app/pages/index.vue`: o erro de carregamento agora vem antes do destaque, para uma falha em "hoje" não aparecer como sugestão.
- [x] `app/utils/setTaskDone.ts`: também recarrega `today-tasks`, para a Home não mostrar tarefa concluída em outra página.
- [x] `app/components/task/Item.vue`: `isToday(new Date(task.scheduled_for!))` repetido cinco vezes virou um `computed` que trata `null`.
- [x] `shared/utils/day.ts`: `endOfLocalDay` removido, sem uso.

Em aberto:

- [ ] Conferência visual do humano na Home, na Inbox e na página do projeto. O agente testou a API num banco temporário (marcar, ordem, concluir, desfazer, tirar de hoje, 400 em `today` inválido) e rodou o lint; não abriu a tela.
- [ ] O sol do `TaskItem` não reage à meia-noite com a Inbox ou o projeto abertos. O critério só exige isso da Home; fica registrado.
- [ ] `PATCH {today: true}` em tarefa concluída é aceito pelo servidor (a interface não oferece). Sem efeito visível, porque a consulta de hoje ignora concluídas.

Segurança: a rota nova e o PATCH pegam o usuário de `getCurrentUser` e filtram por `user_id`.

### Implementação 2026-10-12 (humano; template da Home e correções do review pelo agente, a pedido)

- **Dado.** `scheduled_for` em `tasks` (`timestamp_ms`), migração `20261012024204_sharp_captain_america`. Guarda o momento da marcação, carimbado pelo servidor; tirar de hoje grava `null`.
- **API.** `PATCH /api/tasks/:id` aceita `today: boolean` (`setToday`). `GET /api/tasks/today` (`findToday`) devolve as não concluídas marcadas no dia local, da mais antiga para a mais recente. Concluir não limpa `scheduled_for`: o "Desfazer" devolve a tarefa à fila de hoje.
- **Dia local.** `shared/utils/day.ts` com `startOfLocalDay` e `isToday`, usados no servidor e no cliente.
- **Inbox e página do projeto.** Botão de sol dentro de `TaskItem` (preenchido quando a tarefa é de hoje), escondido nas concluídas. Marcar mostra o toast "Tarefa adicionada para hoje" com "Desfazer".
- **Home.** Destaque = tarefa escolhida com "Focar", senão a primeira de hoje, senão a primeira sugestão (com o rótulo "Sugestão"). O destaque ganhou o botão "Fazer hoje" ou "Tirar de hoje", ao lado de "Iniciar Foco", "Concluir" e "Editar". Dois blocos recolhidos: "Depois, hoje: N" (Focar, sol para tirar de hoje, Concluir) e "Sugestões: N" (Fazer hoje, Concluir).
- **Sugestões.** São as próximas ações do ticket 19 menos as que já são de hoje, filtradas no cliente. Um projeto cuja próxima ação já está em hoje não sugere a segunda tarefa.
- **Meia-noite.** A Home usa `useNow` (um tique por minuto): a data do cabeçalho deriva dele e a troca de dia recarrega hoje e sugestões. Cobre o follow-up do review do 01.
- **Carregamento e erro.** Skeleton enquanto qualquer das duas buscas não tem dado; erro com "Tentar de novo" se qualquer uma falhar.

Critérios marcados acima são os conferidos pela API num banco temporário: marcar não muda status nem projeto, e a ordem é a de marcação. Os demais estão implementados e dependem da conferência visual do humano; ficam desmarcados até lá, junto com o follow-up do review do 01.

### Conferência na tela 2026-10-12 (agente, a pedido)

- Fluxo percorrido na interface real, numa janela Electron oculta sobre `nuxt dev` com banco temporário: marcar duas tarefas na Inbox (continuam lá, sol preenchido), Home com a primeira marcada em destaque e "Depois, hoje: 1", "Focar" trocando o destaque, "Concluir" e "Desfazer", "Tirar de hoje" até cair na sugestão com o rótulo "Sugestão", bloco "Sugestões: N", "Fazer hoje" na sugestão, sol preenchido na página do projeto e estado vazio "Hoje está livre." Sem erro no console.
- Teste da função de dia em `tests/day.test.ts`: `node --import tsx --test tests/day.test.ts`, 2 de 2 passam. Serve de base para o teste do ticket 17.
- Critérios marcados: todos os conferidos acima. Ficam desmarcados dois, implementados mas não exercitados: a troca de dia à meia-noite com o app aberto (exige virar o relógio da máquina) e os estados de carregamento e erro. A conferência foi por texto e estado dos botões; o agente não viu a tela renderizada, então aparência e espaçamento seguem com o humano.

### Follow-up from review of 20 (2026-10-12)

- [ ] `useNow({ interval: 60_000 })` em `app/pages/index.vue:6` não dá um tique por minuto. No `@vueuse/core` 15.0.0 a opção `interval` não existe mais (`useNow` só lê `controls` e `scheduler`, e o padrão é `useRafFn`), então `now` muda a cada quadro e a data do cabeçalho é recalculada a cada quadro. O editor acusa o erro de tipo na mesma linha. Correção: `useNow({ scheduler: (cb) => useIntervalFn(cb, 60_000) })`. Conferido lendo `node_modules/@vueuse/core/dist/index.js`; não medido no app.
