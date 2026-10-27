# 63: Aviso de versão nova no macOS

**What to build:** No macOS, onde o app não é assinado e não pode se atualizar sozinho, o FocusOS avisa pelo menu que há versão nova e leva o usuário à página de download.

**Blocked by:** 62

**Status:** in-review

- [ ] Verifica ao abrir e a cada 4 horas, como no ticket 62, mas sem baixar nada
- [ ] Com versão nova, o menu do app ganha "Baixar FocusOS X.Y.Z…", que abre a página da release no navegador
- [ ] "FocusOS > Verificar atualizações…" responde num diálogo; com versão nova, o diálogo oferece "Abrir página de download"
- [ ] Nenhuma janela modal nem notificação aparece sozinha
- [x] Sem internet, falha em silêncio como no ticket 62
- [ ] Instalar o `.dmg` novo por cima mantém os dados (backup do ticket 61 roda se houver migration)

## Comments

### Nota do PO (2026-10-26)

- Decisões em `docs/adr/0006-releases-e-auto-update.md`. O Squirrel.Mac recusa updates sem assinatura Developer ID; o humano decidiu não assinar por enquanto.
- Mesmo código do ticket 62 com `autoDownload: false` no macOS: o `update-available` do `electron-updater` lê o `latest-mac.yml` e dá a versão; o link é `https://github.com/tklsn/FocusOS/releases/tag/vX.Y.Z`.
- Quando houver assinatura (fora de escopo, ver spec), este ticket some: o macOS passa a seguir o fluxo do 62.

### Implementação 2026-10-26 (agente, a pedido)

- O mesmo `startUpdater()` do ticket 62, com `autoDownload = false` no macOS. Com versão nova, o menu FocusOS ganha "Baixar FocusOS X.Y.Z…", que abre `https://github.com/tklsn/FocusOS/releases/tag/vX.Y.Z`. "Verificar atualizações…" fica no mesmo menu, logo abaixo de "Sobre".
- O `latest-mac.yml` é gerado (conferido em `dist/`).
- Conferido: sem release publicada, a falha fica no log e o app segue. Os diálogos e o item de download não foram vistos; precisam de uma release.
