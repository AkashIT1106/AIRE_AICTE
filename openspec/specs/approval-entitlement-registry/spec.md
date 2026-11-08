# approval-entitlement-registry Specification

## Purpose

Maintains immutable annual AICTE approval orders (Extension of Approval / Letter of Approval) and granular programme seat entitlement quotas to validate admission limits deterministically.

## Requirements

### Requirement: Annual Approval Order Ingestion
The system SHALL ingest and maintain versioned AICTE approval orders per institution and academic year, capturing regulatory order number, order type, issuance date, status, and supersession links.

#### Scenario: Ingesting a valid EOA approval order
- **WHEN** an AICTE administrator uploads an official Extension of Approval order for an institution and academic year
- **THEN** the system creates the approval order in ACTIVE status and links it to the target institution

#### Scenario: Superseding an existing approval order
- **WHEN** a revised approval order is issued for an institution and academic year with an existing active order
- **THEN** the system sets the previous order status to SUPERSEDED, records the superseding order reference, and preserves the historical audit trail

### Requirement: Sanctioned Seat Entitlement Quotas
The system SHALL record sanctioned intake and category quotas (OPEN, SC, ST, OBC, EWS, TFW, supernumerary) for each programme approved under an approval order.

#### Scenario: Validating quota arithmetic consistency
- **WHEN** seat entitlements are submitted where category breakdowns do not conform to total sanctioned intake rules
- **THEN** the system rejects the entitlement record with a validation error detailing the arithmetic discrepancy

#### Scenario: Retrieving approved entitlements for admission verification
- **WHEN** an authorized client queries seat entitlements for an institution programme in a specific academic year
- **THEN** the system returns the active approved intake and exact category quota limits
