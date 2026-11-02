# API Conventions and Error Schemas

| Metadata             | Value                                                                                                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/07-api-integrations/api-conventions.md`                                                                                                                                                     |
| Authoritative For    | Headers, Pagination, Error Conventions, Transport Security                                                                                                                                        |
| Status               | `CONFIRMED`                                                                                                                                                                                       |
| Source               | PROJECT_PLAN.md §11.3, §13.1, §13.3                                                                                                                                                               |
| Related Requirements | [`AIRE-REQ-086`](../00-governance/requirements-traceability.md), [`AIRE-REQ-087`](../00-governance/requirements-traceability.md), [`AIRE-REQ-089`](../00-governance/requirements-traceability.md) |

---

## 1. HTTP Headers & Conventions

- **Content-Type:** `application/json` (or `multipart/form-data` for batch file uploads).
- **Correlation ID:** Clients may send `X-Correlation-ID`. If missing, Express middleware generates a UUIDv7 and echoes it in the response header.
- **Session Auth:** Better Auth session cookie sent automatically via `credentials: 'include'`.
- **Pagination Parameters:** Standard query parameters: `page` (default: 1), `pageSize` (default: 25, max: 100), `sortBy`, `sortOrder` (`asc` | `desc`).

---

## 2. Standard Error Status Codes

| HTTP Status        | AIRE Error Code       | Condition                                                          |
| ------------------ | --------------------- | ------------------------------------------------------------------ |
| `400 Bad Request`  | `VALIDATION_ERROR`    | Request body or query failed Zod schema parsing.                   |
| `401 Unauthorized` | `UNAUTHENTICATED`     | Session cookie absent, expired, or invalid.                        |
| `403 Forbidden`    | `FORBIDDEN_SCOPE`     | User role lacks permission or cross-tenant query attempted.        |
| `404 Not Found`    | `RESOURCE_NOT_FOUND`  | Requested entity ID does not exist or belongs to another tenant.   |
| `409 Conflict`     | `BATCH_SEALED`        | Attempting to upload to a cohort that is already sealed or locked. |
| `429 Too Many Req` | `RATE_LIMIT_EXCEEDED` | Tenant or IP exceeded rate quota.                                  |
| `500 Server Error` | `INTERNAL_ERROR`      | Unhandled error; returns correlation ID with zero stack trace.     |
