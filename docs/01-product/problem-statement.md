# Problem Statement

| Metadata          | Value                                                          |
| ----------------- | -------------------------------------------------------------- |
| Document          | `docs/01-product/problem-statement.md`                         |
| Authoritative For | Domain Problems, Regulatory Bottlenecks, Inefficiency Analysis |
| Status            | `CONFIRMED`                                                    |
| Source            | PROJECT_PLAN.md §2.3, §3.6                                     |

---

## 1. Context: Indian Higher Technical Education

The All India Council for Technical Education (AICTE) regulates over 10,000 engineering, management, pharmacy, and polytechnic institutions across India, accounting for millions of student admissions annually.

Each institution is issued annual seat approvals that specify:

- Approved intake per programme (e.g. 120 seats in B.Tech Computer Science).
- Statutory reservation allocations (SC, ST, OBC-NCL, General-EWS).
- Supernumerary quotas (Tuition Fee Waiver - TFW, PMSSS / J&K, NRI, Lateral Entry).

---

## 2. Identified Bottlenecks & Regulatory Deficiencies

### A. Fragmented, Unverified Admission Declarations

Institutions manually declare admitted cohorts post-admission. Data submitted across disparate state counseling authorities, institutional ERPs, and AICTE portals often contains discrepancies, spelling variations, and inconsistent identifiers.

### B. Opaque Quota Compliance & Ghost Seats

Without cross-institutional deduplication:

- Students hold admissions across multiple institutions simultaneously during mop-up rounds.
- Over-admission beyond sanctioned intake occurs without real-time detection.
- Supernumerary seats (e.g. 5% TFW) are occasionally misclassified to mask general intake overflows.

### C. Manual Scrutiny Bottlenecks

AICTE regional offices face thousands of paper-heavy affidavits, compliance reports, and manual audit spreadsheets. Investigating an over-admission or quota violation takes months, often concluding after students have already completed several semesters.

### D. Lack of Cryptographic Verification for Students

Students graduating from technical institutions lack a single verifiable digital credential that proves their initial admission was within approved AICTE intake limits. This causes severe friction during higher education admissions abroad, public sector employment verification, and professional council registrations.

### E. Privacy Vulnerabilities

Legacy data collection processes frequently circulate unmasked student Aadhaar numbers, phone numbers, and caste certificates across unencrypted spreadsheets and unsecured portal interfaces, creating severe compliance liabilities under India's Digital Personal Data Protection (DPDP) Act 2023.
