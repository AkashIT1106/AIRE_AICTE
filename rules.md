# AIRE --- Mandatory Development Rules

**Project:** AIRE --- AICTE Admission Reconciliation & Evidence
Platform\
**Applies to:** Developer A, Developer B, AI coding agents and
contributors\
**Architecture:** Modular Monolith\
**Execution:** Phase-wise, module-based, approval-gated development

## 1. General rules

These rules are mandatory for everyone working on AIRE.

1.  Follow `foundations.md`.
2.  Follow the assigned developer instruction file.
3.  Read relevant documentation before implementation.
4.  Respect approved architecture and technology decisions.
5.  Do not invent product requirements.
6.  Do not silently change business rules.
7.  Do not skip testing.
8.  Do not mark incomplete work as completed.
9.  Do not start a new phase without explicit approval.
10. Prioritise correctness, security, privacy and traceability.

If an instruction conflicts with an authoritative specification, stop
the affected work and report the conflict.

## 2. Documentation-first rule

Before modifying code, read relevant documentation, including as
applicable:

- `docs/README.md`
- `docs/00-governance/documentation-map.md`
- `docs/00-governance/source-of-truth-policy.md`
- Product requirements.
- Module specification.
- Domain rules and workflows.
- Architecture and database specifications.
- API contracts.
- Security and privacy specifications.
- Testing and acceptance criteria.

Do not begin implementation based only on a short task description when
a detailed specification exists.

### Documentation update rule

When implementation changes an approved design:

1.  Identify the affected specification.
2.  Explain why the change is required.
3.  Obtain required approval.
4.  Update the specification.
5.  Update the decision register when appropriate.
6.  Implement according to the updated decision.

Do not allow implementation and documentation to drift apart.

## 3. Modular architecture rules

AIRE follows a modular monolith architecture: one cohesive system with
independently organised functional modules.

Mandatory principles: - Every module has a clear functional
responsibility and explicit owner. - Module boundaries must be
respected. - Modules communicate through defined contracts. - Module
internals are not accessed directly by unrelated modules. - Shared
functionality is not duplicated. - Cross-module dependencies are
documented. - Integration happens continuously.

Do not: - Divide Developer A into frontend-only work and Developer B
into backend-only work. - Create a second backend for a module without
an approved decision. - Create a second authentication or permission
system. - Duplicate business logic across modules. - Create unapproved
microservices. - Allow unrelated modules to modify each other's internal
tables or repositories. - Introduce circular module dependencies. -
Bypass defined service interfaces.

### Complete vertical ownership

```text
Functional Module
    |
    +-- Frontend
    +-- Backend
    +-- Domain Logic
    +-- Database Integration
    +-- Validation
    +-- Authorization
    +-- Audit Integration
    +-- Tests
    +-- Documentation
```

A module is not complete if only one layer has been implemented.

## 4. Developer ownership rules

**Developer A** - M02 --- Institution and Programme Registry - M03 ---
Approval and Seat Entitlement Registry - M05 --- Institution Onboarding
and Admission Submission - M06 --- Data Ingestion and Normalisation -
M08 --- Admission Lifecycle and Record Ledger - M12 --- Verifiable
Student Records and AEP Issuance

**Developer B** - M04 --- Regulatory Policy and Rule Registry - M07 ---
APAAR Identity Verification Gateway - M09 --- Admission Entitlement
Engine - M10 --- Cohort Reconciliation Engine - M11 --- Exception and
Human Review Workbench - M13 --- Dashboards, Reports and Analytics - M14
--- Integration Hub

**Shared** - M01 --- Identity, Authentication and Access Management -
M15 --- Privacy, Security and Governance

Ownership restrictions: 1. Do not modify another developer's module
internals without coordination. 2. Do not overwrite another developer's
work. 3. Do not change shared interfaces unilaterally. 4. Do not
duplicate a service owned by another module. 5. Coordinate before
modifying shared schemas or database conventions. 6. Ownership
reassignment requires explicit team approval.

## 5. Contract-first integration rules

Before implementing a cross-module dependency, agree on a contract
defining:

- Purpose.
- Input and output fields.
- Validation requirements.
- Error responses.
- Authorization requirements.
- Tenant and scope requirements.
- Data ownership.
- Versioning.
- Expected failure behaviour.
- Test cases.

Do not assume another module's internal database schema, directly import
its private services, create duplicate models for the same concept,
silently change request/response structures or break consumers without
coordinated migration.

When a contract changes, notify dependent owners and update
documentation.

## 6. Technology rules

Follow the documented AIRE technology baseline.

Layer Technology

---

Frontend React + TypeScript
Backend Node.js + Express + TypeScript
Database PostgreSQL
ORM Prisma
Background processing Redis + BullMQ
Optional document AI service Python + FastAPI
Deployment Docker-based infrastructure

Engineering standards: - Use TypeScript consistently. - Avoid
unnecessary `any`. - Prefer reusable components and services. - Separate
domain logic from presentation. - Keep controllers thin. - Validate
untrusted inputs. - Use consistent error handling. - Follow existing
naming and folder conventions. - Avoid unnecessary dependencies. - Do
not introduce a major library without justification and approval. - Do
not leave unused or experimental code in completed modules.

Follow existing repository standards rather than inventing new
conventions.

## 7. Database and data integrity rules

PostgreSQL is the authoritative business data store. Redis is not
authoritative business storage.

- Use Prisma according to approved architecture.
- Use migrations for schema changes.
- Do not manually modify production schema.
- Preserve referential integrity and appropriate constraints.
- Apply tenant isolation and PostgreSQL RLS to tenant-owned data as
  specified.
- Use secure transaction handling.
- Preserve important historical records.
- Make background processing idempotent.
- Keep sensitive data out of unnecessary logs.

Before a schema change, review affected modules and data ownership,
identify dependent queries/services, define and test a migration and
recovery strategy, coordinate with affected developers, and update
database documentation.

Never silently modify another module's tables.

## 8. Security and authorization rules

Security is implemented from the beginning.

### Authorization

- Use centralized authentication and authorization.
- Apply RBAC, ABAC and scope-based authorization as specified.
- Use least privilege and default-deny behaviour.
- Validate permissions on the backend.
- Enforce tenant isolation at database level.
- Do not trust frontend role checks.
- Do not allow users to manipulate their own privileged scopes.
- Apply purpose and field-level restrictions where required.

### Privacy

- Isolate raw student PII in the encrypted Identity Vault.
- Use pseudonymous references for operational queries wherever
  possible.
- Avoid unnecessary personal-data collection.
- Protect sensitive uploads and evidence.
- Do not expose student identifiers through URLs, logs or error
  messages.
- Apply approved retention/deletion policies.
- Audit sensitive data access.

Test unauthorized access, cross-tenant access, privilege escalation,
scope manipulation, session revocation, sensitive-field exposure,
unauthorized exports, Identity Vault access and RLS enforcement.

No institution-sensitive workflow may bypass the Phase 2 security
foundation.

## 9. Regulatory and AI rules

Correctness and traceability are mandatory.

All admission entitlement calculations and regulatory quota checks must
be deterministic.

AI may assist with document extraction, candidate field mapping,
evidence classification, candidate entity matching, reviewer assistance
and natural-language explanation of deterministic findings.

AI must not independently establish regulatory policy, activate rules,
calculate legal entitlements from unverified assumptions, issue final
regulatory decisions, declare a student fraudulent, reject an admission
or modify authoritative approval records.

Preserve source references, applicability dates and policy versions.
Distinguish official rules from interpretations. Do not invent
quota/entitlement values or treat missing data as proof of
non-compliance. Escalate ambiguous policy interpretation for authorised
review.

An exception is not a fraud verdict. Regulatory decisions remain within
authorised human review workflows.

## 10. External integration rules

External integrations use provider adapters.

- Validate actual provider access.
- Use documented API contracts.
- Use mock adapters when live access is unavailable.
- Clearly label mock, sandbox and production environments.
- Handle timeouts and provider unavailability.
- Implement controlled retries.
- Validate external response data.
- Protect credentials.
- Avoid sensitive payload logging.
- Document provider limitations.

Never claim production integration merely because a mock provider works.
Public documentation does not establish that AIRE has authorised
production access.

## 11. Frontend rules

Every module owner is responsible for its module frontend.

- Follow approved UX documentation.
- Reuse shared design-system components.
- Maintain consistent navigation and layout.
- Support loading, empty, error and success states.
- Validate forms.
- Display backend validation errors clearly.
- Enforce role-aware visibility.
- Do not rely on frontend visibility as authorization.
- Protect sensitive information in the UI.
- Maintain accessible interactions.
- Avoid duplicate components when a shared component exists.

Do not create a different visual language for each module.

## 12. Backend and API rules

- Follow documented API conventions.
- Validate every untrusted request.
- Apply authentication and authorization.
- Use consistent response formats and correct HTTP status codes.
- Keep business logic in appropriate domain services.
- Handle errors explicitly.
- Avoid leaking stack traces or sensitive data.
- Apply pagination to large result sets where required.
- Use idempotency for retryable operations.
- Document API changes.
- Test successful and unsuccessful requests.

Frontend validation never replaces backend validation.

## 13. Git and collaboration rules

Follow the repository's existing branch strategy. If the team adopts
feature branches, descriptive examples include:

```text
feature/developer-a/M02-institution-registry
feature/developer-a/M06-data-ingestion
feature/developer-b/M04-policy-registry
feature/developer-b/M09-entitlement-engine
```

Commit rules: - Commit focused changes with descriptive messages. - Do
not commit secrets or real student data. - Do not commit generated files
unless required. - Do not overwrite another developer's commits. - Do
not force-push shared branches without explicit agreement. - Keep the
integration branch buildable.

Before merging, run tests, inspect diffs, confirm contracts, update
documentation, resolve conflicts deliberately and request review where
required.

## 14. Testing rules

Testing is mandatory at every level.

**Unit tests:** domain functions, validation, business rules, state
transitions and deterministic calculations.

**Integration tests:** API/database integration, module contracts,
authorization, RLS, background processing, provider adapters and
transaction behaviour.

**End-to-end tests:** complete user journeys.

The first end-to-end workflow must cover:

1.  Institution login.
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
12. Reviewer decision.
13. AEP generation.
14. Audit and reporting.

Do not skip failing tests, disable tests merely to obtain a green build,
report tests as passed if they were not executed, rely only on mocks for
database integration, or treat a frontend build as proof that a feature
works. Record known test gaps.

## 15. Phase-wise execution rules

Follow Phase 0 through Phase 12 in the approved roadmap. Do not skip
phases or silently combine them.

```text
1. Read phase requirements
        |
2. Identify assigned module tasks
        |
3. Confirm dependencies and contracts
        |
4. Implement assigned functionality
        |
5. Run module tests
        |
6. Integrate Developer A and B work
        |
7. Run integration and regression tests
        |
8. Update documentation
        |
9. Submit phase completion report
        |
10. STOP
        |
11. Request human approval
        |
12. Continue only after explicit approval
```

### Mandatory stopping rule

At the end of every phase, all agents stop. They must not automatically
start the next phase.

The agent must ask the designated human developer/project lead:

**"Phase N is complete. All assigned work and validation results are
reported. May we proceed to Phase N+1?"**

Approved responses:

Response Meaning

---

`APPROVE PHASE N` Phase accepted; next phase may begin
`HOLD PHASE N` Stop and wait
`CHANGES REQUIRED PHASE N` Fix issues and repeat validation

Silence is not approval. A successful build is not approval. A
developer's self-assessment is not final approval. An AI coding agent
cannot approve its own phase. An incomplete phase cannot be approved. If
changes are requested, remain in the same phase, fix issues, rerun
relevant tests and resubmit.

## 16. Phase completion report

```text
AIRE — PHASE COMPLETION REPORT

Phase Number:
Phase Name:
Phase Status: AWAITING_APPROVAL

DEVELOPER A
Assigned modules:
Completed tasks:
Pending tasks:
Test results:
Integration status:
Known issues:

DEVELOPER B
Assigned modules:
Completed tasks:
Pending tasks:
Test results:
Integration status:
Known issues:

SHARED WORK
Shared foundation status:
Database and migration status:
Authorization status:
Security and privacy status:
CI status:

TEST SUMMARY
Unit tests:
Integration tests:
E2E tests:
RLS tests:
Regression tests:
Build status:

DOCUMENTATION
Specifications updated:
API contracts updated:
Database documentation updated:
Known gaps updated:

GIT
Branches:
Commits:
Merge status:

OPEN ISSUES
Blockers:
Unresolved dependencies:
Risks:
Required decisions:

FINAL STATUS
[ ] IN_PROGRESS
[ ] INTERNAL_TESTING
[ ] INTEGRATION_TESTING
[ ] AWAITING_APPROVAL
[ ] APPROVED
[ ] CHANGES_REQUIRED
[ ] BLOCKED

APPROVAL REQUEST
Phase N is complete and awaiting review.
May we proceed to Phase N+1?

Required response:
APPROVE PHASE N
HOLD PHASE N
CHANGES REQUIRED PHASE N
```

The report must reflect actual work and actual test results. Never
fabricate completion or test evidence.

## 17. Definition of Done

A feature is done only when requirements are understood, implementation
follows approved specifications, frontend/backend are completed where
required, database changes are migrated, validation and authorization
are enforced, audit/privacy requirements are satisfied, required tests
pass, documentation is updated, code is reviewed and acceptance criteria
are verified.

A module marked `IMPLEMENTED` is not automatically `VERIFIED`. A phase
marked `VERIFIED` is not automatically `APPROVED`. Only the designated
human approval process authorises the next phase.

## 18. Prohibited shortcuts

Do not: - Implement without reading specifications. - Divide developers
into frontend-only and backend-only roles. - Bypass module boundaries or
duplicate domain logic. - Skip authorization or RLS. - Hardcode
regulatory assumptions. - Treat AI output as a legal decision. - Treat
mock integrations as live integrations. - Silently overwrite historical
records. - Ignore failed tests or hide errors. - Commit secrets or real
student PII. - Start the next phase without approval. - Mark incomplete
functionality as verified. - Change architecture without recording the
decision.

## 19. Final rule

**Build in modules. Integrate continuously. Test every phase. Preserve
evidence. Protect student data. Obtain approval before proceeding.**

AIRE must be a secure, reproducible and evidence-driven platform. The
quality of the complete working workflow matters more than the number of
modules completed independently. No agent or developer may bypass the
phase approval mechanism.
