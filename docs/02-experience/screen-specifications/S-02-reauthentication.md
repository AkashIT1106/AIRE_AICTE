# S-02 — Security Step-Up Re-Authentication Modal

| Metadata             | Value                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Screen ID            | `S-02`                                                                                                                                                  |
| Screen Name          | Security Step-Up Re-Authentication Prompt                                                                                                               |
| Purpose              | Interrupt high-impact, irreversible transactions when session age exceeds 15 minutes to guarantee operator presence and non-repudiation                 |
| User Roles Allowed   | Privileged Roles executing mutations (`INST_ADMIN`, `AICTE_REVIEWER`, `AICTE_ADMIN`)                                                                    |
| Related Journeys     | [`J-01`](../user-journeys/J-01-authentication.md), [`J-03`](../user-journeys/J-03-seal-cohort.md), [`J-05`](../user-journeys/J-05-show-cause-review.md) |
| Primary Route        | Modal Triggered from `/institution/ledger`, `/institution/submissions`, `/aicte/exceptions/:id`                                                         |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                                   |
| Source Reference     | PROJECT_PLAN.md §16.1; [`docs/05-security-privacy/authentication.md`](../../05-security-privacy/authentication.md) §2                                   |
| Related Requirements | [`AIRE-REQ-098`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-124`](../../00-governance/requirements-traceability.md)                  |
| Last Updated         | 2 November 2026                                                                                                                                         |

---

## 1. Information Hierarchy & Content

1. **Modal Header:** Shield icon + _"Security Verification Required"_.
2. **Context Explanation:** Explicitly identifies the pending irreversible transaction:
   - Example A: _"You are about to permanently seal Cohort #104 (862 Students). This action locks all admission data."_
   - Example B: _"You are about to execute dual sign-off resolution on Show Cause Notice #SC-2026-88 with penalty seat reduction."_
3. **Password Re-Entry Input:** Single masked password field with accessible toggle.
4. **Action Pair:**
   - Primary: _"Confirm & Execute Transaction"_ (`bg-indigo-600 text-white`).
   - Secondary / Dismiss: _"Cancel (Return to Workbench)"_ (`bg-slate-100 text-slate-700`).

---

## 2. Interaction & State Contracts

- **Trigger:** Intercepts the submit action of S-13 (Cohort Sealing), S-24 (Notice Dispatch), or S-25 (Dual Sign-Off) if server returns `401 AUTH_STEPUP_REQUIRED` (session authentication age $> 15\text{ min}$).
- **State Preservation:** Form values, file attachments, and quarantine edits in the background view remain completely intact while the modal is open.
- **Success:** Dismisses modal; automatically re-submits the pending transaction with the fresh step-up token.
- **Cancel:** Dismisses modal without executing the transaction. Form remains dirty so operator does not lose progress.
- **Accessibility:** Modal traps focus within password input and action buttons; background scroll is disabled; `Escape` key dismisses modal safely.
