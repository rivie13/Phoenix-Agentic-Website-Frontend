import Link from "next/link";

import { WebsiteBackendClient } from "@/lib/api-client";
import { defaultDocsUrl, websiteBackendBaseUrl } from "@/lib/config";

function sanitizeDocsUrl(value: string, fallback: string): string {
  try {
    const parsed = new URL(value);

    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.toString();
    }

    return fallback;
  } catch {
    return fallback;
  }
}

async function resolveDocsTarget(): Promise<string> {
  const client = new WebsiteBackendClient(websiteBackendBaseUrl);

  try {
    const target = await client.getDocsTarget();
    if (target?.url) {
      return sanitizeDocsUrl(target.url, defaultDocsUrl);
    }
  } catch {
    return defaultDocsUrl;
  }

  return defaultDocsUrl;
}

export default async function DocsPage() {
  const docsTarget = await resolveDocsTarget();

  return (
    <section className="page">
      <h1>Documentation</h1>
      <p>
        Phoenix currently targets a Godot-compatible docs baseline. Use the link
        below for current reference documentation.
      </p>
      <div className="notice">
        <p className="value">Current docs target</p>
        <p>{docsTarget}</p>
      </div>
      <div className="button-row">
        <Link className="button button-primary" href={docsTarget} target="_blank">
          Open docs
        </Link>
      </div>
      <p>Godot documentation and branding remain attributed to the Godot Foundation.</p>
    </section>
  );
}
