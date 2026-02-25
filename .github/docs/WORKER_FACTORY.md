# Worker Factory — Multi-Agent Concurrency Model

This document describes how multiple agents (Local IDE, CLI agent, Cloud agent) work concurrently across and within Phoenix repos without stepping on each other.

## Overview

The Ralph Loop (see `PROJECT_WORKFLOW.md`) is the task lifecycle. The **Worker Factory** extends it to support **parallel execution** — multiple agents working simultaneously on different tasks, even within the same repo.

> Pilot note (Website Frontend first): `.github/docs/DISPATCHER_QA_PILOT_PLAN.md` defines the dispatcher-only + QA-wait target and phased rollout. During the docs phase, this file remains a stable baseline while automation implementation changes are intentionally deferred.

**Key principles:**
1. GitHub project board is the single source of truth — no second source
2. Board-native metadata tracks dependencies and lock scope (`Depends On`, `Needed Files`, `Lock Scope`, `Lock Key`)
3. Dispatcher is event-driven first via an external webhook receiver; reconciliation polling is a required safety backstop
4. Dispatcher enforces lock checks before dispatch/claim
5. `Area` is the required primary lock signal; file overlaps are precision refinement
6. Area/file-level exclusion prevents overlap before implementation starts
7. Board metadata is authoritative across all execution modes
8. Merge queue on protected branches — GitHub enforces sequential integration as a safety net
9. The human reviews dispatch state, not every line of code — role shifts to traffic controller + spot auditor
10. One workspace-level supervisor ingests events once and routes work to five repo-specific loops
11. QA and control signals use dual queues: workspace meta queue + repo micro queues
12. Dispatcher can steer active runs when new information arrives

## Webhook-First Orchestration

Dispatch should react to board/GitHub events rather than relying on frequent polling. Based on current GitHub docs:

- Projects v2 webhook events exist at org scope (`projects_v2`, `projects_v2_item`, `projects_v2_status_update`) and are marked as preview.
- GitHub Actions workflow triggers do not currently list `projects_v2*` events; not all webhook events trigger workflows.
- Therefore, Projects v2 event intake should be handled by an external webhook receiver (for example, GitHub App/org webhook endpoint), then handed to dispatcher logic.
- Dispatch runs are idempotent and always re-validate current lock/dependency state from live board data.
- A low-frequency reconciliation poll remains required to recover from dropped/missed deliveries and unsupported trigger gaps.

## Workspace Supervisor + Repo Loop Workers

In the IDE workspace with five Phoenix repos, use a two-tier execution design:

1. **Workspace Supervisor**
  - Single webhook intake point.
  - Normalizes event payloads into dispatch arguments.
  - Routes each event to exactly one repo queue.

2. **Repo Loop Worker (x5)**
  - One long-running loop per repo.
  - Consumes only its repo queue.
  - Runs claim/lock/dependency checks, then executes local agent path.

This keeps webhook logic centralized while preserving repo isolation and parallelism.

The supervisor/control-plane may be implemented as a dedicated separate repo in the same workspace (webhook ingress, queue state, routing logic) if that simplifies operations.

### Clear scope boundaries

- Workspace scope: webhook intake, normalization, global routing, cross-repo control/QA decisions.
- Repo scope: Ralph loop execution, lock/dependency checks, local run lifecycle.
- Agent scope: execute assigned task/prompt, checkpoint, and report outputs.

## Queue Architecture (Meta + Micro)

### Workspace Meta Queue

Global control queue for supervisory events:

- cross-repo dependency updates,
- priority/policy overrides,
- cancellation/restart directives,
- QA escalations and timeout handling,
- steering messages for active runs.

### Repo Micro Queues

Per-repo execution queues for runnable work items and repo QA tasks.

- One micro queue per repo loop.
- Carries dispatch arguments and local execution metadata.
- Must not consume raw external webhook payloads directly.

### QA dual-queue behavior

- Repo item entering `QA Required` creates repo QA micro queue work.
- Workspace QA meta queue is the operator sequencing queue: it orders what manual QA the user performs next (one-at-a-time).
- Repo QA micro queue holds concrete waiting sessions (including multiple waiting agents in the same repo).
- Agent runs wait on repo-specific QA sessions; workspace queue only controls which manual QA item you pick next.
- Escalated or cross-repo QA conditions create/update workspace meta queue entries.
- Workspace decisions can reprioritize/steer repo QA processing.

### QA gating policy

QA should be requested selectively, not universally:

- Require QA for feature/subfeature/refactoring/bug-fix behavior changes that need human validation.
- Usually skip QA for docs-only, test-only, and non-behavioral chore changes when automated checks pass.

## Prompt-File Handoff Contract

Dispatcher handoff to local CLI agents should be prompt-file based:

- Supervisor generates a minimal prompt file from dispatch arguments (issue, repo, area, dependencies, acceptance checks, links).
- Repo loop invokes chosen local CLI (Codex CLI or Copilot CLI) with that generated prompt file.
- Prompt tells the agent to execute assigned work and checkpoint progress against board/issue/run metadata.
- Prompt files are run-scoped artifacts and should remain minimal; task specifics come from webhook/board arguments.

## Steering Active Runs

When new dispatcher information arrives after a run has started, repo loop applies one of:

- `append_context` — inject additional non-breaking context/constraints.
- `checkpoint_and_replan` — require checkpoint, then continue with updated plan.
- `stop_and_requeue` — terminate current run and start a new run from refreshed prompt arguments.

Steering commands must include reason, source event ID, and target run ID, and be processed idempotently.

---

## Agent Types

There are **three execution modes** for working on tasks. Each has different strengths and appropriate use cases.

| Mode | Where it runs | Branch behavior | Best for |
|------|--------------|-----------------|----------|
| **Local IDE** | VS Code, human + Copilot chat | Works on existing worktree checkout | Complex work, architecture, debugging, multi-file refactors |
| **CLI Agent** | `copilot-cli` invoked locally | Creates its own worktree/branch from a clean base | Well-scoped tasks needing local context (file system, services) |
| **Cloud Agent** | GitHub Copilot coding agent (remote) | Creates its own branch on GitHub | Self-contained tasks with clear acceptance criteria |

### When to use which

| Scenario | Mode | Why |
|----------|------|-----|
| Architecture decisions, multi-repo coordination | Local IDE | Needs human judgment and cross-repo visibility |
| Debugging with running services | Local IDE | Needs local state, breakpoints, logs |
| Bug fix with clear reproduction steps | Cloud Agent | Self-contained, agent can work autonomously |
| Adding tests for existing code | Cloud Agent or CLI | Clear scope, low conflict risk |
| Documentation updates | Cloud Agent | No conflict risk, clear acceptance criteria |
| Feature implementation touching few files | CLI Agent | Can run locally in parallel while you work on something else |
| Code formatting, linting, hygiene | Cloud Agent | Trivial scope, agent excels at these |
| Task in an area you're NOT actively touching | CLI or Cloud | No overlap with your local work |

### CLI Agent — clean worktree requirement

When invoking a CLI agent locally, it creates a new worktree from the specified branch. **The base branch must be clean** (all changes committed and pushed). If you have uncommitted changes on the base branch, the CLI agent worktree will be in a dirty/inconsistent state.

**Before invoking CLI agent:**
1. Commit or stash all local changes on the base branch
2. Push the base branch to origin
3. Then invoke the CLI agent, which creates its own worktree + branch

---

## Board-Native Coordination (Primary)

Concurrency decisions should be made from board metadata, not local files.

### Required board/spec fields

Each runnable issue should carry:

- `Depends On`
- `Area`
- `Needed Files`
- `Lock Scope` (`area` or `files`)
- `Lock Key`
- `Claim Owner`
- `Lease Expires`
- `Last Heartbeat`

### Pre-dispatch gate

Before an agent starts work:

1. Verify all `Depends On` items are complete.
2. Verify `Area` exists (required for dispatch eligibility).
3. Compute requested lock key(s) from `Area`, then refine with `Needed Files` when present.
4. Check active board items for intersecting lock keys.
5. If conflict exists: do not dispatch; keep queued and report conflict reason.
6. If clear: claim and write lock/lease fields.

### Why this is preferred

- Works for Local IDE, CLI, and Cloud uniformly.
- Avoids hidden local-state coordination gaps.
- Makes conflict state visible to all agents on the board.

## Local Run Notes (Optional, Non-Authoritative)

Local notes may still be useful for personal scratch context, but they are not coordination state.

- Do not use local notes for ownership, lock, dependency, or QA status.
- Keep coordination state on board/issue/run metadata only.
- If local notes diverge from board state, board state wins.

---

## Area-Level Concurrency Control

### What is an area?

An area is a coarse-grained partition of the codebase. Each repo defines its own areas based on directory structure. Only one active task may touch a given area at a time.

### Area definitions by repo

#### Phoenix-Agentic-Engine
| Area | Directories | Notes |
|------|-------------|-------|
| `module/assistant-ui` | `modules/ultimate_ai/assistant/` | Chat panel, UI components |
| `module/mcp` | `modules/ultimate_ai/mcp/` | MCP client, adapters |
| `module/agent` | `modules/ultimate_ai/agent/` | Agent orchestration |
| `module/addons` | `modules/ultimate_ai/addons/` | Plugin integrations |
| `core` | `core/`, `scene/`, `editor/`, `main/` | Engine core (high conflict risk) |
| `docs` | `doc/`, `phoenix_docs_*` | Documentation (low conflict risk) |
| `ci` | `.github/workflows/`, `.github/` | CI/CD and tooling |

#### Phoenix-Agentic-Engine-Backend
| Area | Directories | Notes |
|------|-------------|-------|
| `gateway` | `gateway/` | .NET Gateway API |
| `worker` | `worker/` | Python worker runtime |
| `orchestrator` | `orchestrator/` | Agent orchestration layer |
| `contracts` | `contracts/` | API contracts/schemas |
| `infra` | `infra/` | Infrastructure-as-code |
| `docs` | `docs/`, `backend_docs/` | Documentation |
| `ci` | `.github/workflows/`, `scripts/` | CI/CD and tooling |

#### Phoenix-Agentic-Engine-Interface
| Area | Directories | Notes |
|------|-------------|-------|
| `sdk/client` | `sdk/client/` | Client SDK modules |
| `sdk/core` | `sdk/` (root-level exports) | Core SDK types/index |
| `contracts` | `contracts/` | Contract schemas |
| `tests` | `tests/` | Test suite |
| `docs` | `docs/` | Documentation |
| `ci` | `.github/workflows/`, `scripts/` | CI/CD and tooling |

#### Phoenix-Agentic-Website-Frontend
| Area | Directories | Notes |
|------|-------------|-------|
| `app/pages` | `src/app/` | Next.js pages/routes |
| `components` | `src/components/` | React components |
| `content` | `content/` | Blog/CMS content |
| `public` | `public/` | Static assets |
| `docs` | `docs/` | Documentation |
| `ci` | `.github/workflows/` | CI/CD |

#### Phoenix-Agentic-Website-Backend
| Area | Directories | Notes |
|------|-------------|-------|
| `api` | `src/Phoenix.Agentic.Website.Backend.Api/` | API project |
| `domain` | `src/Phoenix.Agentic.Website.Backend.Domain/` | Domain models |
| `infra` | `src/Phoenix.Agentic.Website.Backend.Infrastructure/` | Data/infra layer |
| `tests` | `tests/` | Test projects |
| `docs` | `docs/` | Documentation |
| `ci` | `.github/workflows/`, `scripts/` | CI/CD |

### Exclusion rules

1. **One active lock per key** — if an active item holds `Lock Key=X`, no other active item may hold a conflicting lock key
2. **Cross-area parallelism is allowed** — issue #42 (gateway) and issue #57 (worker) can run concurrently
3. **`docs` and `ci` areas are low-risk** — multiple tasks can touch these if they edit different files, but agents should still check
4. **Cross-repo parallelism is unlimited** — tasks in different repos never conflict at the file level
5. **File lock overlap is a hard conflict** — if `Needed Files` intersect, the later item waits
6. **Missing `Area` means not runnable** — issue returns to triage/spec completion

### How agents check for conflicts

**On startup (before writing code):**

1. Read board metadata for active items (status + lock fields)
2. Compare your intended `Needed Files`/`Area` against active lock keys
3. Check `Depends On` completion state
4. If overlap exists:
   - **STOP** — do not proceed
  - Report: "Lock conflict: Issue #{N} currently holds overlapping lock key(s)."
   - Options: wait for that task to complete, re-scope to avoid the area, or escalate to the human
5. If no overlap: proceed and acquire lock via claim/update flow

Use board/issue/run metadata as the only coordination source.

---

## The Human's Role — Traffic Controller

In the worker factory model, the human's role changes from "code reviewer for every PR" to **traffic controller and spot auditor**.

### What the human does

| Activity | Frequency | Purpose |
|----------|-----------|---------|
| Triage issues, set priority/size on project board | Daily | Keeps the queue healthy |
| Decide agent type (local/CLI/cloud) for each task | Per task | Match task complexity to agent capability |
| Review dispatch state (board locks, leases, dependencies) | A few times per day | Ensure no conflicts, no stale locks |
| Spot-audit PRs — read diffs for high-risk changes | As needed | Trust but verify |
| Resolve area conflicts when agents report them | As needed | Break ties, re-scope work |
| Merge queue management | As needed | Ensure PRs merge in safe order |

### What the human does NOT need to do

- Read every line of every PR (Copilot review handles routine checks)
- Manually create branches (agents do this)
- Manually create PRs (agents do this via MCP tools)
- Manually close issues (agents do this via MCP tools)
- Manually maintain local coordination notes for cloud/CLI agents (board metadata is authoritative)

### Tiered review policy

| Risk level | Review requirement | Auto-merge? |
|------------|-------------------|-------------|
| Low (docs, tests, content, chore) | Copilot review only | Yes, if CI passes |
| Medium (feature work in isolated area) | Copilot review + human spot-check | No — human clicks merge |
| High (core changes, cross-area, architecture) | Full human review | No — human reads the diff |

Risk level is determined by the area and task type. `docs` and `ci` areas are low risk. `core` area in Engine is always high risk. Everything else is medium.

---

## Branch and PR Hygiene — Agent Responsibilities

Agents MUST handle their own branch and PR lifecycle. The human should not have to manually create branches, open PRs, or close issues. This is the #1 operational hygiene rule.

### What every agent MUST do (any mode)

1. **Branch from the correct base** — subfeature branches from `feature/*`, not `main`
2. **Create the branch before starting work** — use `git checkout -b subfeature/task/desc` or MCP tools
3. **Commit frequently** — atomic commits with conventional message style (`feat:`, `fix:`, `chore:`, etc.)
4. **Push to origin** — do not leave work only on local branches
5. **Open a PR** when work is complete — use MCP tools (`mcp_github_github_create_pull_request`)
6. **Fill in PR description** — summary, changes, testing, related issues
7. **Request Copilot review** if not auto-triggered
8. **Close the issue explicitly** after PR merge — use `mcp_github_github_issue_write`
9. **Release lock metadata** (`Lock Key`, lease/heartbeat fields) after completion
10. **Delete the branch** after merge (GitHub can auto-delete, but verify)

### What agents should NOT wait for the human to do

- Creating the branch (agent creates it)
- Opening the PR (agent opens it via MCP)
- Writing the PR description (agent writes it)
- Closing the issue (agent closes it via MCP)
- Managing lock state manually (agent/dispatcher manages lock fields)

The human's only required action is **merging** (for medium/high risk) and **resolving conflicts** if they arise.

---

## Putting It All Together — End-to-End Flow

### Scenario: Three agents working in parallel on Backend (board-native locks)

```
Human (local IDE):     Working on #42 — gateway/auth refactor     Area: gateway
CLI agent (worktree):  Working on #57 — worker telemetry logging   Area: worker
Cloud agent (remote):  Working on #63 — add contract test fixtures Area: contracts
```

**Step 1 — Human starts #42 locally:**
- Claims issue #42 with `Area=gateway` and lock metadata on the board
- Works in VS Code as usual

**Step 2 — Human dispatches #57 to CLI:**
- Commits and pushes current gateway work (clean base!)
- Invokes CLI agent for issue #57
- Dispatcher acquires lock for `Area=worker` / `Lock Key=worker`
- CLI agent creates worktree, branch `subfeature/task/worker-telemetry`
- CLI agent works independently

**Step 3 — Human dispatches #63 to cloud:**
- Adds `cloud-agent` label to issue #63
- Dispatcher acquires lock for `Area=contracts` / `Lock Key=contracts`
- Cloud agent works on its own branch, opens PR when done

**Step 4 — Agents check for conflicts:**
- CLI dispatch checks board locks (`gateway` held, `worker` clear) → proceeds
- Cloud dispatch checks board locks (`gateway` + `worker` held, `contracts` clear) → proceeds

**Step 5 — PRs arrive:**
- #57 PR lands first → Copilot review passes → CI passes → human merges (medium risk) → release `worker` lock
- #63 PR lands second → Copilot review passes → CI passes → human merges → release `contracts` lock
- #42 finishes last → human opens PR → review → merge → release `gateway` lock

All three tasks completed concurrently, no conflicts.

---

## FAQ

**Q: What if an agent needs files outside its declared area?**
A: Update board metadata (`Needed Files`/`Lock Scope`/`Lock Key`) before proceeding. If expanded scope overlaps an active lock, stop and re-queue.

**Q: What if two PRs modify the same file but in different areas?**
A: This shouldn't happen if areas are defined correctly. If it does, the merge queue catches it — the second PR must rebase and pass CI.

**Q: Can I have two local IDE tasks at once?**
A: Not recommended for one person. Keep one local IDE task active and use CLI/cloud agents for additional parallel tasks, all coordinated via board locks.

**Q: Where does coordination state live?**
A: Coordination state lives on board/issue/run metadata for all execution modes, including cloud agents.
