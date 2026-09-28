# 0002: Electron com servidor Nitro embutido

**Status:** aceito (2026-09-28)

## Contexto

O FocusOS precisa de um cliente desktop que funcione offline, com os mesmos dados, regras de negócio e endpoint MCP da versão web.

## Decisão

Usar **Electron**. O processo main:

1. Escolhe uma porta livre em `127.0.0.1`.
2. Sobe o servidor Nitro gerado por `nuxt build` (mesmo código da web), apontando o banco para um arquivo SQLite em `app.getPath('userData')`.
3. Abre a janela carregando `http://127.0.0.1:<porta>`.

Em desenvolvimento, a janela carrega o `nuxt dev`. O renderer não recebe acesso a Node (`contextIsolation` ligado, `nodeIntegration` desligado); tudo passa pela API HTTP, como na web.

## Alternativas descartadas

- **Tauri:** binário bem menor, mas o backend é Rust. Rodar Nitro, db0 e MCP exigiria empacotar um Node como sidecar ou reescrever o backend.

## Consequências

- Instalador grande (~100 MB) por embutir Chromium e Node.
- O servidor escuta só em `127.0.0.1`; nada fica exposto na rede. Mas sites abertos no navegador e outros processos locais alcançam `127.0.0.1`: sem login no desktop (ADR 0003), a API checa `Host`/`Origin` e exige um segredo gerado a cada abertura e entregue só à janela do app.
- Auto-update e assinatura/notarização do instalador ficam fora do MVP.
