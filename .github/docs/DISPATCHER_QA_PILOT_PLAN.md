# Dispatcher + QA Wait Pilot Plan (Website Frontend First)

This document defines the **docs-first pilot plan** for board-driven dispatch and QA handoff in `Phoenix-Agentic-Website-Frontend`.

## Scope and sequencing

This plan is split into two phases:

1. **Phase A — Documentation alignment (current phase)**
   - Define target workflow, statuses, and responsibilities.
   - Update skills/instructions so tooling guidance matches current environment.
   - Stand up the dedicated webhook-server/control-plane repo scaffold in this workspace (`Phoenix-Agentic-Workspace-Supervisor`) as the pilot control-plane reference.
   - No workflow logic or automation behavior changes in this phase.

2. **Phase B — Implementation rollout (after explicit go-ahead)**
   - Update GitHub workflows and board automation mappings.
   - Validate end-to-end dispatch and QA transitions.
   - Validate the two-repo pilot topology (Website Frontend + `Phoenix-Agentic-Workspace-Supervisor`).
   - Replicate to the other four Phoenix repos after pilot validation, including board-only coordination scrub.

## Target operating model

The orchestrator/loop is a **dispatcher only**:

- Consumes webhook/event signals as the primary trigger path (via external receiver for Projects v2 board events).
- Claims work and tracks lease/heartbeat metadata.
- Routes by work mode.
- Dispatches to local/CLI/cloud agents.
- Tracks run links and completion signals.

### Role definitions (workspace vs repo scope)

To avoid ambiguity, these terms are distinct:

- **Workspace Webhook Receiver**: external-facing ingress that accepts webhook deliveries.
- **Workspace Supervisor**: normalizes events, enriches context, and routes work/control messages.
- **Workspace Dispatcher**: scheduling and routing logic owned by the supervisor layer.
- **Repo Loop Worker**: per-repo Ralph loop executor consuming only repo-scoped work.
- **Agent Instance**: concrete running execution target (Local guidance session (notify user to start a local run, or to change to a different mode and update board accordingly if necessary), Codex CLI run, Copilot CLI run, or cloud run (cloud run should and does auto start without dispatcher)).

The user-facing control point in the IDE is the workspace supervisor/dispatcher layer; repo loops and agents are downstream executors.

### Two-tier runtime topology (workspace-level)

For the local IDE workspace that contains all five Phoenix repos, use a two-tier model:

1. **Workspace Supervisor (single webhook front door)**
   - Receives external webhook events once (GitHub/project/QA signals).
   - Normalizes event payloads and resolves target repo + issue/task context.
   - Pushes dispatch-ready work items to per-repo queues.

2. **Repo Loop Workers (five long-running loops, one per repo)**
   - Each repo loop consumes only its own queue and executes the Ralph loop for that repo.
   - Each loop performs lock/dependency preflight against board metadata before claim.
   - Each loop invokes the selected local execution path (Local IDE assistance, Codex CLI, or Copilot CLI).

This avoids duplicating webhook listeners across repos while keeping execution isolated per repo.

### Queue topology (workspace + repo)

Use two queue layers in parallel:

1. **Workspace Meta Queue (global control queue)**
   - Holds cross-repo or supervisory events: dependency-unblock signals, policy updates, priority overrides, cancellations, QA escalations, and dispatcher control intents.
   - Produces control messages that may update one or more repo loops.

2. **Repo Micro Queues (x5 execution queues)**
   - Hold concrete repo-scoped work items to be executed by each repo loop.
   - Feed claim/dispatched/QA/retry lifecycle for that repo only.

Rule: repo loops never read external webhooks directly; they consume supervisor-produced queue messages only.

Implementation note: this workspace supervisor/control-plane now lives in this workspace as a dedicated separate repo: `Phoenix-Agentic-Workspace-Supervisor` (webhook ingress + queue state + routing services).

Pilot rollout note: treat Website Frontend + `Phoenix-Agentic-Workspace-Supervisor` as the initial reference pair. After that pair is stable, this document is the blueprint for applying the same model to Engine, Backend, Interface, and Website Backend.

### Dispatch-to-prompt pipeline (required behavior)

For each dispatchable event:

1. Webhook event is received by Workspace Supervisor.
2. Supervisor resolves dispatch arguments (repo, issue, area, lock/dependency metadata, acceptance criteria, links).
3. Supervisor generates a **minimal prompt file** for the target run from those arguments.
4. Repo loop selects execution mode and invokes the target CLI with that prompt file.
5. Agent starts from the prompt, does required research, executes work, and checkpoints progress against board/issue/run metadata.

### CLI invocation contract (local)

- Dispatcher-driven local runs should call the available CLI agents directly (Codex CLI and/or GitHub Copilot CLI).
- Default selection order is cost-aware: **Codex CLI first**, then **Copilot CLI fallback** when Codex quota/availability is exhausted.
- Prompt files are first-class inputs to these invocations.
- Prompt content is generated from webhook/board arguments so the agent starts with task-specific context rather than static boilerplate.

### Runtime steering contract (new information while run is active)

Dispatcher may receive new information mid-run (for example QA notes, dependency resolution, scope change, priority change). In that case:

1. Workspace supervisor emits a control message into the workspace meta queue.
2. Target repo loop resolves the intended active agent instance.
3. Repo loop applies one of three steering actions:
   - `append_context`: add non-breaking context/update instructions to the active run.
   - `checkpoint_and_replan`: request checkpoint output, then continue with revised constraints.
   - `stop_and_requeue`: terminate current run safely and enqueue a new run with updated prompt arguments.
4. Steering action and reason are recorded in run metadata (`Run Link` + notes).

Steering must be idempotent and sequence-aware (ignore duplicate/stale control messages).

### Minimal generated prompt contract

Each generated prompt should be short and only establish task context + required behavior. Minimum content:

- Identify the assigned issue/task and target repo.
- State that this is the assigned board task for this run.
- Instruct agent to update board/issue/run context from the provided task arguments.
- Instruct agent to execute task work according to repo instructions/skills and update checkpoints with what changed.
- Include dependency/lock warnings and any explicit blockers from dispatch metadata.
- Include required output links/fields to report back (run link, status, QA handoff data).

### Trigger model (event-first, verified constraints)

Dispatch should be **event-driven first**, with reconciliation polling only as a safety backstop:

- Primary trigger intake: org webhook receiver handling issue/project/label/PR/status/QA signals.
- Projects v2 board events are received through webhook events (`projects_v2`, `projects_v2_item`, `projects_v2_status_update`) at organization scope.
- GitHub Actions cannot currently be the sole trigger surface for Projects v2 board changes because `projects_v2*` events are not listed in Actions workflow triggers, and not all webhooks trigger workflows.
- Reconciliation poll: low-frequency sweep to recover missed deliveries and unsupported trigger gaps.
- Event idempotency: repeated deliveries for the same issue/event must be safe.
- Ordering: lock/dependency checks run against live board state at claim time.
- Routing: workspace supervisor routes to one repo loop only; loops must not self-dispatch across repos.

### Capability matrix (GitHub docs-based)

| Capability | Current status | Design implication |
|---|---|---|
| Projects v2 webhook events | Available at organization level (`projects_v2`, `projects_v2_item`, `projects_v2_status_update`), with preview caveat | Safe to use as primary wake-up signal, but treat payloads/versioning defensively |
| Actions triggers for `projects_v2*` | Not listed in `on:` workflow trigger catalog | Do not depend on direct Actions trigger for board field/status edits |
| Actions event coverage | Docs explicitly note not all webhook events trigger workflows | Keep external receiver + reconciliation path |
| Projects automation via Actions | Supported through GraphQL/API patterns | Use Actions as worker execution path, not as sole board-event intake path |

Safety gating for dangerous commands remains agent-side and is **not** a dispatcher responsibility.

## Target status model (board)

Canonical statuses for the pilot:

- `Backlog`
- `Ready`
- `Claimed`
- `In progress`
- `QA Required`
- `QA Feedback`
- `In review`
- `Done`
- `Blocked`
- `Failed`

### Cleanup target

- Remove/retire legacy status aliases that duplicate intent (for example `PR-ready`).
- Keep one canonical path to reduce automation ambiguity.

## Board-native dependency + lock model (planned)

The board should be the single coordination surface for parallel agents, including conflict prevention.

### Required issue/spec metadata at creation time

When creating a spec sheet / issue, include and persist:

- `Depends On` (list of prerequisite issues)
- `Area` (coarse ownership area)
- `Needed Files` (file paths/globs expected to be modified)
- `Lock Scope` (`area` or `files`)
- `Lock Key` (derived from area or normalized file list)
- `Work mode` (`Local IDE`, `CLI Agent`, `Cloud Agent`)

### Lock lifecycle

1. Dispatcher evaluates `Depends On` before claim.
2. If dependencies are incomplete, item remains non-runnable (`Ready` or `Blocked` with reason).
3. Before claim, dispatcher checks active items for intersecting lock keys.
4. If lock conflict exists, do not dispatch; keep in queue and surface conflict reason.
5. If no conflict, dispatcher claims item and sets:
   - `Claim Owner`
   - `Lock Scope`
   - `Lock Key`
   - `Lease Expires`
   - `Last Heartbeat`
6. On completion/failure/abandon, lock is released.

### Conflict policy

- `Area` is the default lock basis for every issue and must be present.
- `files` scope refines `area` scope when `Needed Files` is provided.
- Any file overlap is a hard conflict, even across different worktrees.
- Merge queue remains the final integration safety net, not the primary conflict detector.
- Lock checks should prevent most merge conflicts before implementation starts.

### Area field usage (project board)

- If `Area` is missing, item is not dispatchable.
- First pass arbitration uses `Area` lock keys for fast conflict detection.
- Second pass uses `Needed Files` overlap (when provided) for precise collision checks.
- `Area` should map to canonical values defined in `.github/docs/WORKER_FACTORY.md`.

### Board-only task state

- **Target model:** board-first locking/dependencies with no local task pointer files.
- Task progress, ownership, lock state, and QA state are tracked on board/issue/run metadata only.
- All execution modes (Local IDE, CLI, Cloud) must read/write the same board-linked task state.

## QA handoff contract

When an agent moves an item to **QA Required**, it must provide:

- branch/worktree reference,
- exact validation commands run,
- test/build results,
- what to manually verify,
- known caveats or risks,
- run/PR links when available.

Human QA updates outcome via **QA Feedback** (changes requested) or proceeds toward review/merge.

### QA applicability policy (when QA is required)

QA is not mandatory for every task. Use QA only when human validation is needed.

**QA required examples:**
- Feature behavior changes that need manual verification before merge.
- Bug fixes that require human confirmation of expected behavior.
- UX/flow changes where automated tests are insufficient.

**QA usually not required examples:**
- Documentation-only changes.
- Test-only updates that do not change runtime behavior.
- Pure refactors/chore changes with no behavioral impact and passing validations.

Dispatcher should set `QA Required` only for items that match QA-required policy; otherwise continue normal review path.

### QA queue topology (dual queue)

QA is represented in both queue layers:

- **Workspace QA Meta Queue**
   - Primary purpose: your operator-facing manual QA ordering queue so you can process QA one-at-a-time without overload.
   - Captures global QA control signals: escalations, SLA/timeouts, cross-repo QA dependencies, manual overrides.
   - Does not execute QA itself; it prioritizes what you test next.

- **Repo QA Micro Queue**
   - Captures concrete repo QA items created when an item enters `QA Required`.
   - Includes checklist, run link, branch/worktree, and verdict payload.
   - Supports multiple concurrent waiting sessions in the same repo (multiple agents can be queued for QA there).

Flow:
1. Repo item enters `QA Required` → repo QA micro queue item is created.
2. Workspace supervisor also creates/updates workspace QA meta entry representing your next manual QA order.
3. You pull one workspace QA meta item at a time, then execute QA in the referenced repo/branch/worktree context.
4. If escalated/cross-repo/timeout, workspace QA meta entry priority is adjusted.
5. Workspace meta decisions can reprioritize or steer repo QA items.
6. Final verdict is written back to the repo item; workspace meta entry is resolved when no further cross-repo control is needed.

## MCP-driven interactive QA wait (planned)

Yes — this is possible, with two execution modes:

1. **Interactive mode (Local IDE / CLI agent sessions):**
   - Agent calls MCP tool `qa_session_start` with handoff payload (issue, branch/worktree, validations, checklist, links).
   - MCP server records a `qaSessionId`, sets board status to `QA Required`, and writes required fields (`QA Checklist`, `Run Link`, etc.).
   - Agent then calls `qa_session_wait(qaSessionId, heartbeatIntervalSec)` and remains blocked on that repo-specific QA session.
   - While waiting, the server keeps the session alive and updates lease/heartbeat fields.
   - Human submits verdict via MCP-driven prompt/input path.
   - Wait call returns verdict payload; agent continues immediately based on outcome.

2. **Deferred mode (Cloud/async-safe fallback):**
   - `qa_session_start` still creates the QA session and updates board fields.
   - Agent does **not** block on an open call; dispatcher marks task as waiting for QA.
   - Human submits verdict later (MCP action, issue comment command, or board field update).
   - Dispatcher resumes the agent/job from the saved `qaSessionId` and latest verdict.

Workspace QA meta queue determines your manual testing order; repo QA sessions remain the execution/wait primitive for each agent run.

### Verdict contract

Minimum verdict payload from MCP server back to agent:

- `qaSessionId`
- `verdict`: `approved | changes_requested | blocked | failed`
- `notes`
- `checklistResults`
- `reviewedBy`
- `reviewedAt`

### Agent continuation rules

- `approved` → set `QA Verdict=approved`, move `Status` to `In review`, proceed to PR/review flow.
- `changes_requested` → set `Status=QA Feedback` (or `In progress` after acknowledgement), increment `Retry Count`, continue implementation.
- `blocked` → set `Status=Blocked`, record `Failure Reason`, stop until dependency/input is resolved.
- `failed` → set `Status=Failed`, attach diagnostic context, stop and escalate.

### Session safety rules

- Heartbeat updates must refresh `Last Heartbeat` and extend `Lease Expires` while waiting.
- If wait times out, session remains recoverable via `qaSessionId` (no lost state).
- Repeated waits for the same session must be idempotent.
- Only one active QA wait per issue at a time (enforced by `Claim Owner` + lease).

## Board metadata fields used by dispatcher

These fields are expected to be used for dispatch telemetry:

- `Area`
- `Depends On`
- `Needed Files`
- `Lock Scope`
- `Lock Key`
- `Claim Owner`
- `Lease Expires`
- `Last Heartbeat`
- `Run Link`
- `QA Checklist`
- `QA Verdict`
- `Failure Reason`
- `Retry Count`

## Skills/instructions policy update (docs requirement)

Previous repo guidance in several files disallowed `gh` CLI. The docs-phase updates in this pilot align policy to the current environment.

### Updated policy intent

- **Use both GitHub MCP tools and `gh` CLI.**
- **Prefer MCP tools first** for structured issue/PR/review operations.
- Use **`gh` CLI** for project/GraphQL operations and as fallback when MCP capability is missing or unsuitable.
- Continue to use terminal `git` for local branch/worktree operations.

### Files to align in docs phase

- `.github/instructions/website-frontend-git-hygiene.instructions.md`
- `.github/instructions/website-frontend-code-review.instructions.md`
- `.github/skills/git-hygiene/SKILL.md`
- `.github/skills/pr-management/SKILL.md`
- `.github/skills/focus/SKILL.md`

## Phase B implementation backlog (deferred)

After explicit approval, implement:

1. `sync-project-fields.yml` mapping updates for new statuses.
2. `cloud-agent-assign.yml` behavior validation against canonical status flow.
3. MCP QA server contract + persistence for `qa_session_start` / `qa_session_wait` / verdict submit APIs.
4. Dispatcher resume logic for deferred QA sessions (`qaSessionId`-based continuation).
5. Timeout/heartbeat/idempotency tests for QA wait sessions.
6. Add board fields + automation for `Depends On`, `Needed Files`, `Lock Scope`, `Lock Key`.
7. External org webhook receiver/adapter path for dispatch events (including Projects v2 events) with idempotent handoff to dispatcher.
8. Lock preflight gate before dispatch/claim (dependency check + lock conflict check, Area required).
9. Low-frequency reconciliation poll for missed deliveries and unsupported trigger classes.
10. Define lock release + stale-lock recovery workflow (timeout, reaper, manual override).
11. Implement workspace supervisor routing to per-repo loop workers (5 queues / 5 loops).
12. Implement prompt-file generator from dispatch arguments (minimal contract above).
13. Implement CLI adapters for Codex CLI and Copilot CLI that accept generated prompt file input.
14. Documentation updates in:
   - `.github/docs/PROJECT_WORKFLOW.md`
   - `.github/docs/WORKER_FACTORY.md`
15. Pilot runbook execution and verification.
16. Rollout template for Engine, Backend, Interface, and Website Backend.
17. Implement dual QA queues (workspace QA meta queue + repo QA micro queues) with explicit routing rules.
18. Implement steering channel for active agent instances (`append_context`, `checkpoint_and_replan`, `stop_and_requeue`).
19. Execute board-only coordination scrub in Engine, Backend, Interface, and Website Backend:
   - Remove local task-pointer/task-subdir coordination guidance from docs/skills/instructions.
   - Convert any local task templates/stubs to deprecation notes or remove them where appropriate.
   - Ensure board/issue/run metadata is the only coordination source in each repo.
20. Add cross-repo verification checklist proving each replicated repo no longer relies on local task-file coordination.

## Additional gaps to account for (refinement checklist)

- Stale lock handling when an agent/session dies mid-task.
- Lock override permissions + audit trail for emergency unblocks.
- Lock granularity drift (`Needed Files` incomplete or outdated).
- Dependency cycles (`A depends on B`, `B depends on A`).
- Cross-repo dependency visibility (board item in repo A depends on repo B).
- Rebase policy for long-running locked tasks.
- Retry/backoff policy for repeatedly lock-blocked items.

## Acceptance criteria for docs phase

- Pilot plan exists in repo with clear Phase A/Phase B boundary.
- Skills/instructions no longer prohibit `gh` and now define MCP + `gh` coexistence.
- No workflow/code implementation changes performed in this phase.
