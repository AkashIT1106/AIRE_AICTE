# Tasks

## 1. Database Schema & Migration (M04 Models)

- [x] 1.1 Add `PolicyPack`, `PolicyRule`, `PolicyTestFixture`, and `PolicyActivationSignoff` models to `server/prisma/schema.prisma` with official AICTE statutory statuses (`DRAFT`, `COUNCIL_REVIEW`, `GAZETTE_NOTIFIED`, `IN_FORCE`, `SUPERSEDED`, `AMENDED`) and run `pnpm prisma:generate` to verify Prisma client generation.
- [x] 1.2 Create and apply Prisma SQL migration with indexes, foreign keys, and RLS policies for policy tables, verifying clean database migration with `pnpm --filter @aire/server prisma:migrate`.

## 2. Core Policy Engine & Rule Handlers (`packages/policy-engine`)

- [x] 2.1 Implement deterministic rule evaluation logic in `packages/policy-engine` for regular intake ceilings, statutory reservation quotas (SC/ST/OBC/GEN floor math), supernumerary caps (EWS/TFW ceiling math), and APH Chapter VII penal action rules (`APPROVED`, `REDUCED_INTAKE`, `NO_ADMISSION`, `WITHDRAWAL_OF_APPROVAL`), verifying with unit tests.
- [x] 2.2 Implement synthetic test fixture runner and content hashing utility (SHA-256) in `packages/policy-engine` with unit tests verifying 100% fixture execution pass rate.
- [x] 2.3 Implement temporal replay simulator in `packages/policy-engine` computing comparative transition metrics (`NON_COMPLIANT` $\leftrightarrow$ `COMPLIANT`) and verify with unit tests.

## 3. Shared Types & Validation Schemas (`packages/shared-types`, `packages/validation`)

- [x] 3.1 Export policy pack, rule, fixture, sign-off, and replay DTO interfaces in `@aire/shared-types` reflecting official AICTE states and verify package build succeeds.
- [x] 3.2 Export strict Zod schemas in `@aire/validation` for policy pack creation, rule authoring, fixture test requests, gazette activation sign-off, and replay parameters and verify schema validation tests pass.

## 4. Policy Registry Backend Service & REST Routes (`server`)

- [x] 4.1 Implement `PolicyRegistryService` in `server/src/services/policy-registry.service.ts` handling pack CRUD, immutability checks on `IN_FORCE` packs, dual-authorization sign-off verification (`authorId !== reviewerId` with step-up verification & gazette reference), fixture execution, and audit logging.
- [x] 4.2 Implement REST routes in `server/src/routes/policy.routes.ts` mounted under `/api/v1/policies`, protected with authentication and `AICTE_ADMIN` role authorization.
- [x] 4.3 Implement `POST /api/v1/policies/replay` simulation endpoint in router and service.

## 5. Verification & Integration Testing

- [x] 5.1 Implement comprehensive integration test suite `server/tests/policy.test.ts` verifying official AICTE policy pack lifecycle (`DRAFT` $\rightarrow$ `COUNCIL_REVIEW` $\rightarrow$ `GAZETTE_NOTIFIED` / `IN_FORCE`), fixture enforcement, author self-activation rejection, immutability, and replay simulation.
- [x] 5.2 Run workspace typecheck, lint, and tests across all packages (`pnpm typecheck`, `pnpm test`) verifying zero failures.

## Workflow follow-up

- Archive the change after verification using `/opsx-archive`.
- Update requirements traceability matrix in `docs/00-governance/requirements-traceability.md`.
