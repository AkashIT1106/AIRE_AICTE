# Information Architecture

| Metadata          | Value                                            |
| ----------------- | ------------------------------------------------ |
| Document          | `docs/02-experience/information-architecture.md` |
| Authoritative For | Navigation Hierarchy, Layout Shell, Sitemaps     |
| Status            | `CONFIRMED`                                      |
| Source            | PROJECT_PLAN.md §10.1, §32                       |

---

## 1. Global Shell Structure

All logged-in experiences share a consistent structural shell:

```
+-----------------------------------------------------------------------------------------+
| [AIRE Logo]   [Institution / Campus Switcher]              [User Profile & Logout]     |
+-----------------------------------------------------------------------------------------+
| SIDEBAR NAVIGATION         | MAIN CONTENT VIEWPORT                                     |
| - Dashboard                | [Breadcrumbs: Home > Admissions > 2026-27 > Batch #104]   |
| - Submissions & Uploads    |                                                           |
| - Cohort Ledger            | (High-Density Data Grid / Form / Workbench)               |
| - Exceptions & Notices     |                                                           |
| - AEP Proof Registry       |                                                           |
| - Audit & Activity         |                                                           |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Institutional Navigation Hierarchy

1. **Dashboard:** Submission completeness status, countdown to regulatory freeze, active exception alert counter.
2. **Submissions:**
   - _Upload New Batch:_ File dropzone (CSV/XLSX), column mapping interface.
   - _Ingestion Progress:_ Real-time parse status, defective row quarantine table.
   - _Submission History:_ Sealed cohorts, cryptographic hash receipts, immutable timestamps.
3. **Cohort Ledger:** Filterable student roster (Programme, Category, Quota Type, APAAR Status, Entitlement Status).
4. **Exceptions & Legal Notices:** Active Show Cause notices, deadline indicators, evidence upload drawers.
5. **AEP Proof Registry:** Issued student credentials, batch QR generation, export controls.

---

## 3. AICTE Regulatory Navigation Hierarchy

1. **National Compliance Overview:** Aggregate intake vs admission metrics across states and disciplines.
2. **Regional Scrutiny Hub:** Filtering by State, Regional Office, Institution Type, Accreditation.
3. **Approval Order Management:** EOA/LOA ingestion, seat entitlement verification, amendment history.
4. **Regulatory Policy Engine:** Versioned policy packs, rule fixture test results, activation sign-off.
5. **Show Cause Dispatcher:** Multi-institutional exception notice generation and compliance tracking.
