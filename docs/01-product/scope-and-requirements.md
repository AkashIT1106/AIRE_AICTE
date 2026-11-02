# Scope and Functional Requirements Summary

| Metadata              | Value                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| Document              | `docs/01-product/scope-and-requirements.md`                                                        |
| Authoritative For     | Functional Requirements Overview & Domain Navigation                                               |
| Status                | `CONFIRMED`                                                                                        |
| Source                | PROJECT_PLAN.md §6.1 to §6.8                                                                       |
| Detailed Traceability | [`docs/00-governance/requirements-traceability.md`](../00-governance/requirements-traceability.md) |

---

## 1. Functional Requirement Domains

The platform's functional scope is divided into 8 core domains covering 55 baseline requirements ([`AIRE-REQ-001`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-055`](../00-governance/requirements-traceability.md)):

### Domain 1: Institution Management (`AIRE-REQ-001` – `AIRE-REQ-006`)

- Authoritative institution onboarding, campus mapping, and affiliation management.
- Multi-user membership management with role assignment and status verification.
- Enforced cross-institution access isolation.
- _Detailed specification:_ [`docs/04-domain/domain-model.md`](../04-domain/domain-model.md).

### Domain 2: Approval Management (`AIRE-REQ-007` – `AIRE-REQ-013`)

- Digital ingestion and versioning of AICTE Extension of Approval (EOA) and LOA orders.
- Effective date tracking, amendment handling, and superseding order history.
- Flagging missing, conflicting, or unverified approval orders.
- _Detailed specification:_ [`docs/04-domain/business-rules/intake-and-quota-rules.md`](../04-domain/business-rules/intake-and-quota-rules.md).

### Domain 3: Policy Management (`AIRE-REQ-014` – `AIRE-REQ-020`)

- Policy packs versioned by academic cycle.
- Required evidence definitions and executable test fixtures.
- Dual-authorization activation workflow and immutable historical archive.
- _Detailed specification:_ [`docs/04-domain/business-rules/policy-lifecycle-rules.md`](../04-domain/business-rules/policy-lifecycle-rules.md).

### Domain 4: Admission Management (`AIRE-REQ-021` – `AIRE-REQ-026`)

- Batch ingestion of student admissions with asynchronous validation and cleaning.
- Admission event ledger tracking student transitions chronologically.
- Submission freeze enforcement and tamper-evident sealing.
- _Detailed specification:_ [`docs/04-domain/workflows/admission-submission-workflow.md`](../04-domain/workflows/admission-submission-workflow.md).

### Domain 5: Identity Verification (`AIRE-REQ-027` – `AIRE-REQ-032`)

- Multi-mode adapter architecture (Live, Sandbox, Mock) for national APAAR gateway.
- Preservation of verification statuses and cryptographically protected verification tokens.
- Resilient retry handling and failure isolation.
- _Detailed specification:_ [`docs/07-api-integrations/integration-overview.md`](../07-api-integrations/integration-overview.md).

### Domain 6: Reconciliation (`AIRE-REQ-033` – `AIRE-REQ-040`)

- Deterministic multi-pass reconciliation of admitted cohorts against approved quotas.
- Structured mismatch taxonomy (over-intake, reservation breaches, ghost seats).
- AEP generation, tamper checks, and historical regulatory replay.
- _Detailed specification:_ [`docs/04-domain/business-rules/reconciliation-rules.md`](../04-domain/business-rules/reconciliation-rules.md).

### Domain 7: Exception Management (`AIRE-REQ-041` – `AIRE-REQ-047`)

- Formal Show Cause Notice issuance, institutional evidence upload window.
- Reviewer note preservation, hearing logs, and dual-authorization closure.
- _Detailed specification:_ [`docs/04-domain/workflows/exception-review-workflow.md`](../04-domain/workflows/exception-review-workflow.md).

### Domain 8: Reporting & Dashboards (`AIRE-REQ-048` – `AIRE-REQ-055`)

- Role-scoped dashboards for Institutions, AICTE, Students, and Auditors.
- Server-side aggregation, pagination, field masking, and purpose-bound audited exports.
- Zero unrestricted student personal data downloads.
- _Detailed specification:_ [`docs/02-experience/information-architecture.md`](../02-experience/information-architecture.md).
