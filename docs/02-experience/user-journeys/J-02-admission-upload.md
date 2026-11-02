# J-02 — Admission Batch Ingestion & Quarantine Triage

| Metadata            | Value                                                                                                                                                                                                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Journey ID          | `J-02`                                                                                                                                                                                                                                                                             |
| Journey Title       | Admission Batch Ingestion, Column Mapping & Row Quarantine Triage                                                                                                                                                                                                                  |
| Status              | `CONFIRMED`                                                                                                                                                                                                                                                                        |
| Primary Personas    | `INST_OPERATOR` (Primary), `INST_ADMIN` (Reviewer)                                                                                                                                                                                                                                 |
| Source Requirements | [`AIRE-REQ-021`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-024`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-144`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-149`](../../00-governance/requirements-traceability.md) |
| Related Screens     | [`S-10`](../screen-specifications/S-10-institution-dashboard.md), [`S-11`](../screen-specifications/S-11-upload-batch.md), [`S-12`](../screen-specifications/S-12-ingestion-progress.md)                                                                                           |
| Last Updated        | 2 November 2026                                                                                                                                                                                                                                                                    |

---

## 1. Goal & Context

The institution operator uploads an unformatted spreadsheet of student admissions (CSV or XLSX) for an academic intake cycle. AIRE parses the file, maps institutional column headers to canonical AIRE fields, executes asynchronous schema and business validation via BullMQ workers, separates cleanly valid rows into the staged ledger, and isolates defective or ambiguous rows into an interactive Quarantine Triage Workbench where errors can be remediated inline without invalidating the entire batch.

---

## 2. Preconditions

- User is authenticated with `INST_OPERATOR` or `INST_ADMIN` role bound to the target institution tenant.
- Institutional regulatory freeze deadline has not expired (status is `OPEN`).
- AICTE approval orders (EOA) for the active academic cycle are loaded in the registry.
- File is in `.csv` or `.xlsx` format, under 50 MB, and contains student admission records.

---

## 3. Entry Point

- Institution Dashboard (`/institution/dashboard`), clicking the primary call-to-action button: _"Upload New Batch"_.
- Direct navigation to `/institution/submissions/new` (`S-11`).

---

## 4. Main Success Path

```mermaid
sequenceDiagram
    autonumber
    actor Op as Inst Operator
    participant UI as React Client (S-11, S-12)
    participant API as Express API
    participant Q as Redis / BullMQ Ingestion Queue
    participant W as Worker (M06 Data Pipeline)
    participant DB as PostgreSQL (Prisma + RLS)

    Op->>UI: Drags & drops CSV/XLSX into S-11 upload target
    UI->>UI: Validates file type, size (<50MB), computes client checksum
    UI->>API: POST /api/v1/submission-batches (multipart/form-data)
    API->>DB: Creates submission_batches record (status: UPLOADED)
    API->>Q: Enqueues parse-and-validate job (batchId, tenantId)
    API-->>UI: Returns batchId; UI transitions to S-12 (Ingestion Progress)

    par Asynchronous Processing
        Q->>W: Consumes batch job
        W->>W: Parses rows, maps headers, validates Zod schemas
        W->>DB: Inserts valid records into admission_staged (status: ACCEPTED)
        W->>DB: Inserts defective records into submission_quarantine (status: QUARANTINED)
        W->>DB: Updates batch metrics (validCount, quarantineCount, status: VALIDATED)
    and Client Polling / Stream
        UI->>API: GET /api/v1/submission-batches/:batchId/progress
        API-->>UI: Returns progress percentage, valid count, quarantine count
    end

    UI->>Op: Displays validation complete banner: "850 Valid, 12 Quarantined"
    Op->>UI: Clicks "Triage Quarantined Rows"
    UI->>Op: Renders inline Quarantine Workbench with error badges
    Op->>UI: Corrects typo in roll number and missing category; clicks "Re-validate"
    UI->>API: PATCH /api/v1/submission-batches/:batchId/quarantine
    API-->>UI: Quarantined rows promoted to staged ledger; batch status: READY_FOR_SIGN_OFF
```

### Detailed Operational Steps

1. **File Selection & Dropzone (`S-11`):**
   - Operator selects Programme (e.g. _B.Tech Computer Science and Engineering_) and Academic Cycle (_2026-27_).
   - Operator drops the admission file into the upload zone.
   - Client validates mime-type (`text/csv`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`) and confirms file size is under 50 MB.
2. **Column Mapping Interface:**
   - Client inspects the top 5 rows and suggests auto-mapped canonical fields (Student Name, Roll Number, Date of Birth, Reservation Category, Quota Code, APAAR ID).
   - Operator reviews the mapping; unmapped columns can be manually mapped via accessible dropdown selectors.
   - Operator clicks _"Start Ingestion"_.
3. **Asynchronous Ingestion & Processing (`S-12`):**
   - System displays a calm, deterministic progress monitor:
     - Stage 1: File Checksum & Virus Scan (Completed).
     - Stage 2: Schema Validation (Progress Bar: 0% to 100%).
     - Stage 3: Duplicate & Quota Verification.
4. **Quarantine Triage Workbench (`S-12`):**
   - Batches with 100% valid records immediately transition to `VALIDATED`.
   - Batches with defective records present a split summary:
     - Green Badge: _"850 Records Staged Successfully"_.
     - Amber Badge: _"12 Records Quarantined (Remediation Required)"_.
   - The operator expands the Quarantine Table. Each defective row displays:
     - Row Number in original spreadsheet.
     - Field in Error (e.g. `category_code = "OBC-NCL-XYZ"`).
     - Reason: _"Unrecognized AICTE category code. Expected: GEN, OBC, SC, ST, EWS."_
5. **Inline Remediation:**
   - Operator double-clicks the error cell and selects the valid code from a constrained dropdown.
   - Clicks _"Save & Re-validate Rows"_.
   - Server re-evaluates only the edited quarantine records. Once clean, they are promoted into the staged cohort ledger.
6. **Completion:**
   - Status updates to `VALIDATED / READY_FOR_SIGN_OFF`. Operator notifies the `INST_ADMIN` to review and seal.

---

## 5. Alternate & Failure Paths

### 5.1 Duplicate Batch Detection

- If the operator uploads a file with an identical SHA-256 hash to a previously processed batch in the same academic cycle:
  - System pauses upload and alerts: _"Identical File Detected: This batch was uploaded on 14 Oct 2026 by Operator Sharma. Do you wish to view existing results or re-process?"_
  - Prevents accidental duplicate ingestion.

### 5.2 Malformed Header Schema

- If the uploaded file lacks mandatory identifier columns (e.g. no student name or roll number column):
  - Ingestion halts at Stage 1.
  - Error banner displays missing mandatory headers and provides a direct download link for the official AIRE Excel/CSV template.

### 5.3 Freeze Deadline Expiration Mid-Upload

- If the regulatory freeze cutoff passes (23:59:59 on freeze date) while an operator is uploading:
  - Ingestion job rejects with code `REGULATORY_FREEZE_ENFORCED`.
  - UI displays modal: _"Submission Window Closed. The annual admission reporting window closed at 23:59:59. Contact AICTE for late reopening directives."_

---

## 6. Context Preservation & UI State

- **File Upload Durability:** If network drops during upload, the browser utilizes chunked resumable upload where supported, or displays a clean restart trigger without reloading the entire page.
- **Quarantine Draft State:** Inline edits in the quarantine workbench are auto-saved to temporary draft storage every 30 seconds so operators do not lose manual corrections if interrupted.
