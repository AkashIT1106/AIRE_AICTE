# Tasks

## 1. Data Modeling & Prisma Migration

- [x] 1.1 Add `SubmissionBatch`, `StagedAdmissionRecord`, and `QuarantinedAdmissionRecord` models to `server/prisma/schema.prisma` with tenant foreign keys and indexes, and verify schema syntax with `pnpm --filter @aire/server prisma format`.
- [x] 1.2 Generate Prisma migration and apply it to database using `pnpm --filter @aire/server prisma migrate dev` (or `prisma generate`), and verify generated client types.

## 2. Shared Types & Schema Validation

- [x] 2.1 Update `@aire/shared-types` with batch states (`DRAFT`, `VALIDATING`, `VALIDATED`, `SEALED`, `LOCKED`), quarantine error codes, and record interfaces, and verify package builds with `pnpm --filter @aire/shared-types build`.
- [x] 2.2 Enhance `@aire/validation` with column mapping definitions, Luhn-variant APAAR check, demographic normalizers, and quarantine remediation schemas, and verify with `pnpm --filter @aire/validation test`.

## 3. Submission & Sealing Service Layer

- [x] 3.1 Refactor `server/src/services/submission.service.ts` to utilize relational Prisma models with `withTenantContext`, implementing batch creation, staged query, and quarantine query. Verify with unit tests.
- [x] 3.2 Implement inline quarantine remediation in `SubmissionService` to re-validate corrected attributes, update quarantine status, and promote clean records to staged status. Verify with unit tests.
- [x] 3.3 Implement deterministic binary Merkle tree root hash generation and sealing workflow with regulatory freeze cutoff checks in `SubmissionService`. Verify with unit tests.

## 4. Background Ingestion Worker

- [x] 4.1 Implement BullMQ worker for `aire-submission-ingestion` in `workers/src/ingestion.worker.ts` with streaming CSV/XLSX parsing, column normalization, and batch partitioning into staged and quarantine tables. Verify worker compilation with `pnpm --filter @aire/workers build`.
- [x] 4.2 Connect worker events to progress updates and audit logging. Verify with worker job test.

## 5. API Routes & Tenant Security

- [x] 5.1 Implement REST endpoints in `server/src/routes/submission.routes.ts` for batch upload (`POST /institutions/:id/submissions`), list, detail, quarantine list (`GET /quarantine`), inline remediation (`PATCH /quarantine/:rowId`), and sealing (`POST /seal`). Verify endpoints respond with standardized ApiResponse contracts.
- [x] 5.2 Enforce strict tenant isolation and audit logging (`BATCH_UPLOADED`, `QUARANTINE_REMEDIATED`, `BATCH_SEALED`, `SECURITY_VIOLATION`) across all endpoints. Verify with route tests.

## 6. End-to-End Verification

- [x] 6.1 Execute automated end-to-end integration test exercising full Phase 5 lifecycle: upload CSV with mixed valid/invalid rows, verify quarantine partitioning, execute inline remediation, and cryptographically seal batch. Verify test passes cleanly with `pnpm test`.
