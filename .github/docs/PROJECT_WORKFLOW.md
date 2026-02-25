# Phoenix Project Workflow

This document describes the task management system used across all Phoenix repos.

## Overview

All Phoenix repos share a unified project board and task lifecycle called the **Ralph Loop** — a conditional iteration loop where each cycle confirms the assigned task, works it, completes it, and then awaits the next assignment. The loop includes a branch point for **local (IDE) vs. cloud agent** execution.

When running locally in the multi-repo IDE workspace, loop execution is coordinated by a workspace-level supervisor that receives webhook events once and routes them to repo-specific loops.

> Pilot note (Website Frontend first): See `.github/docs/DISPATCHER_QA_PILOT_PLAN.md` for the dispatcher-only + QA-wait target model and phased rollout. In the current phase, docs/policy are updated first; workflow implementation changes are deferred until explicitly approved.

**Repos in this system:**
| Repo | Visibility | Description |
|------|-----------|-------------|
| `Phoenix-Agentic-Engine` | Public | Godot fork — the game engine |
| `Phoenix-Agentic-Engine-Backend` | Private | .NET Gateway + Python worker runtime |
| `Phoenix-Agentic-Engine-Interface` | Public | TypeScript SDK — contracts between Engine and Backend |
| `Phoenix-Agentic-Website-Frontend` | Public | Next.js public website |
| `Phoenix-Agentic-Website-Backend` | Private | .NET API for website services |

---

## The Ralph Loop

The Ralph Loop is the core task lifecycle. It is a **conditional iteration loop** — not a simple cycle, but a loop with a decision point that determines *how* each task is executed.

The loop supports **three execution modes** (Local IDE, CLI Agent, Cloud Agent) that can run in parallel. See `.github/docs/WORKER_FACTORY.md` for the full concurrency model.

```
┌───────────────────────────────────────────────────────────────┐
│                        RALPH LOOP                             │
│                                                               │
│  ┌─────────────┐                                              │
│  │  PICK TASK   │ ◄───────────────────────────────────────┐   │
│  │  from board  │                                         │   │
│  └──────┬───────┘                                         │   │
│         │                                                 │   │
│         ▼                                                 │   │
│  ┌──────────────────────────┐                              │   │
│  │     DECISION POINT       │                              │   │
│  │  Local / CLI / Cloud?    │                              │   │
│  └───┬─────────┬────────┬───┘                              │   │
│      │         │        │                                  │   │
│  Local IDE  CLI Agent  Cloud Agent                         │   │
│      │         │        │                                  │   │
│      ▼         ▼        ▼                                  │   │
│  ┌────────┐ ┌────────┐ ┌──────────────┐                    │   │
│  │  WORK  │ │  WORK  │ │ Copilot CCA  │                    │   │
│  │  in VS │ │ local  │ │ works async  │                    │   │
│  │  Code  │ │ wktree │ │ opens PR     │                    │   │
│  └───┬────┘ └───┬────┘ └──────┬───────┘                    │   │
│      │          │             │                            │   │
│      ▼          ▼             ▼                            │   │
│  ┌──────────────────────────────────┐                      │   │
│  │        REVIEW + MERGE            │                      │   │
│  │        (In Review → Done)        │                      │   │
│  └──────────────┬───────────────────┘                      │   │
│                 │                                          │   │
│                 ▼                                          │   │
│  ┌──────────────────────────────────┐                      │   │
│  │ COMPLETE TASK + pick next ───────┼──────────────────────┘   │
│  └──────────────────────────────────┘                          │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Loop Phases

#### 1. CONFIRM ASSIGNMENT — Validate what was assigned
- Confirm assigned issue/task from execution context (dispatcher prompt, local user instruction, or cloud assignment)
- Consume webhook/event updates first (issue/project/label/PR transitions), sourced from dispatcher event intake
- Workspace supervisor routes each event to the correct repo loop queue
- Workspace meta queue may inject control decisions before repo queue consumption
- Validate assignment against board state and active lock ownership
- Confirm lock/dependency eligibility (`Area`, `Depends On`, `Lock Scope`, `Lock Key`, `Needed Files`)
- If assignment is missing/ambiguous, request clarification before proceeding

#### 2. DECIDE — Local IDE, CLI Agent, or Cloud Agent?
- **Local IDE**: Complex work requiring human judgment, multi-file refactors, architecture decisions, debugging
- **CLI Agent**: Well-scoped tasks that benefit from local context (file system, running services) but can run in parallel with your IDE work. Invoked via `copilot-cli`. Requires a clean (committed + pushed) base branch.
- **Cloud Agent**: Self-contained tasks with clear acceptance criteria that need no local context — bug fixes, test additions, doc updates, simple features
- **Lock/dependency preflight**: Before dispatch, check `Depends On` and lock overlap (`Area` + `Needed Files` + `Lock Scope` + `Lock Key`) on the board
- On the project board, set the **Work mode** field to "Local (IDE)" or "Cloud Agent" (CLI uses Local IDE)
- If Cloud Agent: add the `cloud-agent` label to the issue → automation assigns Copilot
- **Area check**: `Area` is required. If missing, do not dispatch; return to triage/spec completion.

#### 3. WORK — Execute the task
- **Local path**: You study assigned issue context, work in VS Code with agent support, and save checkpoints to issue/board/run metadata
- **CLI path**: Repo loop generates a minimal prompt file from dispatch arguments, invokes Codex CLI or Copilot CLI with that prompt, and the agent creates its worktree + branch, works independently, and opens a PR
- **Cloud path**: Copilot coding agent works autonomously, opens a PR, you review when done
- **Steering path**: if dispatcher receives new information mid-run, repo loop applies steering (`append_context`, `checkpoint_and_replan`, or `stop_and_requeue`) for the active run
- **Tangent handling**: If a bug or side task comes up during Local work, keep the main assignment anchored to board state and run metadata while handling the tangent
- **Concurrency**: Multiple agents can work in the same repo if they touch different areas. See `WORKER_FACTORY.md` for conflict rules.

#### 4. REVIEW — Validate and merge
- PR is opened → board item moves to **In Review**
- Code review (human or Copilot review)
- Merge when approved

#### 5. RESET — Complete, close issues, and loop
- **Close the GitHub issue explicitly** using `mcp_github_github_issue_write` (state: `closed`, stateReason: `completed`)
  - Do NOT rely solely on `Closes #N` in the PR body — GitHub only auto-closes issues when merging into the default branch. Subfeature PRs merging into `feature/*` branches will NOT auto-close linked issues.
- **Close completed sub-issues** — verify each sub-issue whose work was merged is closed. Close any that remain open.
- **Close parent epic if all children are done** — if the completed task was a sub-issue, check the parent epic. If all siblings are closed, close the epic too.
- **Release lock metadata** — clear or expire lock fields (`Lock Key`, lease/heartbeat values) when work is completed/terminated
- Board item moves to **Done**
- The `focus` skill confirms the next assignment context
- Loop restarts

### Board lock/dependency gate (required)

Treat merge queue as the final guardrail, not the first conflict detector. Before dispatching any item to Local/CLI/Cloud:

1. Confirm `Depends On` prerequisites are completed.
2. Ensure issue contains `Area`, `Lock Scope`, and (when available) `Needed Files`.
3. Compute/assign `Lock Key`.
4. Check active items for overlapping lock keys.
5. If conflict exists, do not dispatch; re-queue or mark blocked with reason.

### Trigger strategy (required)

- Primary: webhook/event-driven dispatch triggers via external receiver.
- Topology: one workspace supervisor for intake/routing, five repo loops for execution.
- Queues: one workspace meta queue (global control) plus five repo micro queues (execution).
- Constraint: Projects v2 webhooks exist, but `projects_v2*` are not listed as direct Actions workflow triggers; not all webhooks trigger workflows.
- Secondary: low-frequency reconciliation polling to recover from missed deliveries and unsupported trigger classes.
- Safety: all event handlers must be idempotent and re-check board state at claim time.

### QA queue model (required)

- Repo QA micro queue: concrete QA items for repo tasks in `QA Required`.
- Workspace QA meta queue: operator sequencing queue for manual QA order (one-at-a-time), plus escalations/cross-repo dependencies/timeout control.
- Workspace decisions may reprioritize or steer repo QA processing.
- Active agent runs remain blocked on repo-specific QA wait sessions until your verdict is submitted.

### QA requirement policy (required)

- QA is required for any task with medium or high risk of user-facing impact, including new features/subfeatures, bug fixes, and refactors that could/do affect behavior.
- QA is usually not required for docs-only or test-only changes, and for non-behavioral chore/refactor work with passing automated validation.

> **CRITICAL:** Never skip issue closing. A task is not complete until its GitHub issue is verified closed.

---

## Issue Hierarchy — Epics, Features, Tasks

Use GitHub's **sub-issues** feature to structure work in a hierarchy. This creates traceability from high-level goals down to individual PRs.

### Three-Level Hierarchy with Branch Mapping

```
Epic (high-level goal, spans multiple repos)
│   Branch: feature/<topic>  →  PR targets main
├── Feature (deliverable, usually one repo)
│   ├── Task  →  subfeature/task/<desc>      →  PR targets feature/<topic>
│   ├── Bug   →  subfeature/bugfix/<desc>     →  PR targets feature/<topic>
│   └── Chore →  subfeature/chore/<desc>      →  PR targets feature/<topic>
├── Feature (another repo)
│   ├── Task  →  subfeature/task/<desc>       →  PR targets feature/<topic>
│   └── Test  →  subfeature/test/<desc>       →  PR targets feature/<topic>
└── Feature
    └── Docs  →  subfeature/docs/<desc>       →  PR targets feature/<topic>
```

### Level Definitions

| Level | Scope | Lifetime | Label | Branch pattern | Example |
|-------|-------|----------|-------|----------------|---------|
| **Epic** | Multi-repo milestone | Weeks–months | `epic` | `feature/<topic>` → PR to `main` | "Phase 2: Public website v1 launch" |
| **Feature** | Single repo deliverable | Days–weeks | `feature` | (same as parent epic branch) | "Blog system with automated posts" |
| **Task** | Single PR unit of work | Hours–days | `task` | `subfeature/task/<desc>` → PR to `feature/*` | "Add RSS feed generation" |
| **Bug** | Bug fix within a feature | Hours–days | `bug` | `subfeature/bugfix/<desc>` → PR to `feature/*` | "Fix blog post date rendering" |
| **Refactor** | Code restructuring | Hours–days | `refactor` | `subfeature/refactor/<desc>` → PR to `feature/*` | "Extract blog components" |
| **Test** | Test additions/fixes | Hours–days | `test` | `subfeature/test/<desc>` → PR to `feature/*` | "Add blog integration tests" |
| **Docs** | Documentation | Hours–days | `docs` | `subfeature/docs/<desc>` → PR to `feature/*` | "Document blog system" |
| **Chore** | Maintenance/tooling | Hours–days | `chore` | `subfeature/chore/<desc>` → PR to `feature/*` | "Update ESLint config" |

### How to Create the Hierarchy

1. **Create the Epic issue** in the primary repo (usually where most work happens)
   - Title: `[Epic] Phase 2: Public website v1 launch`
   - Label: `epic`
   - Add to project board

2. **Create Feature issues** as sub-issues of the Epic
   - In the Epic issue, click **"Add sub-issue"**
   - Sub-issues can be in **different repos** — a Frontend Epic can have Backend sub-issues
   - Label: `feature`

3. **Create Task issues** as sub-issues of Features
   - In the Feature issue, click **"Add sub-issue"**
   - Label: `task`
   - These map 1:1 to PRs

### Cross-Repo Sub-Issues

Sub-issues work across repos. Example structure for website work:

```
Epic #10 in Phoenix-Agentic-Website-Frontend:
  "[Epic] Phase 2: Public website v1 launch"
  ├── Feature #11 (Frontend): "Blog system"
  │   ├── Task #12 (Frontend): "Blog post page component"
  │   └── Task #13 (Frontend): "RSS feed generation"
  ├── Feature #5 (Backend): "Blog API endpoints"
  │   └── Task #6 (Backend): "POST /api/blog/publish"
  └── Feature #20 (Backend): "Newsletter integration"
      └── Task #21 (Backend): "Mailchimp webhook handler"
```

The project board shows all of these regardless of which repo they live in.

### Labels to Use

Create these labels in each repo:
- `epic` — Multi-repo milestone → maps to `feature/<topic>` branch
- `feature` — Repo-level deliverable (sub-issue of epic)
- `task` — PR-level unit of work → maps to `subfeature/task/<desc>` branch
- `bug` — Bug fix → maps to `subfeature/bugfix/<desc>` branch
- `refactor` — Code restructuring → maps to `subfeature/refactor/<desc>` branch
- `test` — Test additions/fixes → maps to `subfeature/test/<desc>` branch
- `docs` — Documentation → maps to `subfeature/docs/<desc>` branch
- `chore` — Maintenance/tooling → maps to `subfeature/chore/<desc>` branch
- `cloud-agent` — Assign to Copilot coding agent
- `blocked` — Cannot proceed (note reason in issue)

---

## Cloud Agent Auto-Assignment

When you decide a task should be handled by Copilot coding agent instead of locally in your IDE:

### How It Works

1. Create the issue in the appropriate repo
2. **Move the issue to "Ready" status on the project board** (required)
3. Add the `cloud-agent` label to the issue
4. The `cloud-agent-assign.yml` workflow fires automatically and performs these checks:
   - **Permission guard**: Actor must have write/maintain/admin permission (+ optional `CLOUD_AGENT_ALLOWED_USERS` allowlist)
   - **Ready guard**: Issue must be in **Ready** status on the project board — issues in Backlog, No Status, or any other status are **rejected**
5. If both guards pass:
   - Copilot is assigned to the issue
   - Project board **Status** is automatically updated to **In Progress**
   - Project board **Work mode** is automatically set to **Cloud Agent**
6. Copilot coding agent picks up the issue, works on it, and opens a PR
7. The `project-board-sync.yml` workflow auto-adds the PR to the project board
8. You review the PR in the "In Review" column

### Safeguards

| Guard | What it checks | On failure |
|-------|---------------|------------|
| Permission | Actor has write/maintain/admin repo access | Label removed, comment posted |
| Allowlist (optional) | Actor is in `CLOUD_AGENT_ALLOWED_USERS` repo variable | Label removed, comment posted |
| Ready status | Issue is in "Ready" on project board | Label removed, comment posted with instructions |

### When to Use Cloud Agent

**Good candidates:**
- Bug fixes with clear reproduction steps
- Adding or updating tests
- Documentation updates
- Simple, well-scoped features with clear acceptance criteria
- Code formatting, linting, or hygiene tasks

**Keep local:**
- Multi-repo coordinated changes
- Architecture decisions
- Debugging complex issues requiring IDE context
- Performance optimization requiring profiling
- Anything requiring access to running services or local state

### From the Project Board — Step by Step

> **IMPORTANT:** The issue MUST be in **Ready** status before adding the `cloud-agent` label.
> Adding the label to an issue in Backlog or any other status will be rejected.

1. Ensure the issue is on the [project board](https://github.com/users/rivie13/projects/3)
2. Move the issue to **Ready** status
3. Go to the issue and add the `cloud-agent` label
4. The workflow will:
   - Verify the issue is in Ready status
   - Assign @copilot
   - Move the board item to **In Progress**
   - Set **Work mode** to **Cloud Agent**
5. Copilot picks it up automatically — no manual board updates needed

### What the Workflow Updates Automatically

When a cloud agent is successfully assigned, the workflow updates the project board so you don't have to:

| Field | Before | After |
|-------|--------|-------|
| Status | Ready | **In Progress** |
| Work mode | (any) | **Cloud Agent** |
| Assignee | (none) | **@copilot** |

### Required Secret

The workflow requires the `PROJECT_BOARD_TOKEN` repository secret with `project` and `repo` scopes. This is the same token used by `project-board-sync.yml`.

---

## Automations in This Repo

| Workflow | Trigger | Action |
|----------|---------|--------|
| `project-board-sync.yml` | Issue opened/reopened, PR opened/reopened | Adds item to Phoenix Project Board |
| `cloud-agent-assign.yml` | Issue labeled `cloud-agent` | Guards (permission + Ready status), assigns Copilot, updates board Status → In Progress + Work mode → Cloud Agent |

---

## Files in This System

| File | Purpose |
|------|---------|
| `.github/docs/WORKER_FACTORY.md` | Multi-agent concurrency model — area definitions, conflict rules, agent types |
| Project board fields (`Status`, `Work mode`, `Area`, `Depends On`, `Needed Files`, `Lock Scope`, `Lock Key`) | Canonical task coordination and lock/dependency state |
| `.github/instructions/website-frontend-current-task.instructions.md` | Instruction telling agents to read task context |
| `.github/skills/focus/SKILL.md` | Skill for resume/pick/checkpoint/complete workflows |
| `.github/workflows/project-board-sync.yml` | Auto-add issues/PRs to project board |
| `.github/workflows/cloud-agent-assign.yml` | Auto-assign Copilot when `cloud-agent` label is added |
| `.github/docs/PROJECT_WORKFLOW.md` | This document |
