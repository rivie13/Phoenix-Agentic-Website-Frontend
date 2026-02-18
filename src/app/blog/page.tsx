const posts = [
  {
    slug: "roadmap-update",
    title: "Roadmap update",
    summary: "Milestone progress across public frontend and private backend integration.",
  },
  {
    slug: "security-boundary",
    title: "Security boundary notes",
    summary: "How the public frontend delegates authority to private backend services.",
  },
];

export default function BlogPage() {
  return (
    <section className="page">
      <h1>Blog</h1>
      <p>Product updates, architecture notes, and release communications.</p>
      <div className="grid">
        {posts.map((post) => (
          <article className="card" key={post.slug}>
            <h2>{post.title}</h2>
            <p>{post.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
