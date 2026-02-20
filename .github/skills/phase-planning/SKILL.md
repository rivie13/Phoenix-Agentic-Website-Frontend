---
name: phase-planning
description: Navigate the Website Frontend roadmap, understand current phase status, plan next tasks, and track what needs to be done. Use when user asks what to work on next, current project status, phase progress, roadmap, task planning, or what's left to do.
---

# Phase Planning — Phoenix Agentic Website Frontend

## Repo Context

This is the **Website Frontend** (Public). See `docs/IMPLEMENTATION_PLAN.md` for the full plan.

## How to check roadmap

Read the planning docs for full details:

```
read_file("Phoenix-Agentic-Website-Frontend/docs/IMPLEMENTATION_PLAN.md")
read_file("Phoenix-Agentic-Website-Frontend/docs/ARCHITECTURE.md")
read_file("Phoenix-Agentic-Website-Frontend/.github/instructions/website-frontend-roadmap.instructions.md")
```

## Key docs

| File | Purpose |
|------|---------|
| `docs/IMPLEMENTATION_PLAN.md` | Full implementation plan |
| `docs/ARCHITECTURE.md` | Frontend architecture |
| `docs/AUTOMATED_BLOG_PLAN.md` | Blog automation plan |
| `docs/SECURITY_BOUNDARY.md` | Security boundary rules |
| `docs/MAILCHIMP_SETUP.md` | Newsletter integration |

## Using VS Code tasks for development

- `website: dev: setup` — Install npm dependencies
- `website: dev: run` — Start Next.js dev server
- `website: dev: lint` — Run ESLint
- `website: dev: typecheck` — Run tsc --noEmit
- `website: dev: test` — Run vitest
- `website: dev: build` — Production build
- `website: dev: check` — Full validation (lint + typecheck + test + build)
- `website: dev: clean` — Remove build artifacts

## Working principles

1. Read `docs/` before starting any new feature area
2. Keep changes scoped to one feature/task at a time
3. Security boundary rules apply — no secrets in client-side code
4. Cross-service integration via API client, not direct backend coupling
5. Maintain SSR compatibility for all components
