# S-40 — Temporal Regulatory Replay Simulator

| Metadata             | Value                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Screen ID            | `S-40`                                                                                                                                       |
| Screen Name          | Temporal Regulatory Replay & Historical Policy Simulator                                                                                     |
| Purpose              | Execute deterministic comparative replay simulations of historical admission snapshots against versioned regulatory policies                 |
| User Roles Allowed   | `AUDITOR`, `AICTE_ADMIN`                                                                                                                     |
| Related Journeys     | [`J-08`](../user-journeys/J-08-auditor-inspection.md)                                                                                        |
| Primary Route        | `/auditor/replay`                                                                                                                            |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                        |
| Source Reference     | PROJECT_PLAN.md §2.4, §29; [`docs/04-domain/business-rules/reconciliation-rules.md`](../../04-domain/business-rules/reconciliation-rules.md) |
| Related Requirements | [`AIRE-REQ-055`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-175`](../../00-governance/requirements-traceability.md)       |
| Last Updated         | 2 November 2026                                                                                                                              |

---

## 1. Information Hierarchy & Content

1. **Header Context:** Breadcrumb: `Auditor Workbench > Regulatory Replay Simulator`.
2. **Replay Configuration Card:**
   - Historical Cohort Selector: Academic Cycle (e.g. `2024-25`), Region/State, Discipline.
   - Baseline Policy Version: e.g. `AICTE-APH-2024-V1.0`.
   - Comparison / Simulated Policy Version: e.g. `AICTE-APH-2025-V2.1`.
3. **Execution Trigger:**
   - Action Button: _"Run Comparative Replay Simulation"_.
4. **Comparative Analysis Matrix (Results View):**
   - Headcount evaluated: Total student records in snapshot.
   - Deterministic Integrity Metric: `100% Identical Output` when re-evaluating under baseline policy.
   - Variance Breakdown (under comparison policy):
     - Records transitioning `NON_COMPLIANT` $\rightarrow$ `COMPLIANT`.
     - Records transitioning `COMPLIANT` $\rightarrow$ `REVIEW_REQUIRED`.
   - Explanatory delta trace with clause citations.
5. **Export Action:** _"Export Comparative Impact Analysis (.csv / .pdf)"_.
