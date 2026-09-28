# 29: Decomposição por IA

**What to build:** O botão "Decompor" transforma uma tarefa vaga em 3 a 8 micro-passos concretos com minutos estimados, que podem ser salvos como subtarefas.

**Blocked by:** 25, 27

**Status:** ready-for-human

- [ ] Chamada ao LLM feita só no servidor; API key em variável de ambiente (web) ou nas Configurações locais (desktop), nunca exposta ao renderer
- [ ] Prévia editável dos passos antes de salvar
- [ ] Salvar cria subtarefas com estimativa
- [ ] Falha ou timeout mostra mensagem gentil e não perde nada
- [ ] Rota usa o usuário atual e limita tamanho da entrada
