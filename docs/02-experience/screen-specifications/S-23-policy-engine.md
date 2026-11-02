# S-23 — Regulatory Policy Engine & Fixtures

| Metadata             | Value                                                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Screen ID            | `S-23`                                                                                                                                     |
| Screen Name          | Regulatory Policy Engine, Version Packs & Test Fixtures Console                                                                            |
| Purpose              | Author, inspect, test, and activate versioned Regulatory Policy Packs linking declarative AICTE rules to executable test fixtures          |
| User Roles Allowed   | `AICTE_ADMIN`                                                                                                                              |
| Related Journeys     | Policy Governance (Audit J-07)                                                                                                             |
| Primary Route        | `/aicte/policies`                                                                                                                          |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                      |
| Source Reference     | PROJECT_PLAN.md §23; [`docs/04-domain/business-rules/policy-lifecycle-rules.md`](../../04-domain/business-rules/policy-lifecycle-rules.md) |
| Related Requirements | [`AIRE-REQ-014`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-020`](../../00-governance/requirements-traceability.md)   |
| Last Updated         | 2 November 2026                                                                                                                            |

---

## 1. Information Hierarchy & Content

1. **Header Context:** Breadcrumb: `AICTE > Regulatory Policy Engine`.
2. **Active Policy Pack Indicator:** Displays active handbook edition (e.g. `AICTE Approval Process Handbook 2026-27 (Version 1.2)`), effective date, and status (`ACTIVE`).
3. **Rule Catalog & Fixture Runner:**
   - Table of declarative rule handlers (e.g. `IntakeCeilingRule`, `TFWReservationRule`, `NRIEntitlementRule`).
   - Each rule shows linked handbook clause, mathematical formula, and test suite status (e.g. `12/12 Fixtures Passing`).
   - Interactive button: _"Run Policy Test Suite"_.
4. **Draft Pack Activation Console:**
   - Allows an `AICTE_ADMIN` (distinct from rule author) to review proposed changes and execute activation with step-up authentication.
