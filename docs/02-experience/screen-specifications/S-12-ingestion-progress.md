# S-12 — Ingestion Status & Quarantine Triage

| Metadata             | Value                                                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Screen ID            | `S-12`                                                                                                                                     |
| Screen Name          | Ingestion Processing Monitor & Quarantine Triage Workbench                                                                                 |
| Purpose              | Real-time processing progress monitor for asynchronous batch ingestion, error metrics, and interactive triage workbench for defective rows |
| User Roles Allowed   | `INST_OPERATOR`, `INST_ADMIN`                                                                                                              |
| Related Journeys     | [`J-02`](../user-journeys/J-02-admission-upload.md)                                                                                        |
| Primary Route        | `/institution/submissions/:batchId`                                                                                                        |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                      |
| Source Reference     | PROJECT_PLAN.md §25; [`docs/06-data/data-quality-and-validation.md`](../../06-data/data-quality-and-validation.md)                         |
| Related Requirements | [`AIRE-REQ-022`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-024`](../../00-governance/requirements-traceability.md)   |
| Last Updated         | 2 November 2026                                                                                                                            |

---

## 1. Information Hierarchy & Content Sections

1. **Batch Ingestion Header:**
   - Breadcrumb: `Institution > Submissions > Batch #104`.
   - Batch Metadata: Programme, Filename, Upload Timestamp, Submitter Name.
2. **Real-Time Progress Monitor (Active during processing):**
   - 3-Stage Progress Stepper:
     - Stage 1: File Checksum & Structure Check (`COMPLETED`).
     - Stage 2: Schema & Type Validation (Animated progress bar, e.g. _"750 / 862 Rows Evaluated"_).
     - Stage 3: Duplicate & National Quota Cross-Check.
3. **Partitioned Ingestion Summary (Rendered post-validation):**
   - **Accepted Staged Rows:** Green card (e.g. `850 Records Staged Successfully`).
   - **Quarantined Rows:** Amber card (e.g. `12 Defective Rows Requiring Triage`).
4. **Quarantine Triage Data Grid:**
   - High-density table displaying exclusively defective rows.
   - Columns:
     - Original Row Number.
     - Candidate Name & Roll Number.
     - Flagged Attribute (e.g. `DOB = "31/02/2006"` or `Category = "XYZ"`).
     - Error Code & AICTE Validation Rule.
     - Inline Edit Field.
     - Row Action: _"Save & Re-test"_, _"Discard Row"_.
5. **Action Controls:**
   - Primary: _"Promote Cleaned Records to Staged Cohort"_.
   - Secondary: _"Download Defective Rows Report (.csv)"_.

---

## 2. Interaction & Editing Behavior

- **Inline Cell Editing:** Double-clicking an error cell opens a specialized accessible input (e.g. date picker for invalid DOB, allowlisted category dropdown for invalid category code).
- **Auto-Validation on Blur:** When the operator tabs out of an edited cell, the client evaluates the field against Zod schemas immediately and clears the red border if valid.
- **Bulk Action:** Checkbox to select multiple corrected rows and click _"Re-evaluate Selected"_.
- **Zero Ingestion Loss:** Staged clean rows are already safe in the database; fixing quarantine rows simply merges them into the batch without re-uploading the whole file.
