import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { WebsiteBackendClient } from "@/lib/api-client";
import { authOptions } from "@/lib/auth";
import { websiteBackendBaseUrl } from "@/lib/config";

type ActionBody = {
  action?: "checkout" | "portal";
};

function getRedirectUrl(payload: Record<string, unknown>): string | null {
  const value =
    typeof payload.url === "string"
      ? payload.url
      : typeof payload.redirectUrl === "string"
        ? payload.redirectUrl
        : null;

  if (!value) {
    return null;
  }

  try {
    const parsed = new URL(value);

    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.toString();
    }

    return null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  const body = (await request.json()) as ActionBody;

  if (!body.action || !["checkout", "portal"].includes(body.action)) {
    return NextResponse.json({ message: "Invalid billing action." }, { status: 400 });
  }

  const client = new WebsiteBackendClient(websiteBackendBaseUrl, session.accessToken);

  try {
    const result =
      body.action === "checkout"
        ? await client.startCheckout({ source: "website-frontend" })
        : await client.startBillingPortal({ source: "website-frontend" });

    return NextResponse.json({
      url: getRedirectUrl(result),
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to perform billing action right now." },
      { status: 502 },
    );
  }
}
