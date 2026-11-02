# S-24 — Show Cause Dispatcher & Hearing Queue

| Metadata             | Value                                                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Screen ID            | `S-24`                                                                                                                                    |
| Screen Name          | Show Cause Notice Dispatcher & Statutory Hearing Queue                                                                                    |
| Purpose              | Manage, configure, and dispatch formal Show Cause notices to non-compliant institutions; track statutory countdowns and hearing schedules |
| User Roles Allowed   | `AICTE_REVIEWER`, `AICTE_ADMIN`                                                                                                           |
| Related Journeys     | [`J-05`](../user-journeys/J-05-show-cause-review.md)                                                                                      |
| Primary Route        | `/aicte/exceptions`                                                                                                                       |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                     |
| Source Reference     | PROJECT_PLAN.md §30; [`docs/04-domain/workflows/exception-review-workflow.md`](../../04-domain/workflows/exception-review-workflow.md)    |
| Related Requirements | [`AIRE-REQ-041`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-043`](../../00-governance/requirements-traceability.md)  |
| Last Updated         | 2 November 2026                                                                                                                           |

---

## 1. Information Hierarchy & Content Sections

1. **Header Context:** Breadcrumb: `AICTE > Show Cause Dispatcher`.
2. **Hearing & Countdown Status Cards:**
   - **Active Notices Issued:** Total institutions currently within open response windows.
   - **Awaiting Regional Review:** Responses received with uploaded evidence awaiting scrutiny.
   - **Defaulted / Overdue:** Institutions that failed to respond within statutory cutoff.
3. **Show Cause Management Table:**
   - Columns:
     - Notice Serial & Year (e.g. `SC-2026-WEST-088`).
     - Target Institution Name & ID.
     - Violated Regulation (e.g. _AICTE APH 2026-27 Sanctioned Intake Ceiling_).
     - Calculated Excess Seats / Breach Magnitude.
     - Notice Issue Timestamp.
     - Days Remaining in Window (Real-time live counter).
     - Current Hearing Status (`ISSUED`, `RESPONSE_RECEIVED`, `UNDER_REVIEW`, `ESCALATED_TO_SHC`).
     - Actions: _"Open Investigation Workbench"_ (routes to S-25), _"Extend Window (Requires Admin Auth)"_.
4. **Primary Action:** _"Dispatch Show Cause Notice"_ (opens configuration modal).

---

## 2. Dispatch Configuration Modal

- Reviewer selects target institution and specific reconciliation finding.
- System auto-generates legal text with exact rule citations.
- Reviewer sets mandatory response deadline: `7 Days`, `14 Days` (standard baseline), or `21 Days`.
- Submitting writes an immutable audit record and updates notice state to `SHOW_CAUSE_ISSUED`.
