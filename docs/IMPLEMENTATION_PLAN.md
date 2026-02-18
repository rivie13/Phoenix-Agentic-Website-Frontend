# Frontend Implementation Plan (Public Repo)

## Goals

1. Ship a secure public website frontend for Phoenix.
2. Keep all sensitive logic in private backend services.
3. Support Entra-based sign-in and account UX.
4. Support marketing + docs + downloads + donation flows.

## Phase 0 — Foundation

- Framework: Next.js (App Router) + TypeScript
- UI baseline: Tailwind + minimal component system
- CI: lint/typecheck/test/build on PR
- Security defaults: CSP, secure headers, dependency scanning

## Phase 1 — Public Pages

- Home
- Pricing
- Download
- Docs redirect page (version-aware link target)
- Blog index/detail
- Video demos
- Customer reviews
- Donation page (with disclosure: 10% to Godot Foundation)

## Phase 2 — Auth + Account UX

- Entra sign-in/sign-up flow
- Session handling in frontend
- Auth guard for account routes
- Account dashboard shell
- Billing panel (backend-driven data)

## Phase 3 — Backend Integration

Integrate with private website backend API:

- `GET /api/public/v1/me`
- `GET /api/public/v1/account`
- `GET /api/public/v1/entitlements`
- `POST /api/public/v1/billing/checkout`
- `POST /api/public/v1/billing/portal`
- `GET /api/public/v1/downloads`

## Phase 4 — Release Hardening

- Accessibility pass (WCAG focus)
- SEO and social metadata
- Rate-limit aware client UX
- Error observability integration

## Non-Goals (Frontend Repo)

- No secret storage
- No direct Stripe secret usage
- No direct DB access
- No private backend orchestration logic
