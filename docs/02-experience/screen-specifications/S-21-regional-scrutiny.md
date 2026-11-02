# S-21 — AICTE Regional Scrutiny Hub

| Metadata             | Value                                                                                                                                         |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Screen ID            | `S-21`                                                                                                                                        |
| Screen Name          | Regional Scrutiny Hub & Institution Quota Matrix                                                                                              |
| Purpose              | Regional scrutiny grid enabling officers to filter assigned institutions, examine intake vs admitted variance, and triage anomalies           |
| User Roles Allowed   | `AICTE_REVIEWER` (Scoped to Region), `AICTE_ADMIN` (Global)                                                                                   |
| Related Journeys     | [`J-04`](../user-journeys/J-04-aicte-reconciliation.md)                                                                                       |
| Primary Route        | `/aicte/scrutiny`                                                                                                                             |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                         |
| Source Reference     | PROJECT_PLAN.md §10.1, §29; [`docs/04-domain/business-rules/reconciliation-rules.md`](../../04-domain/business-rules/reconciliation-rules.md) |
| Related Requirements | [`AIRE-REQ-033`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-037`](../../00-governance/requirements-traceability.md)      |
| Last Updated         | 2 November 2026                                                                                                                               |

---

## 1. Information Hierarchy & Content Sections

1. **Header Context:** Breadcrumb: `AICTE > Regional Scrutiny > Western Region`.
2. **Filter & Query Controls:**
   - State / Territory Selector (Maharashtra, Goa).
   - Institution Type (Government, Private Aided, Un-Aided).
   - Discipline Filter (Engineering, Management, Pharmacy).
   - Severity Filter: `ALL`, `COMPLIANT_ONLY`, `OVER_ADMISSION`, `QUOTA_BREACH`, `UNVERIFIED_HIGH`.
3. **Regional Scrutiny High-Density Data Grid:**
   - Compact table with server-side pagination.
   - Columns:
     - **Institute Code & Name:** (e.g. `1-1029384 - Govt College of Engineering, Karad`).
     - **Total Sanctioned Intake (EOA):** Number of approved seats.
     - **Total Sealed Admissions:** Reported head count.
     - **Variance (+/-):** Highlighted in red if $> 0$.
     - **Supernumerary Quota Utilization:** TFW & NRI status.
     - **APAAR Verification Rate:** E.g. `96.4%`.
     - **Reconciliation Status Badge:**
       - `COMPLIANT` (Green).
       - `WARNING` (Amber).
       - `CRITICAL_MISMATCH` (Red).
     - **Active Show Cause Indicator:** Padlock/warning badge if under active legal proceeding.
     - **Row Action:** _"Scrutinize Institution Cohorts"_ (navigates to institution drill-down view).
