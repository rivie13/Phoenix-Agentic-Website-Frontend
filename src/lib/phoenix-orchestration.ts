import { type Session } from "next-auth";

import {
  phoenixGatewayBaseUrl,
  phoenixGatewayClientToken,
  phoenixGatewayDefaultTier,
  phoenixGatewayServiceMode,
} from "@/lib/config";

function matchesTaskStatusPath(segments: string[]): boolean {
  return segments.length === 2 && segments[0] === "task" && segments[1].length > 0;
}

function matchesTaskApprovalPath(segments: string[]): boolean {
  return (
    segments.length === 3 &&
    segments[0] === "task" &&
    segments[1].length > 0 &&
    segments[2] === "approval"
  );
}

export function isAllowedOrchestrationPath(method: string, segments: string[]): boolean {
  if (segments.length === 0) {
    return false;
  }

  if (method === "GET") {
    return segments[0] === "locks" || matchesTaskStatusPath(segments);
  }

  if (method === "POST") {
    const joined = segments.join("/");
    return (
      joined === "session/start" ||
      joined === "task/request" ||
      joined === "realtime/negotiate" ||
      matchesTaskApprovalPath(segments) ||
      (segments.length === 3 &&
        segments[0] === "locks" &&
        segments[1].length > 0 &&
        segments[2] === "release")
    );
  }

  return false;
}

export function buildGatewayPath(segments: string[]): string {
  const normalized = segments.map((segment) => encodeURIComponent(segment));
  return `/api/v1/${normalized.join("/")}`;
}

export function resolveGatewayUrl(path: string): string {
  return `${phoenixGatewayBaseUrl}${path}`;
}

function resolveActorId(session: Session): string {
  const email = session.user?.email?.trim();
  if (email) {
    return `website:${email.toLowerCase()}`;
  }

  const name = session.user?.name?.trim();
  if (name) {
    return `website:${name.toLowerCase()}`;
  }

  return "website:authenticated-user";
}

export function buildGatewayHeaders(session: Session): Headers {
  const bearerToken =
    phoenixGatewayClientToken?.trim() ?? session.accessToken?.trim();

  if (!bearerToken) {
    throw new Error(
      "Phoenix gateway token is missing. Set PHOENIX_GATEWAY_CLIENT_TOKEN or configure session token passthrough.",
    );
  }

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${bearerToken}`);
  headers.set("Accept", "application/json");
  headers.set("x-phoenix-service-mode", phoenixGatewayServiceMode);
  headers.set("x-phoenix-actor-id", resolveActorId(session));
  headers.set("x-phoenix-tier", phoenixGatewayDefaultTier);

  return headers;
}
