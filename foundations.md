# AIRE --- Development Foundations

**Project:** AICTE Admission Reconciliation & Evidence Platform\
**Architecture:** Modular Monolith\
**Development Model:** Parallel, module-based vertical development\
**Execution Model:** Phase-wise implementation with mandatory human
approval gates

## 1. Purpose

This document establishes the shared engineering foundation and
execution strategy for AIRE. It is the common reference for Developer A,
Developer B, and coding agents working on the repository.

**Core principle: A module is a complete functional responsibility, not
a frontend or backend task.**

Each developer owns the complete implementation of assigned modules:
frontend, backend, domain logic, database models and migrations,
validation, authorization integration, audit integration, tests, and
documentation.

## 2. Product identity

AIRE is an evidence-driven regulatory admission reconciliation platform
intended to connect AICTE-approved institutional intake and
entitlements, institution-reported student admissions, applicable
regulatory policies, admission lifecycle events, authorised identity
verification evidence, and human-reviewed exceptions and decisions.

### Architectural invariants

1.  Modular monolith with independently scalable background workers
    where required.
2.  PostgreSQL is the authoritative relational business store.
3.  PostgreSQL Forced Row-Level Security protects tenant-owned data.
4.  Redis is ephemeral queue infrastructure, not the authoritative
    business database.
5.  Admission entitlement calculations and regulatory quota checks are
    deterministic.
6.  AI is assistive and cannot independently issue regulatory verdicts.
7.  Raw student PII is isolated in an encrypted Identity Vault.
8.  Operational queries use pseudonymous student references wherever
    possible.
9.  Sensitive actions are authorised, purpose-bound and auditable.
10. Historical evaluations and admission events remain traceable.

## 3. Documentation hierarchy

---

Document/location Purpose

---

`docs/README.md` Documentation portal

`docs/00-governance/documentation-map.md` Documentation navigation

`docs/00-governance/source-of-truth-policy.md` Source-of-truth rules

`docs/00-governance/requirements-traceability.md` Requirements traceability

`docs/00-governance/decisions/decision-register.md` Architecture and UX decisions

`docs/01-product/` Product requirements and scope

`docs/02-experience/` UX and experience specifications

`docs/03-architecture/` Architecture and technology
decisions

`docs/04-domain/` Domain models, rules and workflows

`docs/05-security-privacy/` Security and privacy specifications

`docs/06-data/` Data architecture and lifecycle

`docs/07-api-integrations/` API and integration contracts

`docs/08-engineering/` Coding standards, testing and
repository rules

`docs/09-delivery/` Roadmap, milestones and acceptance
criteria

`docs/10-reference/` Research and source references
-----------------------------------------------------------------------------------------

The modular documents under `docs/` are authoritative for ongoing
implementation. `PROJECT_PLAN.md` is an executive baseline and
historical reference. Do not silently replace a modular specification
with an assumption. If documentation conflicts, stop the affected work
and raise the conflict. Record approved changes in the relevant
specification and decision register.

## 4. Architecture

AIRE uses a **Modular Monolith**: one cohesive backend application with
strongly separated functional modules. Background workers may be
independently scaled where required. Do not introduce microservices
unless an architecture decision explicitly approves them.

### Technology baseline

Layer Technology

---

Frontend React + TypeScript
Backend Node.js + Express + TypeScript
Database PostgreSQL
ORM Prisma
Background processing Redis + BullMQ
Optional document AI service Python + FastAPI
Deployment Docker-based infrastructure

Do not replace frameworks, databases or major libraries without checking
the technology decisions and obtaining approval.

### Module structure

Follow the actual repository structure and
`docs/08-engineering/repository-structure.md`. A conceptual module may
contain frontend pages/components/hooks, backend
routes/controllers/services/validators, domain entities/rules/types,
persistence repositories/queries, tests and a module README. Do not
create duplicate structures if the repository already has an established
convention.

## 5. Functional module catalogue

---

Module Name Primary responsibility

---

M01 Identity, Authentication, users,
Authentication and roles, permissions,
Access Management memberships, scopes and
sessions

M02 Institution and Institutions, campuses,
Programme Registry programmes, aliases and
canonical references

M03 Approval and Seat Approval orders,
Entitlement Registry amendments, effective
periods and
programme-level
entitlements

M04 Regulatory Policy and Versioned policies, rule
Rule Registry schemas, applicability,
review and activation

M05 Institution Onboarding Institution onboarding,
and Admission assignments, secure
Submission submissions and upload
workflows

M06 Data Ingestion and File parsing, mapping,
Normalisation validation, quarantine
and batch processing

M07 APAAR Identity Provider-adapter-based
Verification Gateway identity verification
and verification status

M08 Admission Lifecycle and Append-only admission
Record Ledger events, corrections,
withdrawals and
cancellations

M09 Admission Entitlement Deterministic
Engine admission-level approval
and policy evaluation

M10 Cohort Reconciliation Cohort-level
Engine reconciliation,
findings, snapshots and
historical replay

M11 Exception and Human Exceptions, reviewer
Review Workbench assignments, evidence,
institutional responses
and decisions

M12 Verifiable Student Verifiable records and
Records and AEP Admission Entitlement
Issuance Proof artefacts

M13 Dashboards, Reports and Role-specific
Analytics dashboards, privacy-safe
reporting and controlled
exports

M14 Integration Hub External-system
adapters, API contracts,
retries and integration
monitoring

M15 Privacy, Security and Cross-cutting privacy,
Governance security, audit,
retention and governance
controls
------------------------------------------------------------------------

## 6. Proposed developer ownership

This is a proposed working allocation. Confirm it with the team before
implementation; the module catalogue and roadmap do not by themselves
prescribe developer ownership.

### Developer A --- Institutional data and admission lifecycle

- M02 --- Institution and Programme Registry
- M03 --- Approval and Seat Entitlement Registry
- M05 --- Institution Onboarding and Admission Submission
- M06 --- Data Ingestion and Normalisation
- M08 --- Admission Lifecycle and Record Ledger
- M12 --- Verifiable Student Records and AEP Issuance

### Developer B --- Regulatory evaluation and review

- M04 --- Regulatory Policy and Rule Registry
- M07 --- APAAR Identity Verification Gateway
- M09 --- Admission Entitlement Engine
- M10 --- Cohort Reconciliation Engine
- M11 --- Exception and Human Review Workbench
- M13 --- Dashboards, Reports and Analytics
- M14 --- Integration Hub

### Shared ownership

- M01 --- Identity, Authentication and Access Management
- M15 --- Privacy, Security and Governance
- Repository foundation, shared contracts, database conventions,
  CI/CD, deployment and integration testing.

### Ownership rules

1.  The assigned developer owns the complete vertical implementation of
    a module.
2.  A module is not complete if only its frontend or backend is
    implemented.
3.  Module owners coordinate contracts with dependent module owners.
4.  Developers do not change another module's internals without
    agreement.
5.  Shared modules have an explicitly agreed task owner.
6.  Module ownership does not override architecture, security or domain
    specifications.
7.  Ownership changes require team approval.

## 7. Module interaction and dependency principles

Modules communicate through defined interfaces and contracts. Do not
directly access another module's internal repositories, database
implementation details or private services.

Use explicit service interfaces, versioned API contracts, shared domain
types where appropriate, domain events where appropriate, documented
integration points and controlled transaction boundaries.

Key relationships:

- M01 provides authentication and authorization capabilities.
- M02 provides canonical institution, campus and programme references.
- M03 provides approval and entitlement information.
- M04 provides applicable regulatory policy versions and rules.
- M05 and M06 handle submission and ingestion.
- M07 provides identity verification outcomes.
- M08 preserves admission lifecycle chronology.
- M09 evaluates individual admission entitlement.
- M10 performs cohort reconciliation and replay.
- M11 manages human review and exception resolution.
- M12 produces verifiable record and AEP artefacts.
- M13 presents authorised reporting.
- M14 provides external integration capabilities.
- M15 provides cross-cutting security, privacy and governance
  requirements.

The actual dependency graph and interface details must follow the
modular specifications and approved architecture.

## 8. Phase-wise execution roadmap

Follow the approved Phase 0--12 roadmap.

### Phase 0 --- Research and Requirements Validation

Verify the problem statement, map existing systems, research AICTE
approval data and applicable rules, identify API access limitations,
define assumptions and data flows, identify legal/privacy dependencies,
and document open questions.

**Deliverables:** product vision, requirements baseline, ecosystem
research, initial threat model, open-question register and scope
baseline.

### Phase 1 --- Engineering Foundation

Establish the monorepo/workspaces, React and Express applications,
PostgreSQL and Prisma, Redis, Docker Compose, logging, error handling,
CI, initial schema and test infrastructure.

**Deliverables:** reproducible local environment, successful build,
database connectivity, CI checks and initial tests.

### Phase 2 --- Identity, Access and Security Foundation

Implement OIDC integration, user management, roles and permissions,
memberships, scope assignments, central authorization, secure
transaction wrapper, PostgreSQL RLS, Identity Vault foundation, audit
foundation and security tests.

**Deliverables:** role-based authentication, scope-aware authorization,
verified tenant isolation, RLS tests, session revocation and security
event logging.

**Gate:** no institution-sensitive module proceeds to production-quality
implementation without this foundation.

### Phase 3 --- Institution, Programme and Approval Registry

Implement institution, campus and programme registries, canonical
mapping, approval import/versioning, entitlement registry and
provenance.

**Deliverables:** representative institution, campus, programme,
academic year, approval order and amendment.

### Phase 4 --- Regulatory Policy Registry

Implement policy source registry, policy packs, rule schemas,
allowlisted handlers, applicability dates, rule fixtures, review and
activation workflows.

**Deliverables:** two or three confirmed rules, fixtures, versioned
policy pack and reproducible rule evaluation.

### Phase 5 --- Institution Submission and Ingestion

Implement onboarding, user assignments, upload workflow, CSV/XLSX
parsing, schema validation, canonical mapping, row validation,
quarantine, background processing and batch reports.

**Deliverables:** secure upload, 100--300 synthetic admissions,
validation summary and idempotent processing.

### Phase 6 --- Identity Gateway and Admission Ledger

Implement mock identity provider, identity verification workflow,
Identity Vault, admission ledger/events, corrections,
withdrawal/cancellation and event projection.

**Deliverables:** protected identity workflow, versioned admission
history and correct event transitions.

### Phase 7 --- Entitlement and Reconciliation Engines

Implement approval and policy resolvers, deterministic rule engine,
admission evaluation, AEP generation, cohort reconciliation, historical
snapshots and replay.

**Deliverables:** reproducible admission evaluations, cohort
reconciliation, evidence-backed findings and historical replay.

### Phase 8 --- Exception Workbench

Implement exception generation, reviewer assignment, institution
responses, evidence attachment, reviewer notes, review decisions, state
transitions and audit history.

**Deliverables:** complete institutional response and authorised
reviewer workflows with reproducible decision history.

### Phase 9 --- Reporting and Verification

Implement institution and AICTE dashboards, student access workflow,
external verification workflow, controlled exports, aggregate reporting
and evidence references.

**Deliverables:** role-specific dashboards, privacy-safe reporting and
authorised verification.

### Phase 10 --- Integration Expansion

Validate provider access, obtain authorised sandbox credentials,
implement provider adapters, validate API contracts, implement
retries/monitoring, test provider failures and document production
readiness.

**Deliverables:** tested authorised integrations where access exists;
clearly labelled mocks where it does not; integration readiness report.

### Phase 11 --- Security and Privacy Hardening

Perform threat-model review, authorization/RLS/cross-tenant tests,
Identity Vault testing, retention validation, privacy workflows,
penetration testing, accessibility, performance and backup restoration.

**Deliverables:** security and privacy reports, RLS verification and
production-readiness assessment.

### Phase 12 --- Demonstration and Delivery

Seed synthetic data, create demonstration accounts, prepare end-to-end
workflows, demonstrate reconciliation, exceptions, replay and access
restrictions, and prepare architecture/technical documentation.

**Deliverables:** working end-to-end product, technical documentation,
demonstration environment, evaluation evidence and known-limitations
register.

## 9. Phase-to-module coordination matrix

This is a proposed task allocation, not a replacement for the approved
module dependencies.

---

Phase Developer A Developer B Shared

---

0 Research Research rules, Requirements and
institutional data identity and scope
and workflows integrations

1 Module-ready Module-ready Repository, DB, CI
frontend/backend backend/worker and testing
conventions conventions

2 Integrate modules Integrate modules M01 and M15
with IAM contracts with IAM foundation
contracts

3 M02 and M03 Review Shared contracts
policy/engine  
dependencies

4 Approval data M04 Policy-to-approval
compatibility contract

5 M05 and M06 Ingestion End-to-end upload
integration  
support

6 M08 M07 Identity/admission
event contracts

7 Provide registry, M09 and M10 End-to-end
submission and evaluation
ledger integration

8 Institution-facing M11 Exception workflow
response integration

9 M12 M13 and Role-specific E2E
verification tests
integration

10 Assigned data M14 and provider Integration
integration support adapters validation

11 Security testing for Security testing M15 and system-wide
assigned modules for assigned audit
modules

12 Demonstrate assigned Demonstrate Complete
workflows assigned demonstration
workflows
-----------------------------------------------------------------------------

## 10. Vertical-slice development strategy

Do not complete all modules independently and integrate everything at
the end. Build small, complete, testable workflows across the required
modules.

The first end-to-end slice should cover:

1.  Institution user login.
2.  Authorization and scope check.
3.  Secure admission upload.
4.  Validation and normalisation.
5.  Admission ledger.
6.  Mock identity verification.
7.  Approval and policy resolution.
8.  Admission evaluation.
9.  Cohort reconciliation.
10. Exception creation.
11. Institution response.
12. Authorised reviewer decision.
13. AEP generation.
14. Audit and reporting.

Integrate and test each slice before expanding it.

## 11. Mandatory phase approval mechanism

Every phase ends with a formal approval checkpoint.

```text
NOT_STARTED
    |
    v
IN_PROGRESS
    |
    v
INTERNAL_TESTING
    |
    v
INTEGRATION_TESTING
    |
    v
AWAITING_DEVELOPER_APPROVAL
    |
    +---- HOLD / CHANGES_REQUESTED --> IN_PROGRESS
    |
    +---- APPROVED --> NEXT_PHASE
```

At the end of every phase:

1.  Developer A completes assigned work.
2.  Developer B completes assigned work.
3.  Each developer runs module tests.
4.  Both developers integrate their work.
5.  Integration and regression tests are executed.
6.  Documentation is updated.
7.  Both developers submit a phase completion report.
8.  Execution stops.
9.  The agents request permission from the designated human
    developer/project lead.
10. Only explicit approval permits the next phase.

Approved responses:

- `APPROVE PHASE N` --- accept the phase and authorise the next phase.
- `HOLD PHASE N` --- stop and wait.
- `CHANGES REQUIRED PHASE N` --- fix issues and repeat validation.

Never infer approval from silence, a successful build or an agent's
claim of completion. A coding agent must not approve its own work.

## 12. Shared project status

Maintain `docs/09-delivery/DEVELOPMENT_STATUS.md` with:

- Current phase and phase status.
- Developer A, Developer B and shared module status.
- Completed tasks and failed tests.
- Open blockers and integration status.
- Documentation status.
- Approval status and approved next phase.

Do not start the next phase while the current phase awaits approval.

## 13. Definition of Done

A module or feature is complete only when applicable conditions are
satisfied:

- Requirements and user journey documented.
- Role/permission matrix and scope requirements reviewed.
- Privacy classification completed.
- Database model reviewed and migrations applied.
- RLS implemented where applicable.
- Backend validation and authorization implemented.
- Frontend workflow implemented.
- API contract and error states documented.
- Audit events implemented.
- Unit, integration, tenant-isolation, privacy and applicable E2E
  tests pass.
- Documentation updated and code reviewed.
- Acceptance criteria verified.

A working screen or API alone is not a completed feature.

## 14. Final engineering principle

AIRE optimises for correctness, traceability, privacy, authorization,
accountability and reproducibility. The objective is to deliver a small,
complete, secure and reproducible admission reconciliation workflow,
then expand it through approved phases.
