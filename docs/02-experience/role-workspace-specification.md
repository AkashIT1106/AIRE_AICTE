# Role-Specific Workspace Specification

| Metadata             | Value                                                                                                                                                                                                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/02-experience/role-workspace-specification.md`                                                                                                                                                                                                                   |
| Authoritative For    | User Personas, Role-to-Workspace Binding, Landing Experiences, Action Boundaries, Separation of Duties (SoD)                                                                                                                                                           |
| Status               | `CONFIRMED`                                                                                                                                                                                                                                                            |
| Source               | PROJECT_PLAN.md §5, §10.1; [`docs/01-product/stakeholders-and-user-roles.md`](../01-product/stakeholders-and-user-roles.md); [`docs/05-security-privacy/authorization-and-tenant-isolation.md`](../05-security-privacy/authorization-and-tenant-isolation.md)          |
| Related Requirements | [`AIRE-REQ-074`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-077`](../00-governance/requirements-traceability.md), [`AIRE-REQ-099`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-105`](../00-governance/requirements-traceability.md) |
| Last Updated         | 2 November 2026                                                                                                                                                                                                                                                        |

---

## 1. Role-to-Workspace Matrix Overview

AIRE enforces strict, non-negotiable boundaries across five distinct workspace environments. The interface directly mirrors the user's validated server-side identity, active memberships, and PostgreSQL Row-Level Security (RLS) context.

| Role Identifier  | Role Title                                      | Assigned Workspace                     | Organization Scope   | Primary Interaction Paradigm                                                       |
| ---------------- | ----------------------------------------------- | -------------------------------------- | -------------------- | ---------------------------------------------------------------------------------- |
| `AICTE_ADMIN`    | AICTE Super Administrator                       | AICTE Workspace (`/aicte`)             | Global               | National oversight, policy governance, dual-authorization sign-off                 |
| `AICTE_REVIEWER` | AICTE Regional Reviewer                         | AICTE Workspace (`/aicte`)             | Regional / State     | Scrutiny workbench, discrepancy inspection, Show Cause notice issuance             |
| `INST_ADMIN`     | Institution Administrator / Head of Institution | Institution Workspace (`/institution`) | Institution Tenant   | Submission sign-off, legal freeze attestation, exception response, user management |
| `INST_OPERATOR`  | Institution Data Operator / Registrar           | Institution Workspace (`/institution`) | Institution / Campus | Batch data upload, column mapping, ingestion quarantine remediation                |
| `STUDENT`        | Enrolled Technical Student                      | Student Portal (`/student`)            | Individual Record    | Admission entitlement card, AEP credential view, demographic correction            |
| `VERIFIER`       | External Verifier (Employer / University)       | Verifier Terminal (`/verify`)          | Public / Token Scope | Cryptographic verification card, QR scanner, zero PII exposure                     |
| `AUDITOR`        | Regulatory Auditor (CAG / Ministry)             | Auditor Workbench (`/auditor`)         | Global / Read-Only   | Immutable audit log explorer, temporal regulatory replay simulation                |

---

## 2. Institutional Personas

### 2.1 `INST_OPERATOR` (Institution Data Operator / Registrar)

#### Responsibilities

Operational entry and cleaning of admission data. Prepares admission batches, maps institution-specific CSV/XLSX schemas into AIRE's canonical structure, resolves ingestion quarantine rows, and stages cohorts for administrative sign-off before regulatory freeze deadlines.

#### Primary Tasks

- Upload raw admission spreadsheets (CSV / XLSX).
- Map uploaded columns to AIRE canonical student fields.
- Review asynchronous batch validation results and triage quarantined rows.
- Correct syntax, missing mandatory values, or invalid roll numbers in the quarantine editor.
- Stage validated batches for `INST_ADMIN` review.

#### Landing Experience (`/institution/dashboard`)

- **What they see first:**
  - Annual regulatory submission freeze countdown banner.
  - Quick action card: _"Upload New Batch"_.
  - Active batch ingestion status card (Parsing, Validating, Quarantined rows count).
  - Program-wise admission count table (Draft vs. Validated).
- **Primary Action:** _"Upload Batch"_ (initiates S-11).

#### Action Boundaries & Step-Up Re-Authentication

- **Permitted Self-Service Actions:** File upload, column mapping, inline quarantine editing, draft cohort preview.
- **Actions Requiring Higher Authority (`INST_ADMIN`):** Sealing batches, final cohort certification, responding to AICTE Show Cause notices, inviting other operators.
- **Step-Up Authentication:** Not required for routine file uploads. Required if modifying quarantined records older than 24 hours.

#### Exclusions & Privacy Masking (What They Must NOT See)

- **Zero Access to:** Other institutions' data (strictly blocked via PostgreSQL RLS `tenant_id = app.current_tenant_id`).
- **Data Masking:** Raw Aadhaar numbers are never displayed (Identity Vault isolation). Raw national identity numbers remain encrypted. Contact details masked except when actively fixing quarantined records.
- **Workflow Restriction:** Cannot seal submissions or declare regulatory compliance.

---

### 2.2 `INST_ADMIN` (Institution Administrator / Principal)

#### Responsibilities

Institutional accountability and regulatory compliance. Governs institution membership, verifies operator batches against approved intake orders, legally attests and seals admission cohorts, and formulates formal responses to AICTE Show Cause notices.

#### Primary Tasks

- Review staged admission batches and compare against official AICTE Extension of Approval (EOA).
- Legally certify and seal cohorts before the annual deadline (SHA-256 Merkle root generation).
- Manage institutional operator invitations, role assignments, and session revocations.
- Review AICTE discrepancy findings and submit counter-evidence in the Show Cause drawer.

#### Landing Experience (`/institution/dashboard`)

- **What they see first:**
  - High-urgency alert banner for any active AICTE Show Cause Notices with remaining response days.
  - Overall Institutional Compliance Card: Approved Intake vs. Sealed Admissions vs. Surplus/Deficit.
  - Cohort Sealing Readiness Card: Unsealed validated batches awaiting signature.
  - Operator activity feed: Recent batch uploads and quarantine triage.
- **Primary Action:** _"Review & Seal Cohort"_ (triggers S-13/S-14 freeze workflow).

#### Action Boundaries & Step-Up Re-Authentication

- **Irreversible Actions Requiring Double-Confirmation:**
  - **Cohort Sealing:** Modal presenting total students, verified APAAR percentage, legal warning, mandatory attestation checkbox, and step-up password entry if session is older than 15 minutes.
  - **Show Cause Evidence Submission:** Formal submission of affidavits and documentation to AICTE.
- **User Management:** Can invite, deactivate, or revoke sessions of `INST_OPERATOR` accounts within their tenant.

#### Exclusions & Privacy Masking

- **Zero Access to:** Other institutions' records or AICTE internal scrutiny notes.
- **Separation of Duties:** Cannot adjudicate their own institution's exceptions or mark Show Cause notices as resolved.

---

## 3. Regulatory Personas (AICTE)

### 3.1 `AICTE_REVIEWER` (Regional Reviewer / Scrutiny Officer)

#### Responsibilities

Regional compliance inspection. Scrutinizes enrolled cohorts against approved institutional intakes, analyzes automated multi-pass reconciliation findings, issues formal Show Cause notices, examines uploaded institutional evidence, and recommends disposition.

#### Primary Tasks

- Filter regional institutions by discrepancy severity, programme category, or quota type.
- Inspect student-level reconciliation findings (over-intake, category violations, ghost seats).
- Dispatch formal Show Cause notices with response windows (7, 14, 21 days).
- Evaluate institutional counter-evidence (seat cancellation receipts, affidavits).
- Record reasoned inquiry notes and propose exception resolution.

#### Landing Experience (`/aicte/overview` & `/aicte/scrutiny`)

- **What they see first:**
  - Regional jurisdiction discrepancy triage queue (Institutions with Over-Admissions, Category Breaches).
  - Open Show Cause hearing countdown tracker (Awaiting Response vs. Evidence Submitted).
  - Aggregate regional intake vs. reported admissions ratio.
- **Primary Action:** _"Open Regional Scrutiny Queue"_ (navigates to S-21).

#### Action Boundaries & Step-Up Re-Authentication

- **Permitted Actions:** Querying regional institutions, viewing reconciliation traces, drafting/issuing Show Cause notices, requesting additional evidence.
- **Separation of Duties & Dual-Authorization:**
  - An `AICTE_REVIEWER` **cannot unilaterally close an exception with penalties or derecognition**.
  - Must enter proposed findings and submit to an `AICTE_ADMIN` for digital co-signature via the Dual-Authorization Sign-Off modal.
- **Step-Up Authentication:** Required before issuing Show Cause notices if session > 15 minutes old.

#### Exclusions & Privacy Masking

- **Zero Access to:** Institutions outside their authorized regional jurisdiction (enforced by RLS regional scope checks).
- **Field-Level Masking:** Cannot view raw student phone numbers, email addresses, or unmasked national identity numbers unless specifically authorized under a formal audit purpose token (`PURPOSE_EXCEPTION_INVESTIGATION`).

---

### 3.2 `AICTE_ADMIN` (AICTE Super Administrator / Director)

#### Responsibilities

Platform governance, regulatory policy activation, and final executive adjudication. Governs platform-wide institutional masters, imports authoritative EOA/LOA approval registries, activates temporal policy packs, and co-signs high-impact exception closures.

#### Primary Tasks

- Import and publish authoritative AICTE Extension of Approval (EOA) and LOA data.
- Review and activate versioned Regulatory Policy Packs following test fixture verification.
- Review regional reviewer exception recommendations and execute dual-authorization sign-off.
- Authorize platform-wide compliance reports and statutory exports.
- Oversee system security logs, tenant boundaries, and regional administrator assignments.

#### Landing Experience (`/aicte/overview`)

- **What they see first:**
  - National Compliance Matrix: State-wise, discipline-wise intake vs. admission variance.
  - Dual-Authorization Approval Queue: Pending exception closures requiring executive co-signature.
  - Policy Pack Lifecycle Widget: Current active academic handbook version and pending draft activations.
  - System Ingestion Health: Active BullMQ workers, provider adapter latency.
- **Primary Action:** _"Review Pending Executive Co-Signatures"_.

#### Action Boundaries & Step-Up Re-Authentication

- **High-Impact Regulatory Actions:**
  - **Policy Pack Activation:** Requires automated fixture validation passage (100% clean test suite) and password re-authentication.
  - **Exception Co-Sign:** Executes penalty seat reductions or refers cases to the National Council.

#### Exclusions & Separation of Duties

- **Separation of Duties:** Cannot author a policy pack and independently activate it without a verified test run and recorded reviewer attribution.
- **Audit Tamper Resistance:** Cannot modify, truncate, or delete append-only audit event logs (`audit_events`).

---

## 4. Student, Verifier & Auditor Personas

### 4.1 `STUDENT` (Enrolled Student)

#### Responsibilities

Individual verification and credential custody. Reviews personal technical education admission status, verifies that their admission is backed by an approved AICTE seat quota, downloads their Admission Entitlement Proof (AEP), and reports discrepancies to their college.

#### Primary Tasks

- Access personal admission verification record.
- Verify that their APAAR ID is correctly mapped and authenticated.
- View and download cryptographic AEP certificate card with SVG QR code.
- Submit a structured correction request for demographic misspellings.

#### Landing Experience (`/student/record`)

- **What they see first:**
  - Verified Admission Status Badge (Green "Reconciled & Entitled" / Amber "Pending Institution Seal" / Red "Under Regulatory Review").
  - Admitted College, Programme, Branch, and Academic Year.
  - AICTE Approval Order Reference Number.
  - Direct download button for Admission Entitlement Proof (AEP).

#### Action Boundaries & Privacy Masking

- **Strict Scope Limit:** Accessible data is hard-scoped to `student_id = auth.user_id`. Absolutely zero visibility into peer student records or institutional totals.
- **Masking:** Only the student's own verified demographic details are shown. Sensitive backend hashes are represented via verifiable QR codes.

---

### 4.2 `VERIFIER` (External Verifier / Employer / Higher Ed)

#### Responsibilities

Public or credentialed third-party authentication of student educational claims. Scans physical or digital QR codes on student certificates and validates the digital signature without acquiring student personal contact data.

#### Primary Tasks

- Scan dynamic AEP QR code or input verification token string.
- Review instant cryptographic authenticity validation.
- Confirm institution affiliation, programme accreditation, and approved seat entitlement status.

#### Landing Experience (`/verify/:token`)

- **What they see first:**
  - Minimalist, high-contrast, clean verification terminal.
  - Large status indicator:
    - **AUTHENTIC & ENTITLED:** Sourced from valid AICTE Approval Order and sealed batch.
    - **INVALID / REVOKED:** Cryptographic signature mismatch or superseded record.
  - Core Academic Record: Institution Name, Programme, Conferred Year, Entitlement Hash.
- **Zero PII Exposure:** Personal contact numbers, Aadhaar/APAAR raw numbers, and reservation categories are completely omitted from public verification views.

---

### 4.3 `AUDITOR` (Regulatory & Statutory Auditor)

#### Responsibilities

Independent non-operational oversight. Inspects immutable chronological audit logs, verifies that tenant isolation and separation-of-duties rules were maintained, examines historical exception hearings, and runs temporal regulatory replays.

#### Primary Tasks

- Query append-only audit logs across institutions, actors, and correlation IDs.
- Inspect JSON state diffs for high-impact actions (cohort seals, Show Cause notices, policy activations).
- Execute historical regulatory replay simulations against prior cohorts.
- Verify cryptographic tamper-evidence proofs and Merkle batch roots.

#### Landing Experience (`/auditor/logs`)

- **What they see first:**
  - System Security & Audit Overview: Total recorded events, failed authorization attempts counter, active legal holds.
  - Comprehensive Audit Log Explorer with multi-attribute filtering.
- **Operational Boundaries:** 100% read-only access. Zero mutation, approval, or submission actions.
