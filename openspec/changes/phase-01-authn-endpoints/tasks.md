# Tasks

## 1. Request Validation Schemas & Shared Contracts

- [x] 1.1 Define authentication validation schemas in `packages/validation/src/index.ts` (`signInSchema`, `signUpSchema`, `stepUpSchema`) and verify package compilation via `pnpm --filter @aire/validation build`.
- [x] 1.2 Export authentication response contracts in `packages/shared-types/src/index.ts` and verify workspace typecheck passes via `pnpm run typecheck`.

## 2. Authentication Router & Endpoint Implementation

- [x] 2.1 Create `server/src/routes/auth.routes.ts` implementing `POST /sign-in`, `POST /sign-up`, `POST /sign-out`, `GET /session`, `GET /me`, `POST /session/touch`, `POST /step-up`, and `POST /sessions/revoke-all` wrapped in `ApiResponse<T>`.
- [x] 2.2 Instrument audit logging via `logAuditEvent` in `server/src/routes/auth.routes.ts` for all login successes, failures, step-ups, and session revocations in accordance with `AIRE-REQ-126`.
- [x] 2.3 Mount `authRouter` under `/auth` in `server/src/routes/index.ts` (exposing `/api/v1/auth/*`) and verify server compiles cleanly via `pnpm --filter @aire/server build`.

## 3. Test Coverage & Verification

- [x] 3.1 Update and expand `server/tests/auth.test.ts` to test all `/api/v1/auth/*` endpoints (credential login, invalid login, session retrieval, idle touch heartbeat, step-up password verification, and multi-device session revocation) and verify tests pass with `pnpm --filter @aire/server test server/tests/auth.test.ts`.
- [x] 3.2 Run the full test suite across the workspace with `pnpm run test` to verify zero regression across tenant isolation, authorization, and registry modules.
