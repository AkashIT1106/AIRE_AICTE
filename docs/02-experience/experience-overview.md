# User Experience Overview

| Metadata             | Value                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/02-experience/experience-overview.md`                                                                                        |
| Authoritative For    | UX Principles, Workspace Boundaries, Stage 0 Audit Context                                                                         |
| Status               | `CONFIRMED`                                                                                                                        |
| Source               | PROJECT_PLAN.md §10.1, §10.3                                                                                                       |
| Audit Linkage        | [`docs/04-frontend/ui-ux-audit.md`](../04-frontend/ui-ux-audit.md)                                                                 |
| Related Requirements | [`AIRE-REQ-078`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-083`](../00-governance/requirements-traceability.md) |

---

## 1. Five Distinct Workspaces

AIRE organizes user interactions into five dedicated workspace environments to ensure strict role-based separation:

```
+-----------------------------------------------------------------------------------------+
| AIRE APPLICATION SHELL                                                                  |
+-----------------------------------------------------------------------------------------+
| [AICTE Workspace]        | [Institution Workspace]  | [Student Portal]                 |
| - National Intake Map    | - Batch Upload & Normalise| - Admission Verification Card    |
| - Policy & Approval Hub  | - Intake vs Admitted Ledger- AEP Download & QR Display       |
| - Show Cause Dispatcher  | - Evidence Upload Center | - Demographic Correction Request |
+--------------------------+--------------------------+----------------------------------+
| [External Verifier]                                 | [Auditor Workbench]              |
| - Public AEP Cryptographic Validation               | - Immutable Audit Log Explorer   |
| - QR Code Scanner & Decryption Boundary             | - Regulatory Replay Simulator    |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Core Experience Principles

1. **Deterministic Transparency:** Every metric, quota count, and mismatch badge must explain _why_ it is flagged, linking directly to the governing AICTE Approval Order or Policy Rule.
2. **Zero Layout Shift:** Data-heavy tables and dashboards must render fixed-height skeleton loaders to prevent jarring layout shifts during data fetching.
3. **No Silent Mutations:** Actions that lock cohorts, seal submissions, or issue Show Cause Notices require explicit confirmation modals detailing the legal implications.
4. **Field-Level Privacy Masking:** High-risk student identifiers (Aadhaar, contact details) are masked by default across all screens with unmasking restricted to authorized audit contexts.

---

## 3. Relationship to Stage 0 UI/UX Audit

On 2 November 2026, an exhaustive diagnostic audit of the client codebase was performed. The audit findings and inventories are permanently preserved:

- **Audit Diagnostic Report:** [`docs/04-frontend/ui-ux-audit.md`](../04-frontend/ui-ux-audit.md)
- **Journey Inventory (J-01..J-08):** [`docs/04-frontend/journey-inventory.md`](../04-frontend/journey-inventory.md)
- **Screen Inventory (S-00..S-40):** [`docs/04-frontend/screen-inventory.md`](../04-frontend/screen-inventory.md)
- **Foundations Audit:** [`docs/04-frontend/design-foundations-audit.md`](../04-frontend/design-foundations-audit.md)
- **Decisions Log:** [`docs/04-frontend/ui-ux-decisions.md`](../04-frontend/ui-ux-decisions.md) (Consolidated in [`docs/00-governance/decisions/decision-register.md`](../00-governance/decisions/decision-register.md))
