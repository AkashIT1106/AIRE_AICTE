# Tasks

## 1. Database Schema & Migrations

- [x] 1.1 Extend `server/prisma/schema.prisma` with `Campus`, `Programme`, `ProgrammeAlias`, `ApprovalOrder`, `SeatEntitlement`, and updated `Institution` fields; verify with `pnpm --filter @aire/server prisma generate`
- [x] 1.2 Create committed Prisma migration including PostgreSQL forced Row-Level Security (RLS) policies and grants for `aire_app_user`; verify via `pnpm --filter @aire/server prisma migrate dev`
- [x] 1.3 Add seed data for canonical AICTE programmes and sample approved institutions in `server/prisma/seed.ts`; verify via `pnpm --filter @aire/server prisma db seed`

## 2. Shared Types & Validation Schemas

- [x] 2.1 Define Zod schemas for campuses, canonical programmes, programme aliases, approval orders, and seat entitlement quota breakdowns in `packages/validation`; verify with validation tests
- [x] 2.2 Export shared TypeScript types and API contracts in `packages/shared-types` and `packages/api-contracts`; verify with `pnpm run typecheck`

## 3. Domain Services & Business Logic

- [x] 3.1 Implement `InstitutionRegistryService` in `server/src/services` for managing institution profiles, campuses, programmes, and alias matching; verify with unit tests
- [x] 3.2 Implement `ApprovalRegistryService` in `server/src/services` for managing approval orders, supersession lifecycle, and quota arithmetic verification; verify with unit tests
- [x] 3.3 Integrate structured audit event emission for all registry mutations and order supersessions via `auditService`; verify audit emission in service tests

## 4. API Endpoints & Multi-Tenant Authorization

- [x] 4.1 Implement institution profile and campus management routes under `/api/v1/institutions`; verify route tests pass
- [x] 4.2 Implement programme catalog and AICTE approval order routes under `/api/v1/programmes` and `/api/v1/approvals`; verify route tests pass
- [x] 4.3 Implement integration tests verifying PostgreSQL RLS tenant isolation across institutions and role-based permissions (`AICTE_ADMIN` vs `INSTITUTION_OPERATOR`); verify via `pnpm --filter @aire/server test`

## 5. Verification & Quality Gates

- [x] 5.1 Run full test suite, typechecking, linting, and build across all workspace packages (`pnpm run test`, `pnpm run typecheck`, `pnpm run lint`, `pnpm run build`); verify zero failures

## Workflow follow-up

- Review and archive the change with `openspec archive phase-3-institution-approval-registry` once implemented.
