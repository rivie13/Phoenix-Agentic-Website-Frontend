# Phoenix Agentic Website Frontend (Public)

This repository contains the public website frontend for Phoenix Agentic Engine.

## Purpose

The site provides:

- Account sign-up/sign-in UX (via Microsoft Entra ID)
- Account dashboard and management UI
- Engine download UX (entitlement-aware)
- Pricing and billing entry points (Stripe checkout + customer portal links)
- Donation page and disclosure (10% of gross donations allocated to Godot Foundation, per Engine/Backend docs)
- Product/marketing pages (video demos, customer reviews, blog)
- Docs link to the current Phoenix engine-compatible Godot docs

Website copy is expected to stay aligned with source docs in:

- `Phoenix-Agentic-Engine/phoenix_docs_public/`
- `Phoenix-Agentic-Engine-Backend/docs/`

## Open Source Boundary

This repo is intentionally public and must not contain:

- secrets
- private keys
- backend-only business logic
- Stripe secret keys or webhook secrets

All sensitive operations are delegated to the private website backend.

## High-Level Architecture

- Frontend app authenticates users with Entra ID.
- Frontend receives ID/access tokens and calls private website backend APIs.
- Private website backend is the system-of-record for account, billing, entitlements, and downloads.
- Existing Phoenix agent backend remains separate and focused on runtime/orchestration.
- Identity linking across both backends is done via stable Entra subject identity.

See docs:

- [Implementation Plan](docs/IMPLEMENTATION_PLAN.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Security Boundary](docs/SECURITY_BOUNDARY.md)
- [Frontend Agent Prompt](prompts/FRONTEND_AGENT_PROMPT.md)

## Suggested Remote Repo Settings

- Visibility: Public
- License: MIT (or your preferred OSS license)
- Branch protection: required checks + PR reviews

## Initial Status

Initial Next.js TypeScript scaffold is in place with route areas for marketing, docs, download, auth, and account dashboard UX.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env.local
```

3. Run the app locally:

```bash
npm run dev
```

4. Validate quality gates:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Implemented Route Areas

- Marketing pages: home, pricing, demos, reviews, blog
- Docs link page
- Download UX
- Account dashboard and account management routes (protected)
- Billing and donation entry UX (backend delegated)
