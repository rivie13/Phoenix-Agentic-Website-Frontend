# Security Boundary (Frontend Public Repo)

## Must Stay Public-Safe

Allowed:

- UI code
- public content
- API contracts
- non-secret environment keys intended for client use

Forbidden:

- Stripe secret keys
- Entra client secrets
- DB credentials
- webhook verification secrets
- private backend implementation logic

## Security Controls

- Strict Content Security Policy
- Secure cookie strategy (set by backend)
- CSRF protections for state-changing actions
- Dependency and SAST scanning in CI
- PR review required for auth/billing route changes

## Privacy Controls

- Minimize user PII rendered client-side
- Do not log tokens or sensitive response payloads
- Use privacy-preserving analytics settings by default
