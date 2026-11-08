# Design: Phase 1 Authentication & Session Lifecycle Endpoints

## Context

AIRE uses **Better Auth** (`better-auth`) for credential verification (Argon2id) and PostgreSQL session storage. Currently, Better Auth is mounted at the raw endpoint `/api/auth/*` via `toNodeHandler(auth)` in `server/src/app.ts`. However, AIRE's API standard (`docs/07-api-integrations/api-overview.md`) and UI specifications (`J-01`, `S-01`, `S-02`, `S-03`) mandate `/api/v1/auth/*` endpoints returning the uniform `ApiResponse<T>` envelope, tracking correlation IDs, emitting structured audit logs, and supporting idle heartbeats (`S-03`), step-up re-authentication (`S-02`), and cross-device session revocation (`AIRE-REQ-124`).

## Goals / Non-Goals

**Goals:**

- Provide a dedicated, type-safe Express router (`server/src/routes/auth.routes.ts`) mounted at `/api/v1/auth`.
- Implement clean endpoints:
  - `POST /api/v1/auth/sign-in` (credential login with audit logging and cookie forwarding)
  - `POST /api/v1/auth/sign-up` (user registration with password policy check)
  - `POST /api/v1/auth/sign-out` (session termination and cookie clearing)
  - `GET /api/v1/auth/session` (active session token check)
  - `GET /api/v1/auth/me` (full identity, membership, and tenant permission resolution)
  - `POST /api/v1/auth/session/touch` (inactivity heartbeat resetting idle timer)
  - `POST /api/v1/auth/step-up` (step-up password verification for privileged actions)
  - `POST /api/v1/auth/sessions/revoke-all` (cross-device session invalidation)
- Encapsulate all responses within AIRE's standard `ApiResponse<T>` envelope with `correlationId`.
- Log audit records for every authentication success, failure, step-up, and revocation via `logAuditEvent`.
- Maintain backward compatibility with existing tests relying on `/api/auth/*`.

**Non-Goals:**

- Live SSO provider integrations (AICTE SSO, MeriPehchaan, DigiLocker remain deferred to future phases).
- Database schema changes (Better Auth tables `user`, `session`, `account`, `verification` and AIRE membership tables are already established).

## Decisions

### Decision 1: Programmatic `auth.api.*` Calls in Dedicated Route Handlers

- **Choice:** Implement dedicated Express handlers in `auth.routes.ts` calling `auth.api.*` programmatic methods, rather than mounting the raw `toNodeHandler(auth)` directly at `/api/v1/auth/*`.
- **Rationale:** Programmatic calls allow AIRE to intercept responses, wrap them in the standard `ApiResponse<T>` envelope, attach the correlation ID, forward cookies correctly via `res.setHeader('Set-Cookie', ...)`, and emit compliant `logAuditEvent` calls.
- **Alternatives Considered:** Mounting raw Better Auth handler at `/api/v1/auth/*`. Rejected because raw Better Auth outputs non-conforming JSON schemas, lacks correlation IDs, and cannot execute AIRE-specific audit and step-up logic.

### Decision 2: Inactivity Heartbeat Implementation (`touch`)

- **Choice:** Implement `POST /api/v1/auth/session/touch` protected by `authenticate` middleware. The handler updates `session.updatedAt = new Date()` in PostgreSQL via Prisma and returns a confirmed session expiry timestamp.
- **Rationale:** Directly satisfies the behavioral contract of `S-03` where the user clicking "Stay Signed In" resets the 30-minute idle timer.
- **Alternatives Considered:** Client-side only timer reset. Rejected because server-side sliding session expiration requires database timestamp synchronization.

### Decision 3: Security Step-Up Re-Authentication (`step-up`)

- **Choice:** Implement `POST /api/v1/auth/step-up` protected by `authenticate`. It validates the user's password using Better Auth verification. Upon success, it logs `AUTH_STEPUP_SUCCESS` and returns `{ stepUpVerified: true, verifiedAt: new Date().toISOString() }`.
- **Rationale:** Satisfies `S-02` security contract for irreversible transactions (e.g. Cohort Sealing `S-13` or Show Cause Dispatch `S-24`), preventing replay attacks and ensuring operator presence.

### Decision 4: Cross-Device Session Invalidation (`revoke-all`)

- **Choice:** `POST /api/v1/auth/sessions/revoke-all` executes `prisma.session.deleteMany({ where: { userId: req.user.id } })`, clears the current session cookie, and logs `AUTH_SESSION_REVOKED_ALL`.
- **Rationale:** Fully satisfies `AIRE-REQ-124` requirements to terminate all active sessions across devices upon security events or operator deactivation.

## Risks / Trade-offs

- **[Risk] Cookie header synchronization between Better Auth API and Express response:**
  → _Mitigation:_ Helper function to inspect `better-auth` response headers, parse `set-cookie`, and explicitly call `res.setHeader("Set-Cookie", ...)` to ensure browser cookies are correctly set/cleared.
- **[Risk] Rate limiting & brute force enumeration:**
  → _Mitigation:_ Ensure `POST /api/v1/auth/sign-in` returns generic 401 messages without revealing whether the email or password was invalid, while logging IP and user email in audit records.
