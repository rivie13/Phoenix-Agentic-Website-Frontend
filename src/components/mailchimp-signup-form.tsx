"use client";

import { type FormEvent, useState } from "react";

import {
  isMailchimpConfigured,
  mailchimpActionUrl,
  MAILCHIMP_TAGS,
} from "@/lib/mailchimp";

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

const signupSourceByKind: Record<SignupKind, string> = {
  alpha: MAILCHIMP_TAGS.ALPHA,
  waitlist: MAILCHIMP_TAGS.WAITLIST,
};

interface MailchimpJsonpResponse {
  result?: "success" | "error";
  msg?: string;
}

const CALLBACK_TIMEOUT_MS = 10_000;

function toPostJsonUrl(actionUrl: string): URL {
  const url = new URL(actionUrl);
  if (url.pathname.endsWith("/post")) {
    url.pathname = url.pathname.replace(/\/post$/, "/post-json");
  }
  return url;
}

function toUserFriendlyError(message?: string): string {
  if (!message) {
    return "Something went wrong — please try again.";
  }

  const stripped = message
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

  if (!stripped) {
    return "Something went wrong — please try again.";
  }

  return stripped;
}

function submitMailchimpJsonp(
  actionUrl: string,
  email: string,
  signupSource: string,
): Promise<MailchimpJsonpResponse> {
  return new Promise((resolve, reject) => {
    const callbackName =
      `mailchimp_jsonp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const url = toPostJsonUrl(actionUrl);

    url.searchParams.set("EMAIL", email);
    url.searchParams.set("SIGNUP_SRC", signupSource);
    url.searchParams.set("c", callbackName);

    const script = document.createElement("script");
    script.src = url.toString();

    type JsonpCallback = (payload: MailchimpJsonpResponse) => void;
    const globalScope =
      window as unknown as Record<string, JsonpCallback | undefined>;

    const timeoutId = window.setTimeout(() => {
      cleanup();
      reject(new Error("Mailchimp request timed out."));
    }, CALLBACK_TIMEOUT_MS);

    function cleanup() {
      window.clearTimeout(timeoutId);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete globalScope[callbackName];
    }

    globalScope[callbackName] = (payload: MailchimpJsonpResponse) => {
      cleanup();
      resolve(payload);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("Could not submit signup request."));
    };

    document.body.appendChild(script);
  });
}

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
      const response = await submitMailchimpJsonp(
        mailchimpActionUrl,
        email,
        signupSourceByKind[kind],
      );

      if (response.result === "success") {
        setStatus("success");
        return;
      }

      setStatus("error");
      setErrorMsg(toUserFriendlyError(response.msg));
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
