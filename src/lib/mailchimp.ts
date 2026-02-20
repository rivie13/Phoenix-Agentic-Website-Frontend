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
 * The component uses the `/post-json` variant of the same URL
 * so we can handle success/error client-side without a redirect.
 */

/** Mailchimp hosted subscribe form action URL. */
export const mailchimpActionUrl =
  process.env.NEXT_PUBLIC_MAILCHIMP_ACTION_URL ?? "";

/**
 * Audience-level tag values used to segment alpha vs waitlist signups.
 * These map to Mailchimp merge fields or tags — configure in your
 * audience settings.
 */
export const MAILCHIMP_TAGS = {
  ALPHA: "alpha-signup",
  WAITLIST: "waitlist-signup",
} as const;

/** Whether Mailchimp is configured (env var present and non-empty). */
export const isMailchimpConfigured = mailchimpActionUrl.length > 0;
