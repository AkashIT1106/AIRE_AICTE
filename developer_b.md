# Developer B --- Module Ownership and Execution Instructions

**Project:** AIRE\
**Role:** Functional Module Developer B\
**Architecture:** Modular Monolith\
**Ownership model:** Complete vertical functional modules

## 1. Your role

You implement the functional modules assigned to Developer B. You are
neither a frontend-only nor a backend-only developer.

For every assigned module, own the complete implementation: frontend,
backend, domain logic, database models/migrations/queries, validation,
authorization, audit integration, tests, documentation and integration
with dependent modules.

Follow `foundations.md`, `rules.md`, authoritative documentation under
`docs/`, and the approved roadmap. Do not invent requirements when
specifications exist.

## 2. Assigned modules

Module Name Priority

---

M04 Regulatory Policy and Rule Registry Core
M07 APAAR Identity Verification Gateway Core
M09 Admission Entitlement Engine Core
M10 Cohort Reconciliation Engine Core
M11 Exception and Human Review Workbench Core
M13 Dashboards, Reports and Analytics Core
M14 Integration Hub Core

These are complete vertical module responsibilities.

## 3. Module responsibilities

### M04 --- Regulatory Policy and Rule Registry

**Objective:** Maintain versioned regulatory policies and rules with
controlled review and activation.

Responsibilities: - Policy source registry and policy pack management. -
Rule schemas and allowlisted rule handlers. - Applicability dates and
academic-year applicability. - Required evidence definitions. - Rule
fixtures. - Policy review and activation workflows. - Historical policy
preservation and change history.

Rules: - Maintain references to authoritative source documents. -
Distinguish official rules from interpretations. - Do not store
arbitrary executable code as a regulatory rule. - Use allowlisted
deterministic handlers. - Policy activation follows approved human
review. - Preserve historical versions. - Never silently change an
earlier evaluation's policy inputs.

Acceptance criteria: - Policy versions are preserved. - Applicability is
traceable. - Rule fixtures can be executed. - Review and activation are
controlled. - Historical policies remain available for replay. - Policy
changes are auditable. - Tests cover date boundaries, version selection
and invalid activation.

### M07 --- APAAR Identity Verification Gateway

**Objective:** Provide a controlled provider-adapter-based identity
verification workflow.

Responsibilities: - Identity provider interface. - Mock identity
provider. - Authorised sandbox adapter where credentials and access
exist. - Production adapter only when formally authorised and
supported. - Verification request workflow and status. - Provider
reference storage and error handling. - Retry and unavailable-state
handling. - Identity Vault, pseudonymous token and audit integration.

Rules: - Do not assume production APAAR API access exists. - Clearly
label mock, sandbox and production modes. - Provider unavailability is
not failed identity verification. - Protect raw student identifiers. -
Do not expose raw identity data in normal application responses. - Do
not put sensitive identifiers in logs or queue payloads. - Use approved
encryption and Identity Vault interfaces. - Do not claim live
national-system integration without evidence.

Acceptance criteria: - Mock provider works for demonstration. - Provider
adapters follow a stable interface. - Provider failure is
distinguishable from failed verification. - Verification references and
status are preserved. - Sensitive data is protected. - Retry behaviour
is controlled. - Provider calls are auditable. - Tests cover success,
failure, unavailable and timeout cases.

### M09 --- Admission Entitlement Engine

**Objective:** Perform deterministic admission-level entitlement
evaluation using applicable approval and regulatory policy information.

Responsibilities: - Approval and policy resolver integration. -
Deterministic rule engine. - Admission evaluation. - Rule-by-rule
evaluation trace. - Findings and missing-evidence identification. -
Evaluation versioning and input snapshots. - Evaluation result
persistence and engine version tracking.

Rules: - Regulatory calculations are deterministic. - Do not use AI to
determine legal entitlement. - Do not invent missing policy or approval
values. - Unresolved inputs produce an appropriate unresolved/incomplete
outcome. - Every finding identifies the applicable rule and supporting
evidence. - The same versioned inputs and engine version produce
reproducible results. - Do not silently overwrite historical
evaluations.

Acceptance criteria: - Correct approval and policy versions are
resolved. - Rules are evaluated deterministically. - Each result has a
trace. - Missing inputs are identified. - Historical evaluations are
preserved. - Repeated evaluation with the same versioned inputs is
reproducible. - Tests cover boundary conditions and conflicting inputs.

### M10 --- Cohort Reconciliation Engine

**Objective:** Reconcile admission cohorts against applicable approvals
and regulatory requirements.

Responsibilities: - Cohort selection and reconciliation run
management. - Admission-level evaluation coordination. - Cohort
aggregation. - Duplicate and inconsistency detection as defined by
approved rules. - Finding generation and historical snapshots. -
Reconciliation summaries, replay and provenance. - Reconciliation status
tracking.

Rules: - Use M09 for admission-level entitlement evaluation. - Do not
duplicate M09's regulatory calculation logic. - Preserve exact input
snapshot and applicable versions. - Do not convert an anomaly into a
fraud verdict. - Do not silently overwrite previous reconciliation
results. - Replays record policy, approval and engine versions. -
Findings are traceable to source records and rules.

Acceptance criteria: - Cohort runs can be created and tracked. - Results
are traceable to admission-level evaluations. - Findings are
reproducible. - Historical snapshots are preserved. - Replay uses
explicit version references. - Duplicate/conflicting records follow
approved rules. - Tests cover repeat runs, partial failures and replay.

### M11 --- Exception and Human Review Workbench

**Objective:** Provide evidence-based exception handling and authorised
human review.

Responsibilities: - Exception generation integration and exception
records. - Reviewer assignment. - Institutional response workflow. -
Evidence attachment and reviewer notes. - Review decisions and state
transitions. - Dual-authorization workflow where specified. - Review and
audit history. - Exception status and resolution.

Rules: - An exception is not an automatic fraud verdict. - Authorised
human reviewers retain control over regulatory decisions. - Institution
responses preserve provenance. - Review decisions are authorised and
auditable. - State transitions follow approved workflow rules. -
Evidence is protected and access-controlled. - Prevent users from
approving their own privileged decisions where separation of duties is
required.

Acceptance criteria: - Exceptions can be generated from supported
findings. - Reviewers are assigned according to permissions. -
Institutions can respond within authorised workflows. - Evidence
attachments are traceable. - Review notes and decisions are preserved. -
Invalid transitions are rejected. - Required dual-authorization checks
are enforced. - Audit history is complete.

### M13 --- Dashboards, Reports and Analytics

**Objective:** Provide role-specific dashboards and privacy-safe
reporting.

Responsibilities: - Institution and AICTE dashboards. - Admission
submission and reconciliation summaries. - Exception status reports. -
Aggregate reporting and controlled exports. - Privacy-safe analytics. -
Evidence references. - Dashboard filters/summaries. - Report generation
and access control.

Rules: - Apply role and scope restrictions. - Institution users must not
see other institutions' data. - Do not expose unnecessary student PII in
dashboards or exports. - Aggregate reports follow approved reporting
scope. - Every export is authorised. - Aggregate figures are not
equivalent to individual admission records. - Report data is traceable
to source and reporting period.

Acceptance criteria: - Dashboards display role-appropriate
information. - Institution-level access is isolated. - AICTE-level views
follow approved scope. - Exports are authorised and audited. - Sensitive
fields are protected. - Reports are consistent with source data. - Tests
cover cross-tenant reporting and export restrictions.

### M14 --- Integration Hub

**Objective:** Provide a controlled integration layer for external
systems and providers.

Responsibilities: - Provider adapter contracts and integration
configuration. - API request/response handling and contract
validation. - External provider authentication. - Retry, timeout and
circuit-breaker behaviour where required. - Provider monitoring and
integration status. - Error classification and integration
documentation. - Mock and sandbox adapter support.

Rules: - Keep external providers behind adapters. - Do not hard-code
provider-specific behaviour into unrelated modules. - Do not claim an
integration is live without verified access and testing. - Clearly label
mock and sandbox modes. - Handle unavailable providers explicitly. - Do
not log credentials or sensitive payloads. - Validate external response
data. - Keep external integration failure separate from business-rule
failure.

Acceptance criteria: - Provider interfaces are documented. - Mock
adapters are available where required. - Provider errors are
classified. - Retries are controlled and safe. - Timeouts are handled. -
Integration status is observable. - Credentials are securely managed. -
Tests cover provider success, failure and unavailability.

## 4. Cross-module dependencies

---

Your module Dependency Required coordination

---

M04 M02, M03 Institution, programme
and approval references

M07 M01, M15 Authorization, identity
protection and audit

M07 M05, M06, M08 Submission/admission
verification interfaces

M09 M02, M03, M04, M08 Canonical records,
approvals, policies and
admissions

M10 M09 Admission-level
evaluation results

M10 M08 Admission lifecycle
snapshots

M11 M10 Findings and exception
source references

M11 M05, M06, M08 Institutional responses
and source records

M11 M12 AEP and review decision
references

M13 M05, M06, M09, M10, Reporting data and
M11, M12 access scope

M14 M07 and other Provider adapters and
integration consumers integration contracts

All assigned modules M01, M15 Authorization, privacy,
audit and governance
-----------------------------------------------------------------------

Do not access another module's internal implementation directly. Agree
on service interfaces, API contracts and event contracts with the
relevant owner.

## 5. Phase-wise execution responsibilities

### Phase 0 --- Research and Requirements Validation

- Research regulatory policy sources and applicability questions.
- Research APAAR and other integration access requirements.
- Identify provider API limitations and external dependencies.
- Document unresolved assumptions and evidence requirements.
- Do not assume public documentation means production API access
  exists.

### Phase 1 --- Engineering Foundation

- Review repository and module conventions.
- Confirm backend service/worker, validation, API error, database,
  migration, testing and logging conventions.
- Prepare assigned module plans.
- Do not establish a separate application architecture.

### Phase 2 --- Identity, Access and Security Foundation

- Coordinate with M01 owners.
- Define authorization and scope boundaries.
- Identify sensitive data and processing purposes.
- Integrate with approved authorization, audit and secure transaction
  conventions.
- Do not implement protected production workflows before the Phase 2
  security gate passes.

### Phase 3 --- Institution, Programme and Approval Registry

- Review M02/M03 contracts.
- Define required policy and engine reference fields.
- Validate approval/programme compatibility.
- Coordinate integration requirements with Developer A.
- Do not duplicate registry or approval management.

### Phase 4 --- Regulatory Policy Registry

Primary ownership: M04. Deliver policy source registry, versioned policy
packs, rule schemas, allowlisted handlers, applicability dates,
fixtures, review and activation workflow.

### Phase 5 --- Institution Submission and Ingestion

- Define admission data contract needed by M07 and downstream
  evaluation.
- Validate identity verification handoff.
- Coordinate ingestion and quarantine integration.
- Define provider-independent verification outcomes.
- Do not duplicate M05 or M06.

### Phase 6 --- Identity Gateway and Admission Ledger

Primary ownership: M07. Deliver mock provider, provider interface,
verification workflow, Identity Vault integration, statuses and provider
error/unavailable states. Coordinate with Developer A on ledger
integration.

### Phase 7 --- Entitlement and Reconciliation Engines

Primary ownership: M09 and M10. Deliver approval/policy resolvers,
deterministic evaluation, evaluation trace, cohort reconciliation,
historical snapshots and replay. Coordinate registry, approval and
admission contracts with Developer A.

### Phase 8 --- Exception Workbench

Primary ownership: M11. Deliver exception generation, reviewer
assignment, institution responses, evidence, notes, authorised
decisions, transitions and audit history. Coordinate institution-facing
integration with Developer A.

### Phase 9 --- Reporting and Verification

Primary ownership: M13. Deliver institution/AICTE dashboards,
reconciliation and exception reports, verification workflow integration,
controlled exports and aggregate reporting. Coordinate with Developer A
on M12 data.

### Phase 10 --- Integration Expansion

Primary ownership: M14. Deliver provider adapters, API validation,
retries, monitoring, provider failure handling and integration readiness
documentation. Claim live integration only when authorised access and
testing exist.

### Phase 11 --- Security and Privacy Hardening

Review module authorization, identity protection, deterministic
evaluation integrity, replay reproducibility, reviewer permissions,
reporting isolation, provider failure handling, audit and privacy
controls. Resolve module security findings.

### Phase 12 --- Demonstration and Delivery

Demonstrate correctly labelled identity verification, policy versioning,
deterministic evaluation, cohort reconciliation, replay, exception/human
review, role-specific reporting and integration status. Prepare
technical documentation and limitations.

## 6. Module implementation workflow

For each assigned module:

1.  Read the module specification.
2.  Read relevant domain rules and workflows.
3.  Read architecture and database specifications.
4.  Read applicable API and integration contracts.
5.  Identify dependencies.
6.  Prepare an implementation checklist.
7.  Agree on interfaces with dependent module owners.
8.  Implement database and backend domain behaviour.
9.  Implement frontend workflows.
10. Implement authorization and audit integration.
11. Write tests.
12. Run module tests.
13. Integrate with dependent modules.
14. Run integration tests.
15. Update documentation.
16. Submit a module completion report.

Do not skip specification review.

## 7. Engineering restrictions

- Do not implement regulatory calculations using AI.
- Do not create a second admission ledger.
- Do not duplicate approval or institution registry logic.
- Do not bypass central authorization.
- Do not access private repositories of other modules.
- Do not silently change shared contracts.
- Do not treat provider downtime as failed verification.
- Do not treat an exception as a fraud verdict.
- Do not issue AEP independently of approved evaluation results.
- Do not expose student PII through dashboards or logs.
- Do not claim production integrations without evidence.
- Do not invent regulatory policy values.
- Do not mark untested functionality as verified.

## 8. Module completion report

```text
MODULE COMPLETION REPORT

Developer: B
Module:
Phase:

1. Requirements reviewed:
2. Features implemented:
3. Frontend completed:
4. Backend completed:
5. Database changes:
6. API contracts:
7. Authorization:
8. Audit and privacy:
9. Unit tests:
10. Integration tests:
11. E2E tests:
12. Documentation updated:
13. Known limitations:
14. Unresolved dependencies:
15. Test results:
16. Git branch and commits:
17. Module status:

Status:
[ ] IN_PROGRESS
[ ] IMPLEMENTED
[ ] VERIFIED
[ ] BLOCKED
```

A module may be `IMPLEMENTED` only when implementation is complete. It
may be `VERIFIED` only when required acceptance tests pass.

## 9. Mandatory phase approval

At the end of every phase:

1.  Complete assigned work.
2.  Run module tests.
3.  Coordinate integration with Developer A.
4.  Resolve integration defects.
5.  Update documentation.
6.  Submit the phase completion report.
7.  Stop execution.
8.  Ask the designated human developer/project lead for permission to
    continue.

Use:

`PHASE N COMPLETE — AWAITING APPROVAL`

Then ask:

`May we proceed to Phase N+1? Please respond APPROVE PHASE N, HOLD PHASE N, or CHANGES REQUIRED PHASE N.`

Do not start the next phase without explicit approval. If changes are
requested, remain in the same phase, fix issues and repeat validation.

## 10. Final responsibility

Deliver deterministic, traceable and secure regulatory evaluation and
review modules that integrate cleanly into AIRE. Correctness,
reproducibility, privacy, security and human accountability take
priority over speed.
