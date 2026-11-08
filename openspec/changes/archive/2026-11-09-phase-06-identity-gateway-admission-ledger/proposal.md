# Proposal: Phase 6 Identity Gateway & Admission Ledger

## Why

Currently, student records staged in Phase 5 remain isolated from a persistent, immutable student lifecycle ledger and cannot undergo national identity verification or DPDP-compliant PII protection. To prepare for multi-pass reconciliation (Phase 7), institutional submissions must be promoted into authoritative, append-only admission records with pseudonymous student tokens, AES-256-GCM envelope-encrypted demographic vault storage, and tamper-evident lifecycle events (`ADMITTED`, `BRANCH_CHANGE`, `LATERAL_ENTRY`, `CANCELLATION`, `MIGRATION`).

Simultaneously, the platform requires an isolated Identity Gateway (Module M07) supporting `LIVE`, `SANDBOX`, and `MOCK` modes to resolve 12-digit APAAR/EduLocker student identifiers with circuit breaking, exponential backoff, and correlation tracking per requirements `AIRE-REQ-155`–`166`, ADR-008, and `docs/07-api-integrations/integration-overview.md`.

## What Changes

- **Database Models (`server/prisma/schema.prisma`)**:
  - `AdmissionRecord`: Authoritative operational entity (`tenantId`, `batchId`, `programmeId`, `academicYear`, `studentToken`, `apaarStatus`, `allocatedCategory`, `admittedQuota`, `status: ACTIVE | CANCELLED | TRANSFERRED | MIGRATED`).
  - `LedgerEvent`: Immutable, append-only chronological student lifecycle transition audit trail (`admissionRecordId`, `institutionId`, `eventType`, `payload`, `actorId`, `hash`, `previousHash`, `sequenceNumber`, `timestamp`).
  - `IdentityVaultRecord`: DPDP-compliant PII store in dedicated vault topology (`studentToken`, `encryptedPayload`, `encryptedDek`, `apaarHash`, `keyVersion`).
  - Foreign keys, composite indexes, and PostgreSQL Row-Level Security (RLS) policies for multi-tenant isolation.
- **Identity Gateway Module (M07) (`server/src/services/identity-gateway/`)**:
  - Multi-mode adapter architecture (`LIVE`, `SANDBOX`, `MOCK`) selectable via environment variables (`APAAR_ADAPTER_MODE`).
  - 12-digit APAAR verification against simulated/real EduLocker endpoints with checksum validation.
  - Verification state recording (`VERIFIED`, `UNVERIFIED`, `FAILED`, `TIMEOUT`).
  - Resilience: Circuit breaker (tripping on >50% failure rate over 1-minute window) and exponential backoff retry (3 attempts).
  - Traceable execution with correlation IDs and metrics tracking.
- **Identity Vault & Encryption Service (M15) (`server/src/services/identity-vault.service.ts`)**:
  - AES-256-GCM envelope encryption using dynamic Data Encryption Keys (DEK) wrapped under a master Key Encryption Key (KEK).
  - Purpose-bound access control requiring explicit legal purpose code and audit event generation upon decryption.
  - Blinded APAAR search hashing (SHA-256/HMAC) allowing duplicate checks without exposing raw PII.
- **Admission Ledger Service & APIs (M08) (`server/src/services/admission-ledger.service.ts`, `server/src/routes/admission-ledger.routes.ts`)**:
  - Ingestion promotion: Transitioning sealed staged records into active `AdmissionRecord` entries, encrypting PII into `IdentityVaultRecord`, and minting initial `ADMITTED` / `LATERAL_ENTRY` ledger events.
  - Student lifecycle operations: `BRANCH_CHANGE`, `CANCELLATION`, and `MIGRATION` endpoints with authorized evidence documentation and actor attribution.
  - Seat entitlement quota release upon verified cancellation.
  - Tamper-evident cryptographic hash chaining for non-repudiation.
  - Batch identity verification trigger executing APAAR verification via BullMQ background jobs.

## Capabilities

### New Capabilities

- `identity-gateway`: National student identity adapter gateway (Module M07) resolving 12-digit APAAR identifiers with LIVE, SANDBOX, and MOCK execution modes, circuit breaker resiliency, backoff retries, and correlation tracking.
- `admission-ledger`: Authoritative student admission lifecycle ledger (Module M08) with pseudonymous tokens, AES-256-GCM Identity Vault isolation (M15), append-only chronological lifecycle event chaining, cancellation seat quota release, and tamper evidence.

### Modified Capabilities

- `submission-management`: Update batch sealing workflow to promote sealed staged records into active admission ledger records and identity vault entries.

## Impact

- **Database**: Add `admission_records`, `ledger_events`, and `identity_vault_records` tables with tenant foreign keys and RLS policies.
- **Backend Services**: New `IdentityGatewayService`, `IdentityVaultService`, and `AdmissionLedgerService` in `server/src/services/`.
- **APIs**: Expose REST endpoints under `/api/v1/institutions/:institutionId/admissions` and `/api/v1/identity-gateway/verify`.
- **Workers**: Support asynchronous batch identity verification queue in BullMQ.
- **Security & Privacy**: Zero cleartext PII stored in operational admission tables; complete DPDP Act 2023 compliance.
