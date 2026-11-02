# System Context (C4 Level 1)

| Metadata          | Value                                      |
| ----------------- | ------------------------------------------ |
| Document          | `docs/03-architecture/system-context.md`   |
| Authoritative For | System Context, External System Boundaries |
| Status            | `CONFIRMED`                                |
| Source            | PROJECT_PLAN.md §3, §8.2                   |

---

## 1. System Context Diagram

```
                                  +----------------------------+
                                  | All India Council for      |
                                  | Technical Education (AICTE)|
                                  +----------------------------+
                                                 |
                                     Approvals & Regulatory Norms
                                                 v
+----------------------------+    +----------------------------+    +----------------------------+
| Technical Institutions &   |    |                            |    | National APAAR /           |
| Universities               |--->| AIRE PLATFORM              |<---| EduLocker Gateway          |
| (Batch Admission Records)  |    | - Admission Reconciliation |    | (12-Digit Student Verify)  |
+----------------------------+    | - Quota Verification       |    +----------------------------+
                                  | - Exception Workbench      |
+----------------------------+    | - Verifiable AEP Registry  |    +----------------------------+
| Enrolled Students          |--->|                            |--->| Relying Parties /          |
| (View Admission Status)    |    +----------------------------+    | External Verifiers         |
+----------------------------+                   |                  | (W3C AEP QR Verification)  |
                                                 v                  +----------------------------+
                                  +----------------------------+
                                  | Academic Bank of Credits   |
                                  | (ABC / DigiLocker NAD)     |
                                  +----------------------------+
```

---

## 2. External System Interfaces

1. **AICTE Web Portal & ERP:** Ingests authoritative annual Extension of Approval (EOA) and Letter of Approval (LOA) orders detailing approved intake and category quotas.
2. **National APAAR Gateway:** Verifies 12-digit student APAAR identifiers asynchronously via adapter interfaces.
3. **Academic Bank of Credits (ABC):** Future integration boundary for binding admission entitlement proofs to the student's lifelong academic credit account.
4. **DigiLocker NAD:** Issuance endpoint for pushing signed Admission Entitlement Proof (AEP) credentials directly into student DigiLocker wallets.
