export default function DemosPage() {
  return (
    <section className="page">
      <h1>Demos</h1>
      <p>
        Explore demo workflows for Phoenix-assisted development, runtime testing,
        and multi-agent orchestration previews.
      </p>
      <div className="grid">
        <article className="card">
          <h2>Editor workflow demo</h2>
          <p>Guided authoring from intent to runnable project updates.</p>
        </article>
        <article className="card">
          <h2>Backend orchestration demo</h2>
          <p>Multi-agent coordination with traceable execution states.</p>
        </article>
      </div>
    </section>
  );
}
