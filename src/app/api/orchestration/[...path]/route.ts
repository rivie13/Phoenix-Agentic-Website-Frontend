import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import {
  buildGatewayHeaders,
  buildGatewayPath,
  isAllowedOrchestrationPath,
  resolveGatewayUrl,
} from "@/lib/phoenix-orchestration";

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

async function proxyRequest(request: Request, context: RouteContext, method: "GET" | "POST") {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  const { path } = await context.params;
  const segments = path ?? [];

  if (!isAllowedOrchestrationPath(method, segments)) {
    return NextResponse.json({ message: "Unknown orchestration endpoint." }, { status: 404 });
  }

  try {
    const headers = buildGatewayHeaders(session);
    const upstreamPath = buildGatewayPath(segments);
    const upstreamUrl = resolveGatewayUrl(upstreamPath);
    const bodyText = method === "POST" ? await request.text() : undefined;

    if (bodyText && bodyText.length > 0) {
      headers.set("Content-Type", "application/json");
    }

    const upstreamResponse = await fetch(upstreamUrl, {
      method,
      headers,
      body: bodyText,
      cache: "no-store",
    });

    const responseBody = await upstreamResponse.text();
    const contentType = upstreamResponse.headers.get("content-type") ?? "application/json";

    return new NextResponse(responseBody, {
      status: upstreamResponse.status,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach Phoenix orchestration backend right now." },
      { status: 502 },
    );
  }
}

export async function GET(request: Request, context: RouteContext) {
  return proxyRequest(request, context, "GET");
}

export async function POST(request: Request, context: RouteContext) {
  return proxyRequest(request, context, "POST");
}
