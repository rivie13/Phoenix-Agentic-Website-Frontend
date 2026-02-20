import { type Metadata } from "next";

import { MailchimpSignupForm } from "@/components/mailchimp-signup-form";

export const metadata: Metadata = {
  title: "Alpha Program — Phoenix",
  description:
    "Sign up for the Phoenix alpha. Limited to 10–20 testers. Get free extended access to the full managed service before the public beta.",
};

/* ── What alpha testers get ── */
const alphaPerks = [
  "Free extended trial of the full managed service (multi-agent orchestration, creative tools, everything)",
  "Direct line to the development team for feedback and bug reports",
  "Early influence on features, pricing, and platform direction",
  "Priority access to the beta when it launches",
  "Your name in the credits (if you'd like)",
];

/* ── What we're looking for ── */
const lookingFor = [
  "Hobbyist or professional game developers comfortable with Godot",
  "Willingness to try experimental features and report issues",
  "Available for occasional feedback calls or surveys",
  "Any experience level — we want diverse perspectives",
];

export default function AlphaPage() {
  return (
    <section className="page">
      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero-badge">Limited Alpha &middot; 10–20 Spots</div>
        <h1>
          Phoenix is entering alpha
          <br />
          and we need testers
        </h1>
        <p className="hero-tagline">
          We&apos;re opening a small, invite-only alpha for 10 to 20 testers
          who want to push the engine to its limits. Alpha testers get{" "}
          <strong style={{ color: "var(--foreground)" }}>
            free extended access
          </strong>{" "}
          to the full managed service — multi-agent orchestration, creative
          AI tools, everything — before the public beta goes out.
        </p>
      </div>

      {/* ── Alpha signup ── */}
      <div className="alpha-signup-block">
        <MailchimpSignupForm kind="alpha" />
      </div>

      {/* ── What testers get ── */}
      <div className="section-header">
        <h2>What alpha testers get</h2>
      </div>
      <div style={{ maxWidth: "640px" }}>
        <article className="card">
          <ul className="feature-list">
            {alphaPerks.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </article>
      </div>

      {/* ── What we're looking for ── */}
      <div className="section-header">
        <h2>Who we&apos;re looking for</h2>
      </div>
      <div style={{ maxWidth: "640px" }}>
        <article className="card">
          <ul className="feature-list">
            {lookingFor.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </article>
      </div>

      {/* ── Waitlist ── */}
      <div className="section-header">
        <h2>Alpha full? Join the waitlist</h2>
        <p>
          If all alpha slots are taken, join the waitlist. We may open
          additional spots, and waitlisted users get priority when the public
          beta launches.
        </p>
      </div>
      <div className="alpha-signup-block">
        <MailchimpSignupForm kind="waitlist" />
      </div>

      {/* ── FAQ ── */}
      <div className="section-header">
        <h2>Frequently asked questions</h2>
      </div>
      <div className="faq-list">
        <details className="faq-item">
          <summary>Is the alpha free?</summary>
          <p>
            Yes. Alpha testers receive a free extended trial of the full
            managed service. No credit card required.
          </p>
        </details>
        <details className="faq-item">
          <summary>
            Do I need to create an account to sign up for the alpha?
          </summary>
          <p>
            No — signing up here just adds you to our mailing list (via
            Mailchimp). If you&apos;re selected, we&apos;ll invite you to
            create a Phoenix account using Microsoft Entra ID at that point.
          </p>
        </details>
        <details className="faq-item">
          <summary>How many testers will you accept?</summary>
          <p>
            We&apos;re targeting 10 to 20 for the initial alpha. We may open
            additional slots based on demand and infrastructure capacity.
          </p>
        </details>
        <details className="faq-item">
          <summary>What happens after the alpha?</summary>
          <p>
            Alpha testers get priority access to the beta. Pricing and tier
            details may change based on what we learn during the alpha —
            see the{" "}
            <a className="inline-link" href="/pricing">
              pricing page
            </a>{" "}
            for current placeholder details.
          </p>
        </details>
        <details className="faq-item">
          <summary>Can I still use Phoenix without joining the alpha?</summary>
          <p>
            Yes — you can download and use the editor freely at any time. However,
            AI features (Ask, Plan, and Agent modes) in BYOK mode are currently
            restricted to alpha testers only. Without an alpha invite, BYOK gives
            you the full Godot-compatible editor with no AI features enabled.
            The editor itself is open source (MIT).{" "}
            <a
              className="inline-link"
              href="https://github.com/rivie13/Phoenix-Agentic-Engine"
              rel="noopener noreferrer"
              target="_blank"
            >
              View the engine on GitHub
            </a>
            .
          </p>
        </details>
        <details className="faq-item">
          <summary>Does Phoenix support local AI (Ollama, LM Studio, etc.)?</summary>
          <p>
            Not at this time. Phoenix currently requires a remote model API
            connection — either through the managed service or BYOK with a
            cloud provider (OpenAI, Anthropic, etc.). Local AI hosting in the
            editor is not yet implemented, but it&apos;s something the community
            can build or request. If this is important to you,{" "}
            <a
              className="inline-link"
              href="https://github.com/rivie13/Phoenix-Agentic-Engine/issues"
              rel="noopener noreferrer"
              target="_blank"
            >
              open a feature request on GitHub
            </a>
            .
          </p>
        </details>
      </div>
    </section>
  );
}
