# 20: Intenção "quando/onde vou fazer"

**What to build:** A próxima ação pode ter um gatilho se-então opcional (ex.: "depois do almoço, no escritório").

**Blocked by:** 18

**Status:** done

- [x] Tarefas ganham implementation_intention
- [x] Campo opcional aparece ao marcar próxima ação, com placeholder de exemplo
- [x] Texto aparece junto da próxima ação no projeto e na Home

## Comments

### Implementação 2026-10-12 (humano; campos da interface pelo agente, a pedido)

- **Dado.** `implementation_intention` em `tasks` (`text`, opcional), migração `20261012034452_messy_bruce_banner`.
- **API.** `PATCH /api/tasks/:id` aceita `implementation_intention`; texto vazio grava `null`. Passa pelo `updateTask`, que filtra por `user_id`.
- **Projeto.** Campo de texto sob o título no bloco "Próxima ação", só quando a tarefa está marcada (na sugestão fica oculto). Salva ao sair do campo ou com Enter.
- **Home.** Linha discreta sob o título do destaque, só leitura, quando a tarefa é próxima ação e tem texto.
- **Decisão do PO.** Desmarcar ou concluir a tarefa não apaga o texto; ele só deixa de aparecer. Se a tarefa voltar a ser próxima ação, o texto antigo reaparece.

### Review 2026-10-12: changes requested

O agente escreveu parte do código revisado (campo no projeto, linha na Home, tipo do `updateTask`); o review cobre o diff inteiro mesmo assim. Conferido por leitura do diff, `pnpm lint` (passa) e `pnpm fmt:check` (falha, item abaixo). O app não foi executado: nem a API nem a tela foram exercitadas.

Critérios:

1. Coluna e migração: atendido.
2. Campo ao marcar próxima ação, com placeholder: implementado; falta conferência na tela.
3. Texto no projeto e na Home: implementado; falta conferência na tela.

Segurança: o PATCH pega o usuário de `getCurrentUser` e o `updateTask` filtra por `user_id`. Sem problema.

- [ ] Limite de tamanho no servidor: o schema zod aceita texto de qualquer tamanho; o limite de 200 só existe no `maxlength` do campo. Acrescentar `.max(200)` (`server/api/tasks/[id]/index.patch.ts:14`).
- [ ] `pnpm fmt:check` falha em `server/db/migrations/20261012034452_messy_bruce_banner/snapshot.json`. Rodar `pnpm fmt`.
- [ ] Enter salva e, ao sair do campo em seguida, o blur dispara um segundo PATCH igual se a recarga ainda não voltou. Trocar o handler do Enter por tirar o foco do campo, deixando o blur como único caminho de gravação (`app/pages/projects/[id].vue:247`).
- [ ] Conferência do humano na tela: marcar a estrela mostra o campo; o texto persiste ao recarregar; aparece na Home quando a próxima ação é o destaque; alinhamento da caixa de seleção com o bloco, agora mais alto.

Sem bloqueio, fica como está: o campo não tem rótulo visível (só `aria-label` e placeholder), coerente com a baixa carga visual.

### Aceite 2026-10-12

- Fechado por decisão do humano, com o review acima ainda em "changes requested". Registrado pelo agente a pedido.
- Os critérios 2 e 3 foram marcados por esse aceite. O agente não conferiu a tela nem exercitou a API.
- Os três itens de código do review seguem sem correção (conferido no código em 2026-10-12): `.max(200)` no servidor, `pnpm fmt` no `snapshot.json` da migração e o PATCH duplicado no Enter. Foram levados para o ticket 21, que mostra o mesmo campo.
