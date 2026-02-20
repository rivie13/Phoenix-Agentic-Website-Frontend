# Mailchimp Integration — Setup Guide

## Overview

The alpha/waitlist signup forms on the Phoenix website post directly to
Mailchimp's hosted subscribe endpoint. **No API keys or secrets touch the
frontend** — this is the same mechanism Mailchimp's own embedded-form JS
snippet uses, just wrapped in a React component for a nicer UX.

There are two signup segments:

| Form | Purpose | Mailchimp tag |
|------|---------|---------------|
| Alpha signup | Request one of the 10–20 alpha tester slots | `alpha-signup` |
| Waitlist signup | Queue for extra alpha slots / future beta | `waitlist-signup` |

---

## Step-by-step setup

### 1. Create a Mailchimp account (if you don't have one)

Go to <https://mailchimp.com> and create a free account.  
The free plan supports up to 500 contacts — more than enough for alpha/beta.

### 2. Create an Audience (list)

1. Log in → **Audience** → **Audience dashboard**.
2. Click **Manage Audience** → **Settings**.
3. Name it something like `Phoenix Alpha/Beta Testers`.
4. Fill in the required defaults (from-email, address, etc.).

### 3. Add a merge field for signup source

This lets you distinguish alpha vs waitlist signups in Mailchimp.

1. **Audience** → **Settings** → **Audience fields and `|MERGE|` tags**.
2. Click **Add A Field** → **Text**.
3. Set:
   - **Field label:** `Signup Source`
   - **Merge tag:** `SIGNUP_SRC`
4. Save.

The frontend form automatically sends `SIGNUP_SRC=alpha-signup` or
`SIGNUP_SRC=waitlist-signup` so you can segment/filter on it.

### 4. Get the embedded-form action URL

1. **Audience** → **Signup forms** → **Embedded forms**.
2. Mailchimp will show you a block of HTML. Look for the `<form>` tag's
   `action` attribute. It looks like:

   ```
   https://YOUR-DC.list-manage.com/subscribe/post?u=XXXXXXXXXXXXXXX&id=YYYYYYYYYY
   ```

   - `YOUR-DC` is your Mailchimp data center (e.g. `us21`).
   - `u=` is your account's unique user ID.
   - `id=` is the audience (list) ID.

3. Copy the full URL.

### 5. Set the environment variable

Create or edit your `.env.local` file in the website frontend repo root:

```env
NEXT_PUBLIC_MAILCHIMP_ACTION_URL=https://YOUR-DC.list-manage.com/subscribe/post?u=XXXXXXXXXXXXXXX&id=YYYYYYYYYY
```

For production deployments (e.g. Vercel, Azure Static Web Apps), set this
same env var in your hosting platform's environment configuration.

> **Important:** This is a `NEXT_PUBLIC_` variable, which means it's embedded
> in the client bundle. That's fine — the URL is meant to be public (it's the
> same URL Mailchimp puts in every embedded form snippet).

### 6. Restart the dev server

```powershell
npm run dev
```

The forms on `/alpha` and the homepage will now post real signups to your
Mailchimp audience.

---

## How it works (technical details)

### Files involved

| File | Role |
|------|------|
| `src/lib/mailchimp.ts` | Config: reads env var, exports URL + tag constants |
| `src/components/mailchimp-signup-form.tsx` | Client component: email input + submit to Mailchimp |
| `src/app/alpha/page.tsx` | Alpha page: renders two forms (alpha + waitlist) |
| `src/app/page.tsx` | Homepage: renders one inline alpha signup form |
| `next.config.mjs` | CSP: allows `connect-src` and `form-action` to `*.list-manage.com` |

### Submit flow

1. User enters email and clicks submit.
2. Component builds a URL from the Mailchimp action URL + query params:
   - `EMAIL` — the user's email address
   - `SIGNUP_SRC` — `alpha-signup` or `waitlist-signup`
3. Sends a `GET` request in `no-cors` mode (Mailchimp's `/subscribe/post`
   endpoint accepts GET and always returns 200 for valid submissions).
4. Shows a success message.

### Dev mode (no Mailchimp URL set)

When `NEXT_PUBLIC_MAILCHIMP_ACTION_URL` is empty or unset:

- The forms still render and are interactive.
- On submit, the email + kind are logged to the browser console.
- A success message is shown.

This lets you develop and test the UI without a real Mailchimp account.

---

## Segmenting contacts in Mailchimp

Once signups start coming in, you can create segments:

1. **Audience** → **Segments** → **Create Segment**.
2. Set condition: `SIGNUP_SRC` → `is` → `alpha-signup` (or `waitlist-signup`).
3. Save the segment.

You can then send targeted emails to just alpha testers or just waitlist
signups.

### Using tags instead of merge fields (alternative)

If you prefer Mailchimp tags over merge fields:

1. Create tags named `alpha-signup` and `waitlist-signup` in your audience.
2. Set up an automation: when a contact is added with `SIGNUP_SRC = alpha-signup`,
   automatically apply the `alpha-signup` tag.
3. Same for `waitlist-signup`.

Both approaches work. Merge fields are simpler for basic filtering; tags are
better if you plan to use Mailchimp's automation workflows.

---

## Production checklist

- [ ] Mailchimp audience created
- [ ] `SIGNUP_SRC` merge field added
- [ ] Embedded-form action URL obtained
- [ ] `NEXT_PUBLIC_MAILCHIMP_ACTION_URL` set in production env
- [ ] Test a real signup and verify it appears in Mailchimp audience
- [ ] Create segments for alpha vs waitlist filtering
- [ ] (Optional) Set up welcome/confirmation email automation in Mailchimp

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Form submits but contact doesn't appear in Mailchimp | Check the action URL is correct. Verify the `u=` and `id=` params match your audience. |
| CORS errors in browser console | Expected with `no-cors` mode — the request still goes through. Check Mailchimp audience for the contact. |
| Form shows "coming soon" state | `NEXT_PUBLIC_MAILCHIMP_ACTION_URL` is not set. Add it to `.env.local` and restart the dev server. |
| CSP blocks the request | Ensure `next.config.mjs` includes `*.list-manage.com` in `connect-src` and `form-action` (already done). |
