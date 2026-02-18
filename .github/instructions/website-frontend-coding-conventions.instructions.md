
# Coding conventions — Phoenix Agentic Website Frontend (Public)

## General rule

Match the style of the file you are editing (naming, formatting, import order, and component patterns).

## TypeScript/React conventions

- Use TypeScript strict mode.
- Prefer explicit types on exported APIs and shared component props.
- Avoid `any`; use `unknown` + narrowing when needed.
- Keep components small and composable.
- Use predictable route and component naming.

## Security-first frontend conventions

- Never store secrets in frontend code.
- Never trust client-side auth state as backend authority.
- Sanitize/escape untrusted content rendering.
- Keep auth token handling minimal and safe.

## Patterns to prefer

- Clear server/client component boundaries.
- Reusable API client wrappers for backend calls.
- Consistent loading/error/empty UI states.
- Accessibility-first markup and keyboard support.

## Patterns to avoid

- Monolithic page components with mixed concerns.
- Inline business logic for billing/entitlements.
- Hardcoded backend URLs or credentials.
- Implicit side-effects at module import time.
