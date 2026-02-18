import Link from "next/link";

const highlights = [
  {
    title: "Build with confidence",
    text: "Ship deterministic workflows and agentic tooling aligned to your pipeline.",
  },
  {
    title: "Stay secure by default",
    text: "Public frontend UX with backend-owned billing, entitlements, and downloads.",
  },
  {
    title: "Scale with your team",
    text: "Entra-linked account experiences designed for organizations and creators.",
  },
];

export default function HomePage() {
  return (
    <section className="page">
      <h1>Phoenix Agentic Engine</h1>
      <p>
        Public product hub for downloads, pricing, demos, reviews, documentation,
        and account management.
      </p>
      <div className="button-row">
        <Link className="button button-primary" href="/download">
          Download
        </Link>
        <Link className="button" href="/pricing">
          View pricing
        </Link>
      </div>
      <div className="grid">
        {highlights.map((item) => (
          <article className="card" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
