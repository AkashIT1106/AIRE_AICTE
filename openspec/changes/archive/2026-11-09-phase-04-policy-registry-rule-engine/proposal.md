# Proposal: Phase 4 Regulatory Policy Registry & Rule Engine

## Why

AIRE requires a deterministic, auditable, and version-controlled policy engine to evaluate institutional admissions against statutory AICTE Approval Process Handbook (APH) regulations and state reservation rules. Currently, the platform lacks a persistent registry for versioned policy packs using official AICTE statutory states, executable rule fixtures, dual-authorization activation workflows, and deterministic regulatory replay as mandated by `docs/04-domain/business-rules/policy-lifecycle-rules.md`, `docs/04-domain/business-rules/intake-and-quota-rules.md`, and requirements `AIRE-REQ-014`–`020` and `AIRE-REQ-137`–`142`.

Implementing Phase 4 delivers Module M04 (Policy Registry & Rule Engine) and enhances `@aire/policy-engine`, unblocking automated admission reconciliation (Phase 7), cohort verification (Phase 6), and regulatory replay simulation (Screen S-23 / S-40).

## What Changes

- **Policy Registry Database Models (`server/prisma/schema.prisma`)**:
  - `PolicyPack`: Canonical regulatory policy version representing an AICTE Approval Process Handbook edition (e.g., `APH 2026-27 v1.0`), linked to academic year, effective validity range, official AICTE statutory lifecycle status (`DRAFT`, `COUNCIL_REVIEW`, `GAZETTE_NOTIFIED`, `IN_FORCE`, `SUPERSEDED`, `AMENDED`), gazette notification reference, immutable content hash, and author metadata.
  - `PolicyRule`: Declarative rule definitions within a pack (e.g., `IntakeCeilingRule`, `StatutoryReservationRule`, `SupernumeraryQuotaRule`, `ChapterVIIPenalActionRule`) with category (`CAPACITY`, `QUOTA`, `ELIGIBILITY`, `TIMELINE`, `PENAL_ACTION`), handbook clause references, and JSON configuration parameters.
  - `PolicyTestFixture`: Synthetic test cohorts and expected evaluation outcomes linked to policy rules for automated regression validation.
  - `PolicyActivationSignoff`: Audit record of dual-authorization sign-off (`AICTE_ADMIN` reviewer distinct from author) with timestamp, step-up verification token, gazette notification number, and test execution evidence hash.
- **Declarative Rule Engine (`packages/policy-engine`)**:
  - Implement deterministic evaluation handlers for core AICTE rules:
    - Sanctioned intake ceilings and over-admission breach calculations ($A_{reg} \le S$).
    - Statutory reservation quotas (SC 15%, ST 7.5%, OBC-NCL 27%, Open remainder) with floor rounding.
    - Supernumerary quotas (EWS 10% ceiling, TFW 5% ceiling, Lateral Entry 10% + vacant).
    - APH Chapter VII penal action rules (`APPROVED`, `REDUCED_INTAKE`, `NO_ADMISSION`, `WITHDRAWAL_OF_APPROVAL`, `RESTORATION`).
    - Violation severity classification (`VIOLATION`, `WARNING`, `INCONCLUSIVE`, `COMPLIANT`).
  - Automated test fixture runner executing 100% pass verification prior to council review.
  - Deterministic replay simulator evaluating candidate or historical policy packs against student admission cohorts.
- **Policy Management APIs (`server/src/routes/policy.routes.ts`)**:
  - `GET /api/v1/policies`: List versioned policy packs with filter by academic year and status.
  - `GET /api/v1/policies/:id`: Retrieve policy pack details, rules, and activation history.
  - `POST /api/v1/policies`: Draft a new policy pack (restricted to `AICTE_ADMIN`).
  - `POST /api/v1/policies/:id/rules`: Add or update declarative rules in a `DRAFT` policy pack.
  - `POST /api/v1/policies/:id/test`: Execute policy test fixtures and record fixture run results.
  - `POST /api/v1/policies/:id/submit-review`: Transition pack from `DRAFT` to `COUNCIL_REVIEW` (enforces 100% fixture pass rate).
  - `POST /api/v1/policies/:id/activate`: Dual-authorization activation sign-off requiring step-up authentication, gazette notification number, and a reviewer distinct from the draft author, transitioning pack to `GAZETTE_NOTIFIED` / `IN_FORCE`.
  - `POST /api/v1/policies/replay`: Execute simulated policy evaluation on cohort data without altering historical records.
- **Audit & Immutability Enforcement**:
  - Enforce strict database and service immutability on `IN_FORCE` and `SUPERSEDED` policy packs.
  - Emit audit log events (`POLICY_PACK_CREATED`, `POLICY_FIXTURE_TESTED`, `POLICY_PACK_REVIEW_SUBMITTED`, `POLICY_PACK_ACTIVATED`, `POLICY_REPLAY_EXECUTED`).

## Capabilities

### New Capabilities

- `policy-registry`: Management of immutable versioned regulatory policy packs, declarative rule handlers, automated test fixtures, dual-authorization activation, and temporal replay simulation based on official AICTE statutory states.

### Modified Capabilities

<!-- No existing OpenSpec capabilities to modify -->

## Impact

- **Database**: Add `policy_packs`, `policy_rules`, `policy_test_fixtures`, and `policy_activation_signoffs` tables via committed Prisma migrations with RLS policies and immutability constraints.
- **Packages**:
  - Enhance `@aire/policy-engine` with rule handlers, fixture runner, and replay simulator.
  - Update `@aire/validation` with schemas for policy creation, rule definitions, fixture execution, and activation sign-off.
  - Update `@aire/shared-types` with policy domain types, enums, and API contracts.
- **Server**:
  - New service `server/src/services/policy-registry.service.ts`.
  - New routes `server/src/routes/policy.routes.ts` mounted under `/api/v1/policies`.
  - Audit logging integration for all policy lifecycle events.
