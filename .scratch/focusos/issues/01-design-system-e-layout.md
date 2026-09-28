# 01: Design system e layout base

**What to build:** O app abre com o visual definido: shadcn-vue (componentes copiados para o repo) com tema de cores suaves, bastante espaço em branco e tipografia legível, dentro de um layout com navegação lateral (Hoje, Inbox, Configurações). A Home "Hoje" aparece com um estado vazio acolhedor.

**Blocked by:** None (can start immediately)

**Status:** in-progress

- [x] Tailwind v4 e shadcn-vue configurados; componentes base (botão, input, card, diálogo, toast) adicionados via CLI do shadcn-vue
- [x] Tema suave com contraste AA em modo claro e escuro
- [ ] Barra lateral fixa à esquerda com links Hoje, Inbox e Configurações (Inbox e Configurações podem ser páginas placeholder); áreas e projetos entram nessa barra nos tickets 09–10
- [ ] Link da página atual destacado; Tab percorre os links com foco visível
- [ ] Em telas estreitas a barra vira menu aberto por botão (o componente Sidebar do shadcn-vue cobre isso)
- [ ] Home mostra, no lugar do NuxtWelcome, um estado vazio acolhedor: ícone discreto, uma frase gentil e sem cobrança (ex.: "Hoje está livre. Quando algo surgir, é só capturar, sem precisar organizar agora."), sem contadores nem "você não tem tarefas"
- [ ] `pnpm build` passa
