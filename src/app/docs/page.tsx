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

const docSections = [
  {
    icon: "🚀",
    title: "Getting started",
    text: "Install Phoenix, set up your API keys, and build something in under 10 minutes.",
  },
  {
    icon: "🏗️",
    title: "Architecture",
    text: "How the engine, interface SDK, and optional backend fit together — and why it's designed that way.",
  },
  {
    icon: "🔧",
    title: "Editor workflows",
    text: "Ask, Plan, and Agent modes. Context composer. Tool adapters. Everything you interact with daily.",
  },
  {
    icon: "🔌",
    title: "Integrations",
    text: "Pixel art, audio, Git, testing, external tool servers — what's available and how to configure it.",
  },
];

export default async function DocsPage() {
  const docsTarget = await resolveDocsTarget();

  return (
    <section className="page">
      <div className="hero">
        <h1>Documentation</h1>
        <p className="hero-tagline">
          Everything you need to get started, understand the architecture, and
          get the most out of Phoenix.
        </p>
      </div>

      <div className="grid">
        {docSections.map((s) => (
          <article className="card" key={s.title}>
            <div className="card-icon">{s.icon}</div>
            <h2>{s.title}</h2>
            <p>{s.text}</p>
          </article>
        ))}
      </div>

      <div className="button-row">
        <Link
          className="button button-primary"
          href={docsTarget}
          target="_blank"
        >
          Open full documentation
        </Link>
        <Link
          className="button"
          href="https://docs.godotengine.org"
          target="_blank"
        >
          Godot docs (upstream)
        </Link>
      </div>

      <div className="notice">
        <p>
          Phoenix builds on top of Godot Engine. The upstream Godot docs remain
          an excellent resource for core engine concepts, and we link to them
          throughout our documentation. Godot is a trademark of the Godot
          Foundation.
        </p>
      </div>
    </section>
  );
}
