# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

Freshly scaffolded Nuxt 4 minimal starter. `app/app.vue` still renders `<NuxtWelcome />`; no pages, components, server routes, or modules yet. Not a git repository yet.

## Commands

Package manager is pnpm (`pnpm-lock.yaml`, `pnpm-workspace.yaml`).

- `pnpm install` — installs deps; `postinstall` runs `nuxt prepare` to regenerate `.nuxt/` types
- `pnpm dev` — dev server at http://localhost:3000
- `pnpm build` / `pnpm preview` — production build and local preview
- `pnpm generate` — static site generation

No lint, typecheck, or test tooling is configured. For a typecheck, `npx nuxi typecheck` needs `vue-tsc` and `typescript` installed as dev deps.

## Architecture notes

- Nuxt 4 layout: app source lives under `app/` (srcDir), not the project root. Add `app/pages/`, `app/components/`, `app/composables/`, etc. there; `server/` (API routes) and `public/` stay at the root.
- Auto-imports are on: Vue APIs, composables, and components are used without explicit imports. Generated declarations live in `.nuxt/` (gitignored; regenerate with `pnpm install` or `npx nuxi prepare`).
- `tsconfig.json` only references the generated `.nuxt/tsconfig.*.json` project files — edit TS settings via `nuxt.config.ts` (`typescript` key), not by hand in `.nuxt/`.
- Adding `app/pages/` switches on file-based routing via vue-router; until then `app.vue` is the whole app.

## Agent skills

### Issue tracker

Issues and specs live as local markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five canonical labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), recorded as a `Status:` line in each issue file. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` and `docs/adr/` at the repo root, created lazily. See `docs/agents/domain.md`.

### Workflow

The human writes all application code; the agent acts as Product Owner, Scrum Master and code reviewer (sprints, ticket statuses, reviews appended to tickets). See `docs/agents/workflow.md`.
