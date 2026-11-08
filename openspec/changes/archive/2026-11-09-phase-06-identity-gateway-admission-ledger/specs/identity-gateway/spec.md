# Spec Delta: identity-gateway

## Purpose

Provides a secure, resilient adapter gateway for resolving student identity numbers (APAAR/EduLocker) across LIVE, SANDBOX, and MOCK execution modes with circuit breaking and correlation tracking.

## ADDED Requirements

### Requirement: Multi-Mode Execution Architecture

The system SHALL support LIVE, SANDBOX, and MOCK adapter execution modes configured via environment variables without requiring code modifications.

#### Scenario: Mock execution returns deterministic synthetic identity

- **WHEN** the adapter is configured in MOCK mode and receives a valid 12-digit APAAR request
- **THEN** the system returns a deterministic verified identity response without making external network calls

#### Scenario: Sandbox mode simulates external gateway environment

- **WHEN** the adapter is configured in SANDBOX mode and queries a test student identifier
- **THEN** the system resolves against the staging test registry with simulated latency and response flags

#### Scenario: Live mode executes against authenticated government endpoints

- **WHEN** the adapter is configured in LIVE mode and receives a verification request
- **THEN** the system invokes authoritative government EduLocker endpoints using configured client credentials

### Requirement: APAAR Identifier Verification and State Recording

The system SHALL resolve 12-digit APAAR identifiers and record the outcome as VERIFIED, UNVERIFIED, FAILED, or TIMEOUT.

#### Scenario: Valid identifier verified successfully

- **WHEN** a valid 12-digit APAAR identifier matching central records is verified
- **THEN** the system records the status as VERIFIED with verification timestamp and identity reference

#### Scenario: Invalid or unmatched identifier flagged as unverified

- **WHEN** an APAAR identifier does not exist or fails verification checks
- **THEN** the system records the status as UNVERIFIED without halting the verification queue

### Requirement: Circuit Breaker and Resiliency Patterns

The system SHALL trip a circuit breaker when external API failure rates exceed 50% over a 1-minute window and execute exponential backoff retries on transient errors.

#### Scenario: Circuit trips on elevated downstream failures

- **WHEN** downstream provider failure rate exceeds 50% within a 1-minute sliding window
- **THEN** subsequent calls fail immediately with SERVICE_DEGRADED status until cooldown expires

#### Scenario: Transient network failure triggers exponential backoff

- **WHEN** a network timeout occurs during an external provider call
- **THEN** the system retries up to 3 times with exponential backoff before recording a TIMEOUT status

### Requirement: Correlation Tracking and Health Metrics

The system SHALL track every external identity query using unique correlation IDs and monitor request volume, latency, and circuit breaker health.

#### Scenario: Verification traceable via correlation identifier

- **WHEN** an identity verification request is processed
- **THEN** all logs, metrics, and downstream headers include the request correlation ID
