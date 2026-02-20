import Image from "next/image";
import Link from "next/link";

import { GlowCard } from "@/components/glow-card";
import { MailchimpSignupForm } from "@/components/mailchimp-signup-form";
import { ScrollReveal } from "@/components/scroll-reveal";

/* ── Studio tools — what's in the box right now ── */
const studioTools = [
  {
    icon: "🎨",
    title: "Pixel art editor",
    text: "A fully integrated pixel art editor lives inside the engine. Create, modify, and iterate on sprites without switching apps. Agents can generate, edit, and suggest changes — and you can tune every pixel yourself.",
  },
  {
    icon: "🔊",
    title: "Sound FX engine",
    text: "Built on bfxr — the classic procedural sound designer — directly inside Phoenix. Generate retro-style sound effects, tweak the waveforms, and drop them into your project. Agents can suggest sounds; you dial them in.",
  },
  {
    icon: "💻",
    title: "Code editor",
    text: "Full GDScript and shader editing, powered by the Godot-compatible runtime. Get AI completions, ask why something broke, have an agent write the feature — or just type it yourself. The whole codebase is yours to touch.",
  },
  {
    icon: "🤖",
    title: "Agent hub",
    text: "Orchestrate multiple specialist agents from one panel — code, art, sound, project management. Dispatch tasks, watch them run in real time, approve or reject each step. You're the director; they're the crew.",
  },
  {
    icon: "💬",
    title: "Chat interface",
    text: "Talk to your project. Ask about the codebase, describe a feature, paste an error. The assistant has full context — open scenes, scripts, assets — and can take action or just explain. Conversation-first development.",
  },
  {
    icon: "🔧",
    title: "Asset tuning & control",
    text: "Nothing in Phoenix is read-only. Every asset an agent touches — sprite, sound, script — can be opened, modified, and tweaked by you. Agents suggest; humans decide. That's the deal.",
  },
];

/* ── Integrations — live and coming soon ── */
const integrations = [
  {
    icon: "🗂️",
    title: "Trello integration",
    status: "coming soon",
    text: "See your Trello boards directly inside the engine. Create cards, move tasks, leave comments — without leaving Phoenix. Agents can also create and update cards as they work.",
  },
  {
    icon: "💬",
    title: "Slack integration",
    status: "coming soon",
    text: "Get notified, search channels, and surface relevant threads right in the editor. Drop a screenshot of a bug into a channel without alt-tabbing. Keep the team loop inside the studio.",
  },
  {
    icon: "🎵",
    title: "Music editor & MIDI player",
    status: "coming soon",
    text: "Compose background music and sfx with a MIDI sequencer inside Phoenix. Lay down tracks, trigger instruments, export to your project — all without leaving the engine.",
  },
  {
    icon: "🔌",
    title: "More tools coming",
    status: "on the roadmap",
    text: "The tool system is designed to grow. GitHub, CI pipelines, asset stores, localisation editors — the platform is extensible and the community can build new integrations.",
  },
];

/* ── Autonomy spectrum ── */
const spectrum = [
  {
    icon: "🎯",
    title: "Full manual",
    text: "Use Phoenix as a straight Godot editor. No AI, no cloud, no strings attached. Every tool in the studio is still yours.",
  },
  {
    icon: "💬",
    title: "Ask for guidance",
    text: "Keep the wheel and ask questions as you go — about GDScript, shaders, engine APIs, or your own codebase.",
  },
  {
    icon: "📋",
    title: "Plan together",
    text: "Let the assistant draft a step-by-step plan. You review every step, tweak what you want, then approve.",
  },
  {
    icon: "🤖",
    title: "Let agents build",
    text: "Hand off entire tasks to specialist agents. They write code, generate art, wire up scenes — you watch and approve.",
  },
];

/* ── Glass factory principles ── */
const glassFactory = [
  {
    icon: "👀",
    title: "See everything",
    text: "Every agent action, every tool call, every model response is visible in real time. Nothing runs in the dark.",
  },
  {
    icon: "✋",
    title: "Stop anything",
    text: "Approval gates at every step. Pause, rewind, or cancel whenever something doesn't look right.",
  },
  {
    icon: "📜",
    title: "Full audit trail",
    text: "Timestamped logs for every decision the system makes. Review what happened and why — even days later.",
  },
  {
    icon: "↩️",
    title: "Always reversible",
    text: "Changes go through the editor's undo stack. Ctrl+Z works exactly like it always has.",
  },
];

export default function HomePage() {
  return (
    <section className="page">
      <div className="hero">
        <ScrollReveal stagger={0}>
          <div className="hero-badge">Alpha Launch &middot; Limited Spots</div>
        </ScrollReveal>
        <ScrollReveal stagger={100}>
          <h1>
            <span className="gradient-text">Your whole game studio.</span>
            <br />
            One place.
          </h1>
        </ScrollReveal>
        <ScrollReveal stagger={200}>
          <p className="hero-tagline">
            Phoenix is a Godot-based engine with an entire creative studio built
            in — pixel editor, sound designer, code editor, agent chat, and
            multi-agent orchestration all under one roof. Use as much AI as you
            want, or none at all. Every tool is yours to touch. Every wall is
            transparent.
          </p>
        </ScrollReveal>
        <ScrollReveal stagger={300}>
          <div className="button-row">
            <Link className="button button-primary" href="/alpha">
              Join the alpha
            </Link>
            <Link className="button" href="/alpha">
              View alpha details
            </Link>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal>
        <div className="hero-image-wrapper">
          <Image
            alt="Phoenix splash — AI-native game development"
            height={400}
            priority
            src="/images/phoenix-splash.png"
            style={{
              width: "100%",
              height: "auto",
            }}
            width={1120}
          />
        </div>
      </ScrollReveal>

      <hr className="section-separator" />

      {/* ── Studio tools ── */}
      <ScrollReveal>
        <div className="section-header">
          <h2>Everything you need. Nothing you don&apos;t.</h2>
          <p>
            Phoenix ships with a full creative studio built directly into the
            engine. Every tool talks to every other tool — and every tool
            can be driven by AI, by you, or by both at once.
          </p>
        </div>
      </ScrollReveal>
      <div className="grid">
        {studioTools.map((t, i) => (
          <GlowCard
            accent={["#f97316", "#a855f7", "#3b82f6", "#e11d48", "#10b981", "#f59e0b"][i]}
            icon={t.icon}
            index={i}
            key={t.title}
            title={t.title}
          >
            {t.text}
          </GlowCard>
        ))}
      </div>

      <hr className="section-separator" />

      {/* ── Autonomy spectrum ── */}
      <ScrollReveal>
        <div className="section-header">
          <h2>You set the dial</h2>
          <p>
            From zero AI to full autopilot — and every point in between. Move
            the dial session by session, task by task. There&apos;s no wrong
            answer.
          </p>
        </div>
      </ScrollReveal>
      <div className="grid">
        {spectrum.map((s, i) => (
          <GlowCard
            accent={["#3b82f6", "#10b981", "#f59e0b", "#e11d48"][i]}
            icon={s.icon}
            index={i}
            key={s.title}
            title={s.title}
          >
            {s.text}
          </GlowCard>
        ))}
      </div>

      <hr className="section-separator" />

      {/* ── Glass factory ── */}
      <ScrollReveal>
        <div className="section-header">
          <h2>A glass factory, not a black box</h2>
          <p>
            Most AI tools hide the work and hope you trust the output. Phoenix
            shows you everything — every agent action, every decision, every
            change — and puts a stop button on all of it.
          </p>
        </div>
      </ScrollReveal>
      <div className="grid">
        {glassFactory.map((g, i) => (
          <GlowCard
            accent={["#a855f7", "#f97316", "#6366f1", "#10b981"][i]}
            icon={g.icon}
            index={i}
            key={g.title}
            title={g.title}
          >
            {g.text}
          </GlowCard>
        ))}
      </div>

      <hr className="section-separator" />

      {/* ── Integrations / coming soon ── */}
      <ScrollReveal>
        <div className="section-header">
          <h2>The studio keeps growing</h2>
          <p>
            Phoenix is designed to expand. Integrations with the tools you already
            use — and new creative tools — are being added continuously.
          </p>
        </div>
      </ScrollReveal>
      <div className="grid">
        {integrations.map((t, i) => (
          <GlowCard
            accent={["#0ea5e9", "#6366f1", "#ec4899", "#8b5cf6"][i]}
            icon={t.icon}
            index={i}
            key={t.title}
            title={t.title}
          >
            <span className="coming-soon-badge">{t.status}</span>
            {" "}{t.text}
          </GlowCard>
        ))}
      </div>

      <hr className="section-separator" />

      {/* ── Stats ── */}
      <ScrollReveal>
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-value">6+</div>
            <div className="stat-label">Built-in studio tools</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">100%</div>
            <div className="stat-label">Open source</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">Godot</div>
            <div className="stat-label">Compatible</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">0→Full</div>
            <div className="stat-label">AI autonomy</div>
          </div>
        </div>
      </ScrollReveal>

      <hr className="section-separator" />

      {/* ── Alpha CTA ── */}
      <ScrollReveal>
        <div className="notice" style={{ textAlign: "center" }}>
          <p>
            <strong>Phoenix is entering alpha.</strong> We&apos;re looking for
            10–20 testers to get free extended access to the full managed
            service — all studio tools included — before the public beta.{" "}
            <Link className="inline-link" href="/alpha">
              Learn more &amp; sign up
            </Link>
          </p>
        </div>
      </ScrollReveal>

      {/* ── Inline signup ── */}
      <ScrollReveal>
        <div className="alpha-signup-block">
          <MailchimpSignupForm kind="alpha" />
        </div>
      </ScrollReveal>

      {/* ── Local AI notice ── */}
      <ScrollReveal>
        <div className="notice">
          <p>
            <strong>Local AI hosting is not currently supported.</strong> AI
            features require a remote model API connection — either through the
            managed service or your own cloud provider keys (BYOK, alpha testers
            only). Support for local models like Ollama or LM Studio may be added
            in the future. Want to help build it or vote for it?{" "}
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
      </ScrollReveal>

      <hr className="section-separator" />

      {/* ── Open source ── */}
      <ScrollReveal>
        <div className="section-header">
          <h2>Open source</h2>
          <p>
            Phoenix is built in the open. The engine, SDK, and website are all
            publicly available on GitHub.
          </p>
        </div>
      </ScrollReveal>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <GlowCard accent="#f97316" icon="🎮" index={0} title="Phoenix Agentic Engine">
          The Godot fork with the AI runtime, orchestration layer, and editor integrations. MIT licensed.
        </GlowCard>
        <GlowCard accent="#6366f1" icon="📦" index={1} title="Phoenix Interface SDK">
          The TypeScript SDK for connecting to the Phoenix backend gateway from the editor and external tools.
        </GlowCard>
        <GlowCard accent="#10b981" icon="🌐" index={2} title="This website">
          The public website frontend is open source too. Found a bug or want to improve the docs?
        </GlowCard>
      </div>

      <ScrollReveal>
        <div className="button-row" style={{ justifyContent: "center", paddingTop: "0.5rem" }}>
          <a
            className="button button-primary"
            href="https://github.com/rivie13/Phoenix-Agentic-Engine"
            rel="noopener noreferrer"
            target="_blank"
          >
            Explore on GitHub
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}
