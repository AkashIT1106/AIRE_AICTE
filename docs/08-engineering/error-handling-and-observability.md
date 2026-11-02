# Error Handling and Observability

| Metadata             | Value                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/08-engineering/error-handling-and-observability.md`                                                                        |
| Authoritative For    | Pino Logging, Health Probes, Metrics, Structured Errors                                                                          |
| Status               | `CONFIRMED`                                                                                                                      |
| Source               | PROJECT_PLAN.md §11.3, §39.1 to §39.4                                                                                            |
| Related Requirements | [`AIRE-REQ-059`](../00-governance/requirements-traceability.md), [`AIRE-REQ-061`](../00-governance/requirements-traceability.md) |

---

## 1. Structured Logging with Pino

All server and worker logs are emitted as structured JSON via **Pino**:

- **Fields:** `timestamp`, `level`, `eventType`, `correlationId`, `tenantId`, `actorId`, `message`.
- **Sensitive Field Redaction:** Passwords, tokens, Aadhaar numbers, and raw identity payloads are automatically redacted by Pino serializers (`serializers: { req: ..., res: ... }`).

---

## 2. Health & Readiness Probes

The backend exposes two standardized operational endpoints:

- `GET /api/v1/health`: Liveness probe. Returns HTTP 200 if the Node.js process is active and accepting connections.
- `GET /api/v1/ready`: Readiness probe. Verifies active TCP connectivity to PostgreSQL (`SELECT 1`) and Redis (`PING`). Returns HTTP 503 if any dependency is degraded.
