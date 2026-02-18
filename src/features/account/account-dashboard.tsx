"use client";

import { useCallback, useEffect, useState } from "react";

import { EmptyState, ErrorState, LoadingState } from "@/components/ui-states";
import {
  type AccountSummary,
  type DownloadItem,
  type EntitlementSummary,
  type UserSummary,
} from "@/lib/api-client";

interface AccountSummaryResponse {
  me: UserSummary | null;
  account: AccountSummary | null;
  entitlements: EntitlementSummary[];
  downloads: DownloadItem[];
}

export function AccountDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AccountSummaryResponse | null>(null);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/account/summary", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error();
      }

      const payload = (await response.json()) as AccountSummaryResponse;
      setData(payload);
    } catch {
      setError("Unable to load account data right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  if (loading) {
    return <LoadingState label="Loading your account..." />;
  }

  if (error) {
    return (
      <ErrorState
        actions={
          <button className="button" onClick={() => void loadSummary()} type="button">
            Retry
          </button>
        }
        message={error}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        description="No account payload was returned from the backend."
        title="No account data"
      />
    );
  }

  const noAccountData =
    !data.me &&
    !data.account &&
    data.entitlements.length === 0 &&
    data.downloads.length === 0;

  if (noAccountData) {
    return (
      <EmptyState
        description="Sign-in is active, but the account has no linked records yet."
        title="Account is empty"
      />
    );
  }

  return (
    <section className="page">
      <h1>Account dashboard</h1>
      <p>Data is loaded from protected backend endpoints with your Entra session.</p>

      <div className="grid">
        <article className="card">
          <h2>Profile</h2>
          <span className="label">Display name</span>
          <span className="value">{data.me?.displayName ?? "Not provided"}</span>
          <span className="label">Email</span>
          <span className="value">{data.me?.email ?? "Not provided"}</span>
        </article>

        <article className="card">
          <h2>Plan</h2>
          <span className="label">Current plan</span>
          <span className="value">{data.account?.plan ?? "None"}</span>
          <span className="label">Status</span>
          <span className="value">{data.account?.status ?? "Unknown"}</span>
        </article>
      </div>

      <div className="grid">
        <article className="card">
          <h2>Entitlements</h2>
          {data.entitlements.length === 0 ? (
            <p>No active entitlements were returned.</p>
          ) : (
            <ul>
              {data.entitlements.map((item) => (
                <li key={item.code}>
                  {item.code} — {item.active ? "Active" : "Inactive"}
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="card">
          <h2>Downloads</h2>
          {data.downloads.length === 0 ? (
            <p>No downloads are currently available.</p>
          ) : (
            <ul>
              {data.downloads.map((item) => (
                <li key={item.id}>
                  {item.url ? (
                    <a className="inline-link" href={item.url} rel="noreferrer" target="_blank">
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </section>
  );
}
