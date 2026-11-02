# AIRE — Master Project Plan & Executive Baseline

**AICTE Admission Reconciliation & Evidence Platform**

| Document Metadata      | Value                                                     |
| ---------------------- | --------------------------------------------------------- |
| Document               | `PROJECT_PLAN.md`                                         |
| Project                | AIRE (AICTE Admission Reconciliation & Evidence Platform) |
| Project Type           | Regulatory admission reconciliation and evidence platform |
| Document Status        | **Executive Baseline & Historical Navigation Index**      |
| Original Version       | 1.0 (30 October 2026)                                     |
| Decomposition Date     | 2 November 2026                                           |
| Authoritative Location | [`docs/README.md`](docs/README.md)                        |

---

> [!IMPORTANT]
>
> ### Modular Documentation System Supersedes This Monolith
>
> In accordance with AIRE's engineering operating principles, the technical specifications, domain rules, security architecture, and delivery criteria previously concentrated in this document have been decomposed into a dedicated, modular documentation system under [`docs/`](docs/README.md).
>
> **This file (`PROJECT_PLAN.md`) is no longer the authoritative source of truth for ongoing implementation.** It is permanently retained as an executive baseline, historical reference snapshot, and high-level navigation index.
>
> **For all engineering, design, and regulatory specifications, consult the authoritative documents:**
>
> - **Documentation Portal:** [`docs/README.md`](docs/README.md)
> - **Documentation Map & Reading Guide:** [`docs/00-governance/documentation-map.md`](docs/00-governance/documentation-map.md)
> - **Source of Truth Policy:** [`docs/00-governance/source-of-truth-policy.md`](docs/00-governance/source-of-truth-policy.md)
> - **Requirements Traceability Matrix (243 Requirements):** [`docs/00-governance/requirements-traceability.md`](docs/00-governance/requirements-traceability.md)
> - **Central Decisions Register (Architecture & UI/UX):** [`docs/00-governance/decisions/decision-register.md`](docs/00-governance/decisions/decision-register.md)

---

## 1. Executive Summary

### 1.1 Product Vision & Core Mission

AIRE bridges the critical regulatory gap between approved institutional seat capacities (AICTE Extension of Approval - EOA / Letter of Approval - LOA) and actual student admissions reported by technical education institutions across India.

By establishing continuous, automated reconciliation, cryptographic entitlement verification, and transparent evidence-based exception governance, AIRE eliminates ghost enrollments, quota violations, and multi-month scrutiny delays while upholding student data privacy under India's Digital Personal Data Protection (DPDP) Act 2023.

### 1.2 Five Platform Differentiators

1. **Admission Entitlement Proof (AEP):** Cryptographically signed, W3C-compliant digital credentials with dynamic QR codes issued to students admitted within approved regulatory quotas.
2. **Regulatory Replay & Impact Analysis:** Versioned policy packs that allow AICTE regulators to re-evaluate historical cohorts against past or amended regulatory policies deterministically.
3. **Policy-Aware Identity Resolution:** Integration with the national 12-digit APAAR gateway using envelope encryption and zero-knowledge student tokens to protect student PII.
4. **Evidence-Based Exception Resolution:** Structured legal show-cause workflows, institutional evidence upload windows, and dual-authorization sign-off for non-compliant cohorts.
5. **Admission Lifecycle Chronology:** Append-only student lifecycle ledger tracking admission, branch change, lateral entry, and cancellation events.

### 1.3 Core Architectural Invariants

- **Modular Monolith:** Node.js Express backend with independently scalable BullMQ workers.
- **PostgreSQL is Authoritative:** Relational business store enforcing native Forced Row-Level Security (`Forced RLS`). Redis is strictly ephemeral for queue transport.
- **Deterministic Outcomes:** 100% of admission entitlement calculations and quota checks are performed by deterministic code. AI is strictly assistive and never makes regulatory verdicts.
- **Privacy by Design:** Raw student PII is isolated in an encrypted Identity Vault; operational queries reference pseudonymous student tokens.

---

## 2. Decomposed Section Navigation Index

Every section of the original project plan has been decomposed into its authoritative modular home:

| Original Plan Section | Section Title                              | Authoritative Modular Specification                                                                                                |
| --------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| **§0**                | Document Control and Usage                 | [`docs/00-governance/source-of-truth-policy.md`](docs/00-governance/source-of-truth-policy.md)                                     |
| **§1**                | Master Index                               | [`docs/00-governance/documentation-map.md`](docs/00-governance/documentation-map.md)                                               |
| **§2**                | Product Vision and Problem Definition      | [`docs/01-product/product-overview.md`](docs/01-product/product-overview.md)                                                       |
| **§3**                | Existing Ecosystem and Research            | [`docs/10-reference/research-notes.md`](docs/10-reference/research-notes.md)                                                       |
| **§4**                | Product Scope and Boundaries               | [`docs/01-product/goals-and-non-goals.md`](docs/01-product/goals-and-non-goals.md)                                                 |
| **§5**                | Stakeholders, Users and Authorization      | [`docs/01-product/stakeholders-and-user-roles.md`](docs/01-product/stakeholders-and-user-roles.md)                                 |
| **§6**                | Functional Requirements                    | [`docs/01-product/scope-and-requirements.md`](docs/01-product/scope-and-requirements.md)                                           |
| **§7**                | Non-Functional Requirements                | [`docs/05-security-privacy/security-overview.md`](docs/05-security-privacy/security-overview.md)                                   |
| **§8**                | System Architecture                        | [`docs/03-architecture/architecture-overview.md`](docs/03-architecture/architecture-overview.md)                                   |
| **§9**                | Technology Stack                           | [`docs/03-architecture/technology-decisions.md`](docs/03-architecture/technology-decisions.md)                                     |
| **§10**               | Application Architecture                   | [`docs/02-experience/experience-overview.md`](docs/02-experience/experience-overview.md)                                           |
| **§11**               | Backend Architecture                       | [`docs/08-engineering/coding-standards.md`](docs/08-engineering/coding-standards.md)                                               |
| **§12**               | Database Architecture                      | [`docs/06-data/data-architecture.md`](docs/06-data/data-architecture.md)                                                           |
| **§13**               | API Architecture                           | [`docs/07-api-integrations/api-overview.md`](docs/07-api-integrations/api-overview.md)                                             |
| **§14**               | Integration Architecture                   | [`docs/07-api-integrations/integration-overview.md`](docs/07-api-integrations/integration-overview.md)                             |
| **§15**               | Privacy by Design                          | [`docs/05-security-privacy/privacy-by-design.md`](docs/05-security-privacy/privacy-by-design.md)                                   |
| **§16**               | Authentication and Authorization           | [`docs/05-security-privacy/authentication.md`](docs/05-security-privacy/authentication.md)                                         |
| **§17**               | Database Security and Tenant Isolation     | [`docs/05-security-privacy/authorization-and-tenant-isolation.md`](docs/05-security-privacy/authorization-and-tenant-isolation.md) |
| **§18**               | Identity Vault and Sensitive Data          | [`docs/05-security-privacy/privacy-by-design.md`](docs/05-security-privacy/privacy-by-design.md)                                   |
| **§19**               | Audit, Governance and Retention            | [`docs/05-security-privacy/audit-logging.md`](docs/05-security-privacy/audit-logging.md)                                           |
| **§20**               | M01 — Identity, Auth & Access Management   | [`docs/05-security-privacy/authentication.md`](docs/05-security-privacy/authentication.md)                                         |
| **§21**               | M02 — Institution and Programme Registry   | [`docs/04-domain/domain-model.md`](docs/04-domain/domain-model.md)                                                                 |
| **§22**               | M03 — Approval & Seat Entitlement Registry | [`docs/04-domain/business-rules/intake-and-quota-rules.md`](docs/04-domain/business-rules/intake-and-quota-rules.md)               |
| **§23**               | M04 — Regulatory Policy & Rule Registry    | [`docs/04-domain/business-rules/policy-lifecycle-rules.md`](docs/04-domain/business-rules/policy-lifecycle-rules.md)               |
| **§24**               | M05 — Institution Onboarding & Submission  | [`docs/04-domain/workflows/admission-submission-workflow.md`](docs/04-domain/workflows/admission-submission-workflow.md)           |
| **§25**               | M06 — Data Ingestion & Normalisation       | [`docs/06-data/data-quality-and-validation.md`](docs/06-data/data-quality-and-validation.md)                                       |
| **§26**               | M07 — APAAR Identity Verification Gateway  | [`docs/07-api-integrations/integration-overview.md`](docs/07-api-integrations/integration-overview.md)                             |
| **§27**               | M08 — Admission Lifecycle & Record Ledger  | [`docs/06-data/data-lifecycle.md`](docs/06-data/data-lifecycle.md)                                                                 |
| **§28**               | M09 — Admission Entitlement Engine         | [`docs/04-domain/business-rules/intake-and-quota-rules.md`](docs/04-domain/business-rules/intake-and-quota-rules.md)               |
| **§29**               | M10 — Cohort Reconciliation Engine         | [`docs/04-domain/business-rules/reconciliation-rules.md`](docs/04-domain/business-rules/reconciliation-rules.md)                   |
| **§30**               | M11 — Exception & Human Review Workbench   | [`docs/04-domain/workflows/exception-review-workflow.md`](docs/04-domain/workflows/exception-review-workflow.md)                   |
| **§31**               | M12 — Verifiable Records & AEP Issuance    | [`docs/04-domain/business-rules/reconciliation-rules.md`](docs/04-domain/business-rules/reconciliation-rules.md)                   |
| **§32**               | M13 — Dashboards, Reports and Analytics    | [`docs/01-product/scope-and-requirements.md`](docs/01-product/scope-and-requirements.md)                                           |
| **§33**               | M14 — Integration Hub                      | [`docs/07-api-integrations/integration-overview.md`](docs/07-api-integrations/integration-overview.md)                             |
| **§34**               | M15 — Privacy, Security and Governance     | [`docs/05-security-privacy/privacy-by-design.md`](docs/05-security-privacy/privacy-by-design.md)                                   |
| **§35**               | Repository & Documentation Structure       | [`docs/08-engineering/repository-structure.md`](docs/08-engineering/repository-structure.md)                                       |
| **§36**               | Development Standards                      | [`docs/08-engineering/coding-standards.md`](docs/08-engineering/coding-standards.md)                                               |
| **§37**               | Testing and Quality Assurance              | [`docs/08-engineering/testing-strategy.md`](docs/08-engineering/testing-strategy.md)                                               |
| **§38**               | DevOps and Deployment                      | [`docs/03-architecture/runtime-and-deployment.md`](docs/03-architecture/runtime-and-deployment.md)                                 |
| **§39**               | Observability and Operations               | [`docs/08-engineering/error-handling-and-observability.md`](docs/08-engineering/error-handling-and-observability.md)               |
| **§40**               | Implementation Roadmap (Phases 0–12)       | [`docs/09-delivery/implementation-roadmap.md`](docs/09-delivery/implementation-roadmap.md)                                         |
| **§41**               | First End-to-End Vertical Slice            | [`docs/09-delivery/demo-scenario.md`](docs/09-delivery/demo-scenario.md)                                                           |
| **§42**               | Project-Wide Acceptance Criteria           | [`docs/09-delivery/milestones-and-exit-criteria.md`](docs/09-delivery/milestones-and-exit-criteria.md)                             |
| **§43**               | Risks, Dependencies and Mitigations        | [`docs/09-delivery/known-gaps-and-risks.md`](docs/09-delivery/known-gaps-and-risks.md)                                             |
| **§44**               | Research and Reference Index               | [`docs/10-reference/source-materials.md`](docs/10-reference/source-materials.md)                                                   |
| **§45**               | Architectural Decisions to Lock            | [`docs/00-governance/decisions/decision-register.md`](docs/00-governance/decisions/decision-register.md)                           |
| **§46**               | Implementation Priority Matrix             | [`docs/09-delivery/implementation-roadmap.md`](docs/09-delivery/implementation-roadmap.md)                                         |
| **§47**               | Definition of Done                         | [`docs/09-delivery/milestones-and-exit-criteria.md`](docs/09-delivery/milestones-and-exit-criteria.md)                             |
| **§48**               | Immediate Execution Plan                   | [`prompts/phase-2-identity-access-security.md`](prompts/phase-2-identity-access-security.md)                                       |

---

## 3. Final Engineering Principle

**AIRE is an evidence-driven, privacy-preserving regulatory platform.** Protect correctness, traceability, privacy, authorization, and accountability. Build the smallest complete, testable, securely isolated workflow first; expand only when its acceptance criteria are demonstrated.
