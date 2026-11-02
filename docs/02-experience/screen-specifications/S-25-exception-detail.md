# S-25 — Exception Adjudication & Dual Sign-Off

| Metadata             | Value                                                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Screen ID            | `S-25`                                                                                                                                     |
| Screen Name          | Exception Adjudication & Dual-Authorization Sign-Off Workbench                                                                             |
| Purpose              | Comprehensive investigation workbench for evaluating institution evidence against findings, formulating recommendations, and dual sign-off |
| User Roles Allowed   | `AICTE_REVIEWER` (Inquiry & Recommendation), `AICTE_ADMIN` (Executive Co-Signature & Resolution)                                           |
| Related Journeys     | [`J-05`](../user-journeys/J-05-show-cause-review.md)                                                                                       |
| Primary Route        | `/aicte/exceptions/:id`                                                                                                                    |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                      |
| Source Reference     | PROJECT_PLAN.md §30; [`docs/04-domain/workflows/exception-review-workflow.md`](../../04-domain/workflows/exception-review-workflow.md)     |
| Related Requirements | [`AIRE-REQ-044`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-047`](../../00-governance/requirements-traceability.md)   |
| Last Updated         | 2 November 2026                                                                                                                            |

---

## 1. Information Hierarchy & Content Sections

1. **Case Header Bar:**
   - Notice Serial: `SC-2026-WEST-088`.
   - Target College: _Government College of Engineering, Karad (1-1029384)_.
   - Programme: _B.Tech Mechanical Engineering_.
   - Regulatory Finding: Over-admission of 4 candidates against approved cap of 60 seats.
2. **Side-by-Side Investigative Layout:**
   - **Left Panel (Automated Reconciliation Evidence):**
     - Mathematical Rule Trace: Cited Approval Process Handbook clause, approved intake formulas.
     - Chronological admission list identifying the 4 latest-admitted student records.
   - **Right Panel (Institutional Response & Counter-Evidence):**
     - Formal statement submitted by college principal.
     - Embedded Document Viewer: Displays uploaded cancellation slips and fee refund receipts via secure authenticated stream.
3. **Inquiry Notes & Findings Log:**
   - Chronological, append-only log of reviewer notes, hearing transcripts, and state changes.
4. **Adjudication & Dual Sign-Off Console:**
   - **Reviewer Section (`AICTE_REVIEWER`):**
     - Textarea: _"Inquiry Findings & Reasoning"_.
     - Resolution Proposal Dropdown: `RESOLVED_COMPLIANT`, `RESOLVED_PENALTY`, `ESCALATED_TO_SHC`.
     - Button: _"Submit Proposed Resolution to Executive Administrator"_.
   - **Approving Officer Section (`AICTE_ADMIN`):**
     - Enabled only after reviewer recommendation is recorded.
     - Displays reviewer recommendation and penalty seat calculation.
     - Button: _"Co-Sign and Execute Legal Resolution"_ (Triggers dual-authorization step-up modal).

---

## 2. Separation of Duties Enforced in UI

- The UI strictly blocks self-approval: if the current user ID matches the reviewer who drafted the notice or submitted the inquiry recommendation, the Co-Sign button is replaced with an informational banner: _"Independent Executive Co-Signature Required: You authored this inquiry report; an independent AICTE Admin must co-sign."_
