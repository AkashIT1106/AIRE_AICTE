# authentication-service Specification

## Purpose

Provides standardized, auditable, and secure credential authentication, session lifecycle management, idle touch heartbeats, security step-up verification, and cross-device session termination under `/api/v1/auth`.

## Requirements

### Requirement: Local Credential Sign-In

The system SHALL authenticate users using email and password via `POST /api/v1/auth/sign-in`, returning user identity within the standard ApiResponse envelope, issuing HttpOnly session cookies, and logging audit events.

#### Scenario: Successful authentication

- **WHEN** client submits valid email and password
- **THEN** server returns HTTP 200 with user profile in ApiResponse and sets HttpOnly session cookie

#### Scenario: Failed authentication with invalid password

- **WHEN** client submits incorrect credentials
- **THEN** server returns HTTP 401 with UNAUTHORIZED code, increments rate-limit tracker, and logs a security audit event

### Requirement: Session Sign-Out and Invalidation

The system SHALL invalidate active user sessions via `POST /api/v1/auth/sign-out`, revoking the session token in the database, clearing the session cookie, and logging the termination.

#### Scenario: Successful sign-out

- **WHEN** an authenticated user calls `POST /api/v1/auth/sign-out`
- **THEN** server invalidates the session token, clears the cookie, returns HTTP 200, and subsequent calls with that session fail with HTTP 401

#### Scenario: Sign-out without session

- **WHEN** unauthenticated client calls `POST /api/v1/auth/sign-out`
- **THEN** server returns HTTP 401 with UNAUTHORIZED code

### Requirement: Active Session Status Resolution

The system SHALL provide session status via `GET /api/v1/auth/session` and full identity and tenancy context via `GET /api/v1/auth/me`.

#### Scenario: Fetch active session

- **WHEN** client provides a valid session cookie to `GET /api/v1/auth/session`
- **THEN** server returns HTTP 200 containing active user id and session validity

#### Scenario: Unauthenticated session check

- **WHEN** client calls `GET /api/v1/auth/session` without a session cookie
- **THEN** server returns HTTP 401 with UNAUTHORIZED error code

### Requirement: Inactivity Heartbeat and Idle Touch

The system SHALL refresh idle session timeout via `POST /api/v1/auth/session/touch` when invoked by an authenticated client, resetting the 30-minute inactivity timer.

#### Scenario: Successful session touch heartbeat

- **WHEN** authenticated user dispatches `POST /api/v1/auth/session/touch` during active session
- **THEN** server updates session last active timestamp and returns HTTP 200

#### Scenario: Unauthenticated touch attempt

- **WHEN** unauthenticated client dispatches `POST /api/v1/auth/session/touch`
- **THEN** server returns HTTP 401 and logs unauthenticated access block

### Requirement: Step-Up Re-Authentication for Irreversible Transactions

The system SHALL verify user password on `POST /api/v1/auth/step-up` for high-impact actions when active session age exceeds 15 minutes, issuing a verified step-up timestamp.

#### Scenario: Valid step-up password confirmation

- **WHEN** authenticated user provides current password to `POST /api/v1/auth/step-up`
- **THEN** server verifies password, records AUTH_STEPUP_SUCCESS audit event, and returns HTTP 200 with step-up verification confirmation

#### Scenario: Invalid step-up password

- **WHEN** authenticated user provides incorrect password to `POST /api/v1/auth/step-up`
- **THEN** server rejects transaction with HTTP 401 and records AUTH_STEPUP_FAILURE audit event

### Requirement: Multi-Device Session Revocation

The system SHALL invalidate all active sessions for a user across all devices upon explicit revocation request at `POST /api/v1/auth/sessions/revoke-all` or administrative operator revocation.

#### Scenario: User revokes all sessions

- **WHEN** authenticated user calls `POST /api/v1/auth/sessions/revoke-all`
- **THEN** server terminates all active session rows in the database for that user, logs AUTH_SESSION_REVOKED_ALL, and invalidates existing cookies
