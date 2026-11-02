# Policy Lifecycle and Regulatory Replay Rules

| Metadata             | Value                                                                                                                                                                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/04-domain/business-rules/policy-lifecycle-rules.md`                                                                                                                                                                                                                          |
| Authoritative For    | Policy Versioning, Test Fixtures, Activation Sign-off, Replay                                                                                                                                                                                                                      |
| Status               | `CONFIRMED`                                                                                                                                                                                                                                                                        |
| Source               | PROJECT_PLAN.md §23, ADR-007                                                                                                                                                                                                                                                       |
| Related Requirements | [`AIRE-REQ-014`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-020`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-138`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-143`](../../00-governance/requirements-traceability.md) |

---

## 1. Policy Pack Lifecycle

Regulatory rules (intake caps, reservation models, penalty formulas) are bundled into immutable **Policy Packs**:

$$	ext{Draft} \longrightarrow 	ext{Testing (Fixtures)} \longrightarrow 	ext{Review} \longrightarrow 	ext{Active} \longrightarrow 	ext{Superseded}$$

- **Draft:** Author drafts rules in TypeScript/JSON schema specifying parameters and validity dates.
- **Testing:** Policy pack must execute against a mandatory suite of synthetic test cohorts. All test fixtures must pass with 100% accuracy.
- **Review & Activation:** Dual-authorization required. An `AICTE_ADMIN` reviews test results and signs off to activate.
- **Active & Immutable:** Once active, a policy pack cannot be edited. Any regulatory change requires publishing a new version.

---

## 2. Regulatory Replayability

AIRE guarantees that any historical admission cohort can be re-evaluated under its original governing policy:

- The exact policy version used in a reconciliation run is recorded as an immutable hash.
- Regulators can execute **Impact Analysis**: evaluating what the compliance outcome would have been if a revised quota rule had been applied, without modifying actual historical records.
