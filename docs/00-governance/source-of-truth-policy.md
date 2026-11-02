# Source of Truth Policy

| Metadata     | Value                                                       |
| ------------ | ----------------------------------------------------------- |
| Document     | `docs/00-governance/source-of-truth-policy.md`              |
| Status       | `APPROVED`                                                  |
| Last Updated | 2 November 2026                                             |
| Audience     | All Contributors, System Architects, and Engineering Agents |

---

## 1. Purpose

This document establishes the authority hierarchy, ownership boundaries, and change management procedures for AIRE. It ensures that requirements, architectural constraints, and regulatory rules have exactly one authoritative home, preventing conflicting interpretations and unverified assumptions.

---

## 2. Source of Truth Hierarchy

When sources conflict or requirements diverge, contributors and autonomous agents must follow this strict priority order:

1. **Current Explicit User Instruction:** Specific instructions provided directly by the project owner for the current task, unless technically unsafe or contrary to core project boundaries.
2. **Source of Truth Policy (`docs/00-governance/source-of-truth-policy.md`):** This governance baseline defining authority, boundaries, and change protocols.
3. **Authoritative Domain Specifications (`docs/`):** The modular documents dedicated to specific technical or product areas.
4. **Approved Task Prompts (`prompts/`):** Approved task plans documenting scoped objectives, verified code, and acceptance criteria.
5. **Decisions Register (`docs/00-governance/decisions/decision-register.md`):** Formally recorded architectural and product decisions.
6. **Existing Code & Repository Conventions:** Working implementation patterns, configuration files, and automated tests.
7. **Official Version-Matched Documentation:** Vendor documentation matching installed runtime versions (e.g. Node 20, PostgreSQL 16, Prisma, Better Auth, React 18).
8. **Engineering Judgment:** Informed technical deduction adhering to least privilege, determinism, and safety.

---

## 3. Subject Authority Matrix

Every project topic is assigned exactly one primary authoritative document. All other references must link to this document rather than re-defining requirements.

| Subject Area                     | Authoritative Document                                                                                                           | Derived / Related References                                     |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Product Vision, Problem, Success | [`docs/01-product/product-overview.md`](../01-product/product-overview.md)                                                       | `README.md`, `PROJECT_PLAN.md`                                   |
| Scope Boundaries & In/Out Scope  | [`docs/01-product/goals-and-non-goals.md`](../01-product/goals-and-non-goals.md)                                                 | `AGENTS.md`, `prompts/`                                          |
| User Personas, Roles & Duties    | [`docs/01-product/stakeholders-and-user-roles.md`](../01-product/stakeholders-and-user-roles.md)                                 | `docs/05-security-privacy/authorization-and-tenant-isolation.md` |
| Functional Requirements Summary  | [`docs/01-product/scope-and-requirements.md`](../01-product/scope-and-requirements.md)                                           | `docs/00-governance/requirements-traceability.md`                |
| Information Architecture & Shell | [`docs/02-experience/information-architecture.md`](../02-experience/information-architecture.md)                                 | `docs/04-frontend/screen-inventory.md`                           |
| Design Tokens & UI Foundations   | [`docs/02-experience/design-foundations.md`](../02-experience/design-foundations.md)                                             | `docs/04-frontend/design-foundations-audit.md`                   |
| Accessibility Standards          | [`docs/02-experience/accessibility.md`](../02-experience/accessibility.md)                                                       | `docs/02-experience/interaction-contracts.md`                    |
| System Boundaries & Topology     | [`docs/03-architecture/architecture-overview.md`](../03-architecture/architecture-overview.md)                                   | `docs/03-architecture/system-context.md`                         |
| Module Boundaries & Coupling     | [`docs/03-architecture/module-boundaries.md`](../03-architecture/module-boundaries.md)                                           | `packages/`, `server/src/modules/`                               |
| Approved Technology Choices      | [`docs/03-architecture/technology-decisions.md`](../03-architecture/technology-decisions.md)                                     | `package.json`, `pnpm-workspace.yaml`                            |
| Intake & Quota Arithmetic        | [`docs/04-domain/business-rules/intake-and-quota-rules.md`](../04-domain/business-rules/intake-and-quota-rules.md)               | `packages/reconciliation/`                                       |
| Reconciliation Rules & AEP       | [`docs/04-domain/business-rules/reconciliation-rules.md`](../04-domain/business-rules/reconciliation-rules.md)                   | `docs/04-domain/workflows/exception-review-workflow.md`          |
| Policy Packs & Temporal Rules    | [`docs/04-domain/business-rules/policy-lifecycle-rules.md`](../04-domain/business-rules/policy-lifecycle-rules.md)               | `packages/policy-engine/`                                        |
| Submission & Freeze Lifecycles   | [`docs/04-domain/workflows/admission-submission-workflow.md`](../04-domain/workflows/admission-submission-workflow.md)           | `docs/06-data/data-lifecycle.md`                                 |
| Authentication & Credentials     | [`docs/05-security-privacy/authentication.md`](../05-security-privacy/authentication.md)                                         | `docs/SSO_PROVIDER_INTEGRATION_BOUNDARY.md`                      |
| Authorization, RLS & DB Roles    | [`docs/05-security-privacy/authorization-and-tenant-isolation.md`](../05-security-privacy/authorization-and-tenant-isolation.md) | `server/src/middleware/auth.ts`, `server/prisma/`                |
| Identity Vault & Encryption      | [`docs/05-security-privacy/privacy-by-design.md`](../05-security-privacy/privacy-by-design.md)                                   | `docs/05-security-privacy/data-classification-and-retention.md`  |
| Audit Trail Integrity            | [`docs/05-security-privacy/audit-logging.md`](../05-security-privacy/audit-logging.md)                                           | `server/src/lib/audit.ts`                                        |
| Database Schema & Migrations     | [`docs/06-data/database-design.md`](../06-data/database-design.md)                                                               | `server/prisma/schema.prisma`                                    |
| Ingestion & Schema Validation    | [`docs/06-data/data-quality-and-validation.md`](../06-data/data-quality-and-validation.md)                                       | `packages/validation/`                                           |
| API Contracts & Envelopes        | [`docs/07-api-integrations/api-conventions.md`](../07-api-integrations/api-conventions.md)                                       | `docs/07-api-integrations/api-overview.md`                       |
| External Integration Adapters    | [`docs/07-api-integrations/integration-overview.md`](../07-api-integrations/integration-overview.md)                             | `services/`                                                      |
| Coding Standards & TypeScript    | [`docs/08-engineering/coding-standards.md`](../08-engineering/coding-standards.md)                                               | `tsconfig.base.json`, `oxlint.json`                              |
| Testing Strategy & Gate          | [`docs/08-engineering/testing-strategy.md`](../08-engineering/testing-strategy.md)                                               | `tests/`, vitest configs                                         |
| Delivery Roadmap & Exit Gates    | [`docs/09-delivery/milestones-and-exit-criteria.md`](../09-delivery/milestones-and-exit-criteria.md)                             | `docs/09-delivery/implementation-roadmap.md`                     |
| Formal Decision Records          | [`docs/00-governance/decisions/decision-register.md`](decisions/decision-register.md)                                            | All ADRs and UI/UX decisions                                     |

---

## 4. De-Authorization of Legacy Monolith

The legacy `PROJECT_PLAN.md` served as the initial unified proposal. With the completion of modular decomposition:

1. `PROJECT_PLAN.md` is preserved as an executive summary and historical baseline.
2. `PROJECT_PLAN.md` **is no longer the authoritative source of truth** for ongoing code implementation.
3. In any conflict between `PROJECT_PLAN.md` and a modular document in `docs/`, the modular document prevails.

---

## 5. Handling Audit Documents & Proposals

The audit reports located under `docs/04-frontend/` (`ui-ux-audit.md`, `journey-inventory.md`, `screen-inventory.md`, `design-foundations-audit.md`, `ui-ux-decisions.md`) represent **historical diagnostic evidence** as of 2 November 2026.

- Audit findings are factual records of what was inspected in the codebase at Phase 1.
- Audit recommendations (such as installing shadcn/ui or TanStack Table) are **proposals**, not approved requirements.
- An audit proposal does not become binding until formally approved in [`docs/00-governance/decisions/decision-register.md`](decisions/decision-register.md).

---

## 6. Rules for Modifying Requirements & Decisions

1. **No Silent Rewrites:** Never alter the meaning, strength, or scope of a requirement without explicit approval.
2. **Explicit Uncertainty:** Any requirement or technical direction lacking definitive source evidence must be marked `OPEN`, `TBD`, or `NEEDS VERIFICATION`.
3. **No Unrequested Features:** Never introduce unrequested features, libraries, or architectural layers, even if they appear beneficial.
4. **Link, Do Not Duplicate:** When another document requires context from a different domain, provide a relative markdown link. Do not copy-paste sections.
5. **Evidence-Based Verification:** Never mark a feature, check, or requirement as `IMPLEMENTED` or `VERIFIED` without verifiable code, executed test runs, or migrations. Placeholder components and mocked API routes are strictly classified as `PLACEHOLDER` or `PARTIAL`.
