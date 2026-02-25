---
name: git-hygiene
description: Enforce branch hygiene, pre-commit validation, PR setup via GitHub MCP tools, and review follow-up workflow in the Website Frontend repo.
---

# Git Hygiene — Phoenix Agentic Website Frontend

## CLI tool policy (mandatory)

- **Prefer GitHub MCP tools** (`mcp_github_*`) for structured GitHub operations.
- **`gh` CLI is allowed and supported**; use it when MCP capability is unavailable/insufficient, and for project/GraphQL-heavy operations.
- Use terminal `git` commands for local worktree operations.

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

## PR size discipline (mandatory)

- Keep PRs small and focused — one logical change per PR.
- Use the three-tier branch hierarchy to keep PRs reviewable:
  1. Create `subfeature/<type>/<description>` branches off the parent `feature/<topic>` branch for discrete pieces of work.
  2. Open PRs from each subfeature branch into the feature branch (small, reviewable).
  3. Once subfeature PRs are merged, open a single PR from the feature branch into `main` (large, expected).
- Target: Subfeature PRs should ideally be under ~400 lines of meaningful change.
- If a PR exceeds this, strongly consider splitting into additional subfeature branches before requesting review.

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

## PR workflow (prefer GitHub MCP tools; allow `gh` fallback)

Prefer GitHub MCP tools first; use `gh` CLI when MCP capability is unavailable.

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

## Issue creation (public repo — MCP preferred, `gh` fallback allowed)

- Prefer creating issues using `mcp_github_github_issue_write`; `gh issue create` is acceptable if MCP is unavailable.
- For non-sensitive, public-facing work: assign to Copilot (cloud agent) using `mcp_github_github_assign_copilot_to_issue`.
- Do NOT create public issues for private/sensitive matters.
- Search for existing issues before creating duplicates using `mcp_github_github_search_issues`.

## Issue–branch alignment

| Issue type | Label | Branch pattern | PR target |
|---|---|---|---|
| Epic | `epic` | `feature/<topic>` | `main` |
| Task | `task` | `subfeature/task/<description>` | `feature/<topic>` |
| Bug | `bug` | `subfeature/bugfix/<description>` | `feature/<topic>` |
| Refactor | `refactor` | `subfeature/refactor/<description>` | `feature/<topic>` |
| Test | `test` | `subfeature/test/<description>` | `feature/<topic>` |
| Docs | `docs` | `subfeature/docs/<description>` | `feature/<topic>` |
| Chore | `chore` | `subfeature/chore/<description>` | `feature/<topic>` |

- Epic issues map to `feature/*` branches; close the epic when the feature branch merges to `main`.
- Sub-issues map to `subfeature/<type>/<description>` branches; reference with `Closes #N` in the subfeature PR **and** close explicitly via MCP tools after merge.
- Create sub-issues via `mcp_github_github_sub_issue_write`.

## Project board field management (mandatory)

**Labels ≠ project fields.** The project board (rivie13/projects/3) has separate single-select fields (Priority, Size, Work mode, Status) that are NOT GitHub labels. Never create labels named after field values.

MCP tools cannot set project fields directly. Use **signal labels** (`set:<field>:<value>`) as a bridge:

```text
mcp_github_github_issue_write(method="update", ..., labels=["task", "set:priority:p1", "set:size:m"])
```

The `sync-project-fields.yml` workflow detects signal labels, sets the project field via GraphQL, and removes the signal label. The issue keeps only its real labels.

**Available signal labels:**

| Signal label | Sets field → value |
|---|---|
| `set:priority:p0` – `set:priority:p3` | Priority → P0–P3 |
| `set:size:xs` / `s` / `m` / `l` | Size → XS/S/M/L |
| `set:workmode:cloud-agent` / `local-ide` / `cli-agent` | Work mode → Cloud Agent / Local IDE / CLI Agent |
| `set:status:backlog` / `ready` / `in-progress` / `in-review` / `done` | Status → corresponding value |
| `set:area:<area-name>` | Area → area value (see WORKER_FACTORY.md for valid names per repo) |

**When to set fields:** On issue creation or when triaging. For `cloud-agent` labeled issues, the `cloud-agent-assign.yml` workflow already sets Work mode and Status — only add `set:priority:*`, `set:size:*`, and `set:area:*` signal labels.

## Post-merge issue completion (mandatory)

After any PR is merged, **always close linked issues explicitly**. Do NOT rely solely on `Closes #N` in the PR body — GitHub only auto-closes issues when merging into the repo's **default branch**. Subfeature PRs that merge into `feature/*` branches will NOT auto-close linked issues.

1. **Close the linked issue:**
   ```
   mcp_github_github_issue_write(method="update", owner="rivie13", repo="Phoenix-Agentic-Website-Frontend", issueNumber=<N>, state="closed", stateReason="completed")
   ```

2. **Close completed sub-issues** — if this was a parent issue with sub-issues, verify each merged sub-issue is closed.

3. **Close parent epic if all children are done** — if this was a sub-issue, check whether all sibling sub-issues are now closed. If so, close the parent epic too.

4. **Set Status → Done** on the project board using a signal label:
   ```
   mcp_github_github_issue_write(method="update", owner="rivie13", repo="Phoenix-Agentic-Website-Frontend", issueNumber=<N>, labels=["task", "set:status:done"])
   ```

> **Rule:** A PR is not "fully done" until all linked issues are verified closed.
