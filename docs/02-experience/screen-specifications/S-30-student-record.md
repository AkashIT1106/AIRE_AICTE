# S-30 — Student Admission Verification Card

| Metadata             | Value                                                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Screen ID            | `S-30`                                                                                                                                     |
| Screen Name          | Student Admission Entitlement Card                                                                                                         |
| Purpose              | Focused, individual card presenting an enrolled student's official technical admission details, college affiliation, and quota entitlement |
| User Roles Allowed   | `STUDENT` (Hard-scoped to own individual record)                                                                                           |
| Related Journeys     | [`J-06`](../user-journeys/J-06-student-verification.md)                                                                                    |
| Primary Route        | `/student/record`                                                                                                                          |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                      |
| Source Reference     | PROJECT_PLAN.md §10.1, §32.3; [`docs/02-experience/role-workspace-specification.md`](../role-workspace-specification.md)                   |
| Related Requirements | [`AIRE-REQ-048`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-051`](../../00-governance/requirements-traceability.md)     |
| Last Updated         | 2 November 2026                                                                                                                            |

---

## 1. Information Hierarchy & Content Sections

1. **Verification Status Header:**
   - Prominent status banner:
     - `VERIFIED & RECONCILED (COMPLIANT)`: Large emerald badge with shield icon.
     - `PENDING_INSTITUTION_SEAL`: Amber badge explaining that the college has staged but not yet sealed the cohort.
     - `UNDER_REGULATORY_REVIEW`: Blue badge explaining routine reconciliation inquiry.
2. **Core Academic Profile Card:**
   - **Candidate Full Name:** Legal name as reported by institution.
   - **Admitted Institution:** Full College Name, AICTE Permanent Institute ID, Campus City & State.
   - **Programme & Discipline:** Conferred technical degree (e.g. _Bachelor of Technology in Computer Engineering_).
   - **Academic Cycle:** Admitted Year (e.g. _2026-2027_).
   - **Quota Allocation:** Quota Type (State Merit / CAP) and Reservation Classification.
3. **Regulatory Provenance Section:**
   - **AICTE Approval Order Reference:** Extension of Approval (EOA) order number.
   - **APAAR Verification State:** Masked APAAR ID (`******-1234`) with verification timestamp.
4. **Primary Actions:**
   - Primary: _"View & Download Entitlement Proof (AEP)"_ (navigates to S-31).
   - Secondary: _"Report Clerical Typo / Correction Request"_ (routes to S-32).
