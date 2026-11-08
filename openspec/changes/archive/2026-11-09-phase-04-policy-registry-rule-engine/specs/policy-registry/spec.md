# Spec Delta

## Purpose

Enables regulatory administrators to define, test, notify, and replay immutable versioned AICTE policy packs containing deterministic admission entitlement and quota arithmetic rules based on official AICTE Approval Process Handbook (APH) regulatory states.

## ADDED Requirements

### Requirement: Policy Pack Versioning and Statutory Lifecycle Management

The system SHALL maintain versioned regulatory policy packs linked to specific academic years and enforce the official AICTE statutory lifecycle states: DRAFT -> COUNCIL_REVIEW -> GAZETTE_NOTIFIED -> IN_FORCE -> SUPERSEDED (with AMENDED status for official corrigenda).

#### Scenario: Create a draft policy pack

- **WHEN** an authorized AICTE administrator submits a new policy pack with an academic year, title, and Approval Process Handbook edition
- **THEN** the system SHALL create the policy pack in DRAFT status, generate an initial content hash, and record the author identity.

#### Scenario: Submit draft for council review

- **WHEN** all policy test fixtures pass with 100% accuracy and an administrator submits the pack for council review
- **THEN** the system SHALL advance the pack status to COUNCIL_REVIEW and lock rule parameters against unversioned modification.

#### Scenario: Gazette notification and enforcement

- **WHEN** the Executive Committee approves the pack and a distinct authorized reviewer signs off with gazette notification details and step-up verification
- **THEN** the system SHALL advance the pack to GAZETTE_NOTIFIED, immediately transition it to IN_FORCE as the active governing handbook, and mark any previous active pack for that academic year as SUPERSEDED.

#### Scenario: Issue corrigendum or amendment

- **WHEN** AICTE issues an official Corrigendum or Addendum modifying an in-force handbook clause
- **THEN** the system SHALL create an AMENDED version linked to the parent pack with an immutable delta hash and effective date.

### Requirement: Declarative Policy Rule Configuration

The system SHALL allow administrators to configure declarative evaluation rules within a DRAFT policy pack across categories including CAPACITY, QUOTA, ELIGIBILITY, and TIMELINE with handbook clause citations and parameter schemas.

#### Scenario: Add rule definition to draft pack

- **WHEN** an administrator adds an intake ceiling rule with sanctioned intake parameters and handbook clause references to a DRAFT policy pack
- **THEN** the system SHALL store the rule definition and update the policy pack content hash.

#### Scenario: Prevent modifying rules on in-force policy pack

- **WHEN** any user attempts to modify or delete a rule on an IN_FORCE or SUPERSEDED policy pack
- **THEN** the system SHALL reject the request with an HTTP 409 Conflict error and preserve rule immutability.

### Requirement: Deterministic Quota and Intake Arithmetic Evaluation

The rule engine SHALL deterministically compute statutory reservation breakdowns (SC 15%, ST 7.5%, OBC 27%, Open remainder with floor rounding) and supernumerary caps (EWS 10%, TFW 5%, Lateral Entry 10% with ceiling rounding) against approved intake.

#### Scenario: Evaluate regular intake ceiling

- **WHEN** regular admitted enrollment exceeds sanctioned approved intake
- **THEN** the rule engine SHALL return a status of VIOLATION with breach magnitude and clause citation.

#### Scenario: Evaluate statutory reservation quotas

- **WHEN** category student admissions comply with statutory floor percentages of sanctioned intake
- **THEN** the rule engine SHALL return a status of COMPLIANT for each reservation category.

### Requirement: Institutional Penal Status Evaluation (APH Chapter VII)

The rule engine SHALL evaluate admission compliance against the institution's official AICTE regulatory status: APPROVED, REDUCED_INTAKE, NO_ADMISSION, WITHDRAWAL_OF_APPROVAL, or RESTORATION.

#### Scenario: Block admissions under NO_ADMISSION status

- **WHEN** an institution has an official regulatory status of NO_ADMISSION for an academic year and student admissions are submitted
- **THEN** the rule engine SHALL flag all admitted students as severe VIOLATION citing APH Chapter VII penal action.

#### Scenario: Enforce capped quota under REDUCED_INTAKE status

- **WHEN** an institution is placed under REDUCED_INTAKE penal action by AICTE
- **THEN** the rule engine SHALL evaluate admitted student counts against the curtailed intake quota rather than the original sanctioned intake.

### Requirement: Automated Rule Test Fixture Execution

The system SHALL require all associated test fixtures to execute with 100% pass rate before a policy pack can transition from DRAFT to COUNCIL_REVIEW status.

#### Scenario: Successful fixture execution passes policy pack

- **WHEN** an administrator runs the test fixtures for a policy pack and all test cases pass
- **THEN** the system SHALL record the fixture run timestamp, set fixture pass rate to 100%, and allow transition to COUNCIL_REVIEW status.

#### Scenario: Failing fixtures block review transition

- **WHEN** one or more test fixtures fail during execution
- **THEN** the system SHALL retain the policy pack in DRAFT status, record failure details, and block transition to COUNCIL_REVIEW status.

### Requirement: Dual-Authorization Activation Sign-off

The system SHALL require a secondary authorized AICTE administrator, distinct from the pack author, to sign off and activate a policy pack using step-up re-authentication.

#### Scenario: Successful dual-authorization activation

- **WHEN** an AICTE administrator distinct from the policy author signs off on a COUNCIL_REVIEW-status policy pack with valid step-up credentials and gazette reference
- **THEN** the system SHALL transition the policy pack to IN_FORCE, mark any previously active pack for that academic year as SUPERSEDED, and record an immutable sign-off audit log.

#### Scenario: Reject author self-activation

- **WHEN** the original author of the policy pack attempts to activate the policy pack
- **THEN** the system SHALL reject the activation request with an HTTP 400 Bad Request error citing separation of duties violation.

### Requirement: Temporal Regulatory Replay Simulator

The system SHALL support comparative replay simulation evaluating historical or candidate student admission cohorts against any versioned policy pack without mutating authoritative admission or reconciliation records.

#### Scenario: Replay evaluation on historical cohort

- **WHEN** an auditor or administrator triggers a replay simulation selecting a historical cohort and a target policy pack version
- **THEN** the system SHALL execute deterministic rule evaluation, return compliance comparison breakdown metrics, and leave database records unchanged.
