# S-16 — Evidence Upload & Affidavit Drawer

| Metadata             | Value                                                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Screen ID            | `S-16`                                                                                                                                    |
| Screen Name          | Evidence Upload & Compliance Affidavit Slide-Over Drawer                                                                                  |
| Purpose              | Contextual right-hand slide-over drawer enabling institutional administrators to upload counter-evidence, affidavits, and response briefs |
| User Roles Allowed   | `INST_ADMIN`                                                                                                                              |
| Related Journeys     | [`J-05`](../user-journeys/J-05-show-cause-review.md)                                                                                      |
| Primary Route        | Contextual Slide-Over Drawer inside `/institution/exceptions` (`S-15`)                                                                    |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                     |
| Source Reference     | PROJECT_PLAN.md §30; [`docs/04-domain/workflows/exception-review-workflow.md`](../../04-domain/workflows/exception-review-workflow.md)    |
| Related Requirements | [`AIRE-REQ-044`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-045`](../../00-governance/requirements-traceability.md)    |
| Last Updated         | 2 November 2026                                                                                                                           |

---

## 1. Information Hierarchy & Content

1. **Drawer Header:**
   - Title: _"Submit Formal Response: Show Cause #SC-2026-88"_.
   - Close button (`X` icon & `Escape` key trigger).
   - Deadline reminder indicator.
2. **AICTE Finding Summary (Read-Only Card):**
   - Discrepancy: Over-admission of 4 candidates in B.Tech Mechanical Engineering.
   - Cited Clause: AICTE APH 2026-27 Clause 4.2.
3. **Response Statement Editor:**
   - Multi-line textarea for formal institutional statement (up to 2,000 characters).
4. **Document Evidence Upload Dropzone:**
   - Accepts `.pdf` files up to 25 MB each (maximum 5 documents).
   - Document Type Classification:
     - `CANCELLATION_SLIP` (Candidate seat cancellation request).
     - `REFUND_VOUCHER` (Fee refund stamped receipt).
     - `AFFIDAVIT` (Principal sworn affidavit).
     - `CENTRALIZED_ALLOTMENT_PROOF` (State CET cell allotment memo).
   - Attached Files Roster: Lists uploaded files with filename, size, checksum, and remove button.
5. **Mandatory Attestation & Actions:**
   - Checkbox: _"I certify that the attached documents are authentic legal records."_
   - Primary: _"Submit Formal Evidence to AICTE"_ (`bg-indigo-600 text-white`).
   - Secondary: _"Save Draft Response"_.

---

## 2. Interaction & Keyboard Accessibility

- **Slide-Over Animation:** Subdued right-to-left slide transition (150ms). When `prefers-reduced-motion: reduce` is detected, opens instantly without translation.
- **Focus Trap:** Tabbing cycles strictly through drawer controls. Focus returns to the triggering button in S-15 upon dismissal.
- **Unsaved Changes Guard:** If the user presses `Escape` or clicks outside after typing text or uploading files, a prompt intercepts: _"You have unsaved response evidence. Discard or continue editing?"_
