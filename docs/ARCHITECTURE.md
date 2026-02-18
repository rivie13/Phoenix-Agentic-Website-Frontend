# Frontend Architecture (Public Repo)

## Boundaries

- Public frontend renders UX and calls backend APIs.
- Private website backend owns account, billing, entitlements, and download authorization.
- Existing Phoenix agent backend remains separate and consumes the same user identity model.

## Identity Model

- Identity Provider: Microsoft Entra ID.
- Frontend obtains Entra tokens.
- Frontend sends bearer token to private website backend.
- Backend validates token and resolves stable `user_id` for business operations.

## Primary Route Groups

- `/` marketing home
- `/pricing`
- `/download`
- `/docs`
- `/blog`
- `/reviews`
- `/demos`
- `/donate`
- `/account/*` authenticated account/dashboard pages

## Docs Linking Strategy

- Frontend consumes a backend-configured docs target for the current engine baseline.
- Initial value may point to Godot docs `latest`; later can be pinned to exact supported version.

## Runtime Calls

- Public, cacheable content endpoints for marketing pages.
- Authenticated API calls for account and billing state.
- Action endpoints for checkout/portal sessions and download grant retrieval.

## Security Notes

- No secrets in browser code or static output.
- Enforce strict CSP and security headers.
- Defensive rendering and XSS-safe markdown handling for blog/reviews content.
