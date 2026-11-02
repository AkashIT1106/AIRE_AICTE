# S-01 — Local Authentication / Login Screen

| Metadata             | Value                                                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Screen ID            | `S-01`                                                                                                                                 |
| Screen Name          | Local Authentication & Login Terminal                                                                                                  |
| Purpose              | Authenticate users into AIRE using verified local credentials via Better Auth; establish secure session cookies and tenant context     |
| User Roles Allowed   | Public / Unauthenticated Users                                                                                                         |
| Related Journeys     | [`J-01`](../user-journeys/J-01-authentication.md)                                                                                      |
| Primary Route        | `/login`                                                                                                                               |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                  |
| Source Reference     | PROJECT_PLAN.md §16.1; ADR-003, ADR-004; [`docs/05-security-privacy/authentication.md`](../../05-security-privacy/authentication.md)   |
| Related Requirements | [`AIRE-REQ-096`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-098`](../../00-governance/requirements-traceability.md) |
| Last Updated         | 2 November 2026                                                                                                                        |

---

## 1. Information Hierarchy & Content

1. **Header Emblem:** Official Government of India / AICTE crest with platform title ("AIRE — Admission Reconciliation & Evidence Platform").
2. **Security & Integration Banner:** Integration mode badge (`MOCK`, `SANDBOX`, `PRODUCTION`) and regulatory notice: _"Authorized Access Only under IT Act 2000 & DPDP Act 2023."_
3. **Primary Authentication Card:**
   - Institutional Email Address input (`type="email"`, auto-complete `username`).
   - Password input (`type="password"`, auto-complete `current-password`) with accessible show/hide toggle.
   - Primary Action Button: _"Sign In to Workspace"_.
4. **Institutional Notice:** Link to AICTE portal support and system status.

---

## 2. Interaction & State Contracts

### 2.1 Component State Machine

- **Idle:** Form fields clean with standard gray borders (`border-slate-300`).
- **Loading:** Button enters disabled state showing inline spinner and text: _"Authenticating..."_. Inputs disabled to prevent re-submission.
- **Success:** Non-disruptive fade; instant routing to resolved workspace URL.
- **Error:**
  - Field validation errors: Rendered below input field in red (`text-rose-600 text-xs`) linked via `aria-errormessage`.
  - Authentication failure: Generic banner above form: _"Invalid credentials. Please verify your email and password."_ (Prevents account enumeration).
- **Disabled (Lockout):** Button disabled with countdown timer after 5 consecutive failed attempts: _"Too many attempts. Locked for 15 minutes."_

---

## 3. Keyboard & Accessibility

- **Autofocus:** Email input is focused automatically on mount.
- **Enter Key:** Submits the form from either input field.
- **ARIA Linking:** Inputs feature explicit `<label for="...">`, `aria-required="true"`, and `aria-invalid="true"` when errors are present.
