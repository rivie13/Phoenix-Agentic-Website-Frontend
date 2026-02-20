import Link from "next/link";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Phoenix",
  description:
    "Phoenix pricing tiers — placeholder pricing subject to change based on alpha and beta testing.",
};

/* ── Featured managed tiers (shown first) ── */
const managedOptions = [
  {
    name: "Managed Service",
    price: "From $15",
    priceSuffix: "mo",
    description:
      "The full glass-factory experience. We provide the models, routing, and infrastructure — just sign in and build.",
    features: [
      "Full multi-agent orchestration (parallel specialists)",
      "Premium pixel art generation (fine-tuned models)",
      "Premium SFX generation (sound-profile intelligence)",
      "Premium MIDI music production",
      "Platform-provided model access (no API keys needed)",
      "Phoenix custom & fine-tuned models",
      "Optimized model routing (cheap for easy, powerful for hard)",
      "Trello / GitHub workflow automation",
      "Response caching for lower latency",
      "Usage dashboard and analytics",
      "Priority support & team sharing on higher tiers",
    ],
    excluded: [],
    cta: "Coming soon",
    ctaHref: "/signin",
    featured: true,
  },
  {
    name: "Managed BYOK",
    price: "From $10",
    priceSuffix: "mo",
    description:
      "Keep your own model API keys but unlock the full managed platform — multi-agent, creative tools, and DevOps automation.",
    features: [
      "Full multi-agent orchestration (parallel specialists)",
      "Premium pixel art, SFX, and MIDI generation",
      "Trello / GitHub workflow automation",
      "Smart model routing + response caching",
      "Usage dashboard and analytics",
      "Request credit pools + top-up packs",
      "You provide your own base-model API keys",
    ],
    excluded: [],
    cta: "Coming soon",
    ctaHref: "/signin",
    featured: false,
  },
];

/* ── Managed tier breakdown ── */
const managedTiers = [
  {
    name: "Hobby",
    price: "$15/mo",
    description: "For weekend projects and learning.",
    features: [
      "Entry-level request pools",
      "Premium model & creative allowance",
      "Email support (48hr response)",
      "Usage dashboard",
      "Top-up packs available",
    ],
  },
  {
    name: "Pro",
    price: "$25/mo",
    description: "For daily development with frequent multi-agent runs.",
    features: [
      "Medium request pools",
      "Higher premium & creative limits",
      "Priority email support (24hr response)",
      "Advanced usage analytics",
      "Team sharing (up to 3 seats)",
      "Top-up packs available",
    ],
  },
  {
    name: "Ultra",
    price: "$50/mo",
    description: "Heavy usage and maximum creative throughput.",
    features: [
      "Largest request pools",
      "Highest premium & creative limits",
      "Priority support (8hr response)",
      "Early access to new features",
      "Team sharing (up to 10 seats)",
      "Custom rate limits",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Self-hosted, white-label, and volume pricing for studios.",
    features: [
      "Self-hosted deployment option",
      "Custom model fine-tuning",
      "99.9% uptime SLA",
      "Dedicated support engineer",
      "Volume discounts",
      "Starts at $50/seat/month",
    ],
  },
];

/* ── BYOK (free, de-emphasized) ── */
const byokFeatures = [
  "Full Godot-compatible editor (no AI, no cloud required)",
  "Ask / Plan / Agent workflow — alpha testers only",
  "Single-agent orchestration — alpha testers only",
  "Core tool integrations — alpha testers only",
  "Your own API keys, your own provider costs (alpha only)",
  "Offline mode (editor access, no AI features)",
  "Community support",
];

const byokExcluded = [
  "Multi-agent orchestration",
  "Pixel art / SFX / MIDI generation",
  "Trello & GitHub automation",
  "Usage dashboard or analytics",
  "Premium or fine-tuned models",
  "Local AI hosting (not yet supported)",
];

export default function PricingPage() {
  return (
    <section className="page">
      {/* ── Alpha/beta placeholder banner ── */}
      <div className="notice" style={{ borderColor: "var(--accent)", background: "var(--accent-subtle)" }}>
        <p style={{ color: "var(--foreground)" }}>
          <strong>Placeholder pricing.</strong> The tiers and request
          allowances below are preliminary. Final pricing may change based on
          what we learn during the alpha and beta of the managed service.{" "}
          <Link className="inline-link" href="/alpha">
            Join the alpha
          </Link>{" "}
          to help us get it right.
        </p>
      </div>

      <div className="hero">
        <h1>Try the full experience free for 7 days</h1>
        <p className="hero-tagline">
          50 request units, no credit card, full access to multi-agent
          orchestration and every creative tool. When the trial ends you pick a
          plan — or drop to BYOK free forever.
        </p>
      </div>

      {/* ── Featured: managed options ── */}
      <div className="section-header">
        <h2>Managed plans</h2>
        <p>
          Let us handle the models and infrastructure so you can focus on your
          game. Both options unlock the full glass-factory platform.
        </p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        {managedOptions.map((opt) => (
          <article
            className={`pricing-card${opt.featured ? " featured" : ""}`}
            key={opt.name}
          >
            <h2>{opt.name}</h2>
            <p className="price">
              {opt.price}{" "}
              {opt.priceSuffix ? <span>/ {opt.priceSuffix}</span> : null}
            </p>
            <p>{opt.description}</p>
            <ul>
              {opt.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Link className="button button-primary" href={opt.ctaHref}>
              {opt.cta}
            </Link>
          </article>
        ))}
      </div>

      {/* ── Tier breakdown ── */}
      <div className="section-header" style={{ marginTop: "1rem" }}>
        <h2>Pick your tier</h2>
        <p>
          Both Managed Service and Managed BYOK share the same tier structure.
          Each tier includes monthly pools for total requests, premium model
          requests, and creative requests. Run out? Buy top-up packs anytime.
        </p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {managedTiers.map((t) => (
          <article className="card" key={t.name}>
            <h2>{t.name}</h2>
            <p className="price" style={{ fontSize: "1.5rem" }}>
              {t.price}
            </p>
            <p>{t.description}</p>
            <ul className="feature-list">
              {t.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="notice">
        <p>
          <strong>How request credits work.</strong> Managed tiers use a
          weighted credit system. Phoenix Defaults cost 0.9x (saving you 10%),
          regular models cost 1.0x, and premium models / creative endpoints
          cost more. Use Phoenix Defaults to stretch your monthly budget
          further.
        </p>
      </div>

      {/* ── BYOK (de-emphasized) ── */}
      <div className="section-header" style={{ marginTop: "2rem" }}>
        <h2>Just want the editor?</h2>
        <p>
          BYOK mode is free forever. During the alpha, BYOK AI features (Ask,
          Plan, Agent) are available to alpha testers only. Without an alpha
          invite, BYOK gives you the full Godot-compatible editor — no AI,
          no cloud required.
        </p>
      </div>

      <div style={{ maxWidth: "480px" }}>
        <article className="card">
          <h2>BYOK (Free)</h2>
          <p className="price" style={{ fontSize: "1.5rem" }}>
            $0 <span style={{ fontSize: "0.875rem", opacity: 0.6 }}>/ forever</span>
          </p>
          <ul className="feature-list">
            {byokFeatures.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.75rem", marginTop: "0.75rem" }}>
            <span className="label">Not included</span>
            <ul className="feature-list" style={{ marginTop: "0.5rem", opacity: 0.5 }}>
              {byokExcluded.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
          <Link className="button" href="/download" style={{ marginTop: "0.75rem" }}>
            Download
          </Link>
        </article>
      </div>

      {/* ── Local AI notice ── */}
      <div className="notice">
        <p>
          <strong>Local AI is not currently supported.</strong> Phoenix
          requires a remote model API connection — via the managed service or
          your own cloud provider keys (BYOK, alpha testers only). Local model
          hosting (Ollama, LM Studio, etc.) is not yet implemented. Interested
          in helping build it?{" "}
          <a
            className="inline-link"
            href="https://github.com/rivie13/Phoenix-Agentic-Engine/issues"
            rel="noopener noreferrer"
            target="_blank"
          >
            Open a feature request on GitHub
          </a>
          .
        </p>
      </div>
    </section>
  );
}
