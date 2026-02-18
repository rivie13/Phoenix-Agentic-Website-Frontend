
# Project structure — Phoenix Agentic Website Frontend (Public)

This repository is the public website UI for Phoenix.

## Repository layout

| Path | Purpose | Edit policy |
|------|---------|-------------|
| `src/app/` | Route groups/pages | Primary work area |
| `src/components/` | Reusable UI components | Active development |
| `src/lib/` | API clients, utility helpers | Active development |
| `src/features/` | Feature-level modules (auth/account/billing UI) | Active development |
| `docs/` | Architecture/planning/security docs | Reference |
| `prompts/` | Agent prompts for autonomous implementation | Reference |
| `.github/instructions/` | Copilot instruction files | Configuration |
| `.github/skills/` | Copilot skill files | Configuration |

## Key boundaries

- Public frontend only: no secrets or private backend internals.
- Sensitive operations are delegated to private website backend APIs.
- Existing Phoenix agent backend remains a separate service boundary.
