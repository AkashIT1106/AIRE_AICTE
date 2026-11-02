# AIRE — Screen Inventory

**Stage 0: Existing Product and Interface Audit**

| Field      | Value                                                                                                                            |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Document   | `docs/04-frontend/screen-inventory.md`                                                                                           |
| Audit date | 2 November 2026                                                                                                                  |
| Sources    | PROJECT_PLAN.md §10, §20–§34, §41; [`client/src/App.tsx`](../../client/src/App.tsx)                                              |
| Status     | `DRAFT`                                                                                                                          |
| Related    | [ui-ux-audit.md](./ui-ux-audit.md) · [journey-inventory.md](./journey-inventory.md) · [ui-ux-decisions.md](./ui-ux-decisions.md) |

> [!IMPORTANT]
> Screens are classified as **Implemented** only if inspected source code confirms a rendered, functional screen. Placeholder tiles and comment text are not treated as implemented screens.

---

## Implementation Status Key

| Status        | Meaning                                                     |
| ------------- | ----------------------------------------------------------- |
| `IMPLEMENTED` | Source code produces a functional, navigable screen         |
| `PLACEHOLDER` | A tile or label exists as a future marker; no actual screen |
| `MISSING`     | Required by project plan; no code exists                    |
| `UNSPECIFIED` | Implied but not defined in current sources                  |

---

## Shared / Shell Screens

### S-00 — Application Shell

| Field                     | Detail                                                                                                      |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Screen ID**             | S-00                                                                                                        |
| **Name**                  | Application Shell / Layout                                                                                  |
| **Route**                 | N/A (wrapper)                                                                                               |
| **Role/Scope**            | All authenticated users                                                                                     |
| **Primary task**          | Consistent navigation, branding, and workspace framing                                                      |
| **Entry points**          | Any authenticated route                                                                                     |
| **Main content**          | Global navigation, workspace switcher, user identity indicator, notification area (if any)                  |
| **Primary actions**       | Navigate between sections; log out                                                                          |
| **Required data**         | Active user identity; active role/workspace                                                                 |
| **Important states**      | Loading; session expired; permission-denied                                                                 |
| **Related journeys**      | J-01, all                                                                                                   |
| **Implementation status** | `MISSING` — No shell layout or routing exists. `App.tsx` uses an inline header with no workspace switching. |
| **Source references**     | PROJECT_PLAN.md §10.1, §10.2                                                                                |
| **Open decisions**        | D-002 (component library); D-003 (OIDC provider); D-009 (navigation pattern)                                |

---

### S-01 — Login Screen

| Field                     | Detail                                                                  |
| ------------------------- | ----------------------------------------------------------------------- |
| **Screen ID**             | S-01                                                                    |
| **Name**                  | Login / Authentication                                                  |
| **Route**                 | `/login` (unspecified; route convention TBD)                            |
| **Role/Scope**            | Unauthenticated users                                                   |
| **Primary task**          | Authenticate via OIDC                                                   |
| **Entry points**          | Direct URL; session expiry redirect; unauthenticated redirect           |
| **Main content**          | Platform identity; OIDC sign-in button(s); integration mode indicator   |
| **Primary actions**       | Initiate OIDC sign-in                                                   |
| **Required data**         | None (identity resolved post-auth)                                      |
| **Important states**      | Default; auth error; provider unavailable; session clearing in progress |
| **Related journeys**      | J-01, J-12                                                              |
| **Implementation status** | `MISSING`                                                               |
| **Source references**     | PROJECT_PLAN.md §16.1, M01; §14.3 (integration mode must be displayed)  |
| **Open decisions**        | D-003 (which OIDC provider); D-010 (auth error copy)                    |

---

### S-02 — MFA Prompt

| Field                     | Detail                                                |
| ------------------------- | ----------------------------------------------------- |
| **Screen ID**             | S-02                                                  |
| **Name**                  | Multi-Factor Authentication Prompt                    |
| **Route**                 | Part of OIDC flow (provider-hosted or in-app)         |
| **Role/Scope**            | Users with MFA required (at minimum privileged roles) |
| **Primary task**          | Complete second factor                                |
| **Entry points**          | After primary authentication                          |
| **Implementation status** | `MISSING`                                             |
| **Source references**     | PROJECT_PLAN.md §16.1                                 |
| **Open decisions**        | D-003; provider-hosted vs. in-app MFA `Unspecified`   |

---

### S-03 — Foundation / Phase Status Screen

| Field                     | Detail                                                                                                                                                            |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Screen ID**             | S-03                                                                                                                                                              |
| **Name**                  | Engineering Foundation Status                                                                                                                                     |
| **Route**                 | `/` (current root)                                                                                                                                                |
| **Role/Scope**            | Unauthenticated (no auth guard)                                                                                                                                   |
| **Primary task**          | Show Phase 1 baseline status — temporary placeholder                                                                                                              |
| **Entry points**          | Root URL                                                                                                                                                          |
| **Main content**          | Header with AIRE branding, "Foundation Status" card with three tiles (API Monolith, Data Architecture, Security & Isolation), workspace placeholder tiles, footer |
| **Primary actions**       | None                                                                                                                                                              |
| **Required data**         | None (static)                                                                                                                                                     |
| **Important states**      | Static only                                                                                                                                                       |
| **Related journeys**      | None                                                                                                                                                              |
| **Implementation status** | `IMPLEMENTED` — source at [`client/src/App.tsx`](../../client/src/App.tsx)                                                                                        |
| **Source references**     | Phase 1 deliverable                                                                                                                                               |
| **Open decisions**        | This screen should be removed or replaced when Phase 2 authentication is implemented.                                                                             |

---

## AICTE Workspace Screens

### S-10 — AICTE Workspace Root / Regulatory Overview

| Field                     | Detail                                                                                                                                                                     |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Screen ID**             | S-10                                                                                                                                                                       |
| **Name**                  | AICTE Regulatory Overview Dashboard                                                                                                                                        |
| **Route**                 | `/aicte` (tentative)                                                                                                                                                       |
| **Role/Scope**            | `AICTE_ADMIN`, `AICTE_REVIEWER`, `AIRE_SUPER_ADMIN`                                                                                                                        |
| **Primary task**          | High-level regulatory monitoring                                                                                                                                           |
| **Main content**          | Institution coverage, programme admissions summary, approval reconciliation summary, unresolved exceptions count, processing status, historical evaluation changes (§32.2) |
| **Primary actions**       | Navigate to sub-sections                                                                                                                                                   |
| **Required data**         | Aggregate counts; exception queue depth; processing status                                                                                                                 |
| **Implementation status** | `PLACEHOLDER` — tile shown in `App.tsx` line 101; no screen                                                                                                                |
| **Source references**     | PROJECT_PLAN.md §10.1, §32.2                                                                                                                                               |

---

### S-11 — Institution Registry (AICTE)

| Field                     | Detail                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| **Screen ID**             | S-11                                                                                        |
| **Name**                  | Institution Registry                                                                        |
| **Route**                 | `/aicte/institutions` (tentative)                                                           |
| **Role/Scope**            | `AICTE_ADMIN`                                                                               |
| **Primary task**          | View and manage registered institutions                                                     |
| **Main content**          | Institution list (searchable, paginated); institution status; campus/programme associations |
| **Primary actions**       | Register institution; edit institution; manage campuses/programmes                          |
| **Required data**         | `institutions`, `campuses`, `programmes`                                                    |
| **Implementation status** | `MISSING`                                                                                   |
| **Source references**     | PROJECT_PLAN.md §10.1 (AICTE workspace), M02, J-05                                          |

---

### S-12 — Approval Registry (AICTE)

| Field                     | Detail                                                                                 |
| ------------------------- | -------------------------------------------------------------------------------------- |
| **Screen ID**             | S-12                                                                                   |
| **Name**                  | Approval Registry                                                                      |
| **Route**                 | `/aicte/approvals` (tentative)                                                         |
| **Role/Scope**            | `AICTE_ADMIN`                                                                          |
| **Primary task**          | Import, version, and maintain approval orders                                          |
| **Main content**          | Approval list; version history; document viewer; entitlement details                   |
| **Primary actions**       | Import approval; amend; view version history                                           |
| **Required data**         | `approval_orders`, `approval_versions`, `programme_entitlements`, `approval_documents` |
| **Implementation status** | `MISSING`                                                                              |
| **Source references**     | PROJECT_PLAN.md §10.1, M03, J-06                                                       |

---

### S-13 — Policy Registry (AICTE)

| Field                     | Detail                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| **Screen ID**             | S-13                                                                                        |
| **Name**                  | Policy Registry                                                                             |
| **Route**                 | `/aicte/policies` (tentative)                                                               |
| **Role/Scope**            | `AICTE_ADMIN`                                                                               |
| **Primary task**          | Manage and activate regulatory policy packs                                                 |
| **Main content**          | Policy pack list; rule definitions; test fixtures; activation workflow; version history     |
| **Primary actions**       | Draft policy; configure rules; run tests; review; activate                                  |
| **Required data**         | `policy_sources`, `policy_packs`, `policy_rules`, `policy_activations`, `policy_test_cases` |
| **Implementation status** | `MISSING`                                                                                   |
| **Source references**     | PROJECT_PLAN.md §10.1, M04, J-07                                                            |

---

### S-14 — Reconciliation Monitoring (AICTE)

| Field                     | Detail                                                               |
| ------------------------- | -------------------------------------------------------------------- |
| **Screen ID**             | S-14                                                                 |
| **Name**                  | Reconciliation Monitoring                                            |
| **Route**                 | `/aicte/reconciliation` (tentative)                                  |
| **Role/Scope**            | `AICTE_ADMIN`, `AICTE_REVIEWER`                                      |
| **Primary task**          | Monitor and trigger reconciliation runs                              |
| **Main content**          | Run history; run status; findings summary; replay controls           |
| **Primary actions**       | Initiate run; replay; view findings                                  |
| **Required data**         | `reconciliation_runs`, `rule_evaluations`, `reconciliation_findings` |
| **Implementation status** | `MISSING`                                                            |
| **Source references**     | PROJECT_PLAN.md §10.1, M09, M10                                      |

---

### S-15 — Exception Review Queue (AICTE)

| Field                     | Detail                                                                                 |
| ------------------------- | -------------------------------------------------------------------------------------- |
| **Screen ID**             | S-15                                                                                   |
| **Name**                  | Exception Review Queue                                                                 |
| **Route**                 | `/aicte/exceptions` (tentative)                                                        |
| **Role/Scope**            | `AICTE_REVIEWER` (assigned exceptions only)                                            |
| **Primary task**          | Review and resolve regulatory exceptions                                               |
| **Main content**          | Exception list (filtered to reviewer's assignments); exception status; finding details |
| **Primary actions**       | Open exception; assign; request evidence; record decision                              |
| **Required data**         | `exceptions`, `exception_findings`, `exception_assignments`, `review_decisions`        |
| **Implementation status** | `MISSING`                                                                              |
| **Source references**     | PROJECT_PLAN.md §10.1, M11, J-03                                                       |

---

### S-16 — Exception Detail (AICTE Reviewer)

| Field                     | Detail                                                                                                                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Screen ID**             | S-16                                                                                                                                                                             |
| **Name**                  | Exception Detail — Reviewer View                                                                                                                                                 |
| **Route**                 | `/aicte/exceptions/:id` (tentative)                                                                                                                                              |
| **Role/Scope**            | `AICTE_REVIEWER` (assigned)                                                                                                                                                      |
| **Primary task**          | Investigate a specific exception and record a decision                                                                                                                           |
| **Main content**          | Finding; source record; applicable approval; rule; calculation trace; missing evidence; institution response; evidence attachments; reviewer notes; state history; decision form |
| **Primary actions**       | Add notes; request evidence; record decision; reassign; escalate                                                                                                                 |
| **Important states**      | OPEN; AWAITING_INSTITUTION; RESPONSE_RECEIVED; UNDER_REVIEW; RESOLVED                                                                                                            |
| **Required data**         | Full exception record; finding; evaluation trace; institution response; evidence references                                                                                      |
| **Implementation status** | `MISSING`                                                                                                                                                                        |
| **Source references**     | PROJECT_PLAN.md M11, §30.3, J-03                                                                                                                                                 |
| **Open decisions**        | D-011 (evidence viewer design); D-012 (field-level masking rules for reviewer view)                                                                                              |

---

### S-17 — AICTE Reports

| Field                     | Detail                                                                                              |
| ------------------------- | --------------------------------------------------------------------------------------------------- |
| **Screen ID**             | S-17                                                                                                |
| **Name**                  | AICTE Reports and Analytics                                                                         |
| **Route**                 | `/aicte/reports` (tentative)                                                                        |
| **Role/Scope**            | `AICTE_ADMIN`, `AICTE_REVIEWER`                                                                     |
| **Primary task**          | View aggregate reporting and controlled exports                                                     |
| **Main content**          | Category entitlement summaries; exception status; reporting completeness; controlled export actions |
| **Important states**      | Loading; no data; export in progress; export restricted                                             |
| **Required data**         | Aggregated server-side; never full student dataset in browser (§32.5)                               |
| **Implementation status** | `MISSING`                                                                                           |
| **Source references**     | PROJECT_PLAN.md §10.1, §32.2, M13                                                                   |

---

### S-18 — Audit and Governance (AICTE)

| Field                     | Detail                                          |
| ------------------------- | ----------------------------------------------- |
| **Screen ID**             | S-18                                            |
| **Name**                  | Audit and Governance                            |
| **Route**                 | `/aicte/audit` (tentative)                      |
| **Role/Scope**            | `AICTE_ADMIN`, `AUDITOR`                        |
| **Primary task**          | Access audit event records and governance views |
| **Implementation status** | `MISSING`                                       |
| **Source references**     | PROJECT_PLAN.md §10.1, §19, M15                 |

---

## Institution Workspace Screens

### S-20 — Institution Workspace Root

| Field                     | Detail                                                                                                                                                                |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Screen ID**             | S-20                                                                                                                                                                  |
| **Name**                  | Institution Overview Dashboard                                                                                                                                        |
| **Route**                 | `/institution` or `/institution/:id` (tentative)                                                                                                                      |
| **Role/Scope**            | `INSTITUTION_ADMIN`, `INSTITUTION_DATA_OPERATOR`, `INSTITUTION_COMPLIANCE_OFFICER`                                                                                    |
| **Primary task**          | Institution operational overview                                                                                                                                      |
| **Main content**          | Submission overview; admission counts; programme-level results; identity status summaries; exception status; evidence requests; pending institutional actions (§32.1) |
| **Implementation status** | `PLACEHOLDER` — tile shown in `App.tsx` line 102; no screen                                                                                                           |
| **Source references**     | PROJECT_PLAN.md §10.1, §32.1                                                                                                                                          |

---

### S-21 — Admission Submissions

| Field                     | Detail                                               |
| ------------------------- | ---------------------------------------------------- |
| **Screen ID**             | S-21                                                 |
| **Name**                  | Admission Submissions                                |
| **Route**                 | `/institution/submissions` (tentative)               |
| **Role/Scope**            | `INSTITUTION_DATA_OPERATOR`                          |
| **Primary task**          | View submission history and initiate new submission  |
| **Main content**          | Submission batch list; status indicators; row counts |
| **Primary actions**       | New submission; view batch                           |
| **Implementation status** | `MISSING`                                            |
| **Source references**     | PROJECT_PLAN.md §10.1, M05, J-02                     |

---

### S-22 — Upload Form

| Field                     | Detail                                                                                   |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| **Screen ID**             | S-22                                                                                     |
| **Name**                  | Admission Data Upload                                                                    |
| **Route**                 | `/institution/submissions/new` (tentative)                                               |
| **Role/Scope**            | `INSTITUTION_DATA_OPERATOR`                                                              |
| **Primary task**          | Upload CSV/XLSX admission data file                                                      |
| **Main content**          | Institution/campus/programme/year selector; file upload control; submission confirmation |
| **Primary actions**       | Attach file; submit                                                                      |
| **Important states**      | Idle; uploading; validating; error                                                       |
| **Implementation status** | `MISSING`                                                                                |
| **Source references**     | PROJECT_PLAN.md M05, §24.4, J-02                                                         |

---

### S-23 — Batch Validation Result

| Field                     | Detail                                                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Screen ID**             | S-23                                                                                                           |
| **Name**                  | Batch Validation Result                                                                                        |
| **Route**                 | `/institution/submissions/:batchId` (tentative)                                                                |
| **Role/Scope**            | `INSTITUTION_DATA_OPERATOR`                                                                                    |
| **Primary task**          | Review per-row validation results and decide whether to submit                                                 |
| **Main content**          | Summary counts (ACCEPTED, ACCEPTED_WITH_WARNING, REJECTED, QUARANTINED); row-level result table; error details |
| **Primary actions**       | Submit batch; download results; return and re-upload                                                           |
| **Important states**      | Validating (in progress); validated; ready to submit; completed; completed with errors                         |
| **Implementation status** | `MISSING`                                                                                                      |
| **Source references**     | PROJECT_PLAN.md M05, M06, §25.3                                                                                |

---

### S-24 — Reconciliation Results (Institution)

| Field                     | Detail                                                                                                                |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Screen ID**             | S-24                                                                                                                  |
| **Name**                  | Reconciliation Results                                                                                                |
| **Route**                 | `/institution/reconciliation` (tentative)                                                                             |
| **Role/Scope**            | `INSTITUTION_ADMIN`, `INSTITUTION_COMPLIANCE_OFFICER`                                                                 |
| **Primary task**          | View reconciliation outcomes for the institution                                                                      |
| **Main content**          | Programme-level results; overall status (CONSISTENT / REVIEW_REQUIRED / INCOMPLETE / INCONCLUSIVE); finding summaries |
| **Implementation status** | `MISSING`                                                                                                             |
| **Source references**     | PROJECT_PLAN.md §10.1, M10, M09                                                                                       |

---

### S-25 — Institution Exceptions

| Field                     | Detail                                                       |
| ------------------------- | ------------------------------------------------------------ |
| **Screen ID**             | S-25                                                         |
| **Name**                  | Institution Exception List                                   |
| **Route**                 | `/institution/exceptions` (tentative)                        |
| **Role/Scope**            | `INSTITUTION_COMPLIANCE_OFFICER`                             |
| **Primary task**          | View exceptions and respond to AICTE requests                |
| **Main content**          | Exception list; status; finding reference; deadline (if any) |
| **Primary actions**       | Open exception; respond                                      |
| **Implementation status** | `MISSING`                                                    |
| **Source references**     | PROJECT_PLAN.md §10.1, M11, J-04                             |

---

### S-26 — Institution Exception Response Form

| Field                     | Detail                                                                    |
| ------------------------- | ------------------------------------------------------------------------- |
| **Screen ID**             | S-26                                                                      |
| **Name**                  | Exception Response                                                        |
| **Route**                 | `/institution/exceptions/:id/respond` (tentative)                         |
| **Role/Scope**            | `INSTITUTION_COMPLIANCE_OFFICER`                                          |
| **Primary task**          | Submit response and evidence to an exception                              |
| **Main content**          | Exception detail (read-only); response text area; evidence upload; submit |
| **Important states**      | AWAITING_INSTITUTION (only submittable in this state)                     |
| **Implementation status** | `MISSING`                                                                 |
| **Source references**     | PROJECT_PLAN.md M11, J-04                                                 |

---

### S-27 — Institution User Management

| Field                     | Detail                                            |
| ------------------------- | ------------------------------------------------- |
| **Screen ID**             | S-27                                              |
| **Name**                  | Institution User Management                       |
| **Route**                 | `/institution/users` (tentative)                  |
| **Role/Scope**            | `INSTITUTION_ADMIN`                               |
| **Primary task**          | Manage institution members and scoped permissions |
| **Implementation status** | `MISSING`                                         |
| **Source references**     | PROJECT_PLAN.md §10.1, M01, J-08                  |

---

## Student Workspace Screens

### S-30 — Student Own Record

| Field                     | Detail                                                                    |
| ------------------------- | ------------------------------------------------------------------------- |
| **Screen ID**             | S-30                                                                      |
| **Name**                  | Student — Own Admission Record                                            |
| **Route**                 | `/student` (tentative)                                                    |
| **Role/Scope**            | `STUDENT` (own record only)                                               |
| **Primary task**          | View own admission record, verification status, correction request status |
| **Important states**      | Record verified; record with findings; correction pending                 |
| **Implementation status** | `PLACEHOLDER` — tile shown in `App.tsx` line 103; no screen               |
| **Source references**     | PROJECT_PLAN.md §10.1, §32.3, M12                                         |

---

### S-31 — Student Correction Request

| Field                     | Detail                                                                           |
| ------------------------- | -------------------------------------------------------------------------------- |
| **Screen ID**             | S-31                                                                             |
| **Name**                  | Correction Request Form                                                          |
| **Route**                 | `/student/correction-request` (tentative)                                        |
| **Role/Scope**            | `STUDENT`                                                                        |
| **Primary task**          | Submit a correction request for own admission record                             |
| **Implementation status** | `MISSING`                                                                        |
| **Source references**     | PROJECT_PLAN.md §5.1 (Student role: "Own-record access and correction requests") |

---

## External Verifier Workspace Screens

### S-40 — Verification Request

| Field                     | Detail                                                                             |
| ------------------------- | ---------------------------------------------------------------------------------- |
| **Screen ID**             | S-40                                                                               |
| **Name**                  | External Verifier — Verification Request                                           |
| **Route**                 | `/verifier` (tentative)                                                            |
| **Role/Scope**            | `EXTERNAL_VERIFIER`                                                                |
| **Primary task**          | Create a verification request and receive result within authorised scope           |
| **Implementation status** | `MISSING`                                                                          |
| **Source references**     | PROJECT_PLAN.md §10.1, M12, J-10                                                   |
| **Open decisions**        | External Verifier workspace is absent from `App.tsx` placeholder tiles; see D-001. |

---

## Auditor Workspace Screens

### S-50 — Auditor Dashboard

| Field                     | Detail                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------- |
| **Screen ID**             | S-50                                                                                  |
| **Name**                  | Auditor — Audit Records and History                                                   |
| **Route**                 | `/auditor` (tentative)                                                                |
| **Role/Scope**            | `AUDITOR`                                                                             |
| **Primary task**          | Read-only access to approved audit records, historical decisions, evidence references |
| **Implementation status** | `PLACEHOLDER` — tile shown in `App.tsx` line 104; no screen                           |
| **Source references**     | PROJECT_PLAN.md §10.1, §32.4, J-11                                                    |

---

## Screen Summary Table

| Screen ID | Name                                 | Workspace   | Status        | Phase Target        |
| --------- | ------------------------------------ | ----------- | ------------- | ------------------- |
| S-00      | Application Shell                    | All         | `MISSING`     | Phase 2             |
| S-01      | Login                                | Auth        | `MISSING`     | Phase 2             |
| S-02      | MFA Prompt                           | Auth        | `MISSING`     | Phase 2             |
| S-03      | Foundation Status                    | —           | `IMPLEMENTED` | Phase 1 (temporary) |
| S-10      | AICTE Regulatory Overview            | AICTE       | `PLACEHOLDER` | Phase 9             |
| S-11      | Institution Registry                 | AICTE       | `MISSING`     | Phase 3             |
| S-12      | Approval Registry                    | AICTE       | `MISSING`     | Phase 3             |
| S-13      | Policy Registry                      | AICTE       | `MISSING`     | Phase 4             |
| S-14      | Reconciliation Monitoring            | AICTE       | `MISSING`     | Phase 7             |
| S-15      | Exception Review Queue               | AICTE       | `MISSING`     | Phase 8             |
| S-16      | Exception Detail (Reviewer)          | AICTE       | `MISSING`     | Phase 8             |
| S-17      | AICTE Reports                        | AICTE       | `MISSING`     | Phase 9             |
| S-18      | Audit and Governance                 | AICTE       | `MISSING`     | Phase 11            |
| S-20      | Institution Workspace Root           | Institution | `PLACEHOLDER` | Phase 5/9           |
| S-21      | Admission Submissions                | Institution | `MISSING`     | Phase 5             |
| S-22      | Upload Form                          | Institution | `MISSING`     | Phase 5             |
| S-23      | Batch Validation Result              | Institution | `MISSING`     | Phase 5             |
| S-24      | Reconciliation Results (Institution) | Institution | `MISSING`     | Phase 7             |
| S-25      | Institution Exceptions               | Institution | `MISSING`     | Phase 8             |
| S-26      | Exception Response Form              | Institution | `MISSING`     | Phase 8             |
| S-27      | Institution User Management          | Institution | `MISSING`     | Phase 2/3           |
| S-30      | Student Own Record                   | Student     | `PLACEHOLDER` | Phase 9             |
| S-31      | Student Correction Request           | Student     | `MISSING`     | Phase 9             |
| S-40      | External Verifier Workspace          | Verifier    | `MISSING`     | Phase 9             |
| S-50      | Auditor Dashboard                    | Auditor     | `PLACEHOLDER` | Phase 11            |

**Counts:** 1 Implemented · 4 Placeholder · 19 Missing · 0 Inconsistent

> [!NOTE]
> Route paths marked "(tentative)" are not yet defined in any specification or code. See [ui-ux-decisions.md](./ui-ux-decisions.md) — D-013 for the routing convention decision.
