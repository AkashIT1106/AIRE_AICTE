# Proposal: Phase 1 Authentication & Session Lifecycle Endpoints

## Why

AIRE's modular monolith requires a standardized, auditable, and production-grade authentication and session lifecycle API under `/api/v1/auth/*` as specified in `docs/07-api-integrations/api-overview.md`, `docs/05-security-privacy/authentication.md`, and UX specifications (`J-01`, `S-01`, `S-02`, `S-03`). Currently, Better Auth is mounted only at raw `/api/auth/*` without unified `/api/v1/auth/*` route encapsulation, missing dedicated endpoints for idle session touch/heartbeat (`S-03`), security step-up re-authentication (`S-02`), global session revocation across devices (`AIRE-REQ-124`), and structured `ApiResponse<T>` envelopes with audit log emissions (`AIRE-REQ-126`).

Implementing these endpoints now completes the authentication deliverable of Phase 1 / Phase 2 (M01: Identity, Authentication & Access Management), unblocking institutional client integration and meeting regulatory compliance requirements.

## What Changes

- **Dedicated `/api/v1/auth` REST Endpoints**:
  - `POST /api/v1/auth/sign-in`: Authenticate user credentials (email & password) via Better Auth, issue secure `HttpOnly` session cookies, record audit events, and return user profile in the standard `ApiResponse<T>` envelope.
  - `POST /api/v1/auth/sign-up`: Register institutional/admin user credentials with password validation.
  - `POST /api/v1/auth/sign-out`: Invalidate the current session token, clear session cookies, and record logout audit event.
  - `GET /api/v1/auth/session`: Lightweight session validation endpoint returning active user and session tokens.
  - `GET /api/v1/auth/me`: Resolve full authenticated identity, active tenant context, institution memberships, and effective permissions.
  - `POST /api/v1/auth/session/touch`: Heartbeat endpoint that refreshes sliding idle session expiration, supporting the 30-minute idle expiry warning modal (`S-03`).
  - `POST /api/v1/auth/step-up`: Re-authenticate active sessions older than 15 minutes via password verification, issuing a step-up confirmation timestamp for irreversible regulatory actions (`S-02`).
  - `POST /api/v1/auth/sessions/revoke-all`: Terminate all active sessions across all devices for the authenticated user upon account security changes or operator revocation (`AIRE-REQ-124`).
- **Validation Schemas (`@aire/validation`)**:
  - Export strict Zod schemas for login (`signInSchema`), registration (`signUpSchema`), step-up re-authentication (`stepUpSchema`), and session touch requests.
- **Audit Logging & Security Instrumentation (`M15`)**:
  - Emit structured audit log events (`AUTH_LOGIN_SUCCESS`, `AUTH_LOGIN_FAILURE`, `AUTH_LOGOUT`, `AUTH_STEPUP_SUCCESS`, `AUTH_STEPUP_FAILURE`, `AUTH_SESSION_REVOKED_ALL`) with correlation IDs and IP/user metadata.
- **Integration Test Suite**:
  - Comprehensive integration tests in `server/tests/auth.test.ts` validating all `/api/v1/auth/*` endpoints, error handling, cookie headers, idle touch, and cross-device session termination.

## Capabilities

### New Capabilities

- `authentication-service`: End-to-end credential authentication, session lifecycle management, idle touch heartbeats, security step-up re-authentication, and session invalidation under `/api/v1/auth`.

### Modified Capabilities

<!-- No existing OpenSpec capabilities to modify -->

## Impact

- **Server (`@aire/server`)**:
  - New route file `server/src/routes/auth.routes.ts` mounted at `/api/v1/auth`.
  - Mount routing in `server/src/routes/index.ts`.
  - Maintain backward compatibility with `/api/auth/*` for Better Auth internal handler.
- **Packages (`@aire/validation`, `@aire/shared-types`)**:
  - Add auth payload validation schemas and response contracts.
- **Security & Audit**:
  - Enforce audit event emission for every authentication lifecycle mutation via `logAuditEvent`.
