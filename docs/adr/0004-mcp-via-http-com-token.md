# 0004: MCP via HTTP com token por usuário

**Status:** aceito (2026-09-28)

## Contexto

Agentes (Claude Code e outros) devem ler e escrever tarefas do FocusOS, por exemplo capturar uma tarefa ou atualizar a nota "onde eu parei" de um projeto ao fim de uma sessão de trabalho.

## Decisão

O próprio servidor Nitro expõe um endpoint **MCP em `/mcp`** com transporte streamable HTTP, na web e no desktop (no desktop, em `127.0.0.1`).

- **Auth:** token Bearer por usuário, gerado e revogado em Configurações. O token é mostrado uma única vez e guardado só como hash. Sem token válido, `/mcp` responde 401.
- **Isolamento:** o `user_id` vem **do token**, nunca de um argumento da tool. Toda tool filtra e grava por esse usuário.
- **Regras de negócio:** as tools chamam as mesmas funções de servidor usadas pelas rotas da UI (rollover, próxima ação única etc.); nada de lógica duplicada.
- **Tools:** nomes em português, descrições claras para agentes, entrada validada com zod.

## Alternativas descartadas

- **stdio (binário `focusos-mcp`):** funcionaria com o app fechado, mas abriria o mesmo SQLite em outro processo (escrita concorrente) e não serve para a instância web.

## Consequências

- No desktop, o MCP só responde com o app aberto.
- A porta do desktop muda a cada execução; a tela de Configurações precisa mostrar a URL atual do MCP (ou o app fixa uma porta preferida, com fallback).
