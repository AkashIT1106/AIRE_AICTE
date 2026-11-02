# Exception Review and Adjudication Workflow

| Metadata             | Value                                                                                                                                                                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/04-domain/workflows/exception-review-workflow.md`                                                                                                                                                                                                                            |
| Authoritative For    | Exception Lifecycle, Show Cause Notices, Dual-Signoff Adjudication                                                                                                                                                                                                                 |
| Status               | `CONFIRMED`                                                                                                                                                                                                                                                                        |
| Source               | PROJECT_PLAN.md §30, ADR-007                                                                                                                                                                                                                                                       |
| Related Requirements | [`AIRE-REQ-041`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-047`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-178`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-184`](../../00-governance/requirements-traceability.md) |

---

## 1. Exception State Machine

```
+-----------------------------------------------------------------------------------------+
| OPEN                                                                                    |
| Reconciliation engine flags a critical mismatch (e.g. over-admission).                 |
+-----------------------------------------------------------------------------------------+
                                           |
                                           v (AICTE Reviewer Action)
+-----------------------------------------------------------------------------------------+
| SHOW_CAUSE_ISSUED                                                                       |
| Formal notice dispatched with legal reference and response deadline (e.g. 14 days).     |
+-----------------------------------------------------------------------------------------+
                                           |
                                           v (Institution Action)
+-----------------------------------------------------------------------------------------+
| EVIDENCE_SUBMITTED                                                                      |
| Institution uploads clarifying documentation, seat cancellation proof, or affidavits.   |
+-----------------------------------------------------------------------------------------+
                                           |
                                           v (Dual-Authorization Review)
+-----------------------------------------------------------------------------------------+
| RESOLVED_COMPLIANT        | RESOLVED_PENALTY          | ESCALATED                       |
| Evidence accepted; seat   | Over-admission confirmed; | Referred to National Council    |
| entitlements adjusted.    | penalty seat reduction.   | for derecognition hearing.      |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Dual-Authorization Sign-Off Rule

No exception involving over-admission or quota breaches can be closed unilaterally:

1. **Primary Reviewer (`AICTE_REVIEWER`):** Conducts factual inquiry, verifies uploaded evidence, and enters reasoned recommendations.
2. **Approving Officer (`AICTE_ADMIN`):** Reviews findings and digitally co-signs the order to execute resolution.
