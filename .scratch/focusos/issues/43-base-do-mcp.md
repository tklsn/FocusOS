# 43: Base do MCP e tokens de agente

**What to build:** Em Configurações > Agentes, o usuário gera um token e vê a URL do MCP; um agente configurado com eles conecta ao `/mcp` e lista as tools (ainda vazias ou com uma tool de ping).

**Blocked by:** 04

**Status:** ready-for-human

- [ ] Endpoint `/mcp` com transporte streamable HTTP (ADR 0004)
- [ ] Sem token Bearer válido, `/mcp` responde 401
- [ ] Gerar token mostra o valor uma única vez; guardado só como hash; pode ter nome (ex.: "Claude Code notebook")
- [ ] Revogar token corta o acesso imediatamente
- [ ] Configurações mostra a URL atual do MCP e um exemplo de configuração para Claude Code
- [ ] Tool `ping` (ou equivalente) responde com o nome do usuário do token, para testar a conexão
