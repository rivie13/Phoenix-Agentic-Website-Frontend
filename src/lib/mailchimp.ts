/**
 * Mailchimp embedded-form configuration.
 *
 * The frontend never touches Mailchimp API keys — it posts directly
 * to the Mailchimp-hosted subscribe endpoint (the same URL used by
 * Mailchimp's own embedded-form snippet).
 *
 * To configure:
 *  1. Create a Mailchimp audience (list).
 *  2. Go to Audience → Signup forms → Embedded forms.
 *  3. Copy the `action` URL — it looks like:
 *     https://<dc>.list-manage.com/subscribe/post?u=<u>&id=<id>
 *  4. Set the NEXT_PUBLIC_MAILCHIMP_ACTION_URL env var.
 *
 * The signup component converts this URL to the `/post-json` variant
 * for JSONP-based client-side success/error handling.
 */

/** Mailchimp hosted subscribe form action URL. */
const rawMailchimpActionUrl =
  process.env.NEXT_PUBLIC_MAILCHIMP_ACTION_URL ?? "";

export const mailchimpActionUrl = rawMailchimpActionUrl.trim();

/**
 * Audience-level tag values used to segment alpha vs waitlist signups.
 * These map to Mailchimp merge fields or tags — configure in your
 * audience settings.
 */
export const MAILCHIMP_TAGS = {
  ALPHA: "alpha-signup",
  WAITLIST: "waitlist-signup",
} as const;

function isValidMailchimpActionUrl(value: string): boolean {
  if (!value) {
    return false;
  }

  try {
    const parsed = new URL(value);
    if (!/^https?:$/.test(parsed.protocol)) {
      return false;
    }

    if (!parsed.hostname.endsWith("list-manage.com")) {
      return false;
    }

    return /\/subscribe\/post(-json)?$/.test(parsed.pathname);
  } catch {
    return false;
  }
}

/** Whether Mailchimp is configured with a valid action URL. */
export const isMailchimpConfigured = isValidMailchimpActionUrl(mailchimpActionUrl);
