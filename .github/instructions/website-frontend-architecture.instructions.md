
# Architecture — Phoenix Agentic Website Frontend (Public)

## Service model

| Service | Visibility | Role |
|---------|------------|------|
| Website Frontend (this repo) | Public | Marketing + account/dashboard UX |
| Website Backend | Private | Account, billing, entitlements, downloads |
| Phoenix Agent Backend | Private | Runtime/orchestration APIs for editor |

## Identity model

- Identity Provider: Microsoft Entra ID.
- Frontend obtains and forwards bearer tokens to private website backend.
- Stable cross-service user linking is resolved server-side from Entra claims.

## What this frontend owns

- Public marketing routes
- Auth UX and account dashboard UX
- Billing/donation initiation UX
- Docs/download navigation UX

## What this frontend must not own

- Billing authority logic
- Entitlement authority logic
- Secret processing
- Webhook handling
