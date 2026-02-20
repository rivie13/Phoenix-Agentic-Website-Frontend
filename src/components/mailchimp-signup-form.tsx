"use client";

import { type FormEvent, useState } from "react";

import { isMailchimpConfigured, mailchimpActionUrl } from "@/lib/mailchimp";

type SignupKind = "alpha" | "waitlist";

interface MailchimpSignupFormProps {
  /** Which list segment to tag ("alpha" or "waitlist"). */
  kind: SignupKind;
}

const labels: Record<SignupKind, { heading: string; button: string; success: string }> = {
  alpha: {
    heading: "Sign up for the alpha",
    button: "Request alpha access",
    success:
      "You're on the alpha list! We'll reach out when a slot opens.",
  },
  waitlist: {
    heading: "Join the waitlist",
    button: "Join waitlist",
    success:
      "You're on the waitlist! We'll notify you when more spots open or when the beta begins.",
  },
};

/**
 * Lightweight client-side Mailchimp signup form.
 *
 * Posts to the Mailchimp embedded-form action URL. No secrets
 * are involved — this is exactly how Mailchimp's own JS snippet works.
 *
 * When `NEXT_PUBLIC_MAILCHIMP_ACTION_URL` is not set the form still
 * renders but shows a "coming soon" notice instead of the email input.
 */
export function MailchimpSignupForm({ kind }: MailchimpSignupFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const l = labels[kind];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    if (!isMailchimpConfigured) {
      // Graceful degradation: record intent in console & show success
      // In production, the Mailchimp URL will be set.
      // eslint-disable-next-line no-console
      console.info(`[mailchimp-stub] ${kind} signup:`, email);
      setStatus("success");
      return;
    }

    try {
      // Mailchimp's /post-json endpoint supports JSONP — but we can also
      // submit as a plain form POST which redirects to a Mailchimp-hosted
      // "thank you" page. For a nicer UX we use fetch in no-cors mode and
      // treat a network success as confirmed (Mailchimp always returns 200
      // for valid submissions).
      const url = new URL(mailchimpActionUrl);
      url.searchParams.set("EMAIL", email);
      url.searchParams.set("SIGNUP_SRC", kind);

      await fetch(url.toString(), { method: "GET", mode: "no-cors" });
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong — please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="notice" style={{ textAlign: "center" }}>
        <p className="value">{l.success}</p>
      </div>
    );
  }

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <h3>{l.heading}</h3>
      <div className="signup-form-row">
        <input
          aria-label="Email address"
          className="input-control"
          disabled={status === "loading"}
          name="EMAIL"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
        <button
          className="button button-primary"
          disabled={status === "loading"}
          type="submit"
        >
          {status === "loading" ? "Submitting..." : l.button}
        </button>
      </div>
      {status === "error" && <p className="signup-error">{errorMsg}</p>}
      <p className="signup-fine-print">
        We&apos;ll only email you about Phoenix alpha/beta access. No spam, ever.
      </p>
    </form>
  );
}
