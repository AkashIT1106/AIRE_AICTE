# Spec Delta: Data Ingestion

## Purpose

Provides streaming spreadsheet parsing, column mapping, row-level validation, demographic cleaning, and quarantine triage for admission batch data.

## ADDED Requirements

### Requirement: Spreadsheet Parsing and Column Mapping
The system SHALL accept CSV and XLSX file formats up to 50MB and map input headers to canonical AICTE admission fields.

#### Scenario: Parse valid spreadsheet with header aliases
- **WHEN** an operator uploads a CSV or XLSX file containing known header variations (e.g., 'Roll No', 'Candidate Name', 'DOB')
- **THEN** the system normalizes headers to canonical schema fields and extracts all data rows without loss

#### Scenario: Reject unsupported file format or oversize payload
- **WHEN** an upload contains an unsupported MIME type or exceeds 50MB
- **THEN** the system rejects the file immediately with a descriptive validation error

### Requirement: Row-Level Schema Validation and Normalization
The system SHALL validate each admission row against programme code, date of birth, reservation category, quota code, and 12-digit APAAR formatting constraints.

#### Scenario: Valid row validation and demographic cleaning
- **WHEN** an admission row contains valid category, quota, and demographic values
- **THEN** the system trims whitespace, normalizes casing and dates to ISO-8601, and stages the record with ACCEPTED status

#### Scenario: Invalid APAAR or Category detected
- **WHEN** a row contains an invalid category code or malformed APAAR format
- **THEN** the system flags the row with a specific validation error code without rejecting other valid rows

### Requirement: Defective Row Quarantine and Isolation
The system SHALL isolate invalid rows into a dedicated quarantine store while allowing clean records to proceed to staged status.

#### Scenario: Mixed batch partitioning
- **WHEN** an uploaded batch of 100 rows contains 95 valid rows and 5 rows with validation errors
- **THEN** 95 rows are staged with ACCEPTED status, 5 rows are saved in quarantine with error diagnostics, and the batch status reflects quarantined rows present

### Requirement: Inline Quarantine Remediation
The system SHALL allow operators to correct quarantined rows inline, re-validating only the corrected fields and promoting successfully cleaned rows to staged status.

#### Scenario: Successful quarantine correction
- **WHEN** an operator submits valid corrections for a quarantined row
- **THEN** the system re-validates the row, updates its status to REMEDIATED, creates a staged record, and decrements the batch quarantine count

#### Scenario: Failed remediation attempt
- **WHEN** an operator submits corrections that still fail schema rules
- **THEN** the system keeps the row in quarantine, updates the diagnostic error list, and rejects the promotion with an unprocessable entity status
