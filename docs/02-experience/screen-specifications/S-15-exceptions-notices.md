# S-15 — Institution Exceptions & Show Cause Notices

| Metadata             | Value                                                                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Screen ID            | `S-15`                                                                                                                                   |
| Screen Name          | Institutional Compliance Workbench & Active Show Cause Notices                                                                           |
| Purpose              | Display active regulatory exceptions, AICTE Show Cause notices, statutory deadlines, and launch evidence response drawers                |
| User Roles Allowed   | `INST_ADMIN`, `INST_OPERATOR` (Read-only for operator; respond permitted for Admin)                                                      |
| Related Journeys     | [`J-05`](../user-journeys/J-05-show-cause-review.md)                                                                                     |
| Primary Route        | `/institution/exceptions`                                                                                                                |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                    |
| Source Reference     | PROJECT_PLAN.md §30; [`docs/04-domain/workflows/exception-review-workflow.md`](../../04-domain/workflows/exception-review-workflow.md)   |
| Related Requirements | [`AIRE-REQ-041`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-044`](../../00-governance/requirements-traceability.md) |
| Last Updated         | 2 November 2026                                                                                                                          |

---

## 1. Information Hierarchy & Content Sections

1. **Urgent Legal Notice Banner:**
   - Highlights any open Show Cause notice requiring formal response within active statutory window.
   - Live countdown timer: _"Response Deadline: 9 Days, 14 Hours Remaining (Cutoff: 15 Nov 2026, 23:59 IST)"_.
2. **Exceptions Master List:**
   - High-density table listing all current and historical regulatory exceptions:
     - **Notice ID:** E.g. `SC-2026-88`.
     - **Discrepancy Category:** `OVER_ADMISSION_SANCTIONED_CAP`, `CATEGORY_QUOTA_BREACH`, `CONCURRENT_ENROLMENT`.
     - **Programme:** E.g. _B.Tech Mechanical Engineering_.
     - **AICTE Clause Citation:** E.g. _AICTE APH 2026-27 Clause 4.2.1_.
     - **Current Status Badge:**
       - `SHOW_CAUSE_ISSUED` (Amber alert).
       - `EVIDENCE_SUBMITTED` (Blue, awaiting AICTE review).
       - `UNDER_REVIEW` (Purple, reviewer evaluating).
       - `RESOLVED_COMPLIANT` (Green checkmark).
       - `RESOLVED_PENALTY` (Red, seat reduction applied).
     - **Statutory Deadline:** Exact cutoff timestamp.
     - **Actions:**
       - For `INST_ADMIN`: _"Respond & Attach Evidence"_ (opens S-16 Drawer).
       - For `INST_OPERATOR`: _"View Notice Details"_ (read-only view).

---

## 2. Security & Separation of Duties (SoD)

- `INST_OPERATOR` accounts can inspect the notice details but the _"Respond & Attach Evidence"_ button is permanently disabled with tooltip: _"Action restricted: Only the Head of Institution (INST_ADMIN) can submit legally binding responses to AICTE notices."_
