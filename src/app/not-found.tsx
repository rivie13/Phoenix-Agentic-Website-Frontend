import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Page Not Found | Phoenix",
  description: "The page you were looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="error-page">
      <div className="error-page-inner">
        <p className="error-code">404</p>
        <h1 className="error-heading">Page not found</h1>
        <p className="error-body">
          The page you were looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="error-actions button-row">
          <Link className="button button-primary" href="/">
            Go home
          </Link>
          <Link className="button" href="/alpha">
            Join the alpha
          </Link>
        </div>
      </div>
    </div>
  );
}
