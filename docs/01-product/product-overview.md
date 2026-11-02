# Product Overview

| Metadata          | Value                                                |
| ----------------- | ---------------------------------------------------- |
| Document          | `docs/01-product/product-overview.md`                |
| Authoritative For | Product Vision, Key Differentiators, Success Metrics |
| Status            | `CONFIRMED`                                          |
| Source            | PROJECT_PLAN.md §2.1, §2.2, §2.4, §2.5               |

---

## 1. Product Identity

**AIRE** (**AICTE Admission Reconciliation & Evidence Platform**) is a specialized regulatory platform designed for the All India Council for Technical Education (AICTE), approved technical institutions, students, and statutory authorities.

AIRE bridges the gap between approved intake mandates and actual student admissions by providing continuous, automated reconciliation, cryptographic entitlement verification, and transparent evidence-based exception governance.

---

## 2. Core Value Proposition

In Indian higher technical education, institutions receive annual seat approval orders (Extension of Approval - EOA / Letter of Approval - LOA) dictating sanctioned intake, category reservations, and approved supernumerary quotas. However, reporting of admitted students currently relies on disparate, static post-admission filings.

AIRE transforms admission compliance from post-facto periodic declarations into an **evidence-driven, verifiable admission ledger**.

```
+---------------------+       +-----------------------+       +------------------------+
| Approved Entitlement|       | Admitted Cohort       |       | Cryptographic Proof    |
| (AICTE EOA / LOA)   | ----> | (Institution Reports) | ----> | Admission Entitlement  |
| - Sanctioned Intake |       | - 12-Digit APAAR ID   |       | Proof (AEP Record)     |
| - Category Quotas   |       | - Quota Verification  |       | - Tamper-Evident QR    |
+---------------------+       +-----------------------+       +------------------------+
                                          |
                                          v
                              +-----------------------+
                              | Exception Workbench   |
                              | - Structured Notice   |
                              | - Dual Sign-off Review|
                              +-----------------------+
```

---

## 3. Product Differentiators

AIRE introduces five foundational capabilities absent in legacy portal systems:

### A. Admission Entitlement Proof (AEP)

- Every admitted student verified against approved intake receives a cryptographically signed AEP.
- Verifiable by external employers, universities, and visa authorities without exposing the student's Aadhaar or raw PII.
- Follows the W3C Verifiable Credentials Data Model 2.0.

### B. Regulatory Replay & Impact Analysis

- Regulatory policies (quota percentages, relaxation rules) are versioned and stored as code.
- Allows AICTE administrators to replay historical admission cohorts against past or amended regulatory policies to measure impact without altering historical records.

### C. Policy-Aware Identity Resolution

- Decouples raw identity from platform queries.
- Interfaces with the national APAAR (Automated Permanent Academic Account Registry) gateway while enforcing envelope encryption and zero-knowledge student tokens.

### D. Evidence-Based Exception Resolution

- Admissions exceeding approved quotas or violating reservation arithmetic do not trigger blunt automated rejections.
- Instead, AIRE initiates a structured legal workflow: Show Cause Notice -> Institutional Evidence Upload -> Dual-Authorization Sign-Off.

### E. Admission Lifecycle Chronology

- Full chronological event ledger tracking student transitions (Admitted, Branch Change, Lateral Entry, Cancellation, Transfer).
- Guarantees non-repudiation and prevents ghost enrollment across multiple institutions.

---

## 4. Platform Success Criteria

1. **Reconciliation Accuracy:** >95% automated mismatch detection rate on multi-quota technical cohorts.
2. **Deterministic Governance:** Zero reliance on probabilistic AI for final regulatory verdicts or penalties.
3. **Data Protection:** Zero cleartext PII in operational query logs or analytical exports.
4. **Adoption Efficiency:** Batch ingestion processing completes in <60 seconds for a 2,000-student cohort.
