# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

Early MVP. Nuxt 4 SPA (`ssr: false`) with shadcn-vue + Tailwind v4 set up; product spec and tickets live in `.scratch/focusos/` (see Agent skills below). Server, database, desktop shell and MCP are planned but not built yet.

## Commands

Package manager is pnpm (`pnpm-lock.yaml`, `pnpm-workspace.yaml`).

- `pnpm install` — installs deps; `postinstall` runs `nuxt prepare` to regenerate `.nuxt/` types
- `pnpm dev` — dev server at http://localhost:3000
- `pnpm build` / `pnpm preview` — production build and local preview
- `pnpm generate` — static site generation
- `pnpm lint` / `pnpm lint:fix` — oxlint
- `pnpm fmt` / `pnpm fmt:check` — oxfmt

No typecheck or test tooling yet. `npx nuxi typecheck` needs `vue-tsc` and `typescript` as dev deps.

## Architecture notes

- Nuxt 4 layout: app source lives under `app/` (srcDir), not the project root. Add `app/pages/`, `app/components/`, `app/composables/`, etc. there; `server/` (API routes) and `public/` stay at the root.
- Auto-imports are on: Vue APIs, composables, and components are used without explicit imports. Generated declarations live in `.nuxt/` (gitignored; regenerate with `pnpm install` or `npx nuxi prepare`).
- `tsconfig.json` only references the generated `.nuxt/tsconfig.*.json` project files — edit TS settings via `nuxt.config.ts` (`typescript` key), not by hand in `.nuxt/`.
- Adding `app/pages/` switches on file-based routing via vue-router; until then `app.vue` is the whole app.
- UI components are shadcn-vue, copied into the repo via its CLI (`components.json`), no prefix.
- Planned architecture, recorded as ADRs in `docs/adr/`: db0 with hand-written SQL and numbered SQL migrations (0001); Electron shell embedding the same Nitro server with a local SQLite (0002); desktop offline-first v1, web version later as an independent instance, no sync (0003); MCP endpoint `/mcp` with per-user Bearer tokens (0004).
- Security rule for every server route and MCP tool: the user comes from the "current user" helper (auto-created local user on desktop v1, session on the later web version) or the MCP token, never from client input. v1 is desktop offline-first with no login.

## Agent skills

### Issue tracker

Issues and specs live as local markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five canonical labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), recorded as a `Status:` line in each issue file. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` and `docs/adr/` at the repo root, created lazily. See `docs/agents/domain.md`.

### Workflow

The human writes all application code; the agent acts as Product Owner, Scrum Master and code reviewer (sprints, ticket statuses, reviews appended to tickets). See `docs/agents/workflow.md`.
