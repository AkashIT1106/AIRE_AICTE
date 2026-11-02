# Goals and Non-Goals

| Metadata             | Value                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/01-product/goals-and-non-goals.md`                                                                                           |
| Authoritative For    | Product Scope, Boundaries, AI Limits                                                                                               |
| Status               | `CONFIRMED`                                                                                                                        |
| Source               | PROJECT_PLAN.md §4.1, §4.2, §4.3                                                                                                   |
| Related Requirements | [`AIRE-REQ-070`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-073`](../00-governance/requirements-traceability.md) |

---

## 1. In Scope

AIRE explicitly delivers the following core capabilities:

- **Institution & Programme Registry:** Authoritative mapping of AICTE-approved institutions, campuses, affiliated programmes, and approved intake capacities.
- **Batch Admission Ingestion:** High-speed parsing, schema validation, and normalisation of student admission records from standard CSV/XLSX exports.
- **APAAR Gateway Integration:** Verification of 12-digit student APAAR identifiers via an adapter architecture (Live, Sandbox, Mock).
- **Intake & Quota Entitlement Engine:** Deterministic arithmetic verification of approved intake vs actual admissions, statutory reservations, and supernumerary caps.
- **Cross-Institution Duplicate Detection:** Identifying dual-enrollment conflicts using pseudonymized student tokens.
- **Exception Review Workbench:** Complete human-in-the-loop workflow for notice issuance, evidence submission, hearing logs, and dual-authorization closure.
- **Admission Entitlement Proof (AEP):** Generation of cryptographically verifiable student admission records with tamper-evident QR codes.
- **Immutable Audit Trail:** Append-only cryptographic audit logging of all modifying actions and security events.

---

## 2. Out of Scope (Non-Goals)

AIRE explicitly **does not** perform or replace the following:

- **Not an Admission Counseling Portal:** AIRE does not handle student seat applications, entrance exam rankings, counseling rounds, or fee payments.
- **Not an ERP Replacement:** AIRE does not manage timetables, student attendance, semester grades, faculty payroll, or LMS functions.
- **Not a National ID Authority:** AIRE does not issue APAAR IDs, Aadhaar numbers, or DigiLocker accounts. It integrates with existing authorities as a relying party.
- **Not an Automated Rejection Engine:** AIRE never executes autonomous, unilateral rejections of student admissions or institutional accreditations without authorized human review.
- **Not an Autonomous Legal Authority:** AIRE does not write or modify regulatory policies. Authorized humans govern regulatory rules.

---

## 3. Strict AI Boundaries

To preserve regulatory integrity and constitutional due process:

```
+-----------------------------------+-----------------------------------+
| Permitted AI Assistance           | Strictly Prohibited AI Actions    |
+-----------------------------------+-----------------------------------+
| - Document OCR & text extraction  | - Establishing regulatory policy  |
| - Header & column mapping         | - Making final admission verdicts |
| - Demographic fuzzy matching      | - Declaring fraud or penalties    |
| - Reviewer explanation summaries  | - Modifying approved intake counts|
| - Anomaly cluster detection       | - Autonomous exception closure    |
+-----------------------------------+-----------------------------------+
```

> [!IMPORTANT]
> **Deterministic code calculates regulatory outcomes. Authorized humans govern policy and final decisions.**
