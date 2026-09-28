# FocusOS — spec

Status: ready-for-human

Gerenciador de tarefas sob medida para um profissional com TDAH (engenheiro de software, múltiplos projetos de P&D, mestrado, atividades paralelas). Princípio central: **remover fricção, externalizar tempo e memória, mostrar UMA próxima ação por vez e nunca punir atrasos.** É ferramenta de apoio, não tratamento — o app deve dizer isso em algum lugar (ex.: Configurações/Sobre).

## Stack

- Nuxt 4 (full-stack) + shadcn-vue (port Vue do shadcn/ui, via módulo `shadcn-nuxt`) + Tailwind v4; ícones lucide
- Backend: rotas de servidor Nitro (`server/api/`)
- DB: SQLite via Drizzle ORM (arquivo em `.data/`, gitignored); migrar para Postgres se um dia precisar
- Auth: sessão por cookie via `nuxt-auth-utils` (email + senha, `hashPassword`/`verifyPassword`)
- IA (decomposição): chamada a LLM só no servidor; API key em `.env`, nunca no cliente

Sem RLS: **toda rota de servidor obtém o usuário da sessão (`requireUserSession`) e filtra/grava por `user_id`**. Nunca aceitar `user_id` vindo do cliente.

## Princípios de UX (obrigatórios em todas as telas)

1. Captura em no máximo 2 toques/atalho global; nunca exigir projeto/data para capturar.
2. Tela padrão do dia minimalista: só "Hoje" e a próxima ação.
3. Tempo visível: estimativa por tarefa, timer visual com anel que encolhe.
4. Uma tarefa por vez no Modo Foco (tela cheia).
5. Atrasos rolam para hoje sem vermelho, sem contagem de "atrasadas".
6. Recompensa imediata e assimétrica na conclusão, opcional e desligável; nunca penalizar falhas.
7. Baixa carga visual: cores suaves, espaço em branco, ícones, tipografia legível.
8. Estados vazios acolhedores (ex.: Inbox vazia = "Tudo capturado. Respire.") e estados de carregamento em todas as telas.
9. Acessibilidade: contraste AA, navegação por teclado, `prefers-reduced-motion`.

## Modelo de dados

Enums como texto; datas como texto ISO; JSON como texto em modo json.

- **users**: id, email (unique), password_hash, display_name, timezone, settings (json: gamification, sound, shutdown_time, theme), created_at
- **areas**: id, user_id, name, color, icon, sort_order
- **projects**: id, user_id, area_id, name, description, status (active/paused/done), resume_note ("onde eu parei"), next_action_task_id (nullable), github_repo (nullable), created_at
- **tasks**: id, user_id, project_id (nullable → Inbox), parent_task_id (nullable → subtarefa), title, notes, status (inbox/todo/doing/done), is_next_action, estimate_minutes, actual_minutes, energy_level (low/medium/high), context (code/writing/reading/admin/meeting/errand), scheduled_for (date), due_date (date), implementation_intention ("quando/onde vou fazer"), completed_at, created_at, sort_order
- **focus_sessions**: id, user_id, task_id, started_at, ended_at, planned_minutes, actual_minutes, technique (pomodoro/timebox/freeform)
- **daily_plans**: id, user_id, plan_date, planned_minutes_total, capacity_minutes, shutdown_time, reflection_note
- **rewards_log**: id, user_id, task_id, points, created_at

## Telas (MVP)

1. **Login/Signup** — email + senha.
2. **Hoje** (home) — tarefas de hoje; banner de capacidade ("Você planejou 6h30 para uma janela de 5h — remover algo?"); botão grande "Iniciar Foco" na próxima ação; captura rápida sempre visível (campo + atalho).
3. **Modo Foco** — tela cheia com uma tarefa, micro-passos, timer visual (Pomodoro configurável), "Concluir" / "Pausar" / "Adiar sem culpa".
4. **Inbox** — itens sem triagem; ação rápida para atribuir área/projeto/energia/contexto ou decompor.
5. **Projeto** — nota "onde eu parei" editável e destacada, próxima ação marcada, tarefas/subtarefas.
6. **Nova Tarefa / Decompor** — formulário mínimo + "Decompor em micro-passos" (IA) com slider de granularidade; salvar passos como subtarefas.
7. **Configurações** — gamificação e sons on/off, horário de shutdown, tema.

## Regras de negócio

- **Rollover:** tarefa com `scheduled_for < hoje` e status ≠ done passa para hoje, sem marca de atraso.
- **Próxima ação:** cada projeto tem exatamente uma `is_next_action`; a Home puxa dessas.
- **Capacidade:** soma de `estimate_minutes` de hoje vs. `capacity_minutes` do daily_plan; aviso suave se exceder.
- **Modo Zumbi:** filtro que mostra só `energy_level = low`.
- **Decomposição por IA:** título vago → 3 a 8 micro-passos concretos e iniciáveis, com minutos por passo; slider controla granularidade; salvar como subtarefas.

## Tickets

O trabalho está quebrado em tickets de fatia vertical em `issues/`, numerados em ordem de dependência (cada um lista o que o bloqueia). Pegar sempre o menor número desbloqueado e não concluído. Implementação feita pelo usuário.

## Fora de escopo (Fase 2)

Planejamento/shutdown guiados, calendário/timeboxing por arrastar, integração GitHub/calendário, recorrências, body doubling, relatórios estimado-vs-real, Kanban de sprint, templates de rotina, PWA/mobile.

Critério para avançar de fase: usar o MVP por ~2 semanas capturando e concluindo tarefas de forma consistente.
