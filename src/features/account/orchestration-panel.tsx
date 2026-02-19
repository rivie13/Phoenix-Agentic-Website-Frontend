"use client";

import { useMemo, useState } from "react";

import { ErrorState } from "@/components/ui-states";

interface TaskQueuedAck {
  session_id: string;
  task_id: string;
  plan_id: string;
  job_id: string;
  status: string;
  tier: string;
}

interface ProposedAction {
  action_id: string;
}

interface ProposedActionBatch {
  actions: ProposedAction[];
}

interface TaskStatusPayload {
  plan_id: string;
  status: string;
  proposed_action_batch?: ProposedActionBatch;
}

function createSessionId(): string {
  return `sess-web-${Date.now()}`;
}

function createTaskId(): string {
  return `task-web-${Date.now()}`;
}

function createSessionStartPayload(sessionId: string) {
  return {
    schema_version: "v1",
    event: "session_start",
    session_id: sessionId,
    idempotency_key: `idem-start-${Date.now()}`,
    sent_at: new Date().toISOString(),
    project_map: {
      name: "Phoenix Website Orchestration",
      godot_version: "4.3",
      main_scene: "res://main.tscn",
      scenes: {
        "res://main.tscn": {
          root: "Main",
          root_type: "Node",
          children_summary: ["WebsiteOrchestrationPanel (Control)"],
        },
      },
      scripts: ["res://website_orchestration.gd"],
      resources: {
        audio: [],
        sprites: [],
        tilesets: [],
      },
      file_hash: "sha256:website-orchestration",
      extras: {
        source: "website-frontend",
      },
    },
  };
}

function createTaskRequestPayload(sessionId: string, taskId: string, prompt: string) {
  return {
    schema_version: "v1",
    session_id: sessionId,
    task_id: taskId,
    user_input: prompt,
    mode: "agent",
    submitted_at: new Date().toISOString(),
    project_context: {
      current_file: "res://website_orchestration.gd",
      scene_tree: {
        WebsiteOrchestrationPanel: {
          type: "Control",
          children: [],
        },
      },
      open_files: ["res://website_orchestration.gd"],
      project_settings: {},
    },
  };
}

async function readJsonPayload<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export function OrchestrationPanel() {
  const [sessionId, setSessionId] = useState(createSessionId);
  const [taskId, setTaskId] = useState(createTaskId);
  const [prompt, setPrompt] = useState(
    "Generate a small implementation plan for movement, input mapping, and one test.",
  );
  const [planId, setPlanId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskAck, setTaskAck] = useState<TaskQueuedAck | null>(null);
  const [taskStatus, setTaskStatus] = useState<TaskStatusPayload | null>(null);
  const [approvalResult, setApprovalResult] = useState<Record<string, unknown> | null>(null);

  const canApprove = useMemo(() => {
    const actions = taskStatus?.proposed_action_batch?.actions;
    return Boolean(actions && actions.length > 0 && planId.length > 0);
  }, [planId, taskStatus?.proposed_action_batch?.actions]);

  const startAndQueueTask = async () => {
    setBusy(true);
    setError(null);
    setTaskStatus(null);
    setApprovalResult(null);

    try {
      const sessionStartResponse = await fetch("/api/orchestration/session/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createSessionStartPayload(sessionId)),
      });

      if (!sessionStartResponse.ok) {
        throw new Error("Unable to start orchestration session.");
      }

      const taskResponse = await fetch("/api/orchestration/task/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createTaskRequestPayload(sessionId, taskId, prompt)),
      });

      const ackPayload = await readJsonPayload<TaskQueuedAck>(taskResponse);

      if (!taskResponse.ok || !ackPayload?.plan_id) {
        throw new Error("Unable to queue orchestration task.");
      }

      setTaskAck(ackPayload);
      setPlanId(ackPayload.plan_id);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to call orchestration backend right now.",
      );
    } finally {
      setBusy(false);
    }
  };

  const refreshTaskStatus = async () => {
    if (!planId) {
      setError("Queue a task first to get a plan_id.");
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const response = await fetch(`/api/orchestration/task/${encodeURIComponent(planId)}`, {
        cache: "no-store",
      });

      const statusPayload = await readJsonPayload<TaskStatusPayload>(response);

      if (!response.ok || !statusPayload) {
        throw new Error("Unable to fetch task status.");
      }

      setTaskStatus(statusPayload);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to fetch task status right now.",
      );
    } finally {
      setBusy(false);
    }
  };

  const approveAllActions = async () => {
    if (!planId || !taskStatus?.proposed_action_batch?.actions?.length) {
      setError("No proposed actions available to approve.");
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const approvedActionIds = taskStatus.proposed_action_batch.actions.map(
        (action) => action.action_id,
      );

      const response = await fetch(
        `/api/orchestration/task/${encodeURIComponent(planId)}/approval`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            schema_version: "v1",
            session_id: sessionId,
            plan_id: planId,
            decision: "approve",
            approved_action_ids: approvedActionIds,
            rejected_action_ids: [],
            reviewer_id: "website-account-user",
            decided_at: new Date().toISOString(),
          }),
        },
      );

      const payload = await readJsonPayload<Record<string, unknown>>(response);

      if (!response.ok) {
        throw new Error("Unable to submit approval decision.");
      }

      setApprovalResult(payload ?? {});
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to submit approval right now.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="page">
      <h1>Orchestration management</h1>
      <p>
        This page calls Phoenix orchestration endpoints through the frontend proxy.
        Website backend account APIs are not used for task orchestration.
      </p>

      {error ? <ErrorState message={error} /> : null}

      <article className="card">
        <h2>Queue task</h2>
        <div className="form-grid">
          <label className="form-field" htmlFor="orchestration-session-id">
            <span className="label">Session ID</span>
            <input
              className="input-control"
              id="orchestration-session-id"
              onChange={(event) => setSessionId(event.target.value)}
              value={sessionId}
            />
          </label>

          <label className="form-field" htmlFor="orchestration-task-id">
            <span className="label">Task ID</span>
            <input
              className="input-control"
              id="orchestration-task-id"
              onChange={(event) => setTaskId(event.target.value)}
              value={taskId}
            />
          </label>

          <label className="form-field" htmlFor="orchestration-prompt">
            <span className="label">Prompt</span>
            <textarea
              className="input-control input-textarea"
              id="orchestration-prompt"
              onChange={(event) => setPrompt(event.target.value)}
              rows={5}
              value={prompt}
            />
          </label>
        </div>

        <div className="button-row">
          <button
            className="button button-primary"
            disabled={busy}
            onClick={() => void startAndQueueTask()}
            type="button"
          >
            Start session + queue task
          </button>
          <button
            className="button"
            disabled={busy || !planId}
            onClick={() => void refreshTaskStatus()}
            type="button"
          >
            Refresh task status
          </button>
          <button
            className="button"
            disabled={busy || !canApprove}
            onClick={() => void approveAllActions()}
            type="button"
          >
            Approve all proposed actions
          </button>
        </div>
      </article>

      {taskAck ? (
        <article className="card">
          <h2>Task queued</h2>
          <span className="label">Plan ID</span>
          <span className="value">{taskAck.plan_id}</span>
          <span className="label">Job ID</span>
          <span className="value">{taskAck.job_id}</span>
          <span className="label">Status</span>
          <span className="value">{taskAck.status}</span>
        </article>
      ) : null}

      {taskStatus ? (
        <article className="card">
          <h2>Task status payload</h2>
          <pre className="code-block">{JSON.stringify(taskStatus, null, 2)}</pre>
        </article>
      ) : null}

      {approvalResult ? (
        <article className="card">
          <h2>Approval response payload</h2>
          <pre className="code-block">{JSON.stringify(approvalResult, null, 2)}</pre>
        </article>
      ) : null}
    </section>
  );
}
