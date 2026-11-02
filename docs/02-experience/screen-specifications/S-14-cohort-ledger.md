# S-14 — Cohort Ledger & Quota Roster

| Metadata             | Value                                                                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Screen ID            | `S-14`                                                                                                                                              |
| Screen Name          | Institutional Cohort Ledger & Quota Breakdown Roster                                                                                                |
| Purpose              | High-density roster of all enrolled students within an institution; filterable by reservation quota, APAAR state, and entitlement status            |
| User Roles Allowed   | `INST_ADMIN`, `INST_OPERATOR`                                                                                                                       |
| Related Journeys     | [`J-03`](../user-journeys/J-03-seal-cohort.md)                                                                                                      |
| Primary Route        | `/institution/ledger`                                                                                                                               |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                               |
| Source Reference     | PROJECT_PLAN.md §10.1, §32.1; [`docs/04-domain/business-rules/intake-and-quota-rules.md`](../../04-domain/business-rules/intake-and-quota-rules.md) |
| Related Requirements | [`AIRE-REQ-021`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-033`](../../00-governance/requirements-traceability.md)              |
| Last Updated         | 2 November 2026                                                                                                                                     |

---

## 1. Information Hierarchy & Content Sections

1. **Header Context:** Breadcrumb: `Institution > Cohort Ledger`.
2. **Quota Utilization Summary Bar (Interactive):**
   - Programme: _B.Tech Computer Science & Engineering_.
   - Approved Sanctioned Seats: `60`.
   - Admitted Students Count: `60` (General: 30, OBC: 16, SC: 9, ST: 5).
   - Supernumerary Quota: TFW `3/3`, NRI `0/3`, FN `0/3`.
   - Visual progress bar showing exact capacity utilization percentage.
3. **Multi-Attribute Filter Controls:**
   - Search: Instant debounce input (Name, Roll Number, Masked APAAR).
   - Category Filter: All, General, OBC-NCL, SC, ST, EWS.
   - Quota Filter: State Merit, Management Quota, TFW, Lateral Entry.
   - APAAR Verification Filter: Verified, Pending, Unverified.
   - Status Filter: Draft, Validated, Sealed.
4. **High-Density Student Roster Grid:**
   - Compact 36px row height for optimal information density on 1080p displays.
   - Columns:
     - Roll Number (Monospace).
     - Candidate Full Name.
     - Gender & Date of Birth.
     - Category (General / Reserved).
     - Admitted Quota Code.
     - APAAR Status Badge (Verified checkmark vs Pending).
     - Entitlement Status (Eligible vs Discrepancy Flag).
     - Batch ID link.
5. **Action Bar:**
   - For `INST_ADMIN`: _"Review & Seal Cohort"_ button (triggers J-03 sealing modal).
   - For `INST_OPERATOR`: _"Export Filtered Roster (.csv)"_ (purpose-bound, audited).

---

## 2. Interaction & Accessibility Invariants

- **Data Protection Masking:** Raw Aadhaar numbers are never present in DOM or API payloads. Student names and roll numbers are visible; private contact numbers are omitted.
- **Server-Side Pagination:** Data loads in 50-row chunks; entire cohort datasets are never loaded into client memory simultaneously.
- **Sortable Columns:** Roll Number, Candidate Name, Category, Admitted Quota.
