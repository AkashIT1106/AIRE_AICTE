# S-11 — Admission Batch Upload & Mapping

| Metadata             | Value                                                                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Screen ID            | `S-11`                                                                                                                                              |
| Screen Name          | Admission Batch Upload & Column Mapping Interface                                                                                                   |
| Purpose              | Secure ingestion point for institutional CSV/XLSX spreadsheets, header schema validation, and interactive column mapping interface                  |
| User Roles Allowed   | `INST_OPERATOR`, `INST_ADMIN`                                                                                                                       |
| Related Journeys     | [`J-02`](../user-journeys/J-02-admission-upload.md)                                                                                                 |
| Primary Route        | `/institution/submissions/new`                                                                                                                      |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                               |
| Source Reference     | PROJECT_PLAN.md §24, §25; [`docs/04-domain/workflows/admission-submission-workflow.md`](../../04-domain/workflows/admission-submission-workflow.md) |
| Related Requirements | [`AIRE-REQ-021`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-023`](../../00-governance/requirements-traceability.md)            |
| Last Updated         | 2 November 2026                                                                                                                                     |

---

## 1. Information Hierarchy & Content Sections

1. **Header Context:** Breadcrumb: `Institution > Submissions > New Batch`.
2. **Context Selectors:**
   - Academic Cycle Dropdown (e.g. `2026-27`).
   - Programme & Discipline Selector: Populated strictly from approved EOA registry (e.g. `B.Tech - Computer Science & Engineering [60 Seats]`).
3. **Spreadsheet Dropzone:**
   - Large drag-and-drop target accepting `.csv` or `.xlsx` files up to 50 MB.
   - Secondary button: _"Browse Files from Computer"_.
   - Information text: _"Accepted columns: Roll No, Candidate Name, DOB, Category, Quota, APAAR ID."_
   - Download link: _"Download Official AIRE Admission Template (.xlsx / .csv)"_.
4. **Column Mapping Interface (Renders after file selection):**
   - Displays top 5 sample rows extracted in-browser.
   - Left Column: AIRE Canonical Field Name (with required badges).
   - Right Column: Detected Header in Uploaded File (Auto-mapped or manual dropdown selection).
5. **Action Bar:**
   - Primary: _"Start Ingestion & Validation"_ (Disabled until all mandatory columns mapped).
   - Secondary: _"Cancel"_.

---

## 2. Interaction & Error Handling

- **File Type Rejection:** If non-spreadsheet dropped (e.g. `.pdf`, `.exe`): immediate rejection with accessible banner: _"Invalid file type. Please upload a valid CSV or Excel spreadsheet."_
- **Size Limit Rejection:** Files $> 50\text{ MB}$ rejected client-side before network dispatch.
- **Unmapped Required Column:** Auto-detects matches (e.g. `Student Name` $\rightarrow$ `candidate_name`). If an essential field (e.g. `roll_number`) has no match, the cell is highlighted in amber with a prompt: _"Please map this mandatory field."_
- **Execution Transition:** Clicking submit dispatches `POST /api/v1/submission-batches` with chunked upload, receives `batchId`, and routes directly to `S-12`.
