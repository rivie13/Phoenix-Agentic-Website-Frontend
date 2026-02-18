---
excludeAgent: "coding-agent"
---

# Copilot code review instructions (Website Frontend repo)

You are reviewing PRs for the public website frontend.
Priorities: security boundary hygiene, auth correctness, and maintainable UX.

## Review focus

- Treat auth/account/billing route changes as high-risk.
- Verify no secrets are added to client code or repo files.
- Verify Stripe secret operations are not implemented in frontend.
- Verify marketing/docs content changes do not break attribution/disclosure requirements.

## Standards to enforce

- TypeScript strict mode; no avoidable `any`.
- Route/component boundaries should remain clear and testable.
- Safe rendering for user/content data (XSS-safe markdown/content handling).
- Strong error handling for API failure states.

## Security boundary checks

- Frontend must delegate protected operations to private backend.
- No direct DB calls from frontend.
- No Entra client secret or webhook secret in frontend config.

## What to request from authors (when missing)

- Evidence of lint/typecheck/test/build pass.
- Screenshots or route validation notes for auth-protected pages.
- Confirmation that no secret-bearing environment variables are exposed to client.
