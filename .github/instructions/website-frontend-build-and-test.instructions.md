
# Build and test — Phoenix Agentic Website Frontend (Public)

## Repo-scoped terminal/tool discipline (required)

- In this multi-repo workspace, only run Frontend commands from this repo root:
	- `C:\Users\rivie\vsCodeProjects\Phoenix-Agentic-Website-Frontend`
- Before running scripts/tasks/tools, verify scope:
	- `Get-Location`
	- `git rev-parse --show-toplevel`
	- `git branch --show-current`

## Setup

```bash
npm install
```

## Build and validate

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Security validation expectations

- CI must run lint/typecheck/test/build on every PR.
- Dependency audit and secret scanning should be enabled.
- Frontend must never include private secrets.

## Contract validation expectations

- Frontend API client behavior must be compatible with private website backend contract docs.
- Auth-required routes must enforce login state and safe redirect behavior.

