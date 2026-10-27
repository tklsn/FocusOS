# 62: Auto-update no Windows e no Linux

**What to build:** O app instalado no Windows ou no Linux encontra a versão nova publicada pelo ticket 60, baixa em segundo plano e a instala ao sair, sem interromper o usuário.

**Blocked by:** 60, 61

**Status:** in-review

- [ ] Verifica ao abrir e a cada 4 horas com o app aberto
- [ ] Baixa em segundo plano; nenhuma janela modal nem notificação aparece sozinha
- [ ] Com a atualização baixada, o menu ganha "Reiniciar para atualizar (vX.Y.Z)"; sem clicar, ela é instalada ao sair do app
- [ ] Menu "Ajuda > Verificar atualizações…" verifica na hora e responde num diálogo: "Você está na versão mais recente", "Baixando a versão X.Y.Z" ou "Não foi possível verificar agora"
- [x] Sem internet, a verificação automática falha em silêncio (só log) e o app segue normal
- [ ] Ao reiniciar para atualizar, o servidor embutido encerra e os dados seguem intactos na versão nova
- [x] Em `pnpm dev:desktop` e em `pnpm start:desktop` (não empacotado) não verifica nada
- [ ] Conferido de ponta a ponta: instalar a versão N, publicar N+1 pela tag e ver o app atualizar no Windows e no Linux

## Comments

### Nota do PO (2026-10-26)

- Decisões em `docs/adr/0006-releases-e-auto-update.md`.
- `electron-updater` como dependência de runtime. O `build.files` do `package.json` exclui `node_modules`; ele precisa entrar no `app.asar`.
- `autoInstallOnAppQuit` já é o padrão do `electron-updater`. "Reiniciar para atualizar" chama `quitAndInstall()`.
- Princípio da spec: nada de interromper. Por isso não há modal nem notificação automáticos; o diálogo só aparece quando o usuário pede pelo menu.
- O updater confere o `sha512` do `latest*.yml` publicado no HTTPS do GitHub. Sem assinatura no Windows, não configurar `publisherName`.
- Para o teste de ponta a ponta, uma tag de pré-release (ex.: `v0.2.0-beta.1`) serve, desde que o canal seja o mesmo.

### Implementação 2026-10-26 (agente, a pedido)

- `electron/main.mjs`: `startUpdater()` verifica ao abrir e a cada 4 horas, só com `app.isPackaged`. No Windows e no Linux baixa sozinho (`autoDownload`) e instala ao sair (padrão do `electron-updater`). Os erros vão só para o log.
- Menu "Ajuda": "Verificar atualizações…", com os diálogos do ticket, e "Reiniciar para atualizar (vX.Y.Z)" quando o download termina (`quitAndInstall()`). O menu é remontado quando chega uma versão.
- Conferido: o `.app` empacotado sem release publicada registrou `auto-update: No published versions on GitHub` e seguiu normal.
- Não conferido: o ciclo de ponta a ponta no Windows e no Linux. Depende da primeira release pelo CI e de uma segunda para atualizar.
