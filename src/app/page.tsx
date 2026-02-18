import Image from "next/image";
import Link from "next/link";

/* ── Autonomy spectrum ── */
const spectrum = [
  {
    icon: "🎯",
    title: "Full manual",
    text: "Use Phoenix as a straight Godot editor. No AI, no cloud, no strings attached. It's your project.",
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

/* ── Platform highlights ── */
const highlights = [
  {
    icon: "🤝",
    title: "Multi-agent orchestration",
    text: "Parallel specialist agents for code, art, sound, and project management — coordinated automatically. Available on managed tiers.",
  },
  {
    icon: "🎨",
    title: "Pixel art, MIDI & SFX",
    text: "Generate sprites, sound effects, and music with fine-tuned models — without leaving the editor. Available on managed tiers.",
  },
  {
    icon: "🔌",
    title: "Extensible tool system",
    text: "Docs, Trello, GitHub, CI pipelines — plug in what you need. Managed tiers unlock full DevOps automation.",
  },
  {
    icon: "📦",
    title: "Works offline",
    text: "No connection? The full Godot editor still works. You just lose AI features until you're back online.",
  },
];

export default function HomePage() {
  return (
    <section className="page">
      <div className="hero">
        <div className="hero-badge">Open Source &middot; MIT Licensed</div>
        <h1>
          A glass factory
          <br />
          for game development
        </h1>
        <p className="hero-tagline">
          Most AI tools are dark factories — things happen and you hope for the
          best. Phoenix is a glass factory. Go as deep into creation as you
          want: let agents build entire systems, do everything yourself with no
          AI at all, or find the spot in the middle where you're most
          productive. Every wall is transparent. Every switch is yours.
        </p>
        <div className="button-row">
          <Link className="button button-primary" href="/pricing">
            Start free trial
          </Link>
          <Link className="button" href="/docs">
            Read the docs
          </Link>
        </div>
      </div>

      <Image
        alt="Phoenix splash — AI-native game development"
        height={400}
        priority
        src="/images/phoenix-splash.png"
        style={{
          width: "100%",
          height: "auto",
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
        }}
        width={1120}
      />

      {/* ── Autonomy spectrum ── */}
      <div className="section-header">
        <h2>You set the dial</h2>
        <p>
          From zero AI to full autopilot — and every point in between. Move the
          dial session by session, task by task. There&apos;s no wrong answer.
        </p>
      </div>
      <div className="grid">
        {spectrum.map((s) => (
          <article className="card" key={s.title}>
            <div className="card-icon">{s.icon}</div>
            <h2>{s.title}</h2>
            <p>{s.text}</p>
          </article>
        ))}
      </div>

      {/* ── Glass factory ── */}
      <div className="section-header">
        <h2>Why &ldquo;glass factory&rdquo;?</h2>
        <p>
          Dark factories hide the work. Glass factories let you watch every
          step, intervene whenever you want, and walk away knowing exactly what
          changed.
        </p>
      </div>
      <div className="grid">
        {glassFactory.map((g) => (
          <article className="card" key={g.title}>
            <div className="card-icon">{g.icon}</div>
            <h2>{g.title}</h2>
            <p>{g.text}</p>
          </article>
        ))}
      </div>

      {/* ── Platform highlights ── */}
      <div className="section-header">
        <h2>What the platform can do</h2>
      </div>
      <div className="grid">
        {highlights.map((h) => (
          <article className="card" key={h.title}>
            <div className="card-icon">{h.icon}</div>
            <h2>{h.title}</h2>
            <p>{h.text}</p>
          </article>
        ))}
      </div>

      {/* ── CTA ── */}
      <div className="notice">
        <p>
          <strong>7-day free trial.</strong> Try the full managed experience —
          multi-agent orchestration, creative tools, everything — with 50
          request units and no credit card.{" "}
          <Link className="inline-link" href="/pricing">
            See pricing
          </Link>
        </p>
      </div>
    </section>
  );
}
