import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { WebsiteBackendClient } from "@/lib/api-client";
import { authOptions } from "@/lib/auth";
import { websiteBackendBaseUrl } from "@/lib/config";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  const client = new WebsiteBackendClient(websiteBackendBaseUrl, session.accessToken);

  const [me, account, entitlements, downloads] = await Promise.allSettled([
    client.getMe(),
    client.getAccount(),
    client.getEntitlements(),
    client.getDownloads(),
  ]);

  return NextResponse.json({
    me: me.status === "fulfilled" ? me.value : null,
    account: account.status === "fulfilled" ? account.value : null,
    entitlements: entitlements.status === "fulfilled" ? entitlements.value : [],
    downloads: downloads.status === "fulfilled" ? downloads.value : [],
  });
}
