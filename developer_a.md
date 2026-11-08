# Developer A --- Module Ownership and Execution Instructions

**Project:** AIRE\
**Role:** Functional Module Developer A\
**Architecture:** Modular Monolith\
**Ownership model:** Complete vertical functional modules

## 1. Your role

You implement the functional modules assigned to Developer A. You are
neither a frontend-only nor a backend-only developer.

For each assigned module, own its complete implementation: frontend,
backend, domain logic, database models/migrations/queries, validation,
authorization, audit integration, tests, documentation and integration
with dependent modules.

Follow `foundations.md`, `rules.md`, authoritative documentation under
`docs/`, and the approved roadmap. Do not invent requirements when
specifications exist.

## 2. Assigned modules

Module Name Priority

---

M02 Institution and Programme Registry Core
M03 Approval and Seat Entitlement Registry Core
M05 Institution Onboarding and Admission Submission Core
M06 Data Ingestion and Normalisation Core
M08 Admission Lifecycle and Record Ledger Core
M12 Verifiable Student Records and AEP Issuance Core

These are complete vertical module responsibilities.

## 3. Module responsibilities

### M02 --- Institution and Programme Registry

**Objective:** Maintain canonical references for institutions, campuses
and programmes.

Responsibilities: - Institution registry and identifiers. - Campus
registry. - Programme registry and canonical programme codes. -
Programme and institution aliases. - Institution status. - Registry
import and change history.

Rules: - Use authoritative institution references. - Do not use
free-text names as canonical identity. - Ambiguous mapping requires
review. - Fuzzy matching may suggest candidates but must not silently
establish authoritative identity. - Enforce valid institution/campus
relationships. - Normal tenant operations must not create invalid
cross-institution references.

Acceptance criteria: - Institution references are unique. - Programme
mappings are traceable. - Ambiguous aliases are reviewable. - Registry
changes preserve appropriate history. - Access is scoped and
authorised. - Tests reject invalid and cross-tenant references.

### M03 --- Approval and Seat Entitlement Registry

**Objective:** Maintain authoritative approval information and
programme-level entitlement versions.

Responsibilities: - Approval source records and document metadata. -
Approval order references. - Institution/programme and academic-year
associations. - Approval versioning. - Amendments and superseding
orders. - Effective periods. - Programme-level intake information. -
Category/quota entitlement information where defined by approved
rules. - Approval provenance and import history.

Rules: - Preserve source document references. - Never silently overwrite
an earlier approval version. - Preserve amendments and superseding
orders. - Missing approval data does not mean zero entitlement. -
Conflicting or unresolved approval information remains explicitly
unresolved. - Do not invent regulatory intake or quota values.

Acceptance criteria: - Approval records are versioned. - Effective
periods are represented correctly. - Amendments are traceable. -
Programme-level entitlement references are consistent. - Imported
records retain provenance. - Conflicting records can be identified and
reviewed. - Tests cover version selection and effective-date boundaries.

### M05 --- Institution Onboarding and Admission Submission

**Objective:** Support institutional onboarding and secure admission
submission workflows.

Responsibilities: - Institution onboarding. - Institution user
assignments within the agreed boundary. - Submission creation and
metadata. - Secure upload workflow. - Submission status and history. -
Upload validation feedback. - Submission-level audit integration. -
Institution-facing workflow screens.

Rules: - Use M01 for identity and authorization. - Do not create a
second authentication or permission system. - Institution users operate
only within assigned scope. - Preserve submission ownership and
provenance. - Uploads must not bypass validation or access controls. -
Control submission status transitions.

Acceptance criteria: - An authorised institution user can create a
submission. - An unauthorised user cannot submit for another
institution. - Status changes follow approved transitions. - Upload
references and metadata are preserved. - Validation failures are
communicated clearly. - Relevant actions are auditable.

### M06 --- Data Ingestion and Normalisation

**Objective:** Convert submitted admission data into validated,
normalised records.

Responsibilities: - CSV/XLSX parsing. - Schema validation and canonical
field mapping. - Row-level validation and data-quality checks. -
Invalid-row reporting and quarantine. - Batch processing and background
jobs. - Idempotent processing. - Batch status, summary reports and
import error handling.

Rules: - Validate on the backend even if the frontend performs
preliminary validation. - Never trust uploaded file content. - Preserve
original submission provenance. - Do not silently discard invalid
records or convert ambiguous data into authoritative values. - Use
controlled retries and idempotency. - Redis/BullMQ is queue
infrastructure, not authoritative business storage. - Avoid unnecessary
student PII in logs and job payloads.

Acceptance criteria: - Supported file types parse correctly. - Invalid
rows are identified. - Valid rows are normalised. - Quarantined rows
remain traceable. - Duplicate job execution does not create duplicate
business records. - Batch processing recovers from failures. - Import
summaries are reproducible. - Tests cover malformed files, invalid
values and duplicate processing.

### M08 --- Admission Lifecycle and Record Ledger

**Objective:** Maintain the chronology of admission-related events.

Responsibilities: - Admission record creation and references. -
Admission event model and history. - Branch-change and lateral-entry
events. - Correction, withdrawal and cancellation events. - Event
validation and projection. - Historical record retrieval. - Lifecycle
status calculation.

Rules: - Preserve admission chronology. - Use append-only event
behaviour for lifecycle history. - Corrections must not silently erase
previous events. - Validate event transitions and record provenance. -
Ensure historical state can be reconstructed from permitted event
history. - Apply tenant isolation and access restrictions.

Acceptance criteria: - Admission history is preserved. - Valid lifecycle
events can be recorded. - Invalid transitions are rejected. -
Corrections remain traceable. - Historical state can be reconstructed. -
Events are correctly associated with institution and programme. - Access
is scoped and audited.

### M12 --- Verifiable Student Records and AEP Issuance

**Objective:** Produce verifiable records and Admission Entitlement
Proof artefacts using approved evaluation outputs.

Responsibilities: - AEP data model and lifecycle. - Evidence
references. - Approval and policy version references. - Academic-year
references. - Admission lifecycle snapshot references. - Identity
verification state references. - Evaluation engine version and input
snapshot hash. - Rule-by-rule evaluation trace references. - Findings
and missing-evidence references. - Review status and authorised decision
references. - Credential issuance workflow. - Verification presentation
and QR workflow where specified.

Rules: - Do not issue AEP from incomplete or unverified evaluation
data. - Do not represent AEP as an AICTE certificate or independent
legal compliance certificate. - Do not calculate regulatory entitlements
inside M12. - M09 and M10 remain responsible for evaluation and
reconciliation outcomes. - Preserve references to exact versions and
evidence used. - Follow approved credential format and signing
requirements. - Do not invent cryptographic or W3C compliance claims.

Acceptance criteria: - AEP references the correct admission and
evaluation. - Approval and policy versions are traceable. - Evidence
references follow retention rules. - Issuance is controlled by
authorised workflow conditions. - Verification can establish artefact
integrity and status. - Historical AEP records are not silently
overwritten. - Tests cover invalid issuance and status changes where
specified.

## 4. Cross-module dependencies

Your module Dependency Required coordination

---

M02 M01 Access and scope authorization
M03 M02 Institution, campus and programme references
M03 M04 Approval and policy applicability compatibility
M05 M01 Authentication, membership and scope
M05 M06 Submission-to-ingestion contract
M06 M08 Normalised admission record contract
M06 M07 Identity verification handoff
M08 M07 Verification reference and status
M08 M09 Admission data contract for evaluation
M12 M09 Admission evaluation output
M12 M10 Cohort reconciliation and findings references
M12 M11 Authorised decision and review references
M12 M15 Privacy, audit and governance controls

Do not assume a dependency's internal implementation. Agree on its
interface and contract with its owner.

## 5. Phase-wise execution responsibilities

### Phase 0 --- Research and Requirements Validation

- Understand institutional registry requirements.
- Research approval and entitlement source data.
- Understand institution admission submission formats.
- Identify data-quality challenges and unresolved assumptions.
- Document questions and evidence requirements.
- Do not implement unconfirmed regulatory assumptions.

### Phase 1 --- Engineering Foundation

- Review repository structure and module conventions.
- Confirm database/migration, validation, testing, API and
  error-response conventions.
- Prepare assigned module implementation plans.
- Do not create a separate application architecture.

### Phase 2 --- Identity, Access and Security Foundation

- Coordinate with M01 owners.
- Define authorization requirements and institution/programme scope
  boundaries.
- Identify sensitive data handled by assigned modules.
- Verify protected operations use centralized authorization.
- Integrate with approved secure transaction and RLS approach.
- Do not build institution-sensitive production workflows before the
  Phase 2 security gate passes.

### Phase 3 --- Institution, Programme and Approval Registry

Primary ownership: M02 and M03. Deliver registry and approval workflows.
Coordinate contracts with Developer B's policy and evaluation modules.

### Phase 4 --- Regulatory Policy Registry

- Review how M04 selects applicable approval and programme references.
- Validate compatibility between approval records and policy
  applicability.
- Provide documented contract feedback.
- Do not duplicate M04's policy engine.

### Phase 5 --- Institution Submission and Ingestion

Primary ownership: M05 and M06. Deliver onboarding, submission, secure
upload, parsing, validation, normalisation, quarantine, background
processing and batch reporting. Coordinate identity and downstream data
contracts with Developer B.

### Phase 6 --- Identity Gateway and Admission Ledger

Primary ownership: M08. Consume the approved M07 interface, preserve
verification references/statuses, implement admission chronology and
validate correction, withdrawal and cancellation events. Do not build a
second identity gateway.

### Phase 7 --- Entitlement and Reconciliation Engines

Provide stable admission and approval contracts, support M09/M10
integration, validate lifecycle snapshots, provide evidence/provenance
references and resolve contract defects. Do not duplicate the
deterministic engine in M08 or M12.

### Phase 8 --- Exception Workbench

Support institution-facing response integration, ensure submissions and
corrections are referenced correctly, provide evidence/admission
references to M11 and preserve response provenance.

### Phase 9 --- Reporting and Verification

Primary ownership: M12. Deliver approved verifiable record and AEP
workflow. Coordinate with M13 on reporting interfaces.

### Phase 10 --- Integration Expansion

Support provider/data-source integration requirements, preserve
provenance, validate API contracts and support retry/failure handling.

### Phase 11 --- Security and Privacy Hardening

Review module authorization, test institution isolation and RLS, verify
upload protections and admission history integrity, review PII exposure,
verify audit coverage and resolve security findings.

### Phase 12 --- Demonstration and Delivery

Prepare synthetic institution data; demonstrate onboarding, secure
submission, ingestion, admission history and AEP; prepare technical
documentation and report limitations.

## 6. Module implementation workflow

For each assigned module:

1.  Read the module specification.
2.  Read relevant domain rules and workflows.
3.  Read architecture and database specifications.
4.  Read applicable API contracts.
5.  Identify dependencies.
6.  Prepare an implementation checklist.
7.  Agree on interfaces with dependent module owners.
8.  Implement database and backend domain behaviour.
9.  Implement the frontend workflow.
10. Implement authorization and audit integration.
11. Write tests.
12. Run module tests.
13. Integrate with dependent modules.
14. Run integration tests.
15. Update documentation.
16. Submit a module completion report.

Do not skip specification review.

## 7. Repository and collaboration rules

- Work within assigned module boundaries unless a shared task is
  agreed.
- Do not modify Developer B's module internals without coordination.
- Do not duplicate shared services.
- Do not create alternative authorization systems.
- Do not create conflicting database models.
- Do not modify shared API contracts unilaterally.
- Do not commit secrets or real student data.
- Follow the repository's branch and commit conventions.
- Keep commits focused and descriptive.
- Notify Developer B when a contract or dependency changes.
- Update shared documentation when an approved change affects
  architecture.

## 8. Module completion report

```text
MODULE COMPLETION REPORT

Developer: A
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
3.  Coordinate integration with Developer B.
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

Deliver reliable, independently testable functional modules that
integrate cleanly into AIRE. Do not optimise isolated module completion
at the expense of the complete admission reconciliation workflow.
Correctness, security, privacy, traceability and integration take
priority over speed.
