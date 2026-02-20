---
name: git-hygiene
description: Enforce branch hygiene, pre-commit validation, PR setup via GitHub MCP tools, and review follow-up workflow in the Website Frontend repo.
---

# Git Hygiene — Phoenix Agentic Website Frontend

## Mandatory first step: terminal scope check

1. `Set-Location "C:\Users\rivie\vsCodeProjects\Phoenix-Agentic-Website-Frontend"`
2. `Get-Location`
3. `git rev-parse --show-toplevel`
4. `git branch --show-current`

## Branch workflow

1. Sync base branch:

```bash
git checkout main
git pull --ff-only
```

2. Create focused branch:

```bash
git checkout -b feature/<short-topic>
```

3. Keep PR scope single-purpose and small.

## Pre-commit quality gate (required)

Run all:

```bash
npm run lint
npm run typecheck
npm run test
```

If any command fails, fix before committing.

## Commit workflow

```bash
git status
git add <focused file set>
git commit -m "feat: <short summary>"
```

Recommended prefixes: `feat`, `fix`, `chore`, `docs`, `test`.

## PR workflow (prefer GitHub MCP tools)

1. Create PR:

```text
mcp_github_github_create_pull_request(owner="rivie13", repo="Phoenix-Agentic-Website-Frontend", title="...", body="...", head="<branch>", base="main")
```

2. Check whether Copilot review already exists for the latest commits:

```text
mcp_github_github_pull_request_read(method="get_reviews", owner="rivie13", repo="Phoenix-Agentic-Website-Frontend", pullNumber=<PR_NUMBER>)
```

If Copilot review is missing for the latest commit set, request it:

```text
mcp_github_github_request_copilot_review(owner="rivie13", repo="Phoenix-Agentic-Website-Frontend", pullNumber=<PR_NUMBER>)
```

3. Read and handle reviews/comments:

```text
mcp_github_github_pull_request_read(method="get_reviews", owner="rivie13", repo="Phoenix-Agentic-Website-Frontend", pullNumber=<PR_NUMBER>)
mcp_github_github_pull_request_read(method="get_review_comments", owner="rivie13", repo="Phoenix-Agentic-Website-Frontend", pullNumber=<PR_NUMBER>)
```

4. Check PR workflow status and fix failures before merge readiness:

```text
mcp_github_github_actions_list(method="list_workflow_runs", owner="rivie13", repo="Phoenix-Agentic-Website-Frontend")
mcp_github_github_actions_list(method="list_workflow_jobs", owner="rivie13", repo="Phoenix-Agentic-Website-Frontend", resource_id="<RUN_ID>")
```

If any job fails, use the GitHub Actions Debug skill flow to inspect logs, fix root causes, and re-run/recheck.

5. Apply fixes and re-run quality gate.

## Website Frontend checks for PR readiness

- `npm run lint` passes
- `npm run typecheck` passes
- `npm run test` passes
- `npm run build` succeeds
- PR workflow/status checks are green
- No API keys or secrets in client-side code
- Security boundary rules from `docs/SECURITY_BOUNDARY.md` respected
