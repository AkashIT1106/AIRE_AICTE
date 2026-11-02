# Interaction Contracts

| Metadata          | Value                                                 |
| ----------------- | ----------------------------------------------------- |
| Document          | `docs/02-experience/interaction-contracts.md`         |
| Authoritative For | State Machines, Modal Contracts, Freeze Confirmations |
| Status            | `CONFIRMED`                                           |
| Source            | PROJECT_PLAN.md §10.2, §24, §30                       |

---

## 1. Standard Component State Machine

All interactive UI views must handle six standard states deterministically:

$$	ext{Idle} \longrightarrow 	ext{Loading} \longrightarrow 	ext{Success} \mid 	ext{Partial} \mid 	ext{Error} \mid 	ext{Disabled}$$

- **Idle:** Clean baseline presentation with accessible focus states.
- **Loading:** Non-blocking skeleton loader matching the geometry of the target data table or card.
- **Success:** Non-disruptive feedback banner or toast with correlation ID.
- **Partial (Ingestion):** Batch accepted with warnings; defective rows isolated in quarantine view.
- **Error:** Human-readable regulatory or validation error with actionable remediation steps.
- **Disabled:** Explicit visual indication and tooltip explaining why the action is unauthorized or locked.

---

## 2. Irreversible Action Confirmation Contract

High-impact regulatory mutations require a double-confirmation pattern:

1. **Submission Freeze / Seal:**
   - Modal displays student count, verified APAAR percentage, and unverified count.
   - Warning banner: _"Sealing this cohort is irreversible. No further records can be uploaded past the freeze deadline."_
   - Requires explicit checkmark: _"I certify under penalty of regulatory action that these admissions comply with AICTE Approval Orders."_

2. **Show Cause Notice Issuance:**
   - Displays violated AICTE Rule ID, calculated seat excess, and target institution details.
   - Requires setting a mandatory response window (e.g. 7, 14, or 21 days).

3. **Dual-Authorization Sign-Off Modal:**
   - Secondary reviewer enters password or hardware token confirmation before closing an exception.
