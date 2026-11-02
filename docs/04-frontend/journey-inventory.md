# AIRE — User Journey Inventory

**Stage 0: Existing Product and Interface Audit**

| Field      | Value                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Document   | `docs/04-frontend/journey-inventory.md`                                                                                        |
| Audit date | 2 November 2026                                                                                                                |
| Sources    | PROJECT_PLAN.md §5, §6, §10, §20–§34, §41; AGENTS.md                                                                           |
| Status     | `DRAFT`                                                                                                                        |
| Related    | [ui-ux-audit.md](./ui-ux-audit.md) · [screen-inventory.md](./screen-inventory.md) · [ui-ux-decisions.md](./ui-ux-decisions.md) |

> [!IMPORTANT]
> All journeys below are **extracted from approved project documentation only**. Where a role, permission, or step is not defined by the sources, it is marked `Unspecified`. No journeys have been invented.

---

## Journey Status Key

| Status        | Meaning                                                                      |
| ------------- | ---------------------------------------------------------------------------- |
| `IMPLEMENTED` | UI screens and backend routes supporting this journey exist and are verified |
| `PARTIAL`     | Some screens or backend support exist but the journey is incomplete          |
| `MISSING`     | Required by the project plan; no implementation yet                          |
| `UNSPECIFIED` | The journey is implied but not fully defined in current sources              |

---

## J-01 — Institution Operator: Authenticate and Access Workspace

| Field                | Detail                                                                                       |
| -------------------- | -------------------------------------------------------------------------------------------- |
| **Journey ID**       | J-01                                                                                         |
| **User role**        | `INSTITUTION_DATA_OPERATOR`, `INSTITUTION_ADMIN`, `INSTITUTION_COMPLIANCE_OFFICER`           |
| **Authorized scope** | Institution-scoped (their assigned institution only)                                         |
| **Entry point**      | Application root URL                                                                         |
| **User goal**        | Sign in and reach the institution workspace                                                  |
| **Preconditions**    | User account exists; active institution membership with valid scope; OIDC provider available |
| **Status**           | `MISSING`                                                                                    |

**Main path:**

1. User navigates to the application login screen.
2. User authenticates via OIDC / Authorization Code + PKCE flow.
3. MFA prompt if required for the user's role.
4. Session established with HttpOnly/Secure/SameSite cookie.
5. Backend validates identity and resolves active memberships and scopes.
6. User is directed to the institution workspace root.

**Alternate paths:**

- MFA not configured → prompt to configure MFA (behaviour `Unspecified`).
- Returning user with valid session → redirect directly to workspace.

**Failure and recovery:**

- Authentication failure → error message; no sensitive detail exposed.
- MFA failure → account lockout behaviour `Unspecified`.
- Session expiry → redirect to login; sensitive client state cleared (§10.2).
- Provider unavailable → error state with retry guidance.

**Required screens:** Login, MFA prompt, Institution workspace root.

**Data and permissions involved:** Session token; user identity; membership and scope records.

**Must remain visible:** Platform identity and branding during auth flow.

**Completion condition:** User is authenticated; institution workspace root is displayed with scope-appropriate content.

**Audit events:** Authentication success/failure (§19.2 — security audit).

---

## J-02 — Institution Data Operator: Upload Admission Batch

| Field                | Detail                                                                                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Journey ID**       | J-02                                                                                                                                                           |
| **User role**        | `INSTITUTION_DATA_OPERATOR`                                                                                                                                    |
| **Authorized scope** | Assigned institution, campus, programme                                                                                                                        |
| **Entry point**      | Institution workspace → Admission Submissions                                                                                                                  |
| **User goal**        | Upload a CSV/XLSX file of admission records for a programme and academic year                                                                                  |
| **Preconditions**    | Authenticated; active membership with `submission.create` permission; institution, campus, and programme exist in registry; upload window open (if applicable) |
| **Status**           | `MISSING`                                                                                                                                                      |

**Main path (§24.3 submission lifecycle):**

1. Operator navigates to Admission Submissions.
2. Operator selects institution, campus, programme, academic year.
3. Operator attaches CSV/XLSX file.
4. System validates file format, size, and checksum.
5. System displays upload confirmation (DRAFT → UPLOADED).
6. Background worker validates and normalises the file (VALIDATING → VALIDATED).
7. Operator reviews row-level results and validation summary.
8. Operator confirms and submits (READY_FOR_SUBMISSION → SUBMITTED).
9. Background processing completes (PROCESSING → COMPLETED or COMPLETED_WITH_ERRORS).
10. Operator views batch summary and row results.

**Alternate paths:**

- Duplicate batch detected → idempotency handled; operator informed.
- Batch has partially valid rows → COMPLETED_WITH_ERRORS; accepted and rejected rows distinguished.

**Failure and recovery:**

- File too large / wrong format → upload blocked with clear error.
- Validation failure → REJECTED rows listed with reason; operator can correct and re-upload.
- Processing failure (worker error) → operator informed; retry available; partial failures do not corrupt accepted records (§24.5).
- Network interruption → upload resumes or restarts.

**Required screens:** Submission list, upload form, validation result, batch summary, row-level result.

**Data and permissions involved:** `submission.create`, `submission.read`, `submission.validate`, `submission.submit` (§16.3); institution/campus/programme scoped.

**Must remain visible:** Upload progress; previously accepted batches remain accessible.

**Completion condition:** Batch reaches COMPLETED or COMPLETED_WITH_ERRORS; row-level results visible.

**Audit events:** Upload event; validation event; submission event; processing completion (§19).

---

## J-03 — AICTE Reviewer: Review an Exception

| Field                | Detail                                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Journey ID**       | J-03                                                                                                                                       |
| **User role**        | `AICTE_REVIEWER`                                                                                                                           |
| **Authorized scope** | Assigned exceptions within assigned workload                                                                                               |
| **Entry point**      | AICTE workspace → Exception Queue                                                                                                          |
| **User goal**        | Investigate a reconciliation exception, review institution response, and record an authorised decision                                     |
| **Preconditions**    | Authenticated; reviewer assignment for this exception (`exception.assign`); exception is in OPEN, RESPONSE_RECEIVED, or UNDER_REVIEW state |
| **Status**           | `MISSING`                                                                                                                                  |

**Main path (§30, M11):**

1. Reviewer opens the exception queue.
2. Reviewer selects an assigned exception.
3. Reviewer views: specific finding, source record, applicable approval and rule, relevant inputs, calculation trace, missing/conflicting evidence.
4. Reviewer reviews institution response and attached evidence.
5. Reviewer adds notes.
6. Reviewer records an authorised decision (transition to RESOLVED or alternate state).
7. System records actor, timestamp, and decision.
8. Audit event written.

**Alternate paths:**

- Evidence insufficient → reviewer requests additional evidence; exception moves to ADDITIONAL_EVIDENCE_REQUIRED.
- Exception requires escalation → REFERRED_TO_AUTHORISED_PROCESS.
- Reviewer reassigns to another reviewer.

**Failure and recovery:**

- Institution has not responded → exception stays in AWAITING_INSTITUTION; reviewer cannot resolve prematurely.
- Reviewer assignment expired → access denied; must be reassigned.
- Network error during decision submission → state preserved; decision not partially applied.

**Required screens:** Exception queue, exception detail, evidence viewer, notes panel, decision form.

**Data and permissions involved:** `exception.read`, `exception.assign`, `exception.request_evidence`, `exception.resolve` (§16.3); reviewer assignment verification (§17.4); field-level authorization (reviewer sees finding, approval, rule, evaluation trace — not raw APAAR identifier unless separately permitted, §16.5).

**What must remain visible:** Previous reviewer notes; full finding trace; institution response; evidence references; state history.

**Completion condition:** Decision recorded; exception state updated; audit event written; institution notified (notification mechanism `Unspecified`).

**Audit events:** Exception viewed; decision recorded; state transition (§19 — business audit).

---

## J-04 — Institution Compliance Officer: Respond to an Exception

| Field                | Detail                                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Journey ID**       | J-04                                                                                                             |
| **User role**        | `INSTITUTION_COMPLIANCE_OFFICER`                                                                                 |
| **Authorized scope** | Exceptions belonging to the officer's assigned institution                                                       |
| **Entry point**      | Institution workspace → Exceptions                                                                               |
| **User goal**        | Respond to a regulatory exception with supporting evidence                                                       |
| **Preconditions**    | Authenticated; active membership with `exception.respond` permission; exception is in AWAITING_INSTITUTION state |
| **Status**           | `MISSING`                                                                                                        |

**Main path:**

1. Officer opens institution exception list.
2. Officer selects an exception in AWAITING_INSTITUTION.
3. Officer reviews the finding, source record, and AICTE request.
4. Officer attaches supporting evidence (document upload).
5. Officer writes a response.
6. Officer submits the response (exception moves to RESPONSE_RECEIVED).
7. Submission confirmed; audit event written.

**Alternate paths:**

- Evidence attachment fails → officer can retry; partial submissions not silently lost.

**Failure and recovery:**

- Institution tries to respond to an exception from another institution → denied; tenant isolation enforced.
- Response submitted after deadline (if applicable) → behaviour `Unspecified`.

**Required screens:** Institution exception list, exception detail, response form, evidence upload, confirmation.

**Data and permissions involved:** `exception.respond` (§16.3); institution-scoped; response is tenant-scoped (§30.4).

**Separation of duties:** Institution users may respond but cannot resolve regulatory findings as AICTE reviewers (§30.4, §5.5).

**Completion condition:** Response submitted; exception moves to RESPONSE_RECEIVED; AICTE reviewer can proceed.

**Audit events:** Institution response submitted; evidence attached (§19).

---

## J-05 — AICTE Administrator: Manage Institution Registry

| Field                | Detail                                                                                        |
| -------------------- | --------------------------------------------------------------------------------------------- |
| **Journey ID**       | J-05                                                                                          |
| **User role**        | `AICTE_ADMIN`                                                                                 |
| **Authorized scope** | Platform-level registry                                                                       |
| **Entry point**      | AICTE workspace → Institution Registry                                                        |
| **User goal**        | Register or update an institution and its campuses/programmes                                 |
| **Preconditions**    | Authenticated; active membership with `institution.read` and `institution.update` permissions |
| **Status**           | `MISSING`                                                                                     |

**Main path (M02):**

1. Admin navigates to Institution Registry.
2. Admin searches for an existing institution or initiates registration.
3. Admin enters or updates institution details using authoritative reference identifiers.
4. Admin associates campuses and programmes.
5. Admin sets institution status.
6. Changes recorded with audit trail.

**Rules:** Authoritative institution references used (§21.4). Fuzzy matching cannot silently establish canonical identity.

**Required screens:** Institution list, institution detail, campus list, programme list, edit forms.

**Completion condition:** Registry updated; all references traceable; change recorded in audit.

---

## J-06 — AICTE Administrator: Manage Approval Registry

| Field                | Detail                                                                             |
| -------------------- | ---------------------------------------------------------------------------------- |
| **Journey ID**       | J-06                                                                               |
| **User role**        | `AICTE_ADMIN`                                                                      |
| **Authorized scope** | Platform-level approvals                                                           |
| **Entry point**      | AICTE workspace → Approval Registry                                                |
| **User goal**        | Import and version an approval order with programme-level entitlements             |
| **Preconditions**    | Authenticated; `approval.create`, `approval.amend`, `approval.publish` permissions |
| **Status**           | `MISSING`                                                                          |

**Main path (M03):**

1. Admin imports approval order document.
2. Admin (or AI-assisted extraction candidate) enters programme entitlement data.
3. Human reviews and confirms extracted values.
4. Approval version created with effective dates.
5. Superseding amendments link to prior versions.
6. Source provenance and document reference preserved.

**Rules:** Institution-submitted intake must not become the authoritative approval source (§22.4). OCR values are candidates only. Human review required.

**Required screens:** Approval list, approval detail, version history, entitlement editor, document viewer.

**Completion condition:** Versioned approval record with source, entitlements, and effective dates; prior versions preserved.

---

## J-07 — AICTE Admin / Policy Author: Activate a Regulatory Policy

| Field                | Detail                                                                                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Journey ID**       | J-07                                                                                                                                                             |
| **User role**        | `AICTE_ADMIN` (policy management); independent reviewer for activation                                                                                           |
| **Authorized scope** | Platform-level policy                                                                                                                                            |
| **Entry point**      | AICTE workspace → Policy Registry                                                                                                                                |
| **User goal**        | Draft, review, test, and activate a versioned regulatory policy pack                                                                                             |
| **Preconditions**    | Authenticated; `policy.create`, `policy.review`, `policy.activate` permissions (with separation: policy author cannot activate without independent review, §5.5) |
| **Status**           | `MISSING`                                                                                                                                                        |

**Main path (M04, §23.5):**

1. Author drafts policy pack; attaches source document and clause references.
2. Author configures candidate rules using allowlisted handlers.
3. Author adds test fixtures; validates expected results.
4. Independent reviewer reviews the policy pack.
5. Authorised approver activates the policy with effective dates.
6. Prior version is preserved; historical evaluations remain unchanged.

**Rules:** No database-supplied executable code (§23.3). Unconfigured rules never default to PASS (§23.4).

**Required screens:** Policy list, policy editor, rule editor, test fixture runner, review workflow, activation form, version history.

**Completion condition:** Policy activated with source, clause references, test fixtures, and effective dates; prior version preserved.

---

## J-08 — Institution Admin: Manage Users and Memberships

| Field                | Detail                                                                           |
| -------------------- | -------------------------------------------------------------------------------- |
| **Journey ID**       | J-08                                                                             |
| **User role**        | `INSTITUTION_ADMIN`                                                              |
| **Authorized scope** | Their assigned institution                                                       |
| **Entry point**      | Institution workspace → User Management                                          |
| **User goal**        | Invite and manage institution members; assign scoped permissions                 |
| **Preconditions**    | Authenticated; `institution.members.manage` permission; within institution scope |
| **Status**           | `MISSING`                                                                        |

**Separation of duties:** Institution administrators cannot create AICTE privileged accounts (§5.5, §20.5).

**Required screens:** Member list, invite form, role assignment, scope assignment, membership deactivation.

**Completion condition:** Member invited; scoped permissions assigned; audit event recorded.

---

## J-09 — Student: View Own Record

| Field                | Detail                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| **Journey ID**       | J-09                                                                                                   |
| **User role**        | `STUDENT`                                                                                              |
| **Authorized scope** | Own record only                                                                                        |
| **Entry point**      | Student workspace root                                                                                 |
| **User goal**        | View their own admission record, permitted identity verification status, and correction request status |
| **Preconditions**    | Authenticated; own-record access permission                                                            |
| **Status**           | `MISSING`                                                                                              |

**Main path (M13 §32.3, M12):**

1. Student authenticates.
2. Student views their own admission record.
3. Student views permitted verification status.
4. Student may initiate a correction request.

**Rules:** Student cannot access other students' records. Raw APAAR identifier is not displayed. Sensitive fields masked.

**Required screens:** Student workspace, own record view, correction request form.

**Completion condition:** Student views their record; correction request submitted if initiated.

---

## J-10 — External Verifier: Submit a Verification Request

| Field                | Detail                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------- |
| **Journey ID**       | J-10                                                                                     |
| **User role**        | `EXTERNAL_VERIFIER`                                                                      |
| **Authorized scope** | Specific authorised verification scope only                                              |
| **Entry point**      | External Verifier workspace                                                              |
| **User goal**        | Submit an authorised verification request and receive a result                           |
| **Preconditions**    | Authenticated; authorised verifier scope; verification request is within permitted scope |
| **Status**           | `MISSING`                                                                                |

**Main path (M12):**

1. Verifier authenticates.
2. Verifier creates a verification request within authorised scope.
3. System verifies issuer authority.
4. Verifier receives result (minimal data, minimal claims).
5. Request recorded in history.

**Rules:** Only authorised issuers make permitted claims. Minimal data principle (§31.3).

**Required screens:** Verifier workspace, verification request form, result view, request history.

**Completion condition:** Verification result returned within authorised scope; request recorded.

---

## J-11 — Auditor: Access Audit Records

| Field                | Detail                                                                |
| -------------------- | --------------------------------------------------------------------- |
| **Journey ID**       | J-11                                                                  |
| **User role**        | `AUDITOR`                                                             |
| **Authorized scope** | Approved audit records (read-only)                                    |
| **Entry point**      | Auditor workspace                                                     |
| **User goal**        | Review historical decisions, evidence references, and access history  |
| **Preconditions**    | Authenticated; `audit.read` permission; within approved auditor scope |
| **Status**           | `MISSING`                                                             |

**Main path (M13 §32.4):**

1. Auditor authenticates.
2. Auditor browses approved audit records.
3. Auditor views historical evaluation decisions, evidence references, policy version history.
4. Auditor may export records within authorised scope (`audit.export`).

**Required screens:** Auditor workspace, audit log viewer, evaluation history, evidence reference viewer, export (if permitted).

**Completion condition:** Audit records accessed; any export logged.

---

## J-12 — Any Authenticated User: Session Expiry and Re-authentication

| Field                | Detail                                                            |
| -------------------- | ----------------------------------------------------------------- |
| **Journey ID**       | J-12                                                              |
| **User role**        | All authenticated roles                                           |
| **Authorized scope** | N/A                                                               |
| **Entry point**      | Any protected screen                                              |
| **User goal**        | Seamlessly re-authenticate after session expiry without data loss |
| **Preconditions**    | Session has expired                                               |
| **Status**           | `MISSING`                                                         |

**Main path:**

1. Session expires.
2. Sensitive client state is cleared (§10.2).
3. User is redirected to login.
4. User re-authenticates.
5. User is returned to their previous context where possible.

**Completion condition:** Re-authenticated; sensitive state not persisted; return-to context preserved if safe.

---

## Journey Coverage Summary

| Journey ID | Description                       | Role(s)                          | Status    |
| ---------- | --------------------------------- | -------------------------------- | --------- |
| J-01       | Authenticate and Access Workspace | All institutional/AICTE          | `MISSING` |
| J-02       | Upload Admission Batch            | `INSTITUTION_DATA_OPERATOR`      | `MISSING` |
| J-03       | Review an Exception               | `AICTE_REVIEWER`                 | `MISSING` |
| J-04       | Respond to an Exception           | `INSTITUTION_COMPLIANCE_OFFICER` | `MISSING` |
| J-05       | Manage Institution Registry       | `AICTE_ADMIN`                    | `MISSING` |
| J-06       | Manage Approval Registry          | `AICTE_ADMIN`                    | `MISSING` |
| J-07       | Activate a Regulatory Policy      | `AICTE_ADMIN`                    | `MISSING` |
| J-08       | Manage Users and Memberships      | `INSTITUTION_ADMIN`              | `MISSING` |
| J-09       | View Own Record                   | `STUDENT`                        | `MISSING` |
| J-10       | Submit a Verification Request     | `EXTERNAL_VERIFIER`              | `MISSING` |
| J-11       | Access Audit Records              | `AUDITOR`                        | `MISSING` |
| J-12       | Session Expiry and Re-auth        | All                              | `MISSING` |

> [!NOTE]
> Additional journeys implied by PROJECT_PLAN.md but not fully specified include: reconciliation run initiation, AEP generation and review, data subject rights requests (access/correction/erasure), provider health monitoring, and dead-letter job recovery. These are marked `Unspecified` and require product definition before UI design can proceed.
