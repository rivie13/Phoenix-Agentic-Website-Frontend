import Image from "next/image";
import Link from "next/link";

import { getAllPosts } from "@/lib/blog";

/* ── Planned posts (not yet written) ── */
const planned = [
  {
    title: "Why we forked Godot",
    preview:
      "The story behind Phoenix — why we chose Godot as a foundation, what we're adding, and what we're committed to keeping the same.",
  },
  {
    title: "How Ask / Plan / Agent actually works",
    preview:
      "A deep dive into the three modes, how they interact with the editor, and why giving users control matters more than autonomy.",
  },
  {
    title: "BYOK and the case against vendor lock-in",
    preview:
      "How Phoenix handles model providers, why we default to bring-your-own-key, and what the managed option will look like.",
  },
];

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <section className="page">
      <div className="hero">
        <h1>Blog</h1>
        <p className="hero-tagline">
          Development updates, technical deep dives, and the occasional strong
          opinion about game dev tooling.
        </p>
      </div>

      {/* ── Published posts ── */}
      {posts.length > 0 && (
        <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
          {posts.map((post) => (
            <Link
              className="blog-card-link"
              href={`/blog/${post.slug}`}
              key={post.slug}
            >
              <article className="card blog-card">
                <div className="blog-card-header">
                  <Image
                    alt=""
                    className="blog-card-hero"
                    height={160}
                    src={post.heroImage}
                    width={320}
                  />
                  <div className="blog-card-badges">
                    <span className="label">{post.date}</span>
                    {post.aiGenerated && (
                      <span className="badge-ai">AI-Generated</span>
                    )}
                  </div>
                </div>
                <h2>{post.title}</h2>
                <p>{post.summary}</p>
                <span className="blog-card-author">By {post.author}</span>
              </article>
            </Link>
          ))}
        </div>
      )}

      {/* ── Planned (coming soon) ── */}
      <div className="section-header">
        <h2>Coming soon</h2>
        <p>These posts are being written by humans — check back soon.</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
        {planned.map((post) => (
          <article className="card" key={post.title}>
            <span className="label">Coming soon</span>
            <h2>{post.title}</h2>
            <p>{post.preview}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
