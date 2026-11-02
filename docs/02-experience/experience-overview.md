# User Experience Overview

| Metadata             | Value                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/02-experience/experience-overview.md`                                                                                           |
| Authoritative For    | Experience Direction, UX Principles, Workspace Concepts, Cross-Cutting UX Invariants                                                  |
| Status               | `CONFIRMED`                                                                                                                           |
| Source               | PROJECT_PLAN.md §10.1, §10.2, §10.3; [`docs/01-product/stakeholders-and-user-roles.md`](../01-product/stakeholders-and-user-roles.md) |
| Audit Linkage        | [`docs/04-frontend/ui-ux-audit.md`](../04-frontend/ui-ux-audit.md)                                                                    |
| Related Requirements | [`AIRE-REQ-074`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-083`](../00-governance/requirements-traceability.md)    |
| Last Updated         | 2 November 2026                                                                                                                       |

---

## 1. Experience Direction: Quiet Institutional Confidence

AIRE's visual and interaction language is described as **Quiet Institutional Confidence**. This phrase encodes a precise set of design constraints — not a mood board.

### 1.1 What It Means in Concrete Terms

| Dimension                                        | What It Means                                                                                                                                                                          | What It Rules Out                                                                                               |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Trustworthy**                                  | Every figure, badge, and status is sourced and linkable. Nothing is approximate or decorative.                                                                                         | Fabricated progress bars, rounded-to-look-good numbers, generic "loading skeletons" that imply false precision. |
| **Calm**                                         | One primary action per view. Supporting actions are subdued. Visual noise is eliminated.                                                                                               | Multiple competing call-to-action buttons. Banner ads. Notification storms. Confetti animations.                |
| **Clear**                                        | Labels are exact. States are named. Errors explain cause and remediation.                                                                                                              | Ambiguous icon-only controls. Generic "something went wrong" messages. Unlabelled form fields.                  |
| **Efficient**                                    | Common tasks are reachable in three interactions or fewer. Dense tables are preferred to nested drill-down wizards where data fits.                                                    | Unnecessary wizard steps. Blocking modals for non-destructive tasks. Pagination where scroll suffices.          |
| **Modern without generic SaaS aesthetics**       | Components use contemporary interaction patterns (drawers, inline validation, toast feedback) but without branded gradients, illustrated empty states, or growth-oriented UI patterns. | Animated hero banners. "Upgrade your plan" nudges. Emoji-heavy messaging.                                       |
| **Institutional without appearing bureaucratic** | Structure reflects regulatory seriousness — hierarchy is visible, states are explicit — but the interface is responsive and operable, not form-heavy or slow.                          | Print-layout forms. Multi-page PDF workflows embedded in browser. Tables with no column sorting.                |

### 1.2 Per-Workspace Application

| Workspace                | Primary Tone                | Density                                       | Dominant Pattern                                        |
| ------------------------ | --------------------------- | --------------------------------------------- | ------------------------------------------------------- |
| AICTE Workspace          | Analytical authority        | High — aggregate data, national metrics       | Filterable data grids; scrutiny-oriented detail drawers |
| Institution Workspace    | Operational accountability  | Medium-high — batch workflows, cohort ledgers | Step-based progress tracking; evidence upload workflows |
| Student Portal           | Clarity, individual dignity | Low — one record, focused tasks               | Single-record summary card; download-first flow         |
| External Verifier Portal | Neutral, decisive           | Minimal — single verification outcome         | Token or QR input → cryptographic result                |
| Auditor Workbench        | Analytical rigor, read-only | High — audit logs, reconciliation history     | Immutable log explorer; no mutating controls visible    |

---

## 2. Eight Core Experience Principles

These principles are approved behavioral constraints, not aspirational themes. Each principle has direct implications for implementation decisions.

### Principle 1 — Work Before Widgets

**Statement:** Every screen serves a task. No screen exists to demonstrate platform capability, fill whitespace, or provide decorative navigation.

**Behavioral implications:**

- Dashboard widgets display metrics only if the metric informs an actionable decision within that session.
- Empty states name the task the user should complete next — they do not display branded illustrations.
- Navigation items link to functional screens, not placeholder pages.

**What this rules out:** Animated feature showcases, "coming soon" tiles in production builds, decorative summary cards with no actionable link.

---

### Principle 2 — Explain Decisions

**Statement:** Every metric, badge, mismatch flag, or compliance finding links to its source rule, policy pack version, and calculation basis.

**Behavioral implications:**

- A mismatch badge must include: the rule that triggered it, the approved intake figure from the Approval Order, the admitted figure from the submission, and the delta.
- A quota status indicator must link to the applicable reservation percentage in the active policy pack.
- Exception status labels must display the policy provision under which the Show Cause Notice was issued.

**What this rules out:** Unexplained "red/amber/green" status indicators with no definition. Aggregate totals with no drill-down to source records. AI-generated summaries presented as authoritative regulatory conclusions.

**Source:** ADR-007 (Regulatory Evaluation Determinism), PROJECT_PLAN.md §4.3.

---

### Principle 3 — Calm Visual Hierarchy

**Statement:** Each view has exactly one primary action. Secondary actions are visually subdued. Destructive actions are clearly distinguished.

**Behavioral implications:**

- Primary action buttons use the primary color token and appear once per content zone.
- Secondary or tertiary actions use ghost or outline variants.
- Destructive actions (seal submission, issue Show Cause) use the destructive color token and require confirmation (see Principle 8 and interaction contracts).
- Modal dialogs contain at most two actions: confirm and cancel.

**What this rules out:** Three or more visually equal action buttons in a single view. Destructive actions styled as primary actions. Toast notifications with embedded action buttons competing with the main action.

---

### Principle 4 — Evidence Over Decoration

**Statement:** Data and provenance are first-class content. No data element appears without a visible or accessible source reference.

**Behavioral implications:**

- Reconciliation findings display source document ID, version, and evaluation timestamp.
- AEP credentials display the cryptographic hash and the policy pack version used for generation.
- Submission history entries display ingestion batch ID, record count, and sealed timestamp.
- No illustrative charts appear unless built from actual persisted data.

**What this rules out:** Trend sparklines built from mock data. Placeholder charts. "Sample data" visible in production builds.

---

### Principle 5 — Preserve User Context

**Statement:** Navigation preserves scroll position, applied filters, and in-progress form state across view transitions and browser back/forward.

**Behavioral implications:**

- Cohort Ledger filter state (programme, category, quota type, APAAR status) persists when the user navigates to a student detail panel and returns.
- Sidebar expanded/collapsed state persists across page loads (stored in client-side session storage; not sensitive data).
- Multi-step batch upload forms preserve completed steps when the user navigates away and returns within the same session.
- URL query parameters encode active filter sets so that links are shareable within the same role context.

**What this rules out:** Filter resets on every navigation event. Form data loss on back-button press. Silent state clears on sidebar toggle.

**Open Decision:** D-002 (multi-institution context switcher) — context switch behavior with preserved state is unresolved. See Section 5 (cross-cutting invariants) and [`docs/00-governance/decisions/decision-register.md`](../00-governance/decisions/decision-register.md).

---

### Principle 6 — Progressive Disclosure

**Statement:** Tables and summaries show the information needed to act. Complex detail is revealed on demand via drawers or panels — not blocking full-page navigations.

**Behavioral implications:**

- Student detail in the Cohort Ledger opens in a right-side drawer without navigating away from the table.
- Exception evidence upload opens in a drawer; the Show Cause Notice context remains visible behind it.
- Batch ingestion error detail expands inline under the relevant row — the user does not leave the ingestion progress screen.
- Regulatory policy pack diffs are shown in a collapsible diff panel, not on a separate page.

**What this rules out:** Full-page navigation for detail that fits in a drawer. Nested drill-down chains more than two levels deep for a single entity. Paginated modals.

---

### Principle 7 — Accessibility by Default

**Statement:** WCAG 2.2 Level AA is the binding technical baseline for all user-facing interfaces.

**Behavioral implications:**

- Text contrast: minimum 4.5:1 against background.
- Non-text UI element contrast: minimum 3:1.
- All interactive controls are keyboard-operable; tab order follows visual reading order.
- Modal dialogs trap focus until dismissed; focus returns to the trigger element on close.
- `aria-live` regions announce dynamic changes (toast notifications, batch ingestion status updates, filter result counts).
- Form fields have explicit `<label>` associations; error messages reference their field by ID.
- Motion complies with `prefers-reduced-motion` (see motion spec).

**Source:** ADR-011. Open item: GIGW applicability (D-004) — see [`docs/00-governance/decisions/decision-register.md`](../00-governance/decisions/decision-register.md).

**Related document:** [`docs/02-experience/accessibility.md`](./accessibility.md)

---

### Principle 8 — No Silent Invention

**Statement:** The interface never fabricates, rounds, or approximates data to appear more complete. Gaps, missing data, and uncertainty are named explicitly.

**Behavioral implications:**

- If a student's APAAR link status is unknown, the field displays "Not linked" or "Verification pending" — not a blank cell or a fabricated status.
- If a policy pack has not yet been activated, the policy status is "Inactive" — not "Draft" if "Draft" is not a defined state.
- If an API call returns partial results, the table displays a "Partial results — N records could not be loaded" notice and does not silently omit the missing records.
- Submission completeness percentages use integer arithmetic over confirmed rules — not estimated weights.

**What this rules out:** Fabricated "sample" data in production views. Progress indicators that animate to suggest work is happening when no request is in flight. Rounded percentages that obscure boundary conditions.

---

## 3. Five Workspace Concepts

Each workspace is a coherent product environment scoped to a defined set of roles and tasks. Workspaces are not just navigation groupings — they impose different security postures, data access scopes, and interaction affordances.

### 3.1 AICTE Workspace

| Attribute           | Value                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Roles**           | `AICTE_ADMIN` (global scope), `AICTE_REVIEWER` (regional scope)                                                                                   |
| **Primary purpose** | National admission oversight: scrutinize institution submissions, manage regulatory policy, issue Show Cause Notices, govern exception resolution |
| **Data scope**      | Cross-institution, national or regional aggregate; individual institution records accessible on drill-down                                        |

**Core task list:**

1. Monitor national/regional compliance overview (aggregate intake vs admitted metrics by state, discipline, institution type).
2. Filter and select institutions for scrutiny within assigned regional scope.
3. Review individual institution cohort submissions against Approval Order entitlements.
4. Issue Show Cause Notices for confirmed mismatches or non-compliance.
5. Review submitted exception evidence.
6. Propose exception closure (AICTE_REVIEWER) or execute dual-sign-off closure (AICTE_ADMIN).
7. Ingest and manage Approval Order documents (EOA/LOA).
8. Author and activate versioned regulatory policy packs (with rule-author/activator SoD — ADR-007).

**What users see first:**

- `AICTE_ADMIN`: National Compliance Overview — aggregate compliance health indicators, count of pending exception closures requiring dual sign-off, count of pending policy activations.
- `AICTE_REVIEWER`: Regional Scrutiny Hub pre-filtered to their assigned region — institution list with compliance status indicators sorted by urgency.

**What must never appear:**

- Student PII (Aadhaar, contact details) without explicit audit-context authorization and masking controls.
- Controls to modify submitted admission records directly (write access to institutional data is not an AICTE function).
- Mutation controls for audit log records (ADR-009).
- Any suggestion that AI/ML output constitutes a final regulatory determination (ADR-007).

---

### 3.2 Institution Workspace

| Attribute           | Value                                                                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Roles**           | `INST_ADMIN` (institution scope), `INST_OPERATOR` (institution/campus scope)                                                              |
| **Primary purpose** | Admission batch submission, ingestion quality resolution, cohort ledger management, Show Cause evidence upload, AEP credential management |
| **Data scope**      | Strictly bounded to the operator's institution or campus tenant; cross-institution queries blocked at middleware and RLS layers           |

**Core task list:**

1. Upload new admission batch (CSV/XLSX) with column mapping.
2. Monitor ingestion progress; resolve defective row warnings.
3. Review and validate draft submission before sealing.
4. Sign off (INST_ADMIN) to seal a submission for regulatory review.
5. Browse the Cohort Ledger to verify student records against admission entitlements.
6. Respond to Show Cause Notices by uploading compliance evidence within the deadline.
7. Monitor AEP credential issuance; export or regenerate QR codes for students.
8. Manage institution operator accounts (INST_ADMIN only).

**What users see first:**

- Institutional Dashboard: submission completeness status for the current regulatory cycle, freeze deadline countdown, count of active Show Cause Notices requiring action.

**What must never appear:**

- Records of other institutions.
- Controls to modify sealed or locked submissions.
- Ability to close or adjudicate Show Cause Notices (regulatory authority only).
- Audit log mutation controls.

---

### 3.3 Student Portal

| Attribute           | Value                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------ |
| **Roles**           | `STUDENT`                                                                                  |
| **Primary purpose** | Personal admission entitlement status review, AEP download, demographic correction request |
| **Data scope**      | Individual record only — the authenticated student's own admission entitlement record      |

**Core task list:**

1. View personal admission entitlement status and programme details.
2. Download Admission Entitlement Proof (AEP) — cryptographically signed credential.
3. Display QR code for offline/external verification.
4. Submit a demographic correction request with supporting evidence.
5. Track correction request status.

**What users see first:**

- A single-record summary card: institution name, programme, quota type, admission year, entitlement status, and AEP availability indicator.

**What must never appear:**

- Other students' records.
- Regulatory deliberation details (exception states, Show Cause notice contents from AICTE).
- Administrative batch or ingestion data.
- Any control that mutates institutional or regulatory records.

---

### 3.4 External Verifier Portal

| Attribute           | Value                                                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Roles**           | `VERIFIER` (public-facing or token-scoped)                                                                             |
| **Primary purpose** | Cryptographic validation of an Admission Entitlement Proof by QR code scan or manual verification token                |
| **Data scope**      | Minimal disclosure — the verification outcome and the non-sensitive credential fields required to confirm authenticity |

**Core task list:**

1. Scan AEP QR code or enter a verification token.
2. Receive cryptographic verification result: valid / invalid / revoked.
3. View disclosed AEP fields (institution, programme, year, status) — no PII beyond what the credential schema defines.

**What users see first:**

- A verification input interface (QR scanner or token field) with no authenticated session requirement.

**What must never appear:**

- Student PII (Aadhaar, contact, date of birth) — the verifier receives only credential-defined disclosed fields.
- Internal system states (batch IDs, ingestion status, policy pack versions).
- Navigation to authenticated workspaces.

> [!NOTE]
> Decision D-001 (whether the External Verifier workspace is accessed via a standalone public portal or a tile in the main application shell) is **Open**. See [`docs/00-governance/decisions/decision-register.md`](../00-governance/decisions/decision-register.md). This document treats the External Verifier Portal as a standalone, potentially unauthenticated public-facing surface until D-001 is resolved.

---

### 3.5 Auditor Workbench

| Attribute           | Value                                                                                              |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| **Roles**           | `AUDITOR` (global or scoped read-only)                                                             |
| **Primary purpose** | Immutable audit trail inspection, reconciliation history review, evidence vault browsing           |
| **Data scope**      | Global or scoped read-only; zero mutation permissions at application layer and database role level |

**Core task list:**

1. Browse the immutable audit event log (actor, action, timestamp, correlation ID, tenant context).
2. Inspect reconciliation history for a specific institution and cohort.
3. Review evidence vault: uploaded documents, ingestion checksums, sealed submission hashes.
4. Replay regulatory evaluation logic against a historical policy pack version and cohort snapshot (if Replay Simulator is available).
5. Export audit excerpts for external reporting (format and authorization: `UNSPECIFIED`).

**What users see first:**

- Audit log explorer: sortable, filterable by date range, actor, action type, tenant, and correlation ID.

**What must never appear:**

- Any mutation control — create, update, delete, seal, issue, upload.
- Unmasked student PII without documented authorization.
- Controls that alter audit records (blocked at DB role level per ADR-009).

---

## 4. Cross-Cutting UX Invariants

These behaviors apply identically across all five workspaces. They are not configurable per workspace.

### 4.1 Sensitive Field Masking

- High-risk student identifiers (Aadhaar number, APAAR ID, contact phone/email in PII context) are **masked by default** in all views.
- Unmasking requires an explicit per-field action that is logged to the audit trail.
- Masking is never omitted to improve visual clarity.
- Masked fields display a consistent masked placeholder (e.g., `••••••••1234`) — not blank cells.

**Source:** ADR-008 (Identity Vault & Envelope Encryption), PROJECT_PLAN.md §10.2, §15.

### 4.2 Integration Mode Indicator

- Every authenticated session must display a persistent, non-dismissible indicator of the current integration mode: `MOCK`, `SANDBOX`, or `PRODUCTION`.
- The indicator is placed in the application shell header where it is visible in all views.
- In `MOCK` or `SANDBOX` mode, a secondary visual signal (e.g., a colored banner or badge) reinforces that data is not real.
- No real student data is ever used in `MOCK` or `SANDBOX` mode.

**Source:** PROJECT_PLAN.md §10.2.

### 4.3 Session Expiry Behavior

- Session absolute timeout: **8 hours**.
- Session idle timeout: **30 minutes**.
- On session expiry, the client clears all sensitive state held in memory or session storage and redirects to the login screen.
- Sensitive data is **not** stored in `localStorage` (which persists across browser sessions).
- Re-authentication is required for sensitive operations completed more than **15 minutes** after initial authentication. The re-auth prompt appears inline before the operation executes — it does not navigate away.
- On re-auth completion, the deferred operation resumes.

**Source:** ADR-003 (Better Auth), PROJECT_PLAN.md §16.1.

### 4.4 Permission-Denied Treatment

- When a user attempts to access a route or action they are not authorized for, the system:
  1. Returns an HTTP 403 from the API (never a 200 with empty data).
  2. Displays a permission-denied view that explains the required role without revealing system internals.
  3. Offers a navigation option back to a known-authorized route.
- Navigation items are hidden for roles that do not have access, but hidden navigation is **not** the authorization boundary. Authorization is enforced independently at the API layer.

**Source:** PROJECT_PLAN.md §10.2, AGENTS.md §7.

### 4.5 No-Data States

- Every list, table, and registry has an explicit empty state.
- Empty states name the condition: "No submissions have been uploaded for this cycle" — not a generic "No data found."
- Where the user can take an action to populate the data, the empty state includes a clear call to action.
- Where the data is missing due to a system condition (e.g., pending ingestion), the empty state explains the condition without fabricating interim content.

### 4.6 Six View States

Every interactive view handles exactly six states:

| State      | Description                                                                                                      |
| ---------- | ---------------------------------------------------------------------------------------------------------------- |
| `Idle`     | Data is loaded; user can interact normally.                                                                      |
| `Loading`  | A request is in flight; a skeleton or spinner is shown. Layout does not shift.                                   |
| `Success`  | Action completed; result is displayed or a toast confirms.                                                       |
| `Partial`  | Data loaded but with known gaps; a notice explains what is missing and why.                                      |
| `Error`    | Request failed; the error message explains the cause and remediation. Error toasts require manual dismissal.     |
| `Disabled` | The control exists but cannot be used in the current state; the reason is available (tooltip or adjacent label). |

**Source:** PROJECT_PLAN.md §10.2, interaction contracts specification.

### 4.7 Irreversible Action Confirmation

- Actions that are operationally irreversible (submission seal, Show Cause Notice issuance, exception closure with penalties) require **double-confirmation**:
  1. Primary confirmation modal — describes the action, its consequences, and any legal implications.
  2. Secondary confirmation — a type-to-confirm or explicit checkbox acknowledgment.
- Exception closure with penalties additionally requires **dual authorization**: both an `AICTE_REVIEWER` and an `AICTE_ADMIN` must confirm in sequence via the dual-authorization modal.

**Source:** PROJECT_PLAN.md §10.2.

---

## 5. Relationship to Audit Documents

The Stage 0 UI/UX audit conducted on 2 November 2026 is an **evidence snapshot** of the client codebase at Phase 1 baseline. It is not a source of approved product scope. Findings in audit documents identify gaps; they do not authorize features.

> [!IMPORTANT]
> Audit documents in `docs/04-frontend/` are diagnostic evidence only. Do not infer product requirements or approved behavior from audit findings. The authoritative source is the approved specifications under `docs/02-experience/` and `docs/01-product/`.

| Audit Document                                                                               | Purpose                                   | Authority Status                                                                                                         |
| -------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [`docs/04-frontend/ui-ux-audit.md`](../04-frontend/ui-ux-audit.md)                           | Stage 0 diagnostic audit of client code   | Diagnostic evidence snapshot                                                                                             |
| [`docs/04-frontend/journey-inventory.md`](../04-frontend/journey-inventory.md)               | Inventory of user journeys J-01..J-08     | Diagnostic audit evidence                                                                                                |
| [`docs/04-frontend/screen-inventory.md`](../04-frontend/screen-inventory.md)                 | Inventory of screens S-00..S-40           | Diagnostic audit evidence                                                                                                |
| [`docs/04-frontend/design-foundations-audit.md`](../04-frontend/design-foundations-audit.md) | Audit of client styling and design tokens | Diagnostic audit evidence                                                                                                |
| [`docs/04-frontend/ui-ux-decisions.md`](../04-frontend/ui-ux-decisions.md)                   | Original UI/UX decisions log D-001..D-008 | Consolidated into [`docs/00-governance/decisions/decision-register.md`](../00-governance/decisions/decision-register.md) |

---

## 6. Open Decisions

| ID    | Question                                                                                          | Status                                        | Owner             |
| ----- | ------------------------------------------------------------------------------------------------- | --------------------------------------------- | ----------------- |
| D-001 | Is the External Verifier Portal a standalone public surface or a tile in the authenticated shell? | `Open`                                        | Product Owner     |
| D-002 | Navigation pattern for users with memberships in multiple institutions or campuses                | `Open` (Proposed: Option a — header switcher) | UX Lead           |
| D-003 | UI component library: shadcn/ui or bespoke Tailwind                                               | `Open` (Proposed: Option a)                   | Frontend Lead     |
| D-004 | GIGW applicability for AICTE portal branding                                                      | `Open`                                        | Regulatory review |
| D-008 | Motion and animation: zero decorative animations vs fluid micro-interactions                      | `Open` (Proposed: Option a)                   | UX Lead           |

Full decision register: [`docs/00-governance/decisions/decision-register.md`](../00-governance/decisions/decision-register.md)
