# Agent Prompt — Website Frontend (Public Repo)

You are building the **public** Phoenix website frontend.

## Context

- Repo: `Phoenix-Agentic-Website-Frontend`
- Visibility: Public OSS
- Identity provider: Microsoft Entra ID
- Sensitive business logic and secrets live in private backend repo
- Existing Phoenix agent backend remains separate

## Objective

Implement a production-ready frontend with these route areas:

1. Marketing pages (home, pricing, demos, reviews, blog)
2. Docs link page (current Phoenix/Godot compatible docs)
3. Download UX
4. Authenticated account dashboard and management UI
5. Billing/donation entry UX (Stripe actions delegated to backend)

## Hard Constraints

- Never store secrets in frontend code.
- Never call Stripe secret APIs from frontend.
- All protected operations must go through backend endpoints.
- Follow secure defaults (CSP, safe redirects, anti-XSS patterns).

## Deliverables

1. Next.js TypeScript scaffold with route groups above
2. Reusable API client for website backend
3. Auth/session wiring with Entra sign-in UX
4. Account dashboard pages with loading/error/empty states
5. Donation page with explicit statement:
   - 10% of donations are allocated to Godot Foundation support
6. CI pipeline for lint/typecheck/test/build
7. Documentation updates in `/docs`

## Acceptance Criteria

- Build, lint, and tests pass
- Auth-required pages are protected
- No secrets committed
- API failures produce user-safe errors
- Docs link and Godot attribution are present

## Non-Goals

- No backend/server-side billing logic implementation
- No direct DB integrations
