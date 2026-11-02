# J-01 — Local Authentication & Workspace Session

| Metadata            | Value                                                                                                                                                                                                                                                                            |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Journey ID          | `J-01`                                                                                                                                                                                                                                                                           |
| Journey Title       | Local Authentication, Workspace Binding & Session Lifecycle                                                                                                                                                                                                                      |
| Status              | `CONFIRMED`                                                                                                                                                                                                                                                                      |
| Primary Personas    | All Roles (`AICTE_ADMIN`, `AICTE_REVIEWER`, `INST_ADMIN`, `INST_OPERATOR`, `STUDENT`, `AUDITOR`)                                                                                                                                                                                 |
| Source Requirements | [`AIRE-REQ-096`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-098`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-120`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-126`](../../00-governance/requirements-traceability.md) |
| Related Screens     | [`S-00`](../screen-specifications/S-00-application-shell.md), [`S-01`](../screen-specifications/S-01-login.md), [`S-02`](../screen-specifications/S-02-reauthentication.md)                                                                                                      |
| Last Updated        | 2 November 2026                                                                                                                                                                                                                                                                  |

---

## 1. Goal & Context

The user authenticates with verified credentials to establish a secure, tenant-isolated session. The platform verifies identity, resolves active organization memberships, establishes PostgreSQL Row-Level Security (RLS) connection context, and routes the user into their authorized workspace. During the session, idle warnings and step-up re-authentication ensure data protection under DPDP Act 2023.

---

## 2. Preconditions

- User possesses an active registered account in AIRE's Better Auth identity store.
- User's account is in `ACTIVE` status (not suspended or pending initial email confirmation).
- For institutional and regional roles, at least one valid organizational membership is active.
- Browser accepts `HttpOnly`, `Secure`, `SameSite=Lax` session cookies.

---

## 3. Entry Point

- Direct URL navigation to `/login`.
- Unauthenticated access redirect from any protected route (`/institution/*`, `/aicte/*`, `/auditor/*`, `/student/*`), with the target path preserved in a clean `?returnTo=` query parameter (sanitized against open redirects).

---

## 4. Main Success Path

```mermaid
sequenceDiagram
    autonumber
    actor User as Operator / Admin
    participant UI as React Client (S-01)
    participant Auth as Express / Better Auth
    participant DB as PostgreSQL (Prisma + RLS)

    User->>UI: Navigates to /login
    UI->>User: Displays S-01 (Email/Password, Integration Mode Pill)
    User->>UI: Enters institutional email & password; clicks "Sign In"
    UI->>UI: Validates client inputs via Zod (RFC 5322 email format)
    UI->>Auth: POST /api/auth/sign-in/email (Argon2id verification)
    Auth->>DB: Validates credentials, checks account status
    DB-->>Auth: Account ACTIVE, user authenticated
    Auth->>DB: Queries active memberships & roles
    DB-->>Auth: Returns primary role & tenantId
    Auth-->>UI: Sets HttpOnly session cookie, returns user & tenant profile
    UI->>UI: Stores tenant context in memory; initializes TanStack Query
    UI->>User: Redirects to role workspace (e.g. /institution/dashboard)
```

1. **Presentation:** User views the clean institutional login screen (`S-01`) featuring the AIRE emblem, confidentiality disclaimer, and clear integration mode badge (`MOCK`, `SANDBOX`, or `PRODUCTION`).
2. **Credential Input:** User enters their registered email address and password.
3. **Client-Side Validation:** React Hook Form + Zod validates that email syntax is correct and password is non-empty before submission.
4. **Authentication Request:** Client dispatches credentials to Better Auth backend handler (`POST /api/auth/sign-in/email`).
5. **Server Verification:** Backend verifies credentials against Argon2id hashed records in PostgreSQL. Checks account suspension flags and brute-force rate limits.
6. **Session & Cookie Issuance:** A cryptographically random session identifier is stored in PostgreSQL and issued to the client via an `HttpOnly`, `Secure`, `SameSite=Lax` cookie.
7. **Workspace Context Resolution:** Client requests `/api/v1/auth/me`. Server returns identity details and active memberships.
8. **Navigation Routing:**
   - Institutional users (`INST_ADMIN`, `INST_OPERATOR`) route to `/institution/dashboard`.
   - AICTE officers route to `/aicte/overview`.
   - Students route to `/student/record`.
   - Auditors route to `/auditor/logs`.

---

## 5. Alternate & Edge Paths

### 5.1 Multi-Institution Membership

- If the user holds active memberships in multiple institutions or regional jurisdictions, the system defaults to the most recently accessed tenant.
- The global context switcher in the shell header (`S-00`) displays an accessible dropdown enabling instant switching without re-logging in.

### 5.2 Idle Timeout & Expiry Lifecycle

- **30-Minute Idle Timeout:** After 25 minutes of zero user activity (no mouse, touch, or keyboard events), a non-blocking modal appears: _"Your session will expire in 5 minutes due to inactivity. Click 'Continue Session' to remain logged in."_
- **Clicking 'Continue Session':** Dispatches a lightweight heartbeat (`POST /api/auth/session/touch`), resetting the idle timer.
- **Expiry Occurrence:** If no action is taken by minute 30, the modal locks, in-memory TanStack caches are cleared, the session cookie is invalidated, and the user is redirected to `/login?reason=session_expired`.

### 5.3 Step-Up Re-Authentication (`S-02`)

- When an `INST_ADMIN` initiates an irreversible action (e.g. Cohort Sealing) or an `AICTE_REVIEWER` issues a Show Cause notice:
  - If the active session authentication age exceeds 15 minutes, a modal prompt interrupts: _"Security Step-Up: Re-enter your password to execute this irreversible regulatory action."_
  - Upon successful password verification, the action proceeds without losing form state or file uploads.

---

## 6. Failure & Recovery Paths

| Failure Scenario        | UI Presentation                                                                                                                     | Recovery Behavior                                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Invalid Credentials** | Inline error banner: _"Invalid email or password. Please verify and try again."_                                                    | Password field is cleared; focus returns to password input. Error is generic to prevent user enumeration. |
| **Account Suspended**   | Modal dialog: _"Account Suspended: Access has been disabled by your institution or AICTE administrator. Contact your coordinator."_ | Login is rejected; session cookie is not issued. Support reference correlation ID displayed.              |
| **Brute Force Lockout** | Warning banner: _"Too many failed login attempts. Account temporarily locked for 15 minutes. Try again later."_                     | Sign-in button disabled with live countdown timer.                                                        |
| **Network Failure**     | Toast error: _"Network connectivity issue. Unable to contact AIRE authentication service. Please check your connection."_           | Form data preserved; retry button available.                                                              |

---

## 7. Security & Privacy Constraints

- **Zero LocalStorage Tokens:** Session tokens are strictly stored in `HttpOnly` cookies and inaccessible to JavaScript, completely mitigating XSS token theft.
- **Audit Logging:** Every login attempt (successful or rejected) writes an append-only audit record containing IP hash, user agent, timestamp, and result code to `audit_events`.
