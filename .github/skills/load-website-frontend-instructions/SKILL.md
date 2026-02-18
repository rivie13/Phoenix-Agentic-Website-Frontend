---
name: load-website-frontend-instructions
description: Load Website Frontend repo instruction files into context. Use when working on website frontend code and needing coding conventions, build instructions, project structure, architecture, roadmap, or strategy context for the public website UI.
---

# Load Website Frontend Instructions

## Mandatory first step: terminal scope check

Before running any Frontend command, verify terminal scope:

1. `Set-Location "C:\Users\rivie\vsCodeProjects\Phoenix-Agentic-Website-Frontend"`
2. `Get-Location`
3. `git rev-parse --show-toplevel`
4. `git branch --show-current`

If scope is wrong, open a fresh Frontend-scoped terminal and re-run checks.

## Available instruction files

All files live in `Phoenix-Agentic-Website-Frontend/.github/instructions/`:

| File | Content | When to load |
|------|---------|-------------|
| `website-frontend-coding-conventions.instructions.md` | TS/React conventions + security boundaries | When writing/reviewing code |
| `website-frontend-build-and-test.instructions.md` | npm build/test/lint guidance | When building/testing |
| `website-frontend-project-structure.instructions.md` | Directory ownership and edit policy | When navigating/adding files |
| `website-frontend-architecture.instructions.md` | Cross-service architecture + Entra linking boundary | For architecture decisions |
| `website-frontend-roadmap.instructions.md` | Current phase status and milestones | For planning |
| `website-frontend-strategy.instructions.md` | Feature placement strategy | For scope decisions |

**Also available**: `website-frontend-code-review.instructions.md` — manual-only, includes `excludeAgent` guard.

## Load patterns

### Start coding
```
read_file("Phoenix-Agentic-Website-Frontend/.github/instructions/website-frontend-coding-conventions.instructions.md")
read_file("Phoenix-Agentic-Website-Frontend/.github/instructions/website-frontend-project-structure.instructions.md")
```

### Build/test troubleshooting
```
read_file("Phoenix-Agentic-Website-Frontend/.github/instructions/website-frontend-build-and-test.instructions.md")
```

### Planning/architecture
```
read_file("Phoenix-Agentic-Website-Frontend/.github/instructions/website-frontend-architecture.instructions.md")
read_file("Phoenix-Agentic-Website-Frontend/.github/instructions/website-frontend-roadmap.instructions.md")
read_file("Phoenix-Agentic-Website-Frontend/.github/instructions/website-frontend-strategy.instructions.md")
```
