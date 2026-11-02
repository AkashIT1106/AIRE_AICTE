# User Journey Specification Index

| Metadata             | Value                                                                                                                                                                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/02-experience/user-journeys/README.md`                                                                                                                                                                                                                                       |
| Authoritative For    | User Journey Catalog, Operational Workflows, Classification, Requirements Traceability                                                                                                                                                                                             |
| Status               | `CONFIRMED`                                                                                                                                                                                                                                                                        |
| Source               | PROJECT_PLAN.md §5, §6, §10, §24, §25, §30, §41; [`docs/04-frontend/journey-inventory.md`](../../04-frontend/journey-inventory.md)                                                                                                                                                 |
| Related Requirements | [`AIRE-REQ-021`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-047`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-074`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-083`](../../00-governance/requirements-traceability.md) |
| Last Updated         | 2 November 2026                                                                                                                                                                                                                                                                    |

---

## 1. Journey Classification & Scope Alignment

During the Stage 0 UI/UX audit, 12 granular journeys were catalogued. In accordance with the modular documentation architecture, these workflows have been consolidated into **8 authoritative end-to-end user journeys** that map directly to the approved functional domains and requirements.

### Classification Key

- **`CONFIRMED`**: Backed directly by approved functional requirements and core domain models. Implementation-ready.
- **`PROPOSED`**: Value-add flow requiring operational or product sign-off before implementation.
- **`OUT_OF_SCOPE`**: Excluded from the current modular monolith baseline (e.g. external SSO auto-provisioning).
- **`NEEDS_CLARIFICATION`**: Dependent on unresolved regulatory interpretations or external API availability.

---

## 2. Master Journey Catalog

| Journey ID | Journey Title                                       | Primary Persona                               | Scope / Tenant       | Classification | Implementation Status | Authoritative Specification File                                           |
| ---------- | --------------------------------------------------- | --------------------------------------------- | -------------------- | -------------- | --------------------- | -------------------------------------------------------------------------- |
| **J-01**   | Local Authentication & Workspace Session            | All Roles                                     | Global / Tenant      | `CONFIRMED`    | Planned (Phase 2)     | [`J-01-authentication.md`](./J-01-authentication.md)                       |
| **J-02**   | Admission Batch Ingestion & Quarantine Triage       | `INST_OPERATOR`                               | Institution Tenant   | `CONFIRMED`    | Planned (Phase 4/5)   | [`J-02-admission-upload.md`](./J-02-admission-upload.md)                   |
| **J-03**   | Cohort Legal Certification & Tamper Sealing         | `INST_ADMIN`                                  | Institution Tenant   | `CONFIRMED`    | Planned (Phase 4/5)   | [`J-03-seal-cohort.md`](./J-03-seal-cohort.md)                             |
| **J-04**   | AICTE Regional Scrutiny & Multi-Pass Reconciliation | `AICTE_REVIEWER`                              | Regional Scope       | `CONFIRMED`    | Planned (Phase 6/7)   | [`J-04-aicte-reconciliation.md`](./J-04-aicte-reconciliation.md)           |
| **J-05**   | Show Cause Notice Issuance & Dual-Auth Adjudication | `AICTE_REVIEWER`, `INST_ADMIN`, `AICTE_ADMIN` | Regional / Tenant    | `CONFIRMED`    | Planned (Phase 7/8)   | [`J-05-show-cause-review.md`](./J-05-show-cause-review.md)                 |
| **J-06**   | Student Entitlement View & AEP Download             | `STUDENT`                                     | Individual Record    | `CONFIRMED`    | Planned (Phase 8/9)   | [`J-06-student-verification.md`](./J-06-student-verification.md)           |
| **J-07**   | Public Cryptographic AEP Verification               | `VERIFIER`                                    | Public / Token Scope | `CONFIRMED`    | Planned (Phase 8/9)   | [`J-07-external-aep-verification.md`](./J-07-external-aep-verification.md) |
| **J-08**   | Auditor Inspection & Temporal Regulatory Replay     | `AUDITOR`                                     | Global / Read-Only   | `CONFIRMED`    | Planned (Phase 8/9)   | [`J-08-auditor-inspection.md`](./J-08-auditor-inspection.md)               |

---

## 3. Mapping from Stage 0 Audit Journeys

The initial Stage 0 diagnostic audit catalogued 12 journeys (`docs/04-frontend/journey-inventory.md`). The table below documents how those exploratory entries map into the authoritative J-01 through J-08 catalog:

| Audit ID | Audit Description                             | Consolidated Modular Journey            | Rationale & Architectural Notes                                                         |
| -------- | --------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------- |
| J-01     | Institution Operator: Authenticate & Access   | **J-01** (Authentication & Session)     | Expanded to cover all platform roles via Better Auth baseline.                          |
| J-02     | Institution Data Operator: Upload Batch       | **J-02** (Admission Ingestion & Triage) | Covers file dropzone, column mapping, asynchronous parsing, and row quarantine.         |
| J-03     | AICTE Reviewer: Review Exception              | **J-05** (Show Cause & Adjudication)    | Merged with institutional response and dual sign-off for complete lifecycle.            |
| J-04     | Institution Compliance: Respond to Exception  | **J-05** (Show Cause & Adjudication)    | Incorporated as the institutional response stage of Show Cause notices.                 |
| J-05     | AICTE Admin: Manage Institution Registry      | Operational Master Data                 | Managed via standard CRUD admin views in AICTE Workspace.                               |
| J-06     | AICTE Admin: Manage Approval Registry         | Operational Master Data                 | EOA/LOA ingestion and versioning handled under Approval Hub.                            |
| J-07     | AICTE Admin: Activate Regulatory Policy       | **J-08** / Policy Module                | Automated rule test fixtures and activation sign-off.                                   |
| J-08     | Institution Admin: Manage Users & Memberships | Operational Tenant Admin                | Internal team provisioning inside Institution Workspace (`/institution/users`).         |
| J-09     | Student: View Own Record                      | **J-06** (Student Verification & AEP)   | Retained as focused individual student entitlement verification flow.                   |
| J-10     | External Verifier: Verification Request       | **J-07** (External AEP Verification)    | Focused decoupled verification card using cryptographic token/QR code.                  |
| J-11     | Auditor: Access Audit Records                 | **J-08** (Auditor Inspection & Replay)  | Combines immutable audit querying with historical regulatory replay.                    |
| J-12     | Any User: Session Expiry & Re-auth            | **J-01** (Authentication & Session)     | Integrated as the session lifecycle, idle warning, and step-up re-auth section of J-01. |

---

## 4. Requirements Traceability Matrix

Every confirmed journey traces directly to functional and security requirements in `docs/00-governance/requirements-traceability.md`:

```
J-01  <--->  AIRE-REQ-096, AIRE-REQ-098, AIRE-REQ-120..126 (Auth & Sessions)
J-02  <--->  AIRE-REQ-021..024, AIRE-REQ-144..149 (Ingestion, Normalization & Quarantine)
J-03  <--->  AIRE-REQ-025..026, AIRE-REQ-150..152 (Submission Freeze & Tamper Sealing)
J-04  <--->  AIRE-REQ-033..040, AIRE-REQ-160..168 (Deterministic Quota Reconciliation)
J-05  <--->  AIRE-REQ-041..047, AIRE-REQ-178..184 (Show Cause & Dual Sign-off)
J-06  <--->  AIRE-REQ-048..051, AIRE-REQ-188..192 (AEP Issuance & Student Custody)
J-07  <--->  AIRE-REQ-052..053, AIRE-REQ-193..196 (Cryptographic Proof Verification)
J-08  <--->  AIRE-REQ-054..055, AIRE-REQ-114..119, AIRE-REQ-175..177 (Audit & Replay)
```
