# S-10 — Institution Operations Dashboard

| Metadata             | Value                                                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Screen ID            | `S-10`                                                                                                                                     |
| Screen Name          | Institution Operations Dashboard                                                                                                           |
| Purpose              | Operational overview of admission reporting progress, countdown to regulatory freeze, batch ingestion health, and active Show Cause alerts |
| User Roles Allowed   | `INST_ADMIN`, `INST_OPERATOR`                                                                                                              |
| Related Journeys     | [`J-01`](../user-journeys/J-01-authentication.md), [`J-02`](../user-journeys/J-02-admission-upload.md)                                     |
| Primary Route        | `/institution/dashboard`                                                                                                                   |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                      |
| Source Reference     | PROJECT_PLAN.md §10.1, §32.1; [`docs/02-experience/information-architecture.md`](../information-architecture.md)                           |
| Related Requirements | [`AIRE-REQ-048`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-050`](../../00-governance/requirements-traceability.md)     |
| Last Updated         | 2 November 2026                                                                                                                            |

---

## 1. Information Hierarchy & Content Sections

1. **Regulatory Freeze Banner (Top Priority):**
   - High-contrast countdown widget displaying days, hours, minutes until the annual statutory cutoff (e.g. _"14 Days, 06 Hours Remaining until 2026-27 Freeze"_).
   - If within 48 hours: transitions to amber warning badge.
2. **Key Metric Summary Cards (4-Column Grid):**
   - **Total Sanctioned Intake:** Sum of approved seats across all programmes from AICTE EOA.
   - **Reported Admissions:** Count of uploaded students (Draft + Validated + Sealed).
   - **Sealed & Locked:** Count of legally attested student admissions.
   - **APAAR Verification Health:** Percentage of admitted students with verified academic identity.
3. **Active Regulatory Notices / Show Cause Alert (Conditional):**
   - If an open Show Cause Notice exists, renders an urgent red card:
     - Notice reference, affected branch, and countdown to mandatory response deadline.
     - Direct button: _"Open Show Cause Workbench"_.
4. **Recent Batches Table:**
   - Most recent 5 batch uploads with Batch ID, Programme, Upload Timestamp, Row Count, Status Badge (`PROCESSING`, `VALIDATED`, `SEALED`), and Quick Action links.
5. **Quick Action Buttons:**
   - _"Upload New Batch"_ (`bg-indigo-600 text-white`).
   - _"View Cohort Ledger"_.

---

## 2. Interaction & State Contracts

- **Loading State:** 4 rectangular skeleton blocks for summary metrics; 5 skeleton rows for recent batches table (zero layout shift).
- **Empty State (Initial Onboarding):**
  - Rendered when 0 batches have been uploaded for the academic cycle.
  - Displays calm institutional illustration, message: _"No admission batches reported for Academic Year 2026-27."_, and prominent action button: _"Upload Initial Admission Batch"_.
- **Error State:** If API call to `/api/v1/reports/institution/summary` fails: renders red banner with correlation ID and _"Retry Loading Dashboard"_ trigger.
- **Auto-Refresh:** Key metric cards poll every 60 seconds while user is active on the screen.
