# Spec Delta: Institution & Programme Registry

## Purpose

Maintains authoritative canonical references for educational institutions, multi-campus physical locations, academic programmes, and programme name aliases to govern admission reconciliations.

## ADDED Requirements

### Requirement: Authoritative Institution Profile Management

The system SHALL maintain regulatory profile records for AICTE-approved institutions including AICTE identifier, legal name, operational status, and geographical location.

#### Scenario: Successful retrieval of institution profile

- **WHEN** an authorized actor requests the profile of an existing institution by ID or AICTE ID
- **THEN** the system returns the institution profile including contact details, status, and associated campuses

#### Scenario: Unauthorized institution profile modification

- **WHEN** a non-admin actor from another institution attempts to modify an institution's profile
- **THEN** the system rejects the request with an authorization error and logs a security audit event

### Requirement: Multi-Campus Hierarchy Management

The system SHALL support multiple physical campuses linked to a parent institution, recording campus name, code, address, state, and active operational status.

#### Scenario: Registering a new campus under an institution

- **WHEN** an authorized institution administrator submits valid campus details
- **THEN** the system persists the campus associated with the institution and returns the created campus record

#### Scenario: Preventing duplicate campus codes within an institution

- **WHEN** an administrator attempts to register a campus with an existing campus code for that institution
- **THEN** the system rejects the creation with a uniqueness conflict error

### Requirement: Academic Programme Registry

The system SHALL maintain a canonical registry of academic programmes specifying canonical programme code, title, degree level, discipline, and standard duration in years.

#### Scenario: Querying canonical programme catalog

- **WHEN** any authenticated user queries the programme catalog with optional filters for discipline or degree level
- **THEN** the system returns matching active canonical programmes

### Requirement: Programme Alias Mapping

The system SHALL maintain aliases and historic titles mapped to canonical programme IDs to resolve variations in institution reporting.

#### Scenario: Resolving reported programme name through alias

- **WHEN** an institution provides a variant programme title during lookup
- **THEN** the system matches the alias to the canonical programme ID with confidence classification
