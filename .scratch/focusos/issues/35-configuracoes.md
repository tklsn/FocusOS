# 35: Página de Configurações

**What to build:** O usuário ajusta nome, timezone e tema, e vê o aviso de que o app é ferramenta de apoio, não tratamento.

**Blocked by:** 02

**Status:** ready-for-human

- [ ] Preferências salvas em settings do usuário
- [ ] Tema claro, escuro ou do sistema
- [ ] Timezone editável (padrão: o do navegador)
- [ ] Aviso "ferramenta de apoio, não tratamento" visível

## Comments

### Follow-up from review of 01 (2026-09-28)

- [ ] Tokens do modo escuro já existem em `app/assets/css/tailwind.css`, mas nada liga a classe `.dark`. Usar `@nuxtjs/color-mode` ou `useColorMode` (VueUse) e conferir contraste AA no escuro
