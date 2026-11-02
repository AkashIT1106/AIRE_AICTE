# Domain Overview

| Metadata          | Value                                           |
| ----------------- | ----------------------------------------------- |
| Document          | `docs/04-domain/domain-overview.md`             |
| Authoritative For | Core Domain Concepts, Reconciliation Philosophy |
| Status            | `CONFIRMED`                                     |
| Source            | PROJECT_PLAN.md §20 to §34                      |

---

## 1. Core Domain Concepts

The AIRE domain centers on reconciling **Authoritative Regulatory Approvals** with **Actual Institutional Admissions**:

- **Approval Order (EOA / LOA):** The statutory mandate establishing the maximum permitted student intake per programme for an academic year, along with category reservation percentages.
- **Admission Record:** An individual student's reported enrollment into a specific programme and category.
- **Seat Entitlement:** The calculated legal quota breakdown (Sanctioned Intake + Supernumerary allocations).
- **Reconciliation Engine:** Deterministic rule engine that matches admissions against entitlements, detecting over-admissions, quota violations, and ghost enrollments.
- **Exception Case:** A formal legal grievance created when an admission cohort violates approved quotas, initiating a structured review workflow.
- **Admission Entitlement Proof (AEP):** A cryptographically signed digital credential certifying that a student's admission is compliant with AICTE approvals.
