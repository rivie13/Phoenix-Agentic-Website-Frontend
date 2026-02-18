export default function PricingPage() {
  return (
    <section className="page">
      <h1>Pricing</h1>
      <p>
        Pricing and billing actions are backend-authoritative. Use your account
        dashboard for checkout and subscription management.
      </p>
      <div className="grid">
        <article className="card">
          <h2>Creator</h2>
          <p>Entry tier for individual experimentation and personal projects.</p>
        </article>
        <article className="card">
          <h2>Studio</h2>
          <p>Team-focused workflows, governance controls, and usage visibility.</p>
        </article>
        <article className="card">
          <h2>Enterprise</h2>
          <p>Private deployment patterns, compliance support, and onboarding.</p>
        </article>
      </div>
    </section>
  );
}
