# S-20 — AICTE National Compliance Overview

| Metadata             | Value                                                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Screen ID            | `S-20`                                                                                                                                 |
| Screen Name          | National Compliance & Admission Reconciliation Overview                                                                                |
| Purpose              | Macro-level executive dashboard tracking nationwide technical education admission compliance, regional heatmaps, and system health     |
| User Roles Allowed   | `AICTE_ADMIN`, `AICTE_REVIEWER`                                                                                                        |
| Related Journeys     | [`J-04`](../user-journeys/J-04-aicte-reconciliation.md)                                                                                |
| Primary Route        | `/aicte/overview`                                                                                                                      |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                  |
| Source Reference     | PROJECT_PLAN.md §10.1, §32.2; [`docs/02-experience/information-architecture.md`](../information-architecture.md)                       |
| Related Requirements | [`AIRE-REQ-048`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-049`](../../00-governance/requirements-traceability.md) |
| Last Updated         | 2 November 2026                                                                                                                        |

---

## 1. Information Hierarchy & Content Sections

1. **National Macro KPIs (Top Row):**
   - **Total Approved Institutions:** Active AICTE-approved colleges (e.g. `8,421`).
   - **Total Sanctioned Intake:** Cumulative seats from master EOA registry (e.g. `2,450,000`).
   - **Total Reported Admissions:** Sealed admissions across all states (e.g. `1,820,400`).
   - **National Discrepancy Rate:** Percentage of institutions flagged with active quota breaches (e.g. `1.8%`).
2. **National Compliance Heatmap (Interactive SVG Map / Tabular View):**
   - State/UT breakdown with color-coded severity:
     - Green: $< 1\%$ discrepancy rate.
     - Amber: $1\% - 3\%$ discrepancy rate.
     - Red: $> 3\%$ discrepancy rate.
   - Clicking a State (e.g. _Maharashtra_) filters the Regional Scrutiny Hub (`S-21`) automatically.
3. **Dual-Authorization Executive Sign-Off Queue (For `AICTE_ADMIN`):**
   - Renders pending exception closures submitted by regional reviewers requiring executive co-signature.
4. **Ingestion & Adapter Health Status:**
   - Real-time BullMQ ingestion queue latency, active workers count, and APAAR national gateway latency.
