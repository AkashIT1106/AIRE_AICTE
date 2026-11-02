# J-03 — Cohort Legal Certification & Tamper Sealing

| Metadata            | Value                                                                                                                                                                                                                                                                            |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Journey ID          | `J-03`                                                                                                                                                                                                                                                                           |
| Journey Title       | Cohort Legal Certification, Attestation & Cryptographic Tamper Sealing                                                                                                                                                                                                           |
| Status              | `CONFIRMED`                                                                                                                                                                                                                                                                      |
| Primary Personas    | `INST_ADMIN` (Principal / Head of Institution)                                                                                                                                                                                                                                   |
| Source Requirements | [`AIRE-REQ-025`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-026`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-150`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-152`](../../00-governance/requirements-traceability.md) |
| Related Screens     | [`S-13`](../screen-specifications/S-13-submission-history.md), [`S-14`](../screen-specifications/S-14-cohort-ledger.md), [`S-02`](../screen-specifications/S-02-reauthentication.md)                                                                                             |
| Last Updated        | 2 November 2026                                                                                                                                                                                                                                                                  |

---

## 1. Goal & Context

The institution head or authorized administrator (`INST_ADMIN`) reviews staged, validated admission cohorts across all academic programmes. The administrator evaluates quota adherence, examines identity verification rates, legally certifies under penalty of regulatory action that reported admissions comply with AICTE Approval Orders, and executes the irreversible Sealing transaction. AIRE generates a cryptographic SHA-256 Merkle root hash of all admitted student records, permanently locks the batch against edits, dispatches the cohort into the deterministic Reconciliation Engine, and issues a tamper-evident digital receipt.

---

## 2. Preconditions

- User is authenticated with `INST_ADMIN` role.
- All admission batches for the programme are in `VALIDATED` status with zero unresolved quarantined rows.
- Annual regulatory freeze cutoff has not passed.
- If session age exceeds 15 minutes, step-up re-authentication credential is required.

---

## 3. Entry Point

- Cohort Ledger (`/institution/ledger`), clicking _"Review & Seal Cohort"_.
- Submissions List (`/institution/submissions`), clicking _"Execute Cohort Sign-Off"_.

---

## 4. Main Success Path

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Inst Administrator
    participant UI as React Client (S-13, S-14)
    participant API as Express API
    participant Engine as Reconciliation Engine (M09/M10)
    participant DB as PostgreSQL (Prisma + RLS)

    Admin->>UI: Reviews Cohort Ledger (S-14); clicks "Review & Seal Cohort"
    UI->>UI: Validates that 100% of rows are VALIDATED and zero quarantine items exist
    UI->>Admin: Displays High-Impact Irreversible Confirmation Modal
    Note over Admin,UI: Displays Total Students (e.g. 862), Verified APAAR (94.2%),<br/>Approved Intake vs Admitted Breakdown
    Admin->>UI: Checks mandatory attestation checkbox
    Admin->>UI: Enters admin password (Step-up re-auth if session >15 min)
    Admin->>UI: Clicks "Seal Cohort & Lock Admissions"

    UI->>API: POST /api/v1/submission-batches/:batchId/seal
    API->>API: Verifies INST_ADMIN permission and re-auth password
    API->>DB: Transitions batch status: VALIDATED -> SEALED
    API->>DB: Computes canonical SHA-256 Merkle root hash across all records
    API->>DB: Writes immutable audit_event (ACTION_COHORT_SEALED)
    API->>Engine: Dispatches cohort to Reconciliation Engine (M10)
    Engine->>DB: Executes deterministic multi-pass rules & generates initial findings
    API-->>UI: Returns 200 OK + Cryptographic Seal Receipt (Merkle Hash, Timestamp)

    UI->>Admin: Renders Seal Confirmation View with Downloadable AICTE Receipt
    UI->>UI: Locks UI editing controls; batch transitions to permanent read-only
```

### Detailed Operational Steps

1. **Pre-Sealing Review (`S-14`):**
   - The administrator inspects the Cohort Summary:
     - Approved Intake (EOA): 840 seats.
     - Supernumerary / TFW approved: 42 seats.
     - Total Admitted & Validated: 862 students.
     - APAAR Identity Verification Rate: 812 Verified (94.2%), 50 Pending/Unverified.
2. **Triggering Confirmation Modal:**
   - Administrator clicks _"Seal Cohort & Lock Admissions"_.
   - The double-confirmation modal opens with background scroll lock:
     - **Prominent Warning Banner:** _"IRREVERSIBLE ACTION: Once sealed, admission records are cryptographically locked. No student can be added, modified, or removed past this point without formal AICTE reopening proceedings."_
     - **Breakdown Summary:** Programme, total headcount, category sub-quotas.
     - **Mandatory Legal Attestation:**
       - Checkbox: _"I, [Administrator Name], Principal/Head of Institution, hereby certify under penalty of regulatory derecognition and statutory sanction under the AICTE Act that the 862 student records submitted herein represent genuine, enrolled students admitted strictly against approved intake quotas and reservation norms."_
     - **Step-Up Password Field:** Required for administrative non-repudiation.
3. **Execution & Cryptographic Generation:**
   - Administrator submits the modal.
   - Client sends the request to `POST /api/v1/submission-batches/:batchId/seal`.
   - The server executes an atomic database transaction:
     - Verifies user hold active `INST_ADMIN` role and matches institution tenant ID.
     - Generates canonical sorted concatenation of all student records and hashes them into a Merkle root SHA-256 string (e.g. `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`).
     - Stores the Merkle root and server timestamp in `submission_batches`.
     - Transitions batch state from `VALIDATED` to `SEALED`.
     - Appends an audit event to `audit_events` with actor details, client IP hash, and batch hash.
4. **Post-Sealing Experience:**
   - Modal dismisses and is replaced by a green institutional success banner: _"Cohort Successfully Sealed & Locked"_.
   - The screen renders the official **AICTE Submission Cryptographic Receipt**:
     - Receipt ID: `REC-2026-BTECH-CSE-104`.
     - Merkle Root Digest.
     - Server Timestamp (IST).
     - Action button: _"Download Tamper-Evident PDF Receipt"_.
   - All editing buttons in the Cohort Ledger are replaced with permanent `LOCKED` badges.

---

## 5. Alternate & Failure Paths

| Failure Scenario                  | UI Presentation                                                                                                                                                              | Recovery Behavior                                                                          |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Pending Quarantine Rows Exist** | Error modal: _"Cannot Seal Cohort: 4 records remain in quarantine triage. All defective rows must be remediated or excluded before sealing."_                                | Sealing button remains disabled; user is redirected to S-12 Quarantine Workbench.          |
| **Step-Up Password Incorrect**    | Inline error in modal: _"Authentication failed. Incorrect administrator password."_                                                                                          | Modal remains open; form state and attestation checkbox preserved. Password field cleared. |
| **Simultaneous Cutoff Enforced**  | Critical alert: _"Regulatory Freeze Enforced: The submission deadline has passed while processing this request. The cohort has been automatically marked as SYSTEM_LOCKED."_ | Transaction rolls back cleanly; cohort transitions to read-only `LOCKED`.                  |

---

## 6. Security & Audit Non-Negotiables

- **Separation of Duties (SoD):** Only users with `INST_ADMIN` can seal cohorts; `INST_OPERATOR` accounts attempting this route receive a strict `403 FORBIDDEN` response.
- **Immutability Guarantee:** After sealing, any direct SQL `UPDATE` attempt on student admission tables is blocked by database triggers and forced RLS policies.
