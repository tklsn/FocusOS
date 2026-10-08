# 07: Atalho global de captura

**What to build:** Em qualquer tela, um atalho de teclado abre um modal de captura; Enter salva na Inbox e fecha.

**Blocked by:** 05

**Status:** done

- [x] Atalho funciona em todas as páginas logadas
- [x] Atalho não dispara quando o foco está em outro campo de texto
- [x] Esc fecha sem salvar
- [x] Atalho aparece como dica na UI

## Comments

### Follow-up from review of 06 (2026-10-08)

- [x] Com captura em qualquer tela, a lista da Inbox pisca para skeleton a cada captura, porque o refresh volta `status` para `pending` (`app/pages/inbox/index.vue:17`). Mostrar o skeleton só na primeira carga: `status === 'pending' && !tasks`. (resolvido em 2026-10-08, junto com o 06)

### Review 2026-10-08: changes requested

Os quatro critérios estão atendidos pela leitura do código (listener global no layout padrão, guarda para campos de texto, Esc do `Dialog`, dica com `Kbd` na Home). Review feito sem rodar a UI. O status tinha sido marcado `done` antes do review; volta para `in-progress` até os bloqueantes saírem.

- [x] Enter repetido cria tarefas duplicadas: `onEnter` chama `addTask()` sem checar envio em andamento (`app/components/task/FastAddInput.vue:41`). O botão é desabilitado por `isSubmitting`, mas o caminho do teclado não, e o campo só é limpo depois do POST e do refresh. Segurar Enter ou apertar duas vezes grava a mesma tarefa mais de uma vez. Corrigir com `if (e.shiftKey || e.isComposing || isSubmitting.value) return;`.
- [x] O modal não tem nome acessível: `DialogContent` sem `DialogTitle` (`app/components/task/ModalHost.vue:43`). Leitor de tela anuncia só "diálogo" e o reka-ui emite aviso no console. Tirar o `as-child` e incluir `<DialogTitle class="sr-only">Capturar tarefa</DialogTitle>` (e um `DialogDescription` `sr-only`) antes do `TaskFastAddInput`.
- [x] `pnpm fmt:check` falha em `app/components/task/FastAddInput.vue`, `app/components/task/ModalHost.vue` e `app/pages/index.vue`. Rodar `pnpm fmt`.

Não bloqueantes:

- [x] `app/components/task/FastAddInput.vue:32`: o `await refreshNuxtData("inbox-tasks")` voltou. Toast, limpeza do campo e fechamento do modal esperam um GET extra; é atrito na captura e aumenta a janela do bug de duplicação. Tirar o `await`.
- [x] `autofocus` no textarea (`FastAddInput.vue:51`) só vale na primeira carga do documento; ao navegar de outra página para a Home o campo não recebe foco. No modal quem foca é o `Dialog`. Se o foco na Home importa, focar em `onMounted` via `ref`; se não, remover o atributo.
- [x] `app/layouts/default.vue:2`: `TaskModalHost` fora do `SidebarProvider` deixa o layout com duas raízes, o que quebra transições de layout se forem ligadas. Mover para dentro do `SidebarProvider`.
- [x] Detecção de Mac duplicada em `app/pages/index.vue:4` e `ModalHost.vue:23`. Extrair para `app/utils/` (auto-importado) e usar nos dois lugares; o `import.meta.client &&` é desnecessário com `ssr: false`.
- [x] `ModalHost.vue:31`: `e.code === 'KeyI'` é a tecla física; em layout não QWERTY ela não é a letra "I" mostrada na dica. `e.key.toLowerCase() === 'i'` acompanha a dica.
- [x] Limpeza em `ModalHost.vue`: `import { onMounted, onBeforeUnmount } from 'vue'` é redundante (auto-import), e o par `onMounted`/`onBeforeUnmount` vira uma linha com `useEventListener(window, 'keydown', onKeydown)` de `@vueuse/core`, já instalado. Nomes: `isPressing` na verdade testa se o alvo é editável (`isEditableTarget`); `aberto`, `criarNovo` e `outro` destoam dos identificadores em inglês do resto do código; `ModalHost` não diz o que hospeda (`CaptureDialog`).
- [ ] A dica do atalho só aparece na Home. Atende o critério; considerar um lugar visível em todas as telas (rodapé da sidebar) quando houver mais páginas.

### Correções 2026-10-08 (agente, a pedido)

- Itens do review acima aplicados, menos a dica do atalho fora da Home, que fica para quando houver mais páginas.
- `ModalHost.vue` virou `app/components/task/CaptureDialog.vue` (`<TaskCaptureDialog />`), agora dentro do `SidebarProvider`.
- `isMac` vive em `app/utils/isMac.ts`.
- O campo de captura recebe foco em `onMounted`, no lugar do atributo `autofocus`.
- Lint sem erros, `pnpm fmt:check` limpo, `pnpm build` passa. Falta a confirmação visual do humano: atalho em cada página, Esc, Enter repetido sem duplicar, foco ao abrir.
