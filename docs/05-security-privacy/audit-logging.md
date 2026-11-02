# Audit Logging Specification

| Metadata             | Value                                                                                                                                                                                                                                                                |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/05-security-privacy/audit-logging.md`                                                                                                                                                                                                                          |
| Authoritative For    | Immutable Audit Trail, Event Schema, Tamper Evidence                                                                                                                                                                                                                 |
| Status               | `CONFIRMED`                                                                                                                                                                                                                                                          |
| Source               | PROJECT_PLAN.md §19.1, §19.2, §19.3, ADR-009                                                                                                                                                                                                                         |
| Related Requirements | [`AIRE-REQ-067`](../00-governance/requirements-traceability.md), [`AIRE-REQ-088`](../00-governance/requirements-traceability.md), [`AIRE-REQ-114`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-117`](../00-governance/requirements-traceability.md) |

---

## 1. Immutable Audit Trail Design

AIRE maintains a tamper-evident audit log of all business mutations and security events:

- Audit tables are append-only. `UPDATE` and `DELETE` grants are revoked from `aire_app_user`.
- Audit writes occur within the same database transaction as the mutating action to guarantee non-repudiation.

---

## 2. Structured Audit Event Schema

Every audit record conforms to the following schema:

| Field Name       | Type        | Description                                                                  |
| ---------------- | ----------- | ---------------------------------------------------------------------------- |
| `id`             | `UUIDv7`    | Time-ordered unique event identifier.                                        |
| `actor_id`       | `String`    | Unique user ID of the authenticated user performing the action.              |
| `actor_role`     | `String`    | Role active at the time of execution (e.g. `INST_OPERATOR`).                 |
| `tenant_id`      | `String`    | Institution or regional tenant ID.                                           |
| `action`         | `String`    | Structured verb (e.g. `BATCH_SEAL`, `SHOW_CAUSE_DISPATCH`, `VAULT_DECRYPT`). |
| `target_entity`  | `String`    | Entity type affected (e.g. `SubmissionBatch`, `ExceptionCase`).              |
| `target_id`      | `String`    | Primary key of the affected entity.                                          |
| `correlation_id` | `UUID`      | Request trace ID passed via `X-Correlation-ID` header.                       |
| `client_ip`      | `String`    | Masked client IP address.                                                    |
| `payload_diff`   | `JSONB`     | Before/after state snapshot (with PII fields masked).                        |
| `hash_chain`     | `String`    | SHA-256 hash linking to the preceding audit entry.                           |
| `timestamp`      | `Timestamp` | Authoritative UTC database timestamp.                                        |
