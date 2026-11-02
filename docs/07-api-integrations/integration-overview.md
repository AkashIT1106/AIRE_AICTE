# Integration Hub and Provider Adapters (M07, M14)

| Metadata               | Value                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document               | `docs/07-api-integrations/integration-overview.md`                                                                                                                                                                                                                                                                                                                                                         |
| Authoritative For      | External Adapters, Resiliency Patterns, Adapter Modes                                                                                                                                                                                                                                                                                                                                                      |
| Status                 | `CONFIRMED`                                                                                                                                                                                                                                                                                                                                                                                                |
| Source                 | PROJECT_PLAN.md §14.1 to §14.4, §26, §33                                                                                                                                                                                                                                                                                                                                                                   |
| SSO Boundary Reference | [`docs/SSO_PROVIDER_INTEGRATION_BOUNDARY.md`](../SSO_PROVIDER_INTEGRATION_BOUNDARY.md)                                                                                                                                                                                                                                                                                                                     |
| Related Requirements   | [`AIRE-REQ-027`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-032`](../00-governance/requirements-traceability.md), [`AIRE-REQ-154`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-159`](../00-governance/requirements-traceability.md), [`AIRE-REQ-191`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-197`](../00-governance/requirements-traceability.md) |

---

## 1. External System Adapters

AIRE communicates with external national platforms through strictly isolated provider adapters:

- **APAAR Gateway Adapter (M07):** Resolves 12-digit student identifiers against central EduLocker registries.
- **Academic Bank of Credits (ABC) Adapter:** Future integration for synchronizing admission verification states.
- **DigiLocker NAD Adapter:** Issues signed AEP credentials to student digital wallets.
- **AICTE EOA Portal Adapter:** Ingests annual approved intake orders and programme allocations.

---

## 2. Adapter Execution Modes

Every external adapter supports three runtime execution modes selectable via environment configuration:

1. **`LIVE`:** Real production HTTP integration against authenticated government endpoints.
2. **`SANDBOX`:** Staging test environment integration using pre-configured synthetic student accounts.
3. **`MOCK`:** Local development mode with zero external network dependencies, returning deterministic synthetic responses.

---

## 3. Resiliency Patterns

- **Circuit Breakers:** Tripped if external API failure rate exceeds 50% over a 1-minute window, returning fast-fail `SERVICE_DEGRADED` responses.
- **Exponential Backoff:** Automated retries (3 attempts: 1s, 2s, 4s) on transient network timeouts (`ETIMEDOUT`, `ECONNRESET`).
- **Dead Letter Queue (DLQ):** Failed integration messages are quarantined in BullMQ DLQ for manual inspection.
