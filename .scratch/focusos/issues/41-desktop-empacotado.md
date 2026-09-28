# 41: Desktop empacotado com servidor embutido

**What to build:** Um instalador macOS abre o FocusOS offline: o app sobe o servidor Nitro embutido em 127.0.0.1 e guarda os dados num SQLite na pasta de dados do usuário.

**Blocked by:** 02, 40

**Status:** ready-for-human

- [ ] Build de produção gera instalador macOS (sem assinatura por enquanto)
- [ ] Servidor escuta só em `127.0.0.1`, em porta preferida fixa com fallback para uma livre
- [ ] Banco SQLite em `userData`; migrations aplicadas no boot
- [ ] Dados sobrevivem a fechar e reabrir o app
- [ ] Conector do banco sem rebuild nativo quebrado no Electron (ADR 0001)
- [ ] Funciona sem internet

## Comments

### Follow-up from review of 01 (2026-09-28)

- [ ] Fonte JetBrains Mono carregada do Google Fonts por URL (`app/assets/css/tailwind.css:1`) não funciona offline; servir localmente (ex.: `@fontsource/jetbrains-mono` ou `@nuxt/fonts`)

### Nota do PO (2026-09-28)

- [ ] Segredo gerado a cada abertura do app, entregue só à janela do Electron e exigido pela API (além da checagem de Host/Origin do ticket 02), para que outros processos locais não usem a API sem o app
- [ ] Usuário local do ticket 02 criado no banco em `userData` no primeiro uso
