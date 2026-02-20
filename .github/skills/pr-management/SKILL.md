---
name: pr-management
description: Create, update, and manage GitHub pull requests for the Website Frontend repo. Use when user asks to create a PR, update a PR description, push changes, list PRs, merge a PR, check PR status, or manage branches.
---

# PR Management — Phoenix Agentic Website Frontend

## CLI tool policy (mandatory)

- **NEVER use `gh` CLI** — it is not installed and must not be used.
- **Always prefer GitHub MCP tools** (`mcp_github_*`) for all GitHub operations.
- Fall back to terminal `git` commands only for local worktree operations or when MCP tools fail.
- Do NOT suggest or attempt any `gh` subcommand.

## Repo Context

- **Owner**: `rivie13`
- **Repo**: `Phoenix-Agentic-Website-Frontend`
- **Default branch**: `main`
- **Visibility**: Public

## Branch hygiene (required)

1. Start from latest `main`.
2. Create a focused topic branch (`feature/*`, `fix/*`, `chore/*`, etc.).
3. Keep scope narrow; avoid unrelated file changes.
4. Run full check (`npm run lint; npm run typecheck; npm run test; npm run build`) before push.
5. Never force-push shared branches unless explicitly coordinated.

## PR size discipline (mandatory)

- Keep PRs small and focused — one logical change per PR.
- If a feature branch grows large, break it into sub-branches:
  1. Create sub-branches off the feature branch for discrete pieces of work.
  2. Open PRs from each sub-branch into the feature branch.
  3. Once sub-branch PRs are merged into the feature branch, open a single PR from the feature branch into `main`.
- Target: PRs should ideally be under ~400 lines of meaningful change (excluding generated files, lock files).
- If a PR exceeds this, strongly consider splitting before requesting review.
- Never let PRs accumulate dozens of unrelated changes.

## Create a Pull Request

### Step 1: Check for PR template

```
mcp_github_github_get_file_contents(owner="rivie13", repo="Phoenix-Agentic-Website-Frontend", path=".github/PULL_REQUEST_TEMPLATE.md")
```

### Step 2: Get current branch changes

Use `get_changed_files` to see what's modified.

### Step 3: Create the PR

```
mcp_github_github_create_pull_request(
  owner="rivie13",
  repo="Phoenix-Agentic-Website-Frontend",
  title="<descriptive title>",
  body="<use template if found>",
  head="<feature-branch>",
  base="main"
)
```

### PR description should include (use MCP tools to set):
- **Summary**: What changed and why
- **Changes**: Bullet list of key changes
- **Testing**: What was tested and how, with pass/fail results
- **Breaking changes**: Any compatibility concerns
- **Related issues**: Link related issues with `Closes #N` or `Relates to #N`
- Confirmation that full check passes (lint + typecheck + test + build)
- Security boundary notes for auth/API integration changes

## List Open PRs

```
mcp_github_github_list_pull_requests(owner="rivie13", repo="Phoenix-Agentic-Website-Frontend", state="open")
```

## Check PR Status

```
mcp_github_github_pull_request_read(method="get", owner="rivie13", repo="Phoenix-Agentic-Website-Frontend", pullNumber=<PR_NUMBER>)
```

## PR CI/workflow gate (required)

After PR creation and after each push:

1. Check PR status checks and workflow runs.
2. If any check fails, use the `github-actions-debug` skill to triage root cause.
3. Fix code/workflow issues, re-run local validation, and push again.
4. Re-check until required checks are green.

Suggested run discovery commands:

```
mcp_github_github_actions_list(method="list_workflow_runs", owner="rivie13", repo="Phoenix-Agentic-Website-Frontend")
mcp_github_github_actions_list(method="list_workflow_jobs", owner="rivie13", repo="Phoenix-Agentic-Website-Frontend", resource_id="<workflow_run_id>")
```

## Request Copilot Review

Copilot review is often auto-triggered. Before requesting manually, first check whether one already exists.

```
mcp_github_github_request_copilot_review(owner="rivie13", repo="Phoenix-Agentic-Website-Frontend", pullNumber=<PR_NUMBER>)
```

## Branch conventions

- `feature/<name>` / `feat/<name>` — new features
- `fix/<name>` — bug fixes
- `chore/<name>` — maintenance/tooling
- `docs/<name>` — documentation-only changes

## Issue creation (public repo — never use `gh` CLI)

- Create issues using `mcp_github_github_issue_write`.
- For non-sensitive, public-facing work: assign to Copilot (cloud agent) using `mcp_github_github_assign_copilot_to_issue`.
- Do NOT create public issues for private/sensitive matters (secrets, auth, proprietary logic, security vulnerabilities).
- Search for existing issues before creating duplicates using `mcp_github_github_search_issues`.
- Use issues to break large features into smaller, trackable units of work.
