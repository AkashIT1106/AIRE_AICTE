# Authentication Specification

| Metadata               | Value                                                                                                                                                                                                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document               | `docs/05-security-privacy/authentication.md`                                                                                                                                                                                                                         |
| Authoritative For      | Better Auth Implementation, Session Lifecycle, SSO Boundary                                                                                                                                                                                                          |
| Status                 | `CONFIRMED`                                                                                                                                                                                                                                                          |
| Source                 | PROJECT_PLAN.md §16.1, ADR-003, ADR-004                                                                                                                                                                                                                              |
| SSO Architecture Guide | [`docs/SSO_PROVIDER_INTEGRATION_BOUNDARY.md`](../SSO_PROVIDER_INTEGRATION_BOUNDARY.md)                                                                                                                                                                               |
| Related Requirements   | [`AIRE-REQ-096`](../00-governance/requirements-traceability.md), [`AIRE-REQ-098`](../00-governance/requirements-traceability.md), [`AIRE-REQ-120`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-126`](../00-governance/requirements-traceability.md) |

---

## 1. Authentication Engine: Better Auth

AIRE implements **Better Auth** (`better-auth`) for session management and credential authentication:

- **Local Credentials:** Secure email and password authentication using Argon2id hashing.
- **Session Tokens:** Cryptographically random session identifiers stored in HTTP-only, secure, `SameSite=Lax` cookies.
- **Brute-Force Protection:** Progressive delays and IP/account lockouts after repeated failed attempts.
- **Prisma Integration:** Better Auth models (`User`, `Session`, `Account`, `Verification`) are integrated directly into the authoritative PostgreSQL schema via Prisma.

---

## 2. Session Lifecycle & Invalidation

1. **Session Expiry:** Absolute timeout at 8 hours; sliding idle expiration at 30 minutes.
2. **Instant Revocation:** When an institution administrator revokes an operator's membership or suspends an account, all active sessions for that `userId` are invalidated immediately across all devices.
3. **Session Re-authentication:** Sensitive administrative operations (e.g. sealing a submission, issuing a Show Cause Notice) require password re-entry if the session is older than 15 minutes.

---

## 3. Decoupled External SSO Boundary

In Phase 2, external SSO integrations (AICTE SSO, MeriPehchaan, DigiLocker) are decoupled and deferred until official government credentials and endpoints are available.

- For the full decoupled architectural contract and future integration guide, inspect [`docs/SSO_PROVIDER_INTEGRATION_BOUNDARY.md`](../SSO_PROVIDER_INTEGRATION_BOUNDARY.md).
- External identity logins, when attached, map into Better Auth `Account` records and **never** bypass AIRE's internal user membership, tenant isolation, or RLS policies.
