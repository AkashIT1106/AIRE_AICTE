# Design: Phase 4 Regulatory Policy Registry & Rule Engine

## Context

AIRE's mission is to provide verifiable and reproducible reconciliation of admission records against statutory AICTE guidelines and state quotas. While Phase 3 established institutional metadata and annual approval orders (`ApprovalOrder` / `SeatEntitlement`), evaluating whether admitted student cohorts comply with statutory limits requires an authoritative, immutable regulatory policy engine.

The platform requires:

1. Versioned regulatory policy packs representing editions of the AICTE Approval Process Handbook (e.g. `AICTE-APH-2026-27-V1.0`), following official statutory notification lifecycle states: `DRAFT` $\rightarrow$ `COUNCIL_REVIEW` $\rightarrow$ `GAZETTE_NOTIFIED` $\rightarrow$ `IN_FORCE` $\rightarrow$ `SUPERSEDED` (with `AMENDED` for official Corrigenda/Addenda).
2. Declarative rule definitions covering regular intake ceilings, reservation categories (SC/ST/OBC/Open), supernumerary quotas (EWS, TFW, Lateral Entry), and APH Chapter VII penal statuses (`APPROVED`, `REDUCED_INTAKE`, `NO_ADMISSION`, `WITHDRAWAL_OF_APPROVAL`, `RESTORATION`).
3. Automated test fixtures enforcing 100% test pass rate prior to council review submission.
4. Dual-authorization activation sign-off (two distinct administrators) with step-up verification and Gazette Notification references.
5. Strict database and application-level immutability for in-force and superseded policy packs.
6. A temporal replay simulation engine to evaluate cohorts under alternative policies without mutating live admission records.

See `proposal.md` for motivation and `specs/policy-registry/spec.md` for normative requirements.

## Goals / Non-Goals

**Goals:**

- Provide database models (`PolicyPack`, `PolicyRule`, `PolicyTestFixture`, `PolicyActivationSignoff`) with PostgreSQL RLS and integrity constraints based on official AICTE statutory states.
- Implement pure deterministic evaluation functions in `@aire/policy-engine` for intake ceilings, statutory reservation splits, supernumerary caps, and APH Chapter VII penal action rules.
- Implement automated fixture execution validating rules against synthetic test cohorts with cryptographic result hashing.
- Enforce dual-authorization activation workflows requiring step-up verification where the reviewer cannot be the draft author.
- Implement REST API endpoints under `/api/v1/policies` protected by centralized RBAC (`AICTE_ADMIN`) and emitting structured audit events (`M15`).
- Provide temporal replay simulation APIs allowing auditor and admin inspection of historical cohorts against candidate policy packs.

**Non-Goals:**

- Automated disciplinary actions or automated student disqualification (human regulators govern policy enforcement and exception hearings).
- Direct mutation of historical student admission records during replay simulations.
- OCR parsing or automated extraction from unstructured PDF policy handbooks (handbooks are codified as declarative JSON/rule fixtures).

## Decisions

### 1. Database Schema & State Transitions

- **Decision:** Model `PolicyPack` with official AICTE regulatory state enum: `DRAFT` $\rightarrow$ `COUNCIL_REVIEW` $\rightarrow$ `GAZETTE_NOTIFIED` $\rightarrow$ `IN_FORCE` $\rightarrow$ `SUPERSEDED` (with `AMENDED` for corrigenda).
- **Details:**
  - `PolicyPack`: `id`, `name`, `code`, `academicYear`, `edition`, `status` (`DRAFT`, `COUNCIL_REVIEW`, `GAZETTE_NOTIFIED`, `IN_FORCE`, `SUPERSEDED`, `AMENDED`), `gazetteReference`, `contentHash`, `authorId`, `effectiveFrom`, `effectiveTo`.
  - `PolicyRule`: `id`, `policyPackId`, `code`, `name`, `category` (`CAPACITY`, `QUOTA`, `ELIGIBILITY`, `TIMELINE`, `PENAL_ACTION`), `clauseReference`, `parameters` (JSONB), `severity` (`VIOLATION`, `WARNING`).
  - `PolicyTestFixture`: `id`, `policyPackId`, `name`, `inputData` (JSONB), `expectedOutput` (JSONB), `lastRunStatus` (`PASSED`, `FAILED`), `lastRunAt`.
  - `PolicyActivationSignoff`: `id`, `policyPackId`, `reviewerId`, `gazetteNotificationNumber`, `signoffNotes`, `stepUpVerifiedAt`, `activatedAt`.
- **Alternatives Considered:**
  - _Generic software states (`TESTING`, `ACTIVE`):_ Rejected in favor of actual statutory AICTE Approval Process Handbook states (`COUNCIL_REVIEW`, `GAZETTE_NOTIFIED`, `IN_FORCE`).

### 2. Pure, Deterministic Evaluation in `@aire/policy-engine`

- **Decision:** Keep rule evaluation logic pure and free of I/O or database dependencies inside `@aire/policy-engine`.
- **Details:**
  - Rule evaluation takes standard typed inputs (`sanctionedIntake`, `categoryBreakdown`, `supernumeraryCounts`, `institutionalStatus`) and returns deterministic `RuleEvaluationOutput`.
  - Quota arithmetic strictly follows statutory rules:
    - SC: $\lfloor S \times 0.150 \rfloor$
    - ST: $\lfloor S \times 0.075 \rfloor$
    - OBC-NCL: $\lfloor S \times 0.270 \rfloor$
    - General/Open: $S - (Q_{SC} + Q_{ST} + Q_{OBC})$
    - EWS: $\lceil S \times 0.10 \rceil$
    - TFW: $\lceil S \times 0.05 \rceil$
  - APH Chapter VII penal rules:
    - `NO_ADMISSION`: flags any admission as severe VIOLATION.
    - `REDUCED_INTAKE`: enforces curtailed quota baseline.
    - `WITHDRAWAL_OF_APPROVAL`: rejects all admission attempts.
- **Alternatives Considered:**
  - _Evaluating rules inside database stored procedures:_ Rejected due to vendor lock-in, poor testability, and difficulty maintaining parity across backend and frontend simulators.

### 3. Dual-Authorization Activation & Separation of Duties

- **Decision:** Enforce server-side separation of duties for policy pack activation: `reviewerId !== authorId`.
- **Details:**
  - The activating user must possess the `AICTE_ADMIN` platform role.
  - The activating user cannot be the same user who created or last edited the policy pack (`authorId`).
  - The request requires step-up re-authentication within the past 15 minutes (`M01` / `S-02`) and mandatory Gazette Notification reference.
  - Activating a new pack for an academic year automatically supersedes the currently active pack for that academic year.

### 4. Content Hashing & Immutability

- **Decision:** Compute SHA-256 hash of all canonical rule parameters and clause references upon transitioning to `COUNCIL_REVIEW` and `IN_FORCE`.
- **Details:**
  - Database updates and deletes on `PolicyPack` and `PolicyRule` where `status IN ('IN_FORCE', 'SUPERSEDED', 'GAZETTE_NOTIFIED')` are prevented both in service logic and via database triggers/RLS policies.
  - Replay and reconciliation runs store the immutable `policyPackHash` on the run record.

### 5. Temporal Replay Architecture

- **Decision:** Implement `POST /api/v1/policies/replay` as a read-only, non-persistent simulation service.
- **Details:**
  - Takes a target `policyPackId` and either a historical `cohortId` or inline admission cohort summary.
  - Re-evaluates all admissions through `@aire/policy-engine`.
  - Calculates delta matrix: headcount evaluated, compliance counts under baseline vs comparison, and transitioning records (`NON_COMPLIANT` $\leftrightarrow$ `COMPLIANT`).

## Risks / Trade-offs

- **[Risk] State quota variations across Indian states** $\rightarrow$ _Mitigation:_ `PolicyPack` supports state-level overrides through an optional `stateCode` field. If null, central AICTE norms apply.
- **[Risk] Fractional seat rounding discrepancies** $\rightarrow$ _Mitigation:_ Statutory rules explicitly define `Math.floor` for regular quota categories and `Math.ceil` for supernumerary categories, codified in automated fixture test suites.
- **[Risk] Accidental modification of active policy rules** $\rightarrow$ _Mitigation:_ Service layer denies updates when `status !== 'DRAFT'`; status checks enforce permanent immutability.

## Migration Plan

1. Create and commit Prisma migration adding `policy_packs`, `policy_rules`, `policy_test_fixtures`, and `policy_activation_signoffs` tables.
2. Seed baseline AICTE Approval Process Handbook (APH 2026-27) policy pack in `IN_FORCE` status with standard intake ceiling, quota, and Chapter VII penal rules.
3. Verify backward compatibility: ensure existing institution and approval endpoints operate without disturbance.
4. Rollback strategy: Drop the newly added policy tables if migration fails. No existing tables are modified destructively.
