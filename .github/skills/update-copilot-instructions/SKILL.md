---
name: update-copilot-instructions
description: Update Copilot instruction files to reflect current project state, architecture, phase progress, or conventions. Use when user asks to update instructions, refresh copilot context, sync instruction files with current reality, or update architecture/roadmap documentation in instruction files.
---

# Update Copilot Instructions — Phoenix Agentic Website Frontend

## Repo Context

- **Repo**: `Phoenix-Agentic-Website-Frontend` (Next.js — public)
- **Instruction location**: `.github/instructions/`

## Instruction files in this repo

| File | Purpose | Auto-loads? |
|------|---------|-------------|
| `website-frontend-code-review.instructions.md` | PR review priorities | No (manual, `excludeAgent: "coding-agent"`) |
| `website-frontend-coding-conventions.instructions.md` | TS/React conventions, security boundaries | No (manual) |
| `website-frontend-build-and-test.instructions.md` | npm scripts, vitest, lint | No (manual) |
| `website-frontend-project-structure.instructions.md` | Directory layout, edit policy | No (manual) |
| `website-frontend-architecture.instructions.md` | Cross-service architecture, Entra boundary | No (manual) |
| `website-frontend-roadmap.instructions.md` | Phase plan, milestones, next tasks | No (manual) |
| `website-frontend-strategy.instructions.md` | Feature placement strategy | No (manual) |
| `website-frontend-git-hygiene.instructions.md` | Branch/commit/PR/review hygiene and MCP usage | No (manual) |

## How to update

### Step 1: Identify what changed

- Phase advanced? → Update `website-frontend-roadmap.instructions.md`
- Architecture changed? → Update `website-frontend-architecture.instructions.md`
- Repo structure changed? → Update `website-frontend-project-structure.instructions.md`
- Build/test process changed? → Update `website-frontend-build-and-test.instructions.md`
- Conventions changed? → Update `website-frontend-coding-conventions.instructions.md`
- Strategy shifted? → Update `website-frontend-strategy.instructions.md`
- Review priorities changed? → Update `website-frontend-code-review.instructions.md`
- Git/PR workflow changed? → Update `website-frontend-git-hygiene.instructions.md`

### Step 2: Read the current file and update it

Use `read_file` to load, then edit with current state.

### Step 3: Keep instructions concise

- State facts, not procedures (procedures go in skills)
- Use tables over prose
- Target under 50 lines per file
