# Proposal: Phase 5 Institution Submission & Ingestion Pipeline

## Why

Institutions currently lack a persistent, asynchronous, and tamper-evident admission submission and ingestion pipeline to upload student cohorts, perform streaming parse and column mapping, validate against AICTE intake and identity constraints, quarantine defective rows without batch abandonment, and cryptographically seal validated submissions before regulatory deadlines.

Implementing Phase 5 delivers Module M05 (Submission Management) and Module M06 (Data Ingestion Pipeline), replacing transient placeholder records with dedicated PostgreSQL relational tables, background BullMQ processing workers, cryptographic Merkle/SHA-256 batch sealing, and inline quarantine remediation per `docs/04-domain/workflows/admission-submission-workflow.md`, `docs/06-data/data-quality-and-validation.md`, screens S-11/S-12, journey J-02, and requirements `AIRE-REQ-021`–`026` and `AIRE-REQ-143`–`154`.

## What Changes

- **Database Models (`server/prisma/schema.prisma`)**:
  - `SubmissionBatch`: Dedicated tenant-scoped entity tracking annual batch lifecycle (`DRAFT`, `VALIDATED`, `SEALED`, `LOCKED`), academic year, programme ID, uploaded file metadata, SHA-256 file hash, cryptographic Merkle seal hash, batch metrics (total, staged, quarantined), submission freeze cutoff timestamp, and sealing operator signature.
  - `StagedAdmissionRecord`: Normalized valid student admission records (`batchId`, `programmeId`, `academicYear`, `studentName`, `rollNumber`, `dateOfBirth`, `gender`, `category`, `quota`, `apaarId`, `status: ACCEPTED`).
  - `QuarantinedAdmissionRecord`: Defective admission rows quarantined without dropping the batch (`batchId`, `rowNumber`, `rawPayload`, `errorCodes`, `errorDetails`, `status: QUARANTINED | REMEDIATED | DISCARDED`).
  - Row-Level Security (RLS) policies and composite indexes for multi-tenant isolation on `institution_id`.
- **Background Ingestion Worker (`workers/src/ingestion.worker.ts`)**:
  - Dedicated BullMQ queue `aire-submission-ingestion` processing CSV and XLSX spreadsheet payloads asynchronously.
  - Header normalization and column mapping against canonical AICTE fields.
  - Row-level Zod validation with Luhn-variant 12-digit APAAR checks and demographic string sanitation.
  - Partitioning into `StagedAdmissionRecord` and `QuarantinedAdmissionRecord` with progress tracking.
- **Submission & Ingestion Services & APIs (`server/src/routes/submission.routes.ts`)**:
  - `POST /api/v1/institutions/:institutionId/submissions`: Create submission batch and enqueue asynchronous ingestion job.
  - `GET /api/v1/institutions/:institutionId/submissions`: List submission batches for tenant institution.
  - `GET /api/v1/institutions/:institutionId/submissions/:batchId`: Retrieve batch metadata, processing progress, and metrics.
  - `GET /api/v1/institutions/:institutionId/submissions/:batchId/quarantine`: Paginated listing of quarantined rows.
  - `PATCH /api/v1/institutions/:institutionId/submissions/:batchId/quarantine/:rowId`: Remediate quarantined row inline; re-validates and promotes to staged on success.
  - `POST /api/v1/institutions/:institutionId/submissions/:batchId/seal`: Cryptographically seal batch with Merkle root hash and sign-off, transitioning to `SEALED`.
  - Regulatory freeze enforcement preventing modification or sealing after annual deadline.
- **Audit & Security**:
  - Strict tenant authorization preventing cross-institution submission attempts (logging security violation on mismatch).
  - Audit logging for `BATCH_UPLOADED`, `BATCH_INGESTED`, `QUARANTINE_REMEDIATED`, `BATCH_SEALED`, and `FREEZE_ENFORCED`.

## Capabilities

### New Capabilities

- `submission-management`: Manages institutional admission batch lifecycle progression (`DRAFT` -> `VALIDATED` -> `SEALED` -> `LOCKED`), freeze deadline enforcement, cryptographic batch sealing with SHA-256/Merkle proofs, and immutable audit tracking.
- `data-ingestion`: Handles streaming parsing of CSV/XLSX spreadsheets, dynamic column mapping, row-level schema validation, deterministic demographic cleaning, defective row quarantine, and inline remediation.

### Modified Capabilities

<!-- No existing OpenSpec capabilities to modify -->

## Impact

- **Database**: Add `submission_batches`, `staged_admission_records`, and `quarantined_admission_records` tables with tenant foreign keys and RLS policies.
- **Workers**: New `ingestionWorker` in `@aire/workers` backed by Redis and BullMQ.
- **Packages**: Ensure `@aire/validation` and `@aire/shared-types` contain comprehensive types and schemas for batch states, staged records, and quarantine error codes.
- **APIs**: Enhance `submission.routes.ts` with dedicated endpoints for upload, progress, quarantine triage, remediation, and sealing.
