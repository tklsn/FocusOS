# 54: Spike: decisão local para triagem

**What to build:** Um experimento fora do app que responde se um modelo de linguagem pequeno, rodando na máquina, acerta o projeto de uma tarefa da Inbox com precisão e velocidade suficientes. O resultado decide se os tickets 55 a 58 valem a pena.

**Blocked by:** 14

**Status:** ready-for-human

- [ ] Script descartável (fora de `app/` e `server/`) que lê as tarefas já triadas do banco local, esconde o projeto de cada uma e pede ao modelo para escolher entre os projetos ativos mais a opção "nenhum"
- [ ] Decisão por leitura de logits das opções (uma passagem pelo modelo, sem gerar texto), como no SemIf; confirmar que o runtime expõe os logits por token
- [ ] Comparar pelo menos dois modelos (cerca de 0,6B e 2B de parâmetros, GGUF quantizado) e os dois runtimes candidatos: `node-llama-cpp` no servidor e wllama no renderer
- [ ] Medir acerto, acerto só nos casos acima de um limiar de margem, e tempo por tarefa
- [ ] Testar o prompt com e sem contexto extra: nota "onde eu parei" e tarefas já triadas de cada projeto como exemplos
- [ ] Registrar os números em `## Comments` e a escolha de runtime e modelo num ADR em `docs/adr/`
- [ ] Decisão go/no-go escrita no ticket. Critério sugerido: 80% ou mais de acerto nos casos acima do limiar, em menos de 1 s por tarefa

## Comments

### Contexto 2026-10-08 (agente)

- Origem: análise de https://openjev.com/ (SemIf). A técnica apresenta a pergunta com opções fechadas (A, B, C…) e normaliza os logits só entre elas. O próprio site avisa que o resultado não é confiança calibrada; por isso o limiar é sobre a margem entre a primeira e a segunda opção, ajustado com os dados do usuário.
- Runtimes: wllama (https://github.com/ngxson/wllama) roda no navegador sem dependência nativa, mas contraria a regra do spec de LLM só no servidor e não atende o MCP. `node-llama-cpp` roda no Nitro e usa GPU, mas é módulo nativo e precisa ser empacotado no Electron (ticket 41).
- Não foi verificado se cada runtime expõe os logits do jeito necessário; é o primeiro item a conferir.
- Com poucas tarefas triadas no banco a medida não diz nada. Se houver menos de umas 50, triar mais antes de rodar ou montar um conjunto à mão.
