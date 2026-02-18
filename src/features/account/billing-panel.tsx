"use client";

import { useState } from "react";

import { ErrorState } from "@/components/ui-states";

type BillingAction = "checkout" | "portal";

export function BillingPanel() {
  const [pendingAction, setPendingAction] = useState<BillingAction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAction = async (action: BillingAction) => {
    setPendingAction(action);
    setError(null);

    try {
      const response = await fetch("/api/account/billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error();
      }

      const payload = (await response.json()) as { url?: string };

      if (payload.url) {
        window.location.assign(payload.url);
        return;
      }
    } catch {
      setError("Unable to start billing action right now. Please try again.");
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <section className="page">
      <h1>Billing</h1>
      <p>
        Billing actions are delegated to the private backend. The frontend never
        holds Stripe secret keys.
      </p>
      {error ? <ErrorState message={error} /> : null}
      <div className="button-row">
        <button
          className="button button-primary"
          disabled={pendingAction !== null}
          onClick={() => void runAction("checkout")}
          type="button"
        >
          Start checkout
        </button>
        <button
          className="button"
          disabled={pendingAction !== null}
          onClick={() => void runAction("portal")}
          type="button"
        >
          Open customer portal
        </button>
      </div>
    </section>
  );
}
