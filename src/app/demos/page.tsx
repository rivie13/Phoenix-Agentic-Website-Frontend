import Link from "next/link";

const demos = [
  {
    icon: "🎮",
    title: "2D Platformer in 5 minutes",
    description:
      "Watch Phoenix scaffold a playable 2D platformer — tilemap, player controller, and camera — from a single prompt.",
    status: "Video coming soon",
    tier: "All tiers",
  },
  {
    icon: "💬",
    title: "Ask mode: learning GDScript",
    description:
      "See how Ask mode explains engine concepts, suggests code patterns, and links to relevant docs — all inline.",
    status: "Video coming soon",
    tier: "All tiers",
  },
  {
    icon: "📋",
    title: "Plan mode: refactoring a scene",
    description:
      "The assistant builds a step-by-step refactoring plan. You review each step, tweak what you want, then approve.",
    status: "Video coming soon",
    tier: "All tiers",
  },
  {
    icon: "🤖",
    title: "Multi-agent: enemies + level design",
    description:
      "Parallel specialist agents create enemy scenes, write AI scripts, and wire up level logic — all coordinated automatically.",
    status: "Video coming soon",
    tier: "Managed tiers",
  },
  {
    icon: "🎨",
    title: "Pixel art generation",
    description:
      "Generate character sprites and tilesets with fine-tuned models. Preview, tweak, and import without leaving the editor.",
    status: "Video coming soon",
    tier: "Managed tiers",
  },
  {
    icon: "🔊",
    title: "SFX & MIDI music",
    description:
      "Create jump sounds, explosions, and background music with premium sound-profile intelligence and MIDI production agents.",
    status: "Video coming soon",
    tier: "Managed tiers",
  },
];

export default function DemosPage() {
  return (
    <section className="page">
      <div className="hero">
        <h1>See Phoenix in action</h1>
        <p className="hero-tagline">
          We&apos;re putting together demo videos that show real workflows —
          not cherry-picked highlights, but actual development sessions.
          Check back soon.
        </p>
      </div>

      <div className="grid">
        {demos.map((demo) => (
          <article className="card" key={demo.title}>
            <div className="card-icon">{demo.icon}</div>
            <h2>{demo.title}</h2>
            <p>{demo.description}</p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "auto" }}>
              <span className="label">{demo.status}</span>
              {demo.tier === "Managed tiers" && (
                <span className="label" style={{ background: "var(--accent)", color: "#000" }}>
                  {demo.tier}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="notice">
        <p>
          Want to try it yourself?{" "}
          <Link className="inline-link" href="/download">
            Download Phoenix
          </Link>{" "}
          and follow the quick-start guide in the docs.
        </p>
      </div>
    </section>
  );
}
