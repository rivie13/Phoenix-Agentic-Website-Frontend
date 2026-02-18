import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export default async function DownloadPage() {
  const session = await getServerSession(authOptions);

  return (
    <section className="page">
      <div className="hero">
        <h1>Download Phoenix</h1>
        <p className="hero-tagline">
          Get started in minutes. Phoenix runs on Windows, macOS, and Linux —
          just like Godot.
        </p>
      </div>

      {session ? (
        <div className="notice">
          <p>
            <strong>You&apos;re signed in.</strong> Head to your dashboard to
            see available downloads and manage your account.
          </p>
          <div className="button-row" style={{ marginTop: "0.75rem" }}>
            <Link className="button button-primary" href="/account">
              Go to dashboard
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid">
            <article className="card">
              <div className="card-icon">🖥️</div>
              <h2>Windows</h2>
              <p>Windows 10+ (x86_64)</p>
            </article>
            <article className="card">
              <div className="card-icon">🍎</div>
              <h2>macOS</h2>
              <p>macOS 12+ (Universal)</p>
            </article>
            <article className="card">
              <div className="card-icon">🐧</div>
              <h2>Linux</h2>
              <p>x86_64, glibc 2.28+</p>
            </article>
          </div>

          <div className="notice">
            <p>
              Sign in to access downloads. We use Microsoft Entra ID for secure
              authentication — no extra account to create.
            </p>
            <div className="button-row" style={{ marginTop: "0.75rem" }}>
              <Link
                className="button button-primary"
                href="/signin?callbackUrl=/download"
              >
                Sign in to download
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
