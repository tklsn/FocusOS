# FocusOS

Gerenciador de tarefas feito sob medida para quem tem TDAH e trabalha em muitas frentes ao mesmo tempo: desenvolvimento de software, projetos de pesquisa, mestrado e atividades paralelas.

> O FocusOS é uma ferramenta de apoio, não um tratamento. Ele não substitui acompanhamento profissional.

## A ideia

Ferramentas tradicionais (Todoist, Jira, Notion) pressupõem uma função executiva que o TDAH justamente compromete. Elas falham por três motivos principais:

- **Tela em branco e excesso de decisões.** Montar o sistema vira a tarefa, e usá-lo depois é outra. O resultado costuma ser o "cemitério" de tarefas atrasadas que dá vergonha de abrir, ou um sistema elaborado que nunca é usado.
- **Cegueira temporal.** Listas organizam tarefas, não tempo. Elas não dizem se o dia comporta o que foi planejado.
- **Lembretes passivos e punição por atraso.** Notificações são descartadas por reflexo; badges vermelhos e streaks quebrados geram vergonha, depois evasão, e o app acaba abandonado.

O FocusOS é opinativo por escolha: em vez de um canvas configurável, oferece trilhos.

## Filosofia

**Remover fricção, externalizar tempo e memória, mostrar UMA próxima ação por vez e nunca punir atrasos.**

1. **Captura sem fricção.** No máximo dois toques ou um atalho. Nunca exigir projeto ou data na hora de capturar; a triagem vem depois.
2. **Uma coisa por vez.** A tela do dia mostra só "Hoje" e a próxima ação. O Modo Foco mostra uma única tarefa em tela cheia.
3. **Tempo visível.** Estimativas por tarefa, timer em anel que encolhe e aviso gentil quando o plano do dia passa da capacidade.
4. **Nunca punir.** Tarefas não concluídas passam para hoje sem vermelho, sem contador de "atrasadas" e sem culpa.
5. **Recompensa imediata e assimétrica.** Uma pequena celebração ao concluir, opcional e desligável. A falha é neutra.
6. **Pouca carga visual.** Cores suaves, espaço em branco, estados vazios acolhedores, acessibilidade (contraste AA, teclado, `prefers-reduced-motion`).
7. **Retomar contexto sem esforço.** Cada projeto guarda uma nota "onde eu parei" e uma próxima ação.
8. **Energia, não só prioridade.** Tarefas marcadas por nível de energia e contexto; o "Modo Zumbi" mostra só o que cabe num dia ruim.
9. **Intenções de implementação.** Um campo opcional "quando/onde vou fazer" transforma a próxima ação num plano se-então.
10. **Decomposição por IA.** Uma tarefa vaga vira de 3 a 8 micro-passos concretos e iniciáveis, salvos como subtarefas.

## Como funciona

> Descreve o MVP planejado; o app está em construção (ver [tickets](.scratch/focusos/issues/)).

### O fluxo de uma tarefa

```
 capturar ──▶ Inbox ──▶ triagem ──▶ projeto ──▶ próxima ação ──▶ Hoje ──▶ Modo Foco ──▶ concluída
   (1)         (2)        (3)         (4)           (5)          (6)        (7)          (8)
```

1. **Capturar.** Um campo sempre visível na Home e um atalho global de teclado. Digita, aperta Enter, pronto. Nada de escolher projeto, data ou prioridade agora: o objetivo é tirar a ideia da cabeça em segundos.
2. **Inbox.** Tudo o que foi capturado e ainda não foi organizado. Vazia, ela diz "Tudo capturado. Respire."
3. **Triagem.** Quando houver energia para isso, cada item recebe em poucos toques um projeto e, se quiser, nível de energia (baixa, média, alta) e contexto (código, escrita, leitura, admin, reunião, rua).
4. **Projeto.** Cada projeto mora numa área da vida (ex.: Trabalho, Pesquisa, Mestrado, Pessoal) e guarda:
   - uma nota **"onde eu parei"**, em destaque no topo, para retomar o contexto sem reconstruir tudo de memória;
   - suas tarefas e subtarefas (um nível só).
5. **Próxima ação.** Cada projeto destaca **exatamente uma** tarefa como a próxima coisa a fazer, com um campo opcional "quando/onde vou fazer" (ex.: "depois do almoço, no escritório").
6. **Hoje.** A tela principal mostra só:
   - as próximas ações dos projetos ativos, com um botão grande "Iniciar Foco" na primeira;
   - as tarefas agendadas para hoje;
   - um aviso gentil se a soma das estimativas passar da capacidade do dia.
7. **Modo Foco.** Tela cheia com uma única tarefa, seus micro-passos em checklist e um timer em anel que encolhe (Pomodoro configurável). Três saídas: Concluir, Pausar ou "Adiar sem culpa".
8. **Concluída.** Uma pequena celebração (confete, som opcional), desligável. Nenhum placar de falhas.

### O dia a dia

- **Rollover sem culpa.** Uma tarefa agendada para ontem e não feita simplesmente aparece hoje. Sem vermelho, sem contador de atrasadas.
- **Capacidade.** Cada tarefa pode ter uma estimativa em minutos. A capacidade do dia vem do tempo até o seu horário de encerramento (*shutdown*) e pode ser ajustada. Passou do limite, a Home avisa: "Você planejou 6h30 para uma janela de 5h. Tirar algo?"
- **Modo Zumbi.** Em dias ruins, um filtro mostra só tarefas de energia baixa. Sem nenhuma, a sugestão é capturar algo pequeno ou descansar.
- **Sessões de foco.** Cada sessão registra o tempo planejado e o real, e soma na tarefa.

### Decomposição por IA

Uma tarefa vaga ("escrever capítulo 2") vira de 3 a 8 micro-passos concretos e iniciáveis, cada um com minutos estimados. Um slider controla a granularidade, de poucos passos grandes a muitos passos pequenos. Os passos aparecem numa prévia editável e, ao salvar, viram subtarefas que o Modo Foco mostra um de cada vez. A chamada ao LLM acontece só no servidor.

### Agentes via MCP

O FocusOS expõe um servidor [MCP](https://modelcontextprotocol.io/) para que agentes como o Claude Code trabalhem junto com você. Exemplo: ao fim de uma sessão de código, o agente atualiza a nota "onde eu parei" do projeto e captura na Inbox o que ficou pendente.

| Tool | O que faz |
|---|---|
| `capturar_tarefa` | Cria uma tarefa na Inbox |
| `listar_inbox` | Lista itens ainda não triados |
| `listar_areas_e_projetos` | Áreas e projetos, com ids para as outras tools |
| `ler_onde_parei` / `atualizar_onde_parei` | Lê ou atualiza a nota de retomada de um projeto |
| `concluir_tarefa` | Marca uma tarefa como concluída |
| `listar_hoje` / `agendar_para_hoje` | Tarefas de hoje (já com rollover) e agendamento |
| `proximas_acoes` | A próxima ação de cada projeto ativo |

Para conectar, gere um token em **Configurações > Agentes** e configure o agente com a URL do MCP mostrada ali. As tools seguem as mesmas regras da interface e só enxergam os dados do dono do token.

## Pesquisa que fundamenta o design

As referências abaixo calibram as decisões de produto; não são exibidas no app.

**Externalização e função executiva**
- Russell A. Barkley descreve o TDAH como um transtorno de autorregulação e função executiva. A intervenção deve externalizar tempo, memória e motivação no ponto de desempenho, com recompensas artificiais e imediatas como "próteses motivacionais" e a memória de trabalho descarregada em dispositivos externos. [Fact sheet: *The Important Role of Executive Functioning and Self-Regulation in ADHD*](https://www.russellbarkley.org/factsheets/ADHD_EF_and_SR.pdf).
- A ideia de "cegueira temporal" (*time blindness*) vem de Barkley (1997). *Attention-deficit/hyperactivity disorder, self-regulation, and time: toward a more comprehensive theory.* Journal of Developmental & Behavioral Pediatrics. [PubMed 9276836](https://pubmed.ncbi.nlm.nih.gov/9276836/).

**Motivação baseada em interesse**
- William Dodson descreve o "sistema nervoso baseado em interesse": o cérebro com TDAH responde a interesse, desafio, novidade e urgência (ICNU, popularizado como PINCH/INCUP pela ADDitude e pelo Psychiatric Times), não a marcadores abstratos de importância. Por isso flags de prioridade não funcionam. [ADDitude: *Secrets of the ADHD Brain*](https://www.additudemag.com/secrets-of-the-adhd-brain/).

**Percepção de tempo**
- Metcalfe, McFeaters & Voyer (2024). *Time-Perception Deficits in Attention-Deficit/Hyperactivity Disorder: A Systematic Review and Meta-Analysis.* Developmental Neuropsychology, 49(1). [doi:10.1080/87565641.2023.2293712](https://doi.org/10.1080/87565641.2023.2293712). 824 tamanhos de efeito, g médio de 0,688 (efeito moderado).
- Marx, Cortese, Koelch & Hacker (2022). *Meta-analysis: Altered Perceptual Timing Abilities in Attention-Deficit/Hyperactivity Disorder.* Journal of the American Academy of Child & Adolescent Psychiatry, 61(7), 866–880. [doi:10.1016/j.jaac.2021.12.004](https://doi.org/10.1016/j.jaac.2021.12.004). Déficits em discriminação, estimativa, produção e reprodução de tempo em 55 estudos.

**Intenções de implementação (planos se-então)**
- Gawrilow & Gollwitzer (2008). *Implementation Intentions Facilitate Response Inhibition in Children with ADHD.* Cognitive Therapy and Research, 32, 261–280. [doi:10.1007/s10608-007-9150-1](https://doi.org/10.1007/s10608-007-9150-1). Crianças com TDAH que formaram planos se-então inibiram respostas indesejadas no mesmo nível de crianças sem TDAH.
- Gawrilow, Gollwitzer & Oettingen (2011). *If-then plans benefit executive functions in children with ADHD.* Journal of Social and Clinical Psychology, 30, 615–645. [Página da publicação](https://www.socmot.uni-konstanz.de/publications/if-then-plans-benefit-executive-functions-children-adhd). Planos se-então também melhoraram flexibilidade (shifting) e resistência a distração.

**Intervenções digitais para adultos**
- D'Amelio et al. (2026). *Effectiveness of attexis, a digital intervention based on cognitive behavioral therapy for adults with ADHD.* Psychological Medicine, 56, e54. [doi:10.1017/S0033291726103390](https://doi.org/10.1017/S0033291726103390). RCT com N = 337: d = 0,85 no fim, d = 0,61 em 6 meses. Cinco RCTs anteriores de intervenções digitais reportaram d entre 0,42 e 1,21.

**Troca de contexto**
- Gloria Mark (UC Irvine), em entrevista à Gallup (2006): 81,9% do trabalho interrompido é retomado no mesmo dia, em média após 23 min 15 s. É número de entrevista, não de artigo. [Gallup: *Too Many Interruptions at Work?*](https://news.gallup.com/businessjournal/23146/too-many-interruptions-work.aspx).
- Gerald Weinberg (1992). [*Quality Software Management, Vol. 1: Systems Thinking*](https://www.dorsethouse.com/books/qsm1.html). Dorset House, p. 284: dois projetos simultâneos custam 20% do tempo em troca de contexto; três, 40%; cinco, até 75%.

**Body doubling**
- A CHADD descreve o *body doubling* (trabalhar na presença de outra pessoa, ao vivo ou por vídeo) como estratégia para iniciar e sustentar tarefas, com evidência ainda sobretudo anedótica. [CHADD: *The Power of Body Doubling*](https://chadd.org/attention-article/the-power-of-body-doubling/). Planejado para a Fase 2.

**Ressalvas**
- A evidência de intenções de implementação no TDAH é mais forte em crianças; a extrapolação para adultos é razoável, mas não definitiva.
- O RCT do attexis mede severidade de sintomas, não gestão de tarefas.
- Os números de troca de contexto vêm da literatura de produtividade em engenharia, não de estudos específicos de TDAH.
- Gamificação tem risco de *overjustification effect* (recompensa externa minando a motivação intrínseca). Por isso ela é leve, opcional e nunca punitiva.

## Inspirações

| App | O que o FocusOS aproveita |
|---|---|
| [Goblin Tools](https://goblin.tools/) (Magic ToDo) | Decomposição por IA com controle de granularidade; aqui os passos são salvos e executados |
| [Sunsama](https://www.sunsama.com/) | Estimativas, aviso de sobre-capacidade, rollover sem culpa |
| [Amazing Marvin](https://amazingmarvin.com/) | Tags de energia e contexto, estratégias liga/desliga, gamificação configurável |
| [Tiimo](https://www.tiimoapp.com/) | Timer visual em anel, foco em transições |
| [Llama Life](https://llamalife.co/) | Uma tarefa por vez com timer |
| [Motion](https://www.usemotion.com/) / [Akiflow](https://akiflow.com/) | Nunca marcar "atrasado"; inbox único |
| [Focusmate](https://www.focusmate.com/) | Body doubling (Fase 2) |

## Arquitetura

```
┌──────────────────── App desktop (Electron) ────────────────────┐
│                                                                │
│  Janela (renderer)            Processo main                    │
│  ┌──────────────────┐         ┌─────────────────────────────┐  │
│  │ Nuxt 4 SPA       │  HTTP   │ Servidor Nitro (127.0.0.1)  │  │
│  │ shadcn-vue       │ ──────▶ │  /api/*  rotas da UI        │  │
│  │ Tailwind v4      │         │  /mcp    agentes (token)    │◀─┼── Claude Code
│  └──────────────────┘         │     │                       │  │   e outros
│                               │     ▼                       │  │
│                               │ Drizzle ▶ SQLite (userData) │  │
│                               └─────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

- **Interface:** Nuxt 4 em modo SPA, com [shadcn-vue](https://www.shadcn-vue.com/), Tailwind v4 e ícones lucide.
- **Servidor:** Nitro, o mesmo código do Nuxt. As rotas `/api/*` atendem a interface e o `/mcp` atende os agentes. As duas chamam as mesmas funções de regra de negócio.
- **Banco:** [Drizzle ORM](https://orm.drizzle.team/) com `node:sqlite`. As migrations são geradas pelo `drizzle-kit` e aplicadas no boot. No desktop o SQLite fica na pasta de dados do usuário.
- **Desktop (v1):** Electron sobe o servidor Nitro embutido em `127.0.0.1` e abre a janela nele. Funciona offline e não tem login: um usuário local é criado no primeiro uso.
- **Segurança local:** sem login, a API confere `Host` e `Origin` e exige um segredo gerado a cada abertura, entregue só à janela do app. Assim, sites abertos no navegador não conseguem chamar o servidor local. O `/mcp` exige token Bearer, guardado só como hash.
- **Isolamento por usuário:** toda rota e toda tool obtém o usuário do servidor (usuário local, sessão ou token), nunca de um dado enviado pelo cliente.
- **Versão web (depois do MVP):** o mesmo código como site multiusuário, com cadastro e login. É uma instância independente, sem sync com o desktop.

As decisões e seus porquês estão em [`docs/adr/`](docs/adr/).

## Desenvolvimento

```bash
pnpm install     # instala dependências e gera os tipos do Nuxt
pnpm dev         # servidor de desenvolvimento em http://localhost:3000
pnpm build       # build de produção
pnpm lint        # oxlint
pnpm fmt         # oxfmt
```

## Organização do trabalho

- **Spec do produto:** [`.scratch/focusos/spec.md`](.scratch/focusos/spec.md)
- **Tickets** (fatias verticais, numerados em ordem de dependência): [`.scratch/focusos/issues/`](.scratch/focusos/issues/)
- **Sprints:** [`.scratch/focusos/sprints/`](.scratch/focusos/sprints/)
- **Fluxo com agentes** (papéis, ciclo dos tickets, code review): [`docs/agents/workflow.md`](docs/agents/workflow.md)

