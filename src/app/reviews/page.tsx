import Link from "next/link";

const principles = [
  {
    icon: "🔍",
    title: "Every change is visible",
    text: "Proposed edits appear as diffs before they touch your project. Nothing happens behind your back.",
  },
  {
    icon: "✋",
    title: "You approve everything",
    text: "Plans require sign-off. Agent actions have approval gates. You can pause or stop at any time.",
  },
  {
    icon: "📜",
    title: "Full audit trail",
    text: "Every action, every tool call, every model response is logged with timestamps and context.",
  },
  {
    icon: "↩️",
    title: "Undo-friendly",
    text: "Changes go through the editor's undo stack. If something isn't right, Ctrl+Z works like it always has.",
  },
];

export default function ReviewsPage() {
  return (
    <section className="page">
      <div className="hero">
        <h1>Built on trust, not hype</h1>
        <p className="hero-tagline">
          Phoenix is pre-release — we don&apos;t have user testimonials yet,
          and we&apos;re not going to make them up. Here&apos;s what we can
          tell you about how the tool is designed.
        </p>
      </div>

      <div className="section-header">
        <h2>How Phoenix earns your trust</h2>
        <p>
          Instead of marketing quotes, here are the design principles we
          actually build against.
        </p>
      </div>

      <div className="grid">
        {principles.map((p) => (
          <article className="card" key={p.title}>
            <div className="card-icon">{p.icon}</div>
            <h2>{p.title}</h2>
            <p>{p.text}</p>
          </article>
        ))}
      </div>

      <div className="empty-state">
        <h2>Real reviews are coming</h2>
        <p>
          Once Phoenix hits public release, this page will feature genuine
          feedback from real users. Until then,{" "}
          <Link className="inline-link" href="/download">
            try it yourself
          </Link>{" "}
          and let us know what you think.
        </p>
      </div>
    </section>
  );
}
