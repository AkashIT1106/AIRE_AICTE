# Admission Submission Workflow

| Metadata             | Value                                                                                                                                                                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/04-domain/workflows/admission-submission-workflow.md`                                                                                                                                                                                                                        |
| Authoritative For    | Batch Submission Lifecycle, Freeze Dates, Sealing Rules                                                                                                                                                                                                                            |
| Status               | `CONFIRMED`                                                                                                                                                                                                                                                                        |
| Source               | PROJECT_PLAN.md §24, §25                                                                                                                                                                                                                                                           |
| Related Requirements | [`AIRE-REQ-021`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-026`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-144`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-149`](../../00-governance/requirements-traceability.md) |

---

## 1. Submission Lifecycle States

```
+-----------------------------------------------------------------------------------------+
| DRAFT                                                                                   |
| Operator uploads batch CSV/XLSX. Files parsed and validated asynchronously.             |
+-----------------------------------------------------------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------------+
| VALIDATED                                                                               |
| Schema checks complete. Valid rows staged; defective rows quarantined for correction.   |
+-----------------------------------------------------------------------------------------+
                                           |
                                           v (Institution Admin Sign-Off)
+-----------------------------------------------------------------------------------------+
| SEALED                                                                                  |
| Cohort locked. Cryptographic SHA-256 batch hash generated. Sent to Reconciliation Engine.|
+-----------------------------------------------------------------------------------------+
                                           |
                                           v (Regulatory Freeze Deadline)
+-----------------------------------------------------------------------------------------+
| LOCKED                                                                                  |
| System-enforced cutoff. Zero modifications allowed without formal AICTE reopening order.|
+-----------------------------------------------------------------------------------------+
```

---

## 2. Submission Freeze Rules

1. **Automated Cutoff:** At 23:59:59 on the annual regulatory freeze date, all pending `DRAFT` or `VALIDATED` submissions automatically transition to `LOCKED`.
2. **Tamper-Evident Sealing:** Sealing a batch calculates a Merkle root hash of all student records in the batch. Any subsequent record alteration invalidates the seal.
