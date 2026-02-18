
# Strategy — Phoenix Agentic Website Frontend (Public)

## Placement rule

If a feature requires secrets, billing authority, or entitlement authority, it does not belong in this repo.

## Strategic priorities

1. Build a trustworthy public UX with clear product messaging.
2. Keep auth and account workflows simple and secure.
3. Preserve strict boundary with private website backend.
4. Maintain compatibility with Entra-based identity linking and future scale.

## Feature placement guide

| Feature | Where |
|---------|-------|
| Marketing pages, blog, demos, reviews | This repo |
| Dashboard UI and account UX | This repo |
| Checkout session creation | Website backend |
| Stripe webhook handling | Website backend |
| Entitlement truth/source | Website backend + agent backend integration |
| Runtime orchestration APIs | Existing Phoenix agent backend |
