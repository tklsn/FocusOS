# 01: Design system e layout base

**What to build:** O app abre com o visual definido: shadcn-vue (componentes copiados para o repo) com tema de cores suaves, bastante espaço em branco e tipografia legível, dentro de um layout com navegação lateral (Hoje, Inbox, Configurações). A Home "Hoje" aparece com um estado vazio acolhedor.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Tailwind v4 e shadcn-vue configurados; componentes base (botão, input, card, diálogo, toast) adicionados via CLI do shadcn-vue
- [x] Tema suave com contraste AA em modo claro e escuro
- [x] Barra lateral fixa à esquerda com links Hoje, Inbox e Configurações (Inbox e Configurações podem ser páginas placeholder); áreas e projetos entram nessa barra nos tickets 09–10
- [x] Link da página atual destacado; Tab percorre os links com foco visível
- [x] Em telas estreitas a barra vira menu aberto por botão (o componente Sidebar do shadcn-vue cobre isso)
- [x] Home mostra, no lugar do NuxtWelcome, um estado vazio acolhedor: ícone discreto, uma frase gentil e sem cobrança (ex.: "Hoje está livre. Quando algo surgir, é só capturar, sem precisar organizar agora."), sem contadores nem "você não tem tarefas"
- [x] `pnpm build` passa

## Comments

### Review 2026-09-28: approved

Todos os critérios atendidos; `pnpm build` e `pnpm lint` passam. Itens abaixo não bloqueiam, mas devem ser resolvidos até o ticket indicado:

- [x] Logo da barra usa `<a href="#">` (`app/components/app/Sidebar.vue:21`): trocar por `<NuxtLink to="/">` para levar à Home
- [x] `app/pages/index.vue:1` usa `lang="js"`; o projeto é TypeScript, usar `lang="ts"`. Limpar `class=""` e o espaço duplo em `text-4xl  font-bold`
- [ ] `app/components/nav/User.vue` é código morto com dados de exemplo (Upgrade to Pro, Billing); remover ou reaproveitar no ticket 52 (copiado para o 52)
- [x] (resolvido no ticket 41, 2026-10-09) Fonte JetBrains Mono vem do Google Fonts via `@import` remoto (`tailwind.css:1`): no desktop offline (ticket 41) não carrega. Servir localmente (ex.: `@fontsource/jetbrains-mono` ou `@nuxt/fonts`) até o ticket 41 (copiado para o 41)
- [ ] Tokens do modo escuro existem, mas nada liga a classe `.dark`; o seletor de tema entra no ticket 35 (lembrar de `@nuxtjs/color-mode` ou `useColorMode`; copiado para o 35)
- [ ] A data da Home é calculada uma vez no carregamento; com o app aberto o dia todo (desktop), fica errada após a meia-noite. Resolver junto do ticket 16/17 (data reativa, ex.: `useNow`; copiado para 16 e 17)
