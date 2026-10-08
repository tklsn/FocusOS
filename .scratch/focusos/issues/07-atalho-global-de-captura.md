# 07: Atalho global de captura

**What to build:** Em qualquer tela, um atalho de teclado abre um modal de captura; Enter salva na Inbox e fecha.

**Blocked by:** 05

**Status:** ready-for-human

- [ ] Atalho funciona em todas as páginas logadas
- [ ] Atalho não dispara quando o foco está em outro campo de texto
- [ ] Esc fecha sem salvar
- [ ] Atalho aparece como dica na UI

## Comments

### Follow-up from review of 06 (2026-10-08)

- [x] Com captura em qualquer tela, a lista da Inbox pisca para skeleton a cada captura, porque o refresh volta `status` para `pending` (`app/pages/inbox/index.vue:17`). Mostrar o skeleton só na primeira carga: `status === 'pending' && !tasks`. (resolvido em 2026-10-08, junto com o 06)
