# Design: Phase 5 Institution Submission & Ingestion Pipeline

## Context

See `proposal.md` for motivation and background. Prior phases established authentication and RBAC/ABAC (Phase 1 & 2), the Institution and Approval Registry (Phase 3), and the Regulatory Policy Registry (Phase 4). Currently, `SubmissionService` stores transient batches inside generic `InstitutionRecord` payload blobs. Phase 5 establishes the production-grade PostgreSQL relational schema, BullMQ background ingestion worker, streaming parsing, row quarantine triage, and cryptographic Merkle sealing required by Module M05 and Module M06.

## Goals / Non-Goals

**Goals:**

- Replace generic `InstitutionRecord` storage with dedicated relational models: `SubmissionBatch`, `StagedAdmissionRecord`, and `QuarantinedAdmissionRecord` with full multi-tenant RLS isolation.
- Provide asynchronous spreadsheet ingestion via BullMQ (`aire-submission-ingestion`), supporting CSV and XLSX format parsing and canonical column normalization.
- Enforce strict state progression: `DRAFT` -> `VALIDATING` -> `VALIDATED` -> `SEALED` -> `LOCKED`.
- Isolate defective rows into quarantine with machine-readable error codes (`ERR_INVALID_APAAR_FORMAT`, `ERR_UNKNOWN_PROGRAMME_CODE`, `ERR_INVALID_CATEGORY`, `ERR_INVALID_DOB`) without dropping valid rows in the batch.
- Provide inline quarantine remediation API (`PATCH /quarantine/:rowId`) that re-validates and promotes clean records to staged status.
- Implement tamper-evident batch sealing with SHA-256 Merkle root computation over sorted staged records.
- Enforce regulatory freeze deadlines to prevent submissions past annual cutoff.

**Non-Goals:**

- External APAAR API network verification and Identity Vault encryption (deferred to Phase 6 / M07 & M08).
- Multi-institution reconciliation and intake quota breach adjudication (deferred to Phase 7 / M09 & M10).
- Formal show-cause exception workbench (deferred to Phase 8 / M11).
- PDF AEP generation and verifiable student credentials (deferred to Phase 9 / M12).

## Decisions

### Decision 1: Relational Schema vs JSON Document Storage

- **Choice:** Dedicated PostgreSQL tables (`SubmissionBatch`, `StagedAdmissionRecord`, `QuarantinedAdmissionRecord`) with foreign keys to `Institution` and `Programme`.
- **Rationale:** Staged records will be directly evaluated and linked to the Admission Ledger in Phase 6 and Reconciliation Engine in Phase 7. Relational tables with indexes on `(institution_id, programme_id)` and `(batch_id, roll_number)` provide deterministic query performance and enable database-level RLS enforcement.
- **Alternatives Considered:** Continuing to store records in JSON payloads inside `InstitutionRecord`. Rejected because it prevents efficient pagination, foreign-key consistency, and index-accelerated duplicate detection.

### Decision 2: Asynchronous Ingestion via BullMQ Queue

- **Choice:** Dispatch upload jobs to `aire-submission-ingestion` queue in BullMQ, handled by worker instances with progress updates.
- **Rationale:** Batch uploads may contain up to 5,000 student records per institution programme. Synchronous HTTP handling risks gateway timeouts and blocking the event loop.
- **Alternatives Considered:** In-memory synchronous parsing. Rejected due to HTTP request timeout limits and lack of fault tolerance if the server restarts mid-parse.

### Decision 3: Deterministic Merkle Root Calculation for Sealing

- **Choice:** Compute a deterministic binary Merkle tree hash across all staged records sorted lexicographically by `(rollNumber, studentName, id)`.
- **Rationale:** Merkle trees allow cryptographic proof of inclusion for individual student records during subsequent verification and audits without revealing the entire cohort.
- **Alternatives Considered:** Simple single SHA-256 hash of the JSON payload. Rejected because it cannot generate per-student inclusion proofs for verifiable credentials.

### Decision 4: Quarantine Triage and Inline Remediation Strategy

- **Choice:** Defective rows are saved to `QuarantinedAdmissionRecord` with raw payload and an array of error diagnostics. The remediation endpoint re-evaluates only corrected fields; if valid, a new `StagedAdmissionRecord` is created, the quarantine row status is updated to `REMEDIATED`, and batch counts are updated atomically.
- **Rationale:** Prevents whole-batch rejections when only a tiny fraction of rows have syntax or typo errors, aligning with user journey J-02.
- **Alternatives Considered:** Rejecting the whole upload if any row has errors. Rejected as it creates massive operator friction.

## Risks / Trade-offs

- **[Risk] Large spreadsheet memory consumption** → Mitigation: Use streaming parsers for CSV and XLSX sheet row iteration; process rows in batches of 250 items to bound memory footprint.
- **[Risk] Race condition during concurrent inline quarantine remediation** → Mitigation: Execute quarantine remediation in an atomic PostgreSQL transaction scoped to tenant ID and batch ID.
- **[Risk] Cross-tenant access attempt** → Mitigation: Apply `withTenantContext` wrapper and verify that `req.tenantContext.institutionId` strictly matches the targeted resource.

## Migration Plan

1. Create Prisma migration adding `submission_batches`, `staged_admission_records`, and `quarantined_admission_records` with RLS policies and indexes.
2. Update `@aire/validation` with schemas for batch submission, row mapping, and quarantine remediation.
3. Update `@aire/shared-types` with batch, staged, and quarantine models.
4. Implement `SubmissionService` with database-backed methods and Merkle tree calculations.
5. Implement BullMQ `ingestionWorker` in `workers/` to process background ingestion jobs.
6. Enhance `server/src/routes/submission.routes.ts` with all lifecycle and quarantine endpoints.
7. Run automated test suite validating multi-tenant isolation, quarantine partitioning, inline remediation, and batch sealing.
