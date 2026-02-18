"use client";

import { signIn } from "next-auth/react";

interface SignInPanelProps {
  callbackUrl: string;
  isConfigured: boolean;
}

export function SignInPanel({ callbackUrl, isConfigured }: SignInPanelProps) {
  return (
    <section className="page">
      <h1>Sign in</h1>
      <p>
        Authenticate with Microsoft Entra ID to access your account dashboard,
        billing actions, and entitled downloads.
      </p>
      {!isConfigured ? (
        <div className="notice error">
          Entra configuration is missing. Add required environment values before
          testing sign-in.
        </div>
      ) : null}
      <div className="button-row">
        <button
          className="button button-primary"
          disabled={!isConfigured}
          onClick={() => void signIn("azure-ad", { callbackUrl })}
          type="button"
        >
          Continue with Entra ID
        </button>
      </div>
    </section>
  );
}
