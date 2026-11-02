# API Overview

| Metadata             | Value                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/07-api-integrations/api-overview.md`                                                                                       |
| Authoritative For    | REST Hierarchy, Standard HTTP Status Codes, Response Envelopes                                                                   |
| Status               | `CONFIRMED`                                                                                                                      |
| Source               | PROJECT_PLAN.md §13.1, §13.2                                                                                                     |
| Related Requirements | [`AIRE-REQ-084`](../00-governance/requirements-traceability.md), [`AIRE-REQ-085`](../00-governance/requirements-traceability.md) |

---

## 1. REST Resource Hierarchy

AIRE APIs are versioned under `/api/v1` and organized into logical domain groups:

- `/api/v1/auth/*`: Better Auth session management, login, logout, password resets.
- `/api/v1/institutions/*`: Institution metadata, campuses, programmes, memberships.
- `/api/v1/approvals/*`: EOA/LOA orders, seat entitlements, approval documents.
- `/api/v1/submissions/*`: Batch uploads, ingestion status, sealing, frozen cohorts.
- `/api/v1/admissions/*`: Student admission ledger, lifecycle events, cancellation.
- `/api/v1/reconciliation/*`: Cohort evaluations, mismatch findings, replay simulator.
- `/api/v1/exceptions/*`: Show Cause notices, evidence uploads, dual sign-off hearings.
- `/api/v1/verifications/*`: Public AEP verification card, QR code resolver.
- `/api/v1/audit/*`: Auditor log queries, security event inspections.

---

## 2. Standard Response Envelope

All API endpoints return JSON conforming to a uniform envelope:

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Array<{ field?: string; message: string }>;
  };
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
  correlationId: string;
}
```
