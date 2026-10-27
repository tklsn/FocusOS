# 59: Builds para Windows e Linux

**What to build:** O mesmo app do ticket 41 gera instalador para Windows e Linux, e o do macOS passa a sair também para Intel. Cada um abre offline com o servidor embutido e os dados em `userData`.

**Blocked by:** 41

**Status:** in-review

- [ ] `pnpm build:desktop` gera o alvo do sistema em que roda: macOS `dmg` + `zip` (arm64 e x64), Windows `nsis` (x64), Linux `AppImage` (x64)
- [ ] Nome dos artefatos com versão, sistema e arquitetura (ex.: `FocusOS-0.2.0-arm64.dmg`, `FocusOS-Setup-0.2.0.exe`, `FocusOS-0.2.0-x86_64.AppImage`)
- [ ] No Windows e no Linux o app abre, cria o banco em `userData`, aplica as migrations e mantém os dados ao fechar e reabrir
- [ ] Windows e Linux usam a moldura de janela padrão do sistema; a barra de título sem moldura continua só no macOS (ticket 40)
- [ ] Menu sem os itens exclusivos do macOS no Windows e no Linux (já previsto em `buildMenu()`; conferir na tela)
- [ ] O `.dmg` arm64 continua funcionando como no ticket 41

## Comments

### Nota do PO (2026-10-26)

- Decisões em `docs/adr/0006-releases-e-auto-update.md`.
- Build de cada sistema roda no próprio sistema (o ticket 60 usa um runner por sistema). Não precisa de cross-build local; para testar Windows e Linux, basta uma VM ou o artefato do CI.
- O `zip` do macOS existe porque o `electron-updater` lê o `latest-mac.yml` gerado a partir dele (ticket 63).
- O `node:sqlite` é do próprio Node do Electron: sem módulo nativo para recompilar por sistema.
- Fora deste ticket: `pnpm dev:desktop` no Windows (o `spawn("pnpm")` e o `process.kill(-pid)` do `electron/main.mjs` são de Unix). Só o app empacotado precisa rodar nos três.
- Ícone próprio do app não entra aqui.

### Implementação 2026-10-26 (agente, a pedido)

- `package.json`: alvos por sistema em `build.mac`, `build.win` e `build.linux`, com os nomes de artefato do ticket. `pnpm build:desktop` agora roda `electron-builder` sem `--mac`, então gera o alvo do sistema atual.
- Linux: `executableName: "focusos"`; sem isso o AppImage falha, porque o nome do pacote (`@tklsn/FocusOS`) tem `@` e `/`.
- Para o `electron-updater` (ticket 62) entrar no `app.asar`, as dependências do app foram para `devDependencies` e `dependencies` ficou só com `electron-updater`. O Nuxt empacota tudo no `.output`, então o build não muda. O `app.asar` tem 2,1 MB e leva só o main e o `electron-updater` com as dependências dele.
- Conferido no mac (arm64): `dmg` e `zip` em arm64 e x64 saem em `dist/` com os nomes certos, junto com o `latest-mac.yml`. O `.app` arm64 aberto de `dist/` com uma pasta de dados temporária (`--user-data-dir`) sobe o servidor em `127.0.0.1:41730`, cria o `focusos.db` nela e responde 403 em `/api/` sem o segredo.
- Não conferido: o AppImage não builda neste mac (`spawn Unknown system error -86`: a ferramenta x86 do AppImage não roda sem Rosetta) e o NSIS precisa de Windows. Os dois saem no CI (ticket 60). A moldura padrão e o menu no Windows e no Linux não foram vistos; o código já os tratava por `process.platform`. O `.dmg` não foi instalado, só o `.app` foi aberto.
