# Design: Phase 6 Identity Gateway & Admission Ledger

## Context

Following Phase 5, student admission cohorts can be uploaded, validated, quarantined, and cryptographically sealed into `SubmissionBatch`. However, staged records remain flat and unlinked to a persistent, immutable student lifecycle ledger. Phase 6 establishes Module M07 (Identity Gateway), Module M08 (Admission Ledger), and Module M15 (Identity Vault) to enable DPDP-compliant PII protection, student lifecycle event tracking, and national identifier verification (see `proposal.md` for motivation and specs for behavior contracts).

## Goals / Non-Goals

**Goals:**

- Implement `AdmissionRecord`, `LedgerEvent`, and `IdentityVaultRecord` in Prisma schema with tenant scoping and RLS.
- Provide DPDP-compliant AES-256-GCM envelope encryption (DEK + master KEK) with blinded search hashes and purpose-bound decryption audit trails.
- Implement append-only student lifecycle state machine (`ADMITTED`, `BRANCH_CHANGE`, `LATERAL_ENTRY`, `CANCELLATION`, `MIGRATION`) with SHA-256 cryptographic hash chaining.
- Build an isolated `IdentityGatewayService` (M07) supporting `LIVE`, `SANDBOX`, and `MOCK` modes with circuit breaking (>50% error rate over 60s) and exponential backoff (3 retries).
- Wire batch sealing in `SubmissionService` to atomically promote staged records to active admission records, encrypt PII into the vault, and mint initial `ADMITTED`/`LATERAL_ENTRY` events.
- Implement seat quota release on admission cancellation.
- Expose REST endpoints with strict tenant authorization and audit logging.

**Non-Goals:**

- Multi-pass entitlement arithmetic and mismatch classification (Phase 7).
- Legal Show Cause workflow and exception review workbench (Phase 8).
- W3C Verifiable Credential and AEP certificate generation (Phase 9).

## Decisions

### 1. AES-256-GCM Envelope Encryption with Master KEK

- **Choice:** Encrypt demographic PII using unique random 256-bit Data Encryption Keys (DEKs) via AES-256-GCM with 96-bit IV and 128-bit authentication tags. Encrypt the DEK under a master Key Encryption Key (KEK) passed via environment secret (`IDENTITY_VAULT_MASTER_KEY`).
- **Rationale:** Satisfies DPDP Act 2023 and ADR-008. If a single DEK is compromised, other records remain secure. Master KEK rotation is supported via a `keyVersion` metadata field.
- **Alternatives Considered:** Single database-level symmetric key (rejected: high blast radius upon key leakage).

### 2. SHA-256 Hash Chaining for Student Ledger Events

- **Choice:** Each `LedgerEvent` includes `sequenceNumber`, `previousHash`, and `hash`, computed as `SHA-256(previousHash + sequenceNumber + eventType + payload + timestamp + actorId)`. The genesis event for a record uses `0000000000000000000000000000000000000000000000000000000000000000` as `previousHash`.
- **Rationale:** Ensures non-repudiation and tamper-evidence (AIRE-REQ-166). Any out-of-band database update invalidates subsequent event hashes, detectable via audit verification queries.
- **Alternatives Considered:** External blockchain ledger (rejected: excessive latency, cost, and complexity for relational student audit requirements).

### 3. Multi-Mode Adapter Pattern for Identity Gateway

- **Choice:** `IdentityGatewayService` exposes an adapter interface (`ApaarAdapter`) with three implementations: `MockApaarAdapter`, `SandboxApaarAdapter`, and `LiveApaarAdapter`. The active adapter is determined by `APAAR_ADAPTER_MODE` (`LIVE | SANDBOX | MOCK`, defaulting to `MOCK`).
- **Rationale:** Enables offline development and integration testing without external EduLocker dependencies while guaranteeing seamless staging and production switches (AIRE-REQ-155).
- **Alternatives Considered:** Conditional if-else blocks inside API handlers (rejected: violates modularity and leaks provider logic into service layers).

### 4. Atomic Ingestion Promotion via Tenant Transaction Wrapper

- **Choice:** Transition from staged records to active `AdmissionRecord` + `IdentityVaultRecord` + `LedgerEvent` occurs inside a single database transaction wrapped in `withTenantContext`.
- **Rationale:** Guarantees zero partial promotion state if cryptographic generation, vault encryption, or ledger event creation fails.

## Risks / Trade-offs

- **[Risk] Identity Vault Decryption Overhead** → _Mitigation:_ Operational queries, list views, and reconciliation runs operate solely on pseudonymous `studentToken` and non-PII fields (`category`, `quota`, `programmeId`). Vault decryption is strictly limited to authorized individual case audits.
- **[Risk] Downstream EduLocker Gateway Latency & Outages** → _Mitigation:_ Circuit breaker fails fast with `SERVICE_DEGRADED` on >50% failure rate; verification queries can run asynchronously via BullMQ jobs.
- **[Risk] Concurrent Lifecycle Events on Same Student** → _Mitigation:_ Sequence numbers and optimistic locking on `AdmissionRecord` ensure events are appended strictly serially.

## Migration Plan

1. Append new Prisma models (`AdmissionRecord`, `LedgerEvent`, `IdentityVaultRecord`) to `server/prisma/schema.prisma`.
2. Generate Prisma client (`pnpm run prisma:generate`).
3. Deploy committed migration or create migration SQL for relational tables and indexes.
4. Integrate `IdentityVaultService`, `IdentityGatewayService`, and `AdmissionLedgerService`.
5. Connect batch sealing in `submission.service.ts` to trigger atomic promotion.
6. Mount routes in `server/src/routes/admission-ledger.routes.ts` and `app.ts`.
7. Verify through automated unit, integration, and security tests.
