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
