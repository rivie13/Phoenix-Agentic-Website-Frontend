import Link from "next/link";

const posts = [
  {
    date: "Coming soon",
    title: "Why we forked Godot",
    preview:
      "The story behind Phoenix — why we chose Godot as a foundation, what we're adding, and what we're committed to keeping the same.",
  },
  {
    date: "Coming soon",
    title: "How Ask / Plan / Agent actually works",
    preview:
      "A deep dive into the three modes, how they interact with the editor, and why giving users control matters more than autonomy.",
  },
  {
    date: "Coming soon",
    title: "BYOK and the case against vendor lock-in",
    preview:
      "How Phoenix handles model providers, why we default to bring-your-own-key, and what the managed option will look like.",
  },
];

export default function BlogPage() {
  return (
    <section className="page">
      <div className="hero">
        <h1>Blog</h1>
        <p className="hero-tagline">
          Development updates, technical deep dives, and the occasional strong
          opinion about game dev tooling.
        </p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
        {posts.map((post) => (
          <article className="card" key={post.title}>
            <span className="label">{post.date}</span>
            <h2>{post.title}</h2>
            <p>{post.preview}</p>
          </article>
        ))}
      </div>

      <div className="empty-state">
        <h2>First posts are on the way</h2>
        <p>
          We&apos;re writing — not generating. Check back soon, or follow the{" "}
          <Link className="inline-link" href="/docs">
            docs
          </Link>{" "}
          for the latest technical details.
        </p>
      </div>
    </section>
  );
}
