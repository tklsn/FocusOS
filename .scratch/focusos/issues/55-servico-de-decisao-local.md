# 55: Serviço de decisão local

**What to build:** O servidor ganha uma função que recebe uma pergunta e uma lista fechada de opções e devolve a opção escolhida com a margem, usando um modelo local opcional que o usuário ativa nas Configurações.

**Blocked by:** 35, 54

**Status:** ready-for-human

- [ ] Função de servidor `decidir(pergunta, opções)` que devolve a opção e a margem; nunca devolve texto livre do modelo
- [ ] Modelo desligado por padrão; Configurações mostra o tamanho do download, permite baixar, ativar, desativar e apagar
- [ ] Download com progresso e retomada; falha ou cancelamento não deixa arquivo corrompido em uso
- [ ] Modelo carregado sob demanda e liberado depois de um tempo sem uso
- [ ] Sem modelo ativo, a função responde "sem decisão" e o app funciona como hoje
- [ ] Entrada com tamanho limitado; nenhuma chamada de rede além do download do modelo
- [ ] Runtime e modelo conforme o ADR do ticket 54

## Comments

### Contexto 2026-10-08 (agente)

- Só existe se o ticket 54 terminar em "go".
- Os pesos ficam fora do instalador, na pasta de dados do usuário (ver ADR 0002), para não inflar o pacote do ticket 41.
