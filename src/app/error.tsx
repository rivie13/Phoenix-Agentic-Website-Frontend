"use client";

import Link from "next/link";
import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to console in development; swap for telemetry in production
    console.error("[Phoenix] Unhandled error:", error);
  }, [error]);

  return (
    <div className="error-page">
      <div className="error-page-inner">
        <p className="error-code">500</p>
        <h1 className="error-heading">Something went wrong</h1>
        <p className="error-body">
          An unexpected error occurred. You can try again or head back home.
        </p>
        {error.digest && (
          <p className="error-digest">Error ID: {error.digest}</p>
        )}
        <div className="error-actions button-row">
          <button className="button button-primary" onClick={reset} type="button">
            Try again
          </button>
          <Link className="button" href="/">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
