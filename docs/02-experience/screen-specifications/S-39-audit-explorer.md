# S-39 — Immutable Audit Log Explorer

| Metadata             | Value                                                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Screen ID            | `S-39`                                                                                                                                    |
| Screen Name          | Immutable Audit Trail & Administrative Activity Explorer                                                                                  |
| Purpose              | High-density query explorer for statutory auditors to inspect chronological, append-only system mutations and JSON diffs of state changes |
| User Roles Allowed   | `AUDITOR`, `AICTE_ADMIN`                                                                                                                  |
| Related Journeys     | [`J-08`](../user-journeys/J-08-auditor-inspection.md)                                                                                     |
| Primary Route        | `/auditor/logs`                                                                                                                           |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                     |
| Source Reference     | PROJECT_PLAN.md §19, §32.4; ADR-009; [`docs/05-security-privacy/audit-logging.md`](../../05-security-privacy/audit-logging.md)            |
| Related Requirements | [`AIRE-REQ-054`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-114`](../../00-governance/requirements-traceability.md)    |
| Last Updated         | 2 November 2026                                                                                                                           |

---

## 1. Information Hierarchy & Content Sections

1. **Header Context:** Breadcrumb: `Auditor Workbench > Audit Log Explorer`.
2. **Audit Filter & Search Bar:**
   - Correlation ID Search (traces an end-to-end distributed transaction).
   - Actor Search (Filter by user ID, email, or role).
   - Target Institution ID Filter.
   - Action Code Dropdown:
     - `USER_AUTHENTICATED`, `AUTH_STEPUP_EXECUTED`.
     - `SUBMISSION_BATCH_INGESTED`, `COHORT_SEALED`.
     - `SHOW_CAUSE_NOTICE_ISSUED`, `EVIDENCE_ATTACHED`.
     - `EXCEPTION_RESOLVED_COMPLIANT`, `EXCEPTION_RESOLVED_PENALTY`.
     - `POLICY_PACK_ACTIVATED`.
   - Date Range Filter (IST).
3. **High-Density Audit Explorer Table:**
   - Compact 36px data grid with server-side pagination.
   - Columns:
     - **Timestamp:** ISO 8601 string / IST time with milliseconds.
     - **Correlation ID:** Monospace identifier (e.g. `cor-882f-1049`).
     - **Action Code:** Color-coded action pill.
     - **Actor ID & Role:** User identity code.
     - **Target Tenant:** Institution Permanent Institute ID.
     - **Outcome:** `SUCCESS` (Green) or `DENIED` (Red).
     - **Action:** _"Inspect State Diff"_.
4. **Expandable JSON Diff Inspector (Child Accordion):**
   - Renders formatted, side-by-side colorized diff comparing `before_state` vs. `after_state` payloads.
   - Proves non-repudiation and demonstrates exact field alterations.
