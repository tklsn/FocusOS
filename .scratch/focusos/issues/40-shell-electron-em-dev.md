# 40: Shell Electron em desenvolvimento

**What to build:** Rodando um comando de desenvolvimento, abre uma janela desktop do FocusOS carregando o app do `nuxt dev`, com hot reload.

**Blocked by:** 01

**Status:** ready-for-human

- [ ] Um script (ex.: `pnpm dev:desktop`) sobe o `nuxt dev` e abre a janela Electron apontando para ele
- [ ] Renderer isolado: `contextIsolation` ligado e `nodeIntegration` desligado
- [ ] Fechar a janela encerra o processo no macOS conforme a convenção da plataforma (Cmd+Q)
- [ ] `pnpm dev` (web) continua funcionando sem Electron
