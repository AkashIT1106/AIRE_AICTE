# AIRE Documentation Map & Agent Guide

| Metadata     | Value                                                                   |
| ------------ | ----------------------------------------------------------------------- |
| Document     | `docs/00-governance/documentation-map.md`                               |
| Status       | `APPROVED`                                                              |
| Last Updated | 2 November 2026                                                         |
| Audience     | Developers, System Architects, Quality Engineers, and Autonomous Agents |

---

## 1. Documentation Index

```text
docs/
├── README.md                                          # Documentation portal & quick start
├── 00-governance/
│   ├── documentation-map.md                          # This index and reading guide
│   ├── source-of-truth-policy.md                     # Authority hierarchy and change protocols
│   ├── requirements-traceability.md                  # Complete 243 requirement traceability matrix
│   └── decisions/
│       └── decision-register.md                      # Unified decision register (Architecture & UI/UX)
├── 01-product/
│   ├── product-overview.md                           # Vision, differentiators (AEP, Replay), success metrics
│   ├── problem-statement.md                          # Indian technical education context & bottlenecks
│   ├── goals-and-non-goals.md                        # Scope boundaries, non-goals, and AI constraints
│   ├── stakeholders-and-user-roles.md                # User personas, role matrix, and separation of duties
│   ├── scope-and-requirements.md                     # Summary of functional domains & requirement links
│   └── glossary.md                                   # Platform acronyms, domain vocabulary, definitions
├── 02-experience/
│   ├── experience-overview.md                        # Five workspace concepts & audit linkages
│   ├── user-journeys/README.md                       # Journey catalog linking to J-01..J-08
│   ├── screen-specifications/README.md               # Screen inventory linking to S-00..S-40
│   ├── information-architecture.md                   # Shell navigation, switcher, and workspace sitemaps
│   ├── interaction-contracts.md                      # Deterministic feedback, states, dual-auth modals
│   ├── design-foundations.md                         # Typography, color tokens, layout, density
│   ├── accessibility.md                              # WCAG 2.2 AA baseline, contrast, keyboard traps, GIGW
│   └── motion-and-feedback.md                        # Micro-interactions, toast notifications, reduced-motion
├── 03-architecture/
│   ├── system-context.md                             # C4 Level 1 context diagram & external boundaries
│   ├── architecture-overview.md                      # Modular monolith blueprint & architectural invariants
│   ├── module-boundaries.md                          # 15 core domain modules (M01..M15) & dependency rules
│   ├── technology-decisions.md                       # Approved stack (Node, React, Postgres, Redis, Python)
│   └── runtime-and-deployment.md                     # Docker Compose topology, environments, secrets
├── 04-domain/
│   ├── domain-overview.md                            # Admission reconciliation domain fundamentals
│   ├── domain-model.md                               # Aggregate roots, entity relationships, value objects
│   ├── business-rules/
│   │   ├── intake-and-quota-rules.md                 # Approved intake arithmetic, reservations, supernumerary
│   │   ├── reconciliation-rules.md                   # Multi-pass matching, mismatch taxonomy, AEP generation
│   │   └── policy-lifecycle-rules.md                 # Temporal policy packs, fixtures, activation rules
│   └── workflows/
│       ├── admission-submission-workflow.md          # DRAFT -> SEALED -> LOCKED submission lifecycle
│       └── exception-review-workflow.md              # Show Cause, evidence upload, hearing, dual sign-off
├── 05-security-privacy/
│   ├── security-overview.md                          # Defense-in-depth, threat modeling, least privilege
│   ├── authentication.md                             # Better Auth local baseline & decoupled SSO boundary
│   ├── authorization-and-tenant-isolation.md         # RBAC, ABAC, PostgreSQL forced RLS, DB roles
│   ├── privacy-by-design.md                          # Identity Vault, envelope encryption, pseudonymization
│   ├── data-classification-and-retention.md          # 4-tier data classification, retention, legal holds
│   ├── audit-logging.md                              # Immutable append-only audit trail & tamper evidence
│   └── compliance-and-regulatory-review.md           # DPDP Act 2023 compliance & human governance
├── 06-data/
│   ├── data-architecture.md                          # Authoritative PostgreSQL vs ephemeral Redis cache
│   ├── database-design.md                            # Entity groups, primary keys, indexes, migrations
│   ├── data-lifecycle.md                             # Ingestion -> Ledger -> Reconciliation -> Archive
│   └── data-quality-and-validation.md                # Ingestion pipeline (M06), row status, Zod validation
├── 07-api-integrations/
│   ├── api-overview.md                               # REST resource hierarchy, HTTP status codes, envelopes
│   ├── api-conventions.md                            # Headers, pagination, sorting, error schemas
│   ├── integration-overview.md                       # External adapters (APAAR, ABC, DigiLocker, AISHE)
│   └── openapi/README.md                             # Contract-first OpenAPI 3.1 specifications
├── 08-engineering/
│   ├── repository-structure.md                       # Monorepo directory structure & package map
│   ├── coding-standards.md                           # TypeScript strict mode, zero any, thin controllers
│   ├── testing-strategy.md                           # Unit, integration, RLS adversarial testing, CI gate
│   ├── error-handling-and-observability.md           # Pino structured logs, correlation IDs, Prometheus
│   └── development-workflow.md                       # Git protocol, committed migrations, prompt workflow
├── 09-delivery/
│   ├── implementation-roadmap.md                     # Phases 0..12 breakdown, goals, and dependencies
│   ├── milestones-and-exit-criteria.md               # Gate exit criteria, Definition of Done
│   ├── demo-scenario.md                              # End-to-end vertical slice demonstration script
│   └── known-gaps-and-risks.md                       # Technical debt repair, external risks, open questions
└── 10-reference/
    ├── source-materials.md                           # AICTE APH, APAAR guidelines, DPDP Act 2023
    ├── external-references.md                        # W3C VC, RFC 7519, RFC 9457, WCAG 2.2
    └── research-notes.md                             # Ecosystem research, gap analysis, comparative notes
```

---

## 2. Specialized External & Historical Documents

| File                                                                                               | Purpose                                                    | Authority Status                          |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------- |
| [`docs/SSO_PROVIDER_INTEGRATION_BOUNDARY.md`](../SSO_PROVIDER_INTEGRATION_BOUNDARY.md)             | Architectural guide for future decoupled SSO integrations. | Authoritative for future SSO adapters.    |
| [`docs/04-frontend/ui-ux-audit.md`](../04-frontend/ui-ux-audit.md)                                 | Stage 0 diagnostic audit of client code.                   | Diagnostic evidence snapshot.             |
| [`docs/04-frontend/journey-inventory.md`](../04-frontend/journey-inventory.md)                     | Inventory of user journeys J-01 through J-08.              | Diagnostic audit evidence.                |
| [`docs/04-frontend/screen-inventory.md`](../04-frontend/screen-inventory.md)                       | Inventory of screens S-00 through S-40.                    | Diagnostic audit evidence.                |
| [`docs/04-frontend/design-foundations-audit.md`](../04-frontend/design-foundations-audit.md)       | Audit of client styling and tokens.                        | Diagnostic audit evidence.                |
| [`docs/04-frontend/ui-ux-decisions.md`](../04-frontend/ui-ux-decisions.md)                         | Original UI/UX decisions log (D-001..D-008).               | Consolidated into decision register.      |
| [`prompts/phase-2-identity-access-security.md`](../../prompts/phase-2-identity-access-security.md) | Approved Phase 2 task execution prompt.                    | Active implementation task specification. |

---

## 3. Agent Reading Pathways by Task

Autonomous coding agents must load only documents relevant to their assigned scope:

### Pathway A: Frontend & UI Development

1. [`docs/00-governance/source-of-truth-policy.md`](source-of-truth-policy.md)
2. [`docs/02-experience/experience-overview.md`](../02-experience/experience-overview.md)
3. [`docs/02-experience/information-architecture.md`](../02-experience/information-architecture.md)
4. [`docs/02-experience/interaction-contracts.md`](../02-experience/interaction-contracts.md)
5. [`docs/02-experience/design-foundations.md`](../02-experience/design-foundations.md)
6. [`docs/02-experience/accessibility.md`](../02-experience/accessibility.md)
7. Audit reference: [`docs/04-frontend/screen-inventory.md`](../04-frontend/screen-inventory.md)

### Pathway B: Authentication, Authorization & Tenant Isolation

1. [`docs/05-security-privacy/authentication.md`](../05-security-privacy/authentication.md)
2. [`docs/05-security-privacy/authorization-and-tenant-isolation.md`](../05-security-privacy/authorization-and-tenant-isolation.md)
3. [`docs/SSO_PROVIDER_INTEGRATION_BOUNDARY.md`](../SSO_PROVIDER_INTEGRATION_BOUNDARY.md)
4. [`docs/00-governance/decisions/decision-register.md`](decisions/decision-register.md) (ADR-011, ADR-012)
5. [`docs/08-engineering/testing-strategy.md`](../08-engineering/testing-strategy.md) (§Adversarial RLS Testing)

### Pathway C: Ingestion Pipeline & Data Quality

1. [`docs/06-data/data-quality-and-validation.md`](../06-data/data-quality-and-validation.md)
2. [`docs/06-data/data-lifecycle.md`](../06-data/data-lifecycle.md)
3. [`docs/04-domain/workflows/admission-submission-workflow.md`](../04-domain/workflows/admission-submission-workflow.md)
4. [`docs/08-engineering/coding-standards.md`](../08-engineering/coding-standards.md) (BullMQ Idempotency)

### Pathway D: Reconciliation Engine & Mathematical Rules

1. [`docs/04-domain/business-rules/intake-and-quota-rules.md`](../04-domain/business-rules/intake-and-quota-rules.md)
2. [`docs/04-domain/business-rules/reconciliation-rules.md`](../04-domain/business-rules/reconciliation-rules.md)
3. [`docs/04-domain/business-rules/policy-lifecycle-rules.md`](../04-domain/business-rules/policy-lifecycle-rules.md)
4. [`docs/01-product/goals-and-non-goals.md`](../01-product/goals-and-non-goals.md) (Deterministic Invariants)

### Pathway E: External Adapter Integrations

1. [`docs/07-api-integrations/integration-overview.md`](../07-api-integrations/integration-overview.md)
2. [`docs/07-api-integrations/api-conventions.md`](../07-api-integrations/api-conventions.md)
3. [`docs/05-security-privacy/privacy-by-design.md`](../05-security-privacy/privacy-by-design.md) (Identity Vault boundary)
