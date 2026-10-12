# 17: Rollover sem culpa

**What to build:** Tarefas agendadas para dias anteriores e não concluídas aparecem hoje, sem nenhuma marca de atraso.

**Blocked by:** 16

**Status:** in-review

- [x] Tarefa com scheduled_for anterior a hoje e não concluída aparece na Home como tarefa de hoje
- [x] Nenhuma cor de alerta, contador ou texto de "atrasada"
- [x] Teste cobre a virada de dia no timezone do usuário

## Comments

### Follow-up from review of 01 (2026-09-28)

- [ ] Rollover depende da virada do dia com o app aberto: garantir que a Home recalcula "hoje" após a meia-noite (ver follow-up no ticket 16)

### Nota do PO para o sprint 02 (2026-10-09)

- O projeto não tem ferramenta de testes. Para o critério do teste, usar `node:test` com o `tsx` já instalado, sobre uma função pura que decide se uma data é "hoje ou antes"; não adicionar framework.
- O rollover é só leitura: a consulta de Hoje inclui `scheduled_for` anterior a hoje e não concluída. Não regravar a data da tarefa.

### Implementação 2026-10-12 (agente, a pedido)

- **Consulta.** `findToday` (`server/services/task.service.ts`) perdeu o limite inferior: devolve as não concluídas com `scheduled_for` anterior ao início de amanhã. O que ficou de dias anteriores vem primeiro, por ser mais antigo. Só leitura: a data da tarefa não é regravada.
- **Função de dia.** `isToday` virou `isTodayOrBefore` em `shared/utils/day.ts` (substitui a citada na nota de implementação do ticket 16). O sol do `TaskItem` usa a mesma função, então uma tarefa de ontem aparece marcada na Inbox e no projeto, e "Tirar de hoje" a remove.
- **Sem marca de atraso.** Nenhum texto, cor ou contador novo: a tarefa de ontem usa a mesma marcação das de hoje, na Home e no `TaskItem`.
- **Teste.** `tests/day.test.ts`, com `node --import tsx --test tests/day.test.ts` (4 de 4 passam): dia local inteiro, virada de dia (marcada às 23:59:59 continua valendo às 00:00 e semanas depois) e amanhã fora. O teste usa o horário local da máquina, como decidido para o sprint 02; o timezone do usuário entra com o ticket 35.
- **Conferido** num banco temporário com tarefas deslocadas para ontem e amanhã: `GET /api/tasks/today` devolveu a de ontem antes da de hoje, sem a de amanhã nem a concluída ontem, e a data da de ontem ficou igual. Na interface (janela Electron oculta), a de ontem apareceu no destaque da Home sem texto de atraso e com o sol marcado na Inbox.
- **Em aberto.** O follow-up do review do 01 (Home recalcular "hoje" após a meia-noite com o app aberto) está implementado no ticket 16 com `useNow`, mas a virada do relógio não foi exercitada. A aparência não foi vista pelo agente, só o texto e o estado dos botões.
