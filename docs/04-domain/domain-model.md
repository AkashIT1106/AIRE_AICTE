# Domain Model & Entity Aggregates

| Metadata          | Value                                                   |
| ----------------- | ------------------------------------------------------- |
| Document          | `docs/04-domain/domain-model.md`                        |
| Authoritative For | Entity Relationships, Aggregate Roots, Schema Blueprint |
| Status            | `CONFIRMED`                                             |
| Source            | PROJECT_PLAN.md §12.2, §12.3, §21                       |

---

## 1. Domain Aggregate Roots

```
+-----------------------------------------------------------------------------------------+
| INSTITUTION AGGREGATE (M02)                                                             |
| Institution (Root) <---> Campus <---> Programme <---> ProgrammeAlias                   |
+-----------------------------------------------------------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------------+
| APPROVAL AGGREGATE (M03)                                                                |
| ApprovalOrder (Root) <---> SeatEntitlement <---> ApprovalDocument                       |
+-----------------------------------------------------------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------------+
| SUBMISSION & ADMISSION AGGREGATE (M05, M06, M08)                                        |
| SubmissionBatch (Root) <---> AdmissionRecord <---> LedgerEvent                          |
|                                     |                                                   |
|                                     v (Token Reference)                                 |
|                         [ Identity Vault Schema ] (M15)                                 |
|                         IdentityVaultRecord (Encrypted PII)                             |
+-----------------------------------------------------------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------------+
| RECONCILIATION & EXCEPTION AGGREGATE (M09, M10, M11, M12)                               |
| ReconciliationRun (Root) <---> MismatchFinding <---> ExceptionCase <---> ReviewAction   |
|            |                                                                            |
|            v                                                                            |
| AdmissionEntitlementProof (AEP)                                                         |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Key Entity Definitions

1. **`Institution`:** Authoritative entity representing an AICTE-approved institution (`id`, `aicteId`, `name`, `status`, `state`, `district`).
2. **`ApprovalOrder`:** Annual approval document (`id`, `institutionId`, `academicYear`, `orderType`, `orderNumber`, `status`, `supersededById`).
3. **`SeatEntitlement`:** Programme-level quota limits (`id`, `approvalOrderId`, `programmeId`, `sanctionedIntake`, `openSeats`, `scSeats`, `stSeats`, `obcSeats`, `ewsSeats`, `tfwSeats`).
4. **`AdmissionRecord`:** Individual student admission (`id`, `tenantId`, `programmeId`, `academicYear`, `studentToken`, `apaarStatus`, `allocatedCategory`, `admittedQuota`).
5. **`LedgerEvent`:** Append-only student lifecycle transition (`id`, `admissionRecordId`, `eventType`, `payload`, `actorId`, `timestamp`).
6. **`ReconciliationRun`:** Audit record of a batch evaluation (`id`, `tenantId`, `academicYear`, `policyPackId`, `totalAdmitted`, `totalApproved`, `mismatchCount`, `status`).
7. **`ExceptionCase`:** Legal review workflow (`id`, `reconciliationRunId`, `institutionId`, `status`, `severity`, `noticeIssuedAt`, `responseDeadline`).
8. **`AdmissionEntitlementProof (AEP)`:** Issued credential (`id`, `admissionRecordId`, `certificateNumber`, `signatureHash`, `issuedAt`, `status`).
