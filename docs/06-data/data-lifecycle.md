# Data Lifecycle and Admission Ledger

| Metadata             | Value                                                                                                                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/06-data/data-lifecycle.md`                                                                                                                                                                    |
| Authoritative For    | Admission Progression, Ledger Events, Cancellation Rules                                                                                                                                            |
| Status               | `CONFIRMED`                                                                                                                                                                                         |
| Source               | PROJECT_PLAN.md §24, §25, §27                                                                                                                                                                       |
| Related Requirements | [`AIRE-REQ-024`](../00-governance/requirements-traceability.md), [`AIRE-REQ-155`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-159`](../00-governance/requirements-traceability.md) |

---

## 1. Student Record Progression

```
[ Raw Batch File ]
       |
       v (Ingestion & Schema Check)
[ Staged Student Record ]
       |
       v (Batch Sealing & Vault Encryption)
[ Active Admission Record ] <=========> [ Identity Vault Record ]
       |                               (Encrypted PII)
       v (Reconciliation Pass 1-4)
[ Reconciled Admission ]
       |
       v (Issuance)
[ Verifiable AEP Credential ]
```

---

## 2. Admission Lifecycle Ledger Events

All modifications to a student's admission status are recorded as immutable `LedgerEvent` entries:

- `ADMITTED`: Initial entry into the programme cohort.
- `BRANCH_CHANGE`: Approved intra-institutional branch change during permitted transfer window.
- `LATERAL_ENTRY`: Direct 2nd-year admission against supernumerary quota.
- `CANCELLATION`: Seat surrendered by student. Releases claimed seat back to entitlement pool.
- `MIGRATION`: Authorized transfer to another affiliated university.
