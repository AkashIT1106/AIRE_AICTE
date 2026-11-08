# Spec Delta: Submission Management

## Purpose

Enforces the institutional admission batch lifecycle progression, regulatory freeze deadlines, cryptographic tamper-evident batch sealing, and tenant isolation for submission records.

## ADDED Requirements

### Requirement: Admission Batch Lifecycle Progression
The system SHALL govern admission batch state progression through DRAFT, VALIDATED, SEALED, and LOCKED states.

#### Scenario: Successful batch creation and transition to validated
- **WHEN** an institution operator uploads an admission batch file and schema validation succeeds
- **THEN** the batch transitions from DRAFT to VALIDATED state with updated record metrics

#### Scenario: Block unauthorized state jump
- **WHEN** an operator attempts to seal a batch that is still in DRAFT or has unaddressed quarantine items
- **THEN** the system rejects the sealing request with an invalid state transition error

### Requirement: Cryptographic Batch Sealing and Integrity Hash
The system SHALL compute a deterministic Merkle root hash and cryptographic SHA-256 seal over all staged student records when an authorized administrator seals a batch.

#### Scenario: Batch sealed with cryptographic signature
- **WHEN** an authorized institution administrator submits a sign-off request for a validated batch
- **THEN** the system generates a Merkle root hash of all staged student records, marks the batch as SEALED, records the sealing administrator identity, and prevents subsequent record edits

### Requirement: Regulatory Freeze Enforcement
The system SHALL enforce regulatory cutoff dates by disallowing modifications, uploads, or seal operations after the annual regulatory deadline.

#### Scenario: Modification attempted past regulatory freeze date
- **WHEN** an institution attempts to create, edit, or seal a batch after the regulatory freeze deadline has passed
- **THEN** the system rejects the operation with a regulatory freeze error and logs the attempt

### Requirement: Multi-Tenant Submission Isolation and Security
The system SHALL restrict all submission batch queries, uploads, and sealing operations to the authenticated institution's tenant context.

#### Scenario: Cross-institution submission blocked
- **WHEN** a client attempts to access or submit records for an institution ID different from the authenticated tenant session
- **THEN** the system blocks the request with an authorization error and emits a security audit event
