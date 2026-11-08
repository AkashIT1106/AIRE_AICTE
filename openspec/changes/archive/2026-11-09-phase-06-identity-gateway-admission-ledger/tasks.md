# Tasks: Phase 6 Identity Gateway & Admission Ledger

## 1. Database Schema & Prisma Models

- [x] 1.1 Add `AdmissionRecord`, `LedgerEvent`, and `IdentityVaultRecord` models to `server/prisma/schema.prisma` and verify with `pnpm --filter @aire/server prisma:generate`.
- [x] 1.2 Create and execute database migration SQL for Phase 6 tables with tenant constraints and composite indexes.

## 2. Identity Vault & Envelope Encryption (M15)

- [x] 2.1 Implement `IdentityVaultService` in `server/src/services/identity-vault.service.ts` with AES-256-GCM envelope encryption, DEK/KEK handling, blinded search hashes, and purpose-bound access.
- [x] 2.2 Add unit and security tests in `server/src/tests/identity-vault.test.ts` verifying encryption round-trip, tag verification, and purpose audit logging.

## 3. Identity Gateway Module (M07)

- [x] 3.1 Implement `IdentityGatewayService` with `MockApaarAdapter`, `SandboxApaarAdapter`, and `LiveApaarAdapter`, circuit breaker (50% failure threshold), and exponential backoff in `server/src/services/identity-gateway/`.
- [x] 3.2 Add tests in `server/src/tests/identity-gateway.test.ts` verifying deterministic mock resolution, 12-digit format validation, circuit tripping, and backoff retries.

## 4. Admission Ledger Engine & Batch Sealing Promotion (M08)

- [x] 4.1 Implement `AdmissionLedgerService` in `server/src/services/admission-ledger.service.ts` supporting staged promotion, lifecycle transitions (`ADMITTED`, `BRANCH_CHANGE`, `CANCELLATION`, `MIGRATION`), seat quota release on cancellation, and SHA-256 event hash chaining.
- [x] 4.2 Update `SubmissionService.sealBatch` in `server/src/services/submission.service.ts` to atomically promote staged records to active admission records, store PII in the Identity Vault, and mint initial ledger events.
- [x] 4.3 Add unit and integration tests in `server/src/tests/admission-ledger.test.ts` verifying promotion, hash chain continuity, branch change, cancellation quota release, and tamper detection.

## 5. REST APIs, Routing & End-to-End Verification

- [x] 5.1 Implement REST routes in `server/src/routes/admission-ledger.routes.ts` (`GET /api/v1/institutions/:institutionId/admissions`, `GET .../admissions/:id`, `GET .../admissions/:id/ledger`, `POST .../admissions/:id/branch-change`, `POST .../admissions/:id/cancel`, `POST .../admissions/:id/verify-identity`) and register with `server/src/app.ts`.
- [x] 5.2 Add API integration tests in `server/src/tests/admission-ledger-api.test.ts` verifying tenant authorization, lifecycle endpoints, and ledger audit verification.
- [x] 5.3 Run full test suites, typechecks, and lints across the workspace to verify complete regression-free integration.

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
- Verify the archived result and update documentation traceability.
