# S-13 — Submission History & Sealed Hashes

| Metadata             | Value                                                                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Screen ID            | `S-13`                                                                                                                                              |
| Screen Name          | Submission History & Cryptographic Batch Registry                                                                                                   |
| Purpose              | Historical ledger of all uploaded, validated, sealed, and locked admission batches; displays Merkle hashes, receipts, and audit trail               |
| User Roles Allowed   | `INST_ADMIN`, `INST_OPERATOR`                                                                                                                       |
| Related Journeys     | [`J-03`](../user-journeys/J-03-seal-cohort.md)                                                                                                      |
| Primary Route        | `/institution/submissions`                                                                                                                          |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                               |
| Source Reference     | PROJECT_PLAN.md §24, §25; [`docs/04-domain/workflows/admission-submission-workflow.md`](../../04-domain/workflows/admission-submission-workflow.md) |
| Related Requirements | [`AIRE-REQ-025`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-026`](../../00-governance/requirements-traceability.md)              |
| Last Updated         | 2 November 2026                                                                                                                                     |

---

## 1. Information Hierarchy & Content Sections

1. **Header Context:** Breadcrumb: `Institution > Submissions`.
2. **Filter Controls Bar:**
   - Academic Year Filter (`2026-27`, `2025-26`).
   - Programme Selector.
   - Status Filter (`DRAFT`, `VALIDATED`, `SEALED`, `LOCKED`).
3. **Master Submission History Table:**
   - Columns:
     - **Batch ID:** Clickable link navigating to batch detail.
     - **Academic Programme:** Conferred discipline name.
     - **Submission Status:** State badge:
       - `DRAFT`: Gray badge.
       - `VALIDATED`: Blue badge.
       - `SEALED`: Green badge with padlock icon.
       - `LOCKED`: Slate badge.
     - **Record Count:** Validated / Total records.
     - **Submitted By:** Full name of operator.
     - **Sign-Off Authority:** Full name of `INST_ADMIN` (if sealed).
     - **Sealing Timestamp:** Exact server time (IST).
     - **Cryptographic Hash (SHA-256):** Truncated Merkle digest (e.g. `e3b0c442...855`) with accessible copy button.
     - **Actions:** _"Download Official Receipt (PDF)"_, _"View Batch Roster"_.
4. **Primary Action:** _"Upload New Batch"_ button in top-right.

---

## 2. Interaction & Accessibility

- **Sorting:** Columns sortable by Timestamp, Batch ID, and Record Count.
- **Copy Digest:** Clicking the hash icon copies the full 64-character Merkle string to clipboard with an accessible tooltip confirmation (_"Copied to clipboard"_).
- **Responsive Strategy:** On screens $< 1024\text{px}$, hash digest and submitter columns hide into an expandable child row accordion.
