# admission-ledger Specification

## Purpose

Maintains the authoritative, tamper-evident student admission lifecycle ledger with pseudonymous tokens, DPDP-compliant Identity Vault isolation, and immutable lifecycle transitions.

## Requirements

### Requirement: Pseudonymous Admission Records and Identity Vault Isolation

The system SHALL isolate raw student Personally Identifiable Information in an encrypted Identity Vault and reference students in operational tables only via pseudonymous tokens.

#### Scenario: Admission record created with pseudonymous token

- **WHEN** staged student records are promoted to active admission records
- **THEN** student demographic PII is encrypted with AES-256-GCM in the Identity Vault, and the operational record retains only a pseudonymous student token

#### Scenario: Purpose-bound vault access logging

- **WHEN** authorized operators query student details with a statutory purpose code
- **THEN** the system decrypts demographic PII and records an immutable audit event attributing the legal purpose and actor

### Requirement: Immutable Append-Only Lifecycle Event Ledger

The system SHALL record all student status changes chronologically as immutable ledger events including ADMITTED, BRANCH_CHANGE, LATERAL_ENTRY, CANCELLATION, and MIGRATION.

#### Scenario: Initial admission recorded upon batch sealing

- **WHEN** a submission batch is sealed and promoted into the admission ledger
- **THEN** the system records an initial ADMITTED or LATERAL_ENTRY ledger event with actor attribution

#### Scenario: Branch change recorded with sequence progression

- **WHEN** an authorized branch transfer is approved within the permitted transfer window
- **THEN** the system appends a BRANCH_CHANGE event with source and destination programme details while updating admission programme reference

### Requirement: Cancellation Entitlement Release

The system SHALL require authorized evidence for admission cancellations and release claimed seats back to the programme entitlement pool.

#### Scenario: Student admission cancellation releases seat

- **WHEN** an authorized administrator submits a cancellation request with valid supporting evidence
- **THEN** the admission record transitions to CANCELLED, a CANCELLATION event is appended to the ledger, and the occupied seat is released

### Requirement: Tamper-Evident Cryptographic Hash Chaining

The system SHALL calculate SHA-256 hash chains across consecutive ledger events for each student record to ensure verifiable integrity.

#### Scenario: Ledger verification detects tampering

- **WHEN** a ledger verification check is performed on an admission record's event history
- **THEN** the system recomputes the cryptographic hash chain and confirms that every event links unbroken to its predecessor
