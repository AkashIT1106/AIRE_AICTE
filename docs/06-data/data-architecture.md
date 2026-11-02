# Data Architecture

| Metadata          | Value                                                   |
| ----------------- | ------------------------------------------------------- |
| Document          | `docs/06-data/data-architecture.md`                     |
| Authoritative For | Authoritative Store, Schema Topology, Transient Storage |
| Status            | `CONFIRMED`                                             |
| Source            | PROJECT_PLAN.md §12.1, §12.4, §12.6, §12.7, ADR-002     |

---

## 1. Storage Topology

AIRE enforces a clear separation between authoritative relational persistence and transient caching:

```
+-----------------------------------------------------------------------------------------+
| PRIMARY RELATIONAL DATABASE: PostgreSQL 16                                              |
| Authoritative Source of Truth for all Business Entities, Policies, and Audit Records   |
|                                                                                         |
| ├── public schema (aire_app)                                                            |
| │   ├── Identity & Session (User, Session, Account, InstitutionMember)                 |
| │   ├── Registries (Institution, Campus, Programme, ApprovalOrder, SeatEntitlement)    |
| │   ├── Submissions (SubmissionBatch, StagedStudent, AdmissionRecord, LedgerEvent)     |
| │   ├── Reconciliation (PolicyPack, ReconciliationRun, MismatchFinding, ExceptionCase)  |
| │   └── Verifiable Proofs (AdmissionEntitlementProof)                                  |
|                                                                                         |
| ├── vault schema (aire_vault)                                                           |
| │   └── IdentityVaultRecord (Envelope Encrypted PII)                                    |
|                                                                                         |
| └── audit schema (aire_audit)                                                           |
|     └── AuditLogEvent (Append-only immutable audit trail)                               |
+-----------------------------------------------------------------------------------------+
                                           |
+-----------------------------------------------------------------------------------------+
| TRANSIENT MESSAGE BROKER & CACHE: Redis 7 Alpine                                        |
| ├── BullMQ Job Queues (Ingestion, APAAR Verification, Reconciliation)                   |
| └── Volatile Rate Limiting Counters & Session Caches (Zero Business State)              |
+-----------------------------------------------------------------------------------------+
```
