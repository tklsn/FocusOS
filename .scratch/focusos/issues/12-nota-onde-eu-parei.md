# 12: Nota "onde eu parei"

**What to build:** Cada projeto tem uma nota de retomada de contexto, destacada no topo da página, para voltar ao trabalho sem esforço.

**Blocked by:** 11

**Status:** done

- [x] Campo resume_note editável no topo, visualmente destacado
- [x] Salva automaticamente ao sair do campo
- [x] Mostra quando foi editado pela última vez

## Comments

### Implementação 2026-10-08 (agente, a pedido)

- `server/db/schema.ts`: `projects` ganhou `resume_note` e `resume_note_updated_at`; migração `20261008215043_deep_hulk`, já aplicada no banco de dev.
- `PATCH /api/projects/:id` aceita `resume_note` (vazio vira `null`) e grava a data da edição no servidor. Renomear ou mudar o status não mexe nessa data.
- `app/pages/projects/[id].vue`: bloco "Onde eu parei" no topo, destacado com borda e fundo na cor primária, acima da captura. Salva ao sair do campo e mostra "Última edição" (hora, se foi hoje; data, se foi antes).
- Teste da API contra o servidor de dev com script descartável; lint, `pnpm fmt:check` e `pnpm build` passam. A UI não foi aberta em navegador: falta a confirmação visual do humano (escrever, sair do campo, ver a data, recarregar).

### Aceite 2026-10-09

- O humano confirmou os itens que dependiam da conferência dele (uso da tela no app). Registrado pelo agente a pedido; o agente não repetiu essa conferência.
