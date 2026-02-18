"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function AuthControls() {
  const { status } = useSession();

  if (status === "authenticated") {
    return (
      <div className="button-row">
        <Link className="button" href="/account">
          Dashboard
        </Link>
        <button
          className="button"
          onClick={() => void signOut({ callbackUrl: "/" })}
          type="button"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Link className="button button-primary" href="/signin">
      Sign in with Entra
    </Link>
  );
}
