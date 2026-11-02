# OpenAPI Specifications

| Metadata          | Value                                             |
| ----------------- | ------------------------------------------------- |
| Document          | `docs/07-api-integrations/openapi/README.md`      |
| Authoritative For | OpenAPI 3.1 Standards, Contract-First Definitions |
| Status            | `CONFIRMED`                                       |
| Source            | PROJECT_PLAN.md §13, §35.2, §42                   |

---

## 1. OpenAPI Standards

AIRE maintains OpenAPI 3.1 contracts for all external and internal REST endpoints.

- **Contract Location:** Contracts are generated and stored in this directory.
- **Validation:** Automated test suites validate that backend Express route implementations strictly conform to defined request/response schemas.
