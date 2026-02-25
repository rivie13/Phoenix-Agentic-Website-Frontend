# Git hygiene and GitHub MCP workflow — Phoenix Agentic Website Frontend

## Scope

This file defines branch, commit, validation, and pull request hygiene for the Website Frontend repo.
Use it whenever making code changes, preparing pull requests, or handling review feedback.

## CLI tool policy (mandatory)

- **Prefer GitHub MCP tools** (`mcp_github_*`) for structured GitHub operations (PRs, issues, reviews, actions, branches, searches, etc.).
- **`gh` CLI is allowed and supported** in this environment. Use it when MCP capability is unavailable/insufficient, and for project/GraphQL-heavy operations.
- Use terminal `git` commands for local worktree operations (status, add, commit, branch, checkout, rebase, push, pull, diff, log).
- Keep tool usage explicit and reproducible in notes/comments so the same flow can be rerun.

## Branch hygiene

### Hierarchy

There are **three branch tiers**:

| Tier | Pattern | Branches from | Merges into | Purpose |
|------|---------|---------------|-------------|---------|
| **main** | `main` | — | — | Stable release line |
| **feature** | `feature/<topic>` or `feat/<topic>` | `main` | `main` | Large, multi-PR deliverable |
| **subfeature** | `subfeature/<type>/<description>` | parent `feature/*` | parent `feature/*` | Focused piece of work within a feature |

### Feature branches (`feature/*`)

- Branch from `main` for new top-level work.
- Merged into `main` **only when the entire feature is complete and validated**.
- The final `feature → main` PR will be large — that is expected and acceptable.
- Keep one focused feature per branch.

### Subfeature branches (`subfeature/*`)

Subfeature branches are the primary unit of daily work. They branch off a parent `feature/*` branch and merge back into it via small, focused PRs.

**Naming convention** — always three segments:

```
subfeature/<type>/<short-description>
```

Where `<type>` is one of:

| Type | Use for |
|------|---------|
| `task` | Planned implementation work |
| `bugfix` | Bug discovered during feature development |
| `refactor` | Structural improvement within the feature |
| `test` | Adding/improving tests for the feature |
| `docs` | Documentation specific to the feature |
| `chore` | Non-functional maintenance (deps, config, formatting) |

**Examples:**
- `subfeature/task/add-blog-generation-pipeline`
- `subfeature/bugfix/fix-newsletter-signup-validation`
- `subfeature/refactor/extract-hero-section`
- `subfeature/test/add-blog-component-tests`

### Top-level branches (non-feature work)

For small, standalone changes that do not belong to a larger feature:
- `fix/<short-topic>` — standalone bug fixes (branches from and merges to `main`)
- `chore/<short-topic>` — non-functional maintenance
- `docs/<short-topic>` — documentation-only changes

### Rules

- Avoid direct commits to `main` or shared `feature/*` branches.
- Rebase/sync regularly with the parent branch to reduce merge drift.
- **Subfeature branches MUST target their parent `feature/*` branch** — never `main` directly.
- Delete subfeature branches after merge into the feature branch.

## Commit hygiene

- Run validations before commit:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test`
- Keep commits atomic and reviewable.
- Commit message style (recommended):
  - `feat: ...`
  - `fix: ...`
  - `chore: ...`
  - `test: ...`
  - `docs: ...`
- Do not include unrelated file changes in the same commit.

## Pull request hygiene

- **Prefer GitHub MCP tools** for PR operations; `gh` CLI is an acceptable fallback when MCP is unavailable.
- Before creating PR:
  - Ensure branch is up to date with `main`
  - Ensure lint/typecheck/tests pass
  - Confirm scope is limited to one logical change
- After creating/updating PR:
  - Check GitHub Actions/workflow run status for the PR
  - If any workflow/job fails, fetch logs and fix the root cause
  - Re-run validations locally and re-trigger/recheck workflow runs
  - Do not mark PR ready while required checks are failing
- PR description should include (use MCP tools to set):
  - **Summary**: What changed and why
  - **Changes**: Bullet list of key changes
  - **Testing**: Validation commands and outcomes
  - **Breaking changes**: Any compatibility concerns
  - **Related issues**: Link related issues with `Closes #N` or `Relates to #N`
  - Security boundary notes (especially for auth/API integration changes)
- Treat Copilot review as auto-requested by default when available.
- Only request Copilot review manually when no Copilot review exists for the latest commit set on the PR.

## Review hygiene (Copilot + humans)

- Fetch and address unresolved review comments.
- For each comment:
  1. Reproduce/understand issue
  2. Apply focused fix
  3. Re-run relevant validations
  4. Respond with what changed and why
- Re-request review when follow-up changes are done.

## GitHub MCP tool preference

**Prefer MCP tools first**, with `gh` CLI as fallback. Prefer MCP tools for:
- Creating and updating PRs
- Listing PRs/reviews/comments
- Checking whether Copilot review already exists
- Requesting Copilot review only when missing for latest commits
- Reading and responding to review feedback
- Listing workflow runs/jobs and reviewing failed logs
- Creating and managing issues
- Searching for existing issues

Use `gh` when needed for project/GraphQL operations, and terminal `git` for local worktree tasks (status, branch, add/commit, rebase, tests).

## PR size discipline (mandatory)

- Keep PRs small and focused — one logical change per PR.
- **Subfeature → feature PRs** should be the normal unit of review. Each should cover one discrete piece of work.
- **Feature → main PRs** will be large (accumulating all merged subfeature work). This is expected. The feature-level PR serves as the final integration gate and should summarize all subfeature PRs that were merged.
- Break work into subfeature branches early. Do not wait until a feature branch is bloated to split.
  1. Create `subfeature/<type>/<description>` branches off the parent `feature/*` branch.
  2. Open PRs from each subfeature branch into the `feature/*` branch.
  3. Once all subfeature PRs are merged and the feature is complete, open a single PR from `feature/*` into `main`.
- Target: subfeature PRs should ideally be under ~400 lines of meaningful change (excluding generated files, lock files).
- If a subfeature PR exceeds this, strongly consider splitting into further subfeature branches.
- Never let PRs accumulate dozens of unrelated changes.

## Issue creation and Copilot assignment (public repo)

- Prefer creating GitHub issues with `mcp_github_github_issue_write`; `gh issue create` is acceptable if MCP is unavailable.
- Use issues to break large features into smaller, trackable units of work.
- For public-facing, non-sensitive issues: assign to Copilot (cloud agent) when appropriate using `mcp_github_github_assign_copilot_to_issue`.
- Do NOT create public issues or assign to Copilot for work involving private/sensitive matters (secrets, auth internals, proprietary logic, infrastructure details, security vulnerabilities).
- Search for existing issues before creating duplicates using `mcp_github_github_search_issues`.

### Issue–branch alignment (mandatory)

Issues must mirror the branch hierarchy so that work is traceable:

| Issue type | Label | Maps to branch | Description |
|------------|-------|----------------|-------------|
| **Epic** | `epic` | `feature/<topic>` | Multi-PR deliverable; the parent issue for all subfeature work |
| **Task** | `task` | `subfeature/task/<desc>` | Planned implementation work within the feature |
| **Bug** | `bug` | `subfeature/bugfix/<desc>` | Bug found during feature development |
| **Refactor** | `refactor` | `subfeature/refactor/<desc>` | Structural cleanup within the feature |
| **Test** | `test` | `subfeature/test/<desc>` | Test coverage for the feature |
| **Docs** | `docs` | `subfeature/docs/<desc>` | Documentation for the feature |
| **Chore** | `chore` | `subfeature/chore/<desc>` | Non-functional maintenance |

- **Epic issues** should be created for each `feature/*` branch. They act as the parent tracker.
- **Sub-issues** should be created for each `subfeature/*` branch using `mcp_github_github_sub_issue_write`. Each sub-issue links to its parent epic.
- When creating a subfeature PR, reference its sub-issue with `Closes #N`.
- When merging the final `feature → main` PR, reference the parent epic with `Closes #N`.
- This creates a clear audit trail: epic → sub-issues → subfeature PRs → feature PR → main.

## Project board field management (mandatory)

The project board (rivie13/projects/3) has **separate fields** that are NOT labels:

| Field | Type | Values |
|-------|------|--------|
| **Priority** | Single select | P0 (Critical), P1 (High), P2 (Medium), P3 (Low) |
| **Size** | Single select | XS, S, M, L, XL |
| **Work mode** | Single select | Cloud Agent, Local IDE |
| **Status** | Single select | Backlog, Ready, In Progress, In Review, Done |
| **Labels** | GitHub labels | `task`, `epic`, `feature`, `cloud-agent`, etc. |

### Labels vs project fields — never confuse them

- **Labels** are GitHub issue metadata (e.g., `task`, `cloud-agent`). They categorize the issue type and trigger workflows.
- **Project fields** (Priority, Size, Work mode, Status) are GitHub Projects V2 properties. They live on the project board, NOT on the issue.
- **NEVER create labels named after project field values** (e.g., `p0: critical`, `size: m`, `local-ide`). This was a past mistake.

### Setting project field values via signal labels

MCP tools cannot set project board fields directly. Use **signal labels** as a bridge:

1. Add transient signal labels to the issue alongside its real labels:
   ```
   mcp_github_github_issue_write(method="update", ..., labels=["task", "set:priority:p1", "set:size:m", "set:workmode:local-ide"])
   ```
2. The `sync-project-fields.yml` workflow triggers, sets the corresponding project field via GraphQL, and removes the signal label.
3. The issue ends up with only its real labels (`task`) and the correct project field values.

**Signal label format:** `set:<field>:<value>`

| Signal label | Sets field | To value |
|---|---|---|
| `set:priority:p0` | Priority | P0 |
| `set:priority:p1` | Priority | P1 |
| `set:priority:p2` | Priority | P2 |
| `set:priority:p3` | Priority | P3 |
| `set:size:xs` | Size | XS |
| `set:size:s` | Size | S |
| `set:size:m` | Size | M |
| `set:size:l` | Size | L |
| `set:workmode:cloud-agent` | Work mode | Cloud Agent |
| `set:workmode:local-ide` | Work mode | Local IDE |
| `set:workmode:cli-agent` | Work mode | CLI Agent |
| `set:status:backlog` | Status | Backlog |
| `set:status:ready` | Status | Ready |
| `set:status:in-progress` | Status | In Progress |
| `set:status:in-review` | Status | In Review |
| `set:status:done` | Status | Done |
| `set:area:<area-name>` | Area | Area value (see WORKER_FACTORY.md for valid names per repo) |

**Important:** Signal labels must exist in the repo before use. Run the `Sync Project Fields` workflow with the `create-signal-labels` dispatch action to bootstrap them.

### When to set project fields

- **Issue creation/triage:** After creating an issue, add signal labels to set Priority, Size, Work mode, and Area.
- **Status transitions:** When starting work, set `set:status:in-progress`. When done, set `set:status:done`.
- **The `cloud-agent` label** already triggers `cloud-agent-assign.yml` which sets Status → In Progress and Work mode → Cloud Agent. You do NOT need separate signal labels for those when using `cloud-agent`.
- **Area:** Always set `set:area:*` to indicate which component the issue targets (see WORKER_FACTORY.md for valid names per repo).
- **CLI-agent issues:** Add `set:workmode:cli-agent` + `set:area:*` (no separate `cloud-agent` label needed).

## Post-merge issue completion (mandatory)

After any PR is merged, **always close linked issues explicitly using MCP tools**. Do NOT rely solely on `Closes #N` in the PR body — GitHub only auto-closes issues when a PR merges into the repo's **default branch** (`main`). Subfeature PRs that merge into `feature/*` branches will NOT auto-close linked issues.

### Required steps after every PR merge:

1. **Close the linked issue:**
   ```
   mcp_github_github_issue_write(method="update", owner="rivie13", repo="Phoenix-Agentic-Website-Frontend", issueNumber=<N>, state="closed", stateReason="completed")
   ```

2. **Close completed sub-issues** — if the merged PR's issue had sub-issues, verify each one whose work is also merged is closed. Close any that remain open.

3. **Close parent epic if all children are done** — if the closed issue was a sub-issue of an epic, read the parent epic to check whether all sibling sub-issues are now closed. If so, close the epic.

4. **Move to "Done"** on the project board.

> **Rule:** A PR is not "fully done" until all linked issues are verified closed. This is as important as passing CI. Never skip this step.

## Website Frontend quality gate (required before PR readiness)

- `npm run lint` passes
- `npm run typecheck` passes
- `npm run test` passes
- `npm run build` succeeds
- PR GitHub Actions checks are green (or explicitly understood/waived)
- No API keys or secrets in client-side code
- Security boundary rules from `docs/SECURITY_BOUNDARY.md` respected

## Agent autonomy — branch, PR, and issue lifecycle

Agents (Local IDE, CLI, Cloud) MUST handle their own git workflow end-to-end. The human should NOT need to manually create branches, open PRs, write PR descriptions, or close issues.

### What every agent MUST do

1. **Create the branch** before starting work — `git checkout -b subfeature/task/<desc>` from the correct base
2. **Commit frequently** with conventional messages (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`)
3. **Push to origin** — do not leave work only on local branches
4. **Open a PR** when work is complete — use `mcp_github_github_create_pull_request`
5. **Fill in the PR description** — summary, changes, testing done, related issues
6. **Request Copilot review** if not auto-triggered
7. **Close the issue explicitly** after PR merge — use `mcp_github_github_issue_write` (do not rely on `Closes #N` for non-default-branch merges)
8. **Delete the branch** after merge if GitHub auto-delete is not configured

### What the human does NOT need to do

- Create branches (agent creates them)
- Open PRs (agent opens via MCP)
- Write PR descriptions (agent writes them)
- Close issues (agent closes via MCP)
- Move board cards (agent uses signal labels)

The human's only required actions are **merging** (for medium/high risk PRs) and **resolving merge conflicts**.

See `.github/docs/WORKER_FACTORY.md` for the full concurrency model and tiered review policy.
