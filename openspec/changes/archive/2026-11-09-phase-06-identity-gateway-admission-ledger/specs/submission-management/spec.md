# Spec Delta: submission-management

## MODIFIED Requirements

### Requirement: Cryptographic Batch Sealing and Integrity Hash

The system SHALL compute a deterministic Merkle root hash and cryptographic SHA-256 seal over all staged student records when an authorized administrator seals a batch, promoting staged records to active admission records in the ledger and encrypting PII in the Identity Vault.

#### Scenario: Batch sealed with cryptographic signature

- **WHEN** an authorized institution administrator submits a sign-off request for a validated batch
- **THEN** the system generates a Merkle root hash of all staged student records, marks the batch as SEALED, records the sealing administrator identity, and prevents subsequent record edits

#### Scenario: Promotion to admission ledger and identity vault upon sealing

- **WHEN** a validated admission batch is successfully sealed
- **THEN** each staged student record is transformed into an active AdmissionRecord with pseudonymous token, student PII is encrypted in the Identity Vault, and an initial ADMITTED ledger event is created
