import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy — Phoenix",
  description:
    "How Phoenix handles account, billing, entitlement, download, and runtime data across the website and backend services.",
};

export default function PrivacyPage() {
  return (
    <section className="page">
      <div className="hero">
        <h1>Privacy</h1>
        <p className="hero-tagline">
          This page explains our current data status and the types of user data
          we may store in the future once account and service features are live.
        </p>
      </div>

      <div className="notice">
        <p>
          <strong>Last updated:</strong> February 20, 2026.
        </p>
      </div>

      <div className="section-header">
        <h2>Current status</h2>
      </div>
      <div className="notice">
        <p>
          We are not currently collecting or storing active user account,
          billing, or entitlement data at this time.
        </p>
      </div>

      <div className="section-header">
        <h2>Data we may store in the future</h2>
      </div>
      <div className="grid">
        <article className="card">
          <h2>Account and identity info</h2>
          <ul className="feature-list">
            <li>Name and email address</li>
            <li>Basic account profile details</li>
            <li>Authentication/account status information</li>
          </ul>
        </article>

        <article className="card">
          <h2>Billing and purchase records</h2>
          <ul className="feature-list">
            <li>Subscription and plan status</li>
            <li>Donation or purchase transaction metadata</li>
            <li>Payment-related account references</li>
          </ul>
        </article>
        <article className="card">
          <h2>Product access and usage data</h2>
          <ul className="feature-list">
            <li>Feature entitlement and access state</li>
            <li>Download access and grant history</li>
            <li>Service activity and operational logs</li>
          </ul>
        </article>

        <article className="card">
          <h2>Optional communication data</h2>
          <ul className="feature-list">
            <li>Alpha/waitlist signup email information</li>
            <li>Support or contact request content</li>
            <li>Notification preferences</li>
          </ul>
        </article>
      </div>

      <div className="section-header">
        <h2>What we do not sell</h2>
      </div>
      <div className="notice">
        <p>
          We do not sell personal user data.
        </p>
      </div>

      <div className="section-header">
        <h2>Questions and requests</h2>
      </div>
      <div className="notice">
        <p>
          For privacy questions or data requests, use the project issue tracker
          and label your request clearly so we can route it to the right
          maintainers.
        </p>
        <div className="button-row" style={{ marginTop: "0.75rem" }}>
          <a
            className="button"
            href="https://github.com/rivie13/Phoenix-Agentic-Website-Frontend/issues"
            rel="noopener noreferrer"
            target="_blank"
          >
            Open a privacy request
          </a>
        </div>
      </div>

      <div className="notice">
        <p>
          We will keep this page updated as features launch and data handling
          changes over time.
        </p>
      </div>
    </section>
  );
}