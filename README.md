# Phoenix Agentic Website Frontend (Public)

This repository contains the public website frontend for Phoenix Agentic Engine.

## Purpose

The site provides:

- Account sign-up/sign-in UX (via Microsoft Entra ID)
- Account dashboard and management UI
- Engine download UX (entitlement-aware)
- Pricing and billing entry points (Stripe checkout + customer portal links)
- Donation page and disclosure (10% of donations to Godot Foundation)
- Product/marketing pages (video demos, customer reviews, blog)
- Docs link to the current Phoenix engine-compatible Godot docs

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

Planning/docs scaffold created. Implementation intentionally deferred for a dedicated frontend coding agent.
