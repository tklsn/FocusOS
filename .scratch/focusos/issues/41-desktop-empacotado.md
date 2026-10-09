# 41: Desktop empacotado com servidor embutido

**What to build:** Um instalador macOS abre o FocusOS offline: o app sobe o servidor Nitro embutido em 127.0.0.1 e guarda os dados num SQLite na pasta de dados do usuário.

**Blocked by:** 02, 40

**Status:** done

- [x] Build de produção gera instalador macOS (sem assinatura por enquanto)
- [x] Servidor escuta só em `127.0.0.1`, em porta preferida fixa com fallback para uma livre
- [x] Banco SQLite em `userData`; migrations aplicadas no boot
- [x] Dados sobrevivem a fechar e reabrir o app
- [x] Conector do banco sem rebuild nativo quebrado no Electron; pasta de migrations empacotada e apontada por `DB_MIGRATIONS_DIR` (ADR 0005)
- [x] Funciona sem internet

## Comments

### Follow-up from review of 01 (2026-09-28)

- [x] Fonte JetBrains Mono carregada do Google Fonts por URL (`app/assets/css/tailwind.css:1`) não funciona offline; servir localmente (ex.: `@fontsource/jetbrains-mono` ou `@nuxt/fonts`)

### Nota do PO (2026-09-28)

- [x] Segredo gerado a cada abertura do app, entregue só à janela do Electron e exigido pela API (além da checagem de Host/Origin do ticket 02), para que outros processos locais não usem a API sem o app
- [x] Usuário local do ticket 02 criado no banco em `userData` no primeiro uso

### Implementação 2026-10-09 (agente, a pedido)

- `pnpm build:desktop` roda `nuxt build` e `electron-builder --mac`; sai `dist/FocusOS-0.1.0-arm64.dmg` (123 MB, sem assinatura, ícone padrão do Electron). `pnpm start:desktop` roda o servidor embutido sem empacotar, para testar rápido.
- Sem `--dev`, o main importa o servidor Nitro de `nuxt build` no próprio processo, com `NITRO_HOST=127.0.0.1` e porta 41730 (ou uma livre, se ocupada).
- Banco em `userData/focusos.db`; `DB_MIGRATIONS_DIR` aponta para a pasta `migrations` dos recursos do app. O `.output` e as migrations vão como `extraResources`; o `app.asar` leva só o main.
- `server/utils/db.ts` agora aplica as migrations no boot, como a ADR 0005 previa, e cria a pasta do banco se faltar. Vale também para `pnpm dev`: não é mais preciso rodar `npx drizzle-kit migrate` à mão.
- `node:sqlite` funciona no Node do Electron 44 (24.21) sem rebuild nativo.
- Segredo por execução: o main gera 32 bytes aleatórios, passa ao servidor em `FOCUSOS_API_SECRET` e acrescenta o cabeçalho `x-focusos-secret` em toda requisição da janela ao servidor; o código do renderer nunca vê o valor. `server/middleware/local-origin.ts` responde 403 em `/api/` sem o cabeçalho certo. Sem a variável (`pnpm dev`), nada muda. Vale também em `pnpm dev:desktop`.
- Usuário local: o main define `APP_MODE=local`, e o plugin existente cria o usuário no primeiro boot.
- Fonte: o `@import` do Google Fonts saiu; JetBrains Mono vem de `@fontsource-variable/jetbrains-mono`, empacotada no build. Nenhuma referência externa de fonte resta em `.output/public`.
- Testado por linha de comando com pasta de dados temporária: app empacotado sobe o servidor só em `127.0.0.1:41730`, cria o banco com as 8 migrations e o usuário local, responde 403 em `/api/` sem o segredo e 200 com ele; uma tarefa criada continua lá depois de reiniciar o servidor.
- Não verificado: a janela do app empacotado em uso (se o renderer recebe o cabeçalho e as telas carregam os dados), a instalação pelo `.dmg` e o uso com a rede desligada. Falta a confirmação do humano. Por não ser assinado, o macOS pede "Abrir" pelo menu de contexto na primeira vez.
- Limite conhecido: o servidor roda dentro do processo main; um travamento dele derruba o app. Mover para um `utilityProcess` se isso virar problema.

### Aceite 2026-10-09

- O humano confirmou os itens que dependiam da conferência dele (uso da tela no app). Registrado pelo agente a pedido; o agente não repetiu essa conferência.
