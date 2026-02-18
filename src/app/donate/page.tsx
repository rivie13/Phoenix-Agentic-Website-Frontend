export default function DonatePage() {
  return (
    <section className="page">
      <div className="hero">
        <h1>Support Phoenix</h1>
        <p className="hero-tagline">
          Phoenix is free and open source. Donations help us keep it that way —
          funding development, infrastructure, and the community tools that make
          this project possible.
        </p>
      </div>

      <div className="grid">
        <article className="card">
          <div className="card-icon">🔥</div>
          <h2>Fund development</h2>
          <p>
            Your donation goes directly toward building new features, squashing
            bugs, and keeping Phoenix compatible with upstream Godot releases.
          </p>
        </article>
        <article className="card">
          <div className="card-icon">🌱</div>
          <h2>Support Godot too</h2>
          <p>
            10% of gross donations are allocated to Godot Foundation support.
            Phoenix wouldn&apos;t exist without the engine, and we want to give
            back.
          </p>
        </article>
        <article className="card">
          <div className="card-icon">🛠️</div>
          <h2>Keep it independent</h2>
          <p>
            Donations help us stay community-funded instead of VC-backed. That
            means our incentives stay aligned with yours.
          </p>
        </article>
      </div>

      <div className="notice">
        <p>
          <strong>Transparency note:</strong> Donation payment processing will be
          handled through our secure backend. We&apos;ll publish a breakdown of
          how funds are used once the program is live. 10% of gross donations
          are allocated to Godot Foundation support.
        </p>
      </div>
    </section>
  );
}
