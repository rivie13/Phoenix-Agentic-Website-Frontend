import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export default async function DownloadPage() {
  const session = await getServerSession(authOptions);

  return (
    <section className="page">
      <h1>Download</h1>
      <p>
        Download permissions are entitlement-aware and authorized by the private
        backend.
      </p>
      {session ? (
        <div className="notice">
          <p>You are signed in. Go to your dashboard for available downloads.</p>
          <div className="button-row">
            <Link className="button button-primary" href="/account">
              Open account dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="notice">
          <p>Sign in to see your entitled download packages.</p>
          <div className="button-row">
            <Link className="button button-primary" href="/signin?callbackUrl=/download">
              Sign in
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
