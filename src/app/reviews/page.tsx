export default function ReviewsPage() {
  return (
    <section className="page">
      <h1>Reviews</h1>
      <p>Community feedback from early teams using Phoenix workflows in production.</p>
      <div className="grid">
        <article className="card">
          <h2>Studio pipeline lead</h2>
          <p>
            Phoenix reduced handoff friction and gave us a predictable path from
            prompt to reviewed code.
          </p>
        </article>
        <article className="card">
          <h2>Indie creator</h2>
          <p>
            The account and download flow is straightforward and keeps tooling
            updates easy to manage.
          </p>
        </article>
      </div>
    </section>
  );
}
