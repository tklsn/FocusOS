# 17: Rollover sem culpa

**What to build:** Tarefas agendadas para dias anteriores e não concluídas aparecem hoje, sem nenhuma marca de atraso.

**Blocked by:** 16

**Status:** ready-for-human

- [ ] Tarefa com scheduled_for anterior a hoje e não concluída aparece na Home como tarefa de hoje
- [ ] Nenhuma cor de alerta, contador ou texto de "atrasada"
- [ ] Teste cobre a virada de dia no timezone do usuário

## Comments

### Follow-up from review of 01 (2026-09-28)

- [ ] Rollover depende da virada do dia com o app aberto: garantir que a Home recalcula "hoje" após a meia-noite (ver follow-up no ticket 16)

### Nota do PO para o sprint 02 (2026-10-09)

- O projeto não tem ferramenta de testes. Para o critério do teste, usar `node:test` com o `tsx` já instalado, sobre uma função pura que decide se uma data é "hoje ou antes"; não adicionar framework.
- O rollover é só leitura: a consulta de Hoje inclui `scheduled_for` anterior a hoje e não concluída. Não regravar a data da tarefa.
