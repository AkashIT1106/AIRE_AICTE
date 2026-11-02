# Architecture Overview

| Metadata          | Value                                                                              |
| ----------------- | ---------------------------------------------------------------------------------- |
| Document          | `docs/03-architecture/architecture-overview.md`                                    |
| Authoritative For | Architectural Topology, Core Invariants                                            |
| Status            | `CONFIRMED`                                                                        |
| Source            | PROJECT_PLAN.md §8.1, §8.2, §8.3                                                   |
| Related Decisions | [`ADR-001`, `ADR-002`, `ADR-007`](../00-governance/decisions/decision-register.md) |

---

## 1. Architectural Approach: Modular Monolith

AIRE is engineered as a **modular monolith** with independently scalable background workers.

```
+-----------------------------------------------------------------------------------------+
| CLIENT TIER (SPA)                                                                       |
| React 18 + TypeScript + Vite + Tailwind CSS + TanStack Query + React Router             |
+-----------------------------------------------------------------------------------------+
                                           | HTTP / REST (/api/v1)
                                           v
+-----------------------------------------------------------------------------------------+
| APPLICATION CORE (Node.js + Express + TypeScript)                                       |
| Routes -> Validation (Zod) -> Auth Middleware -> Domain Services -> Prisma Repositories |
+-----------------------------------------------------------------------------------------+
            | Outbox Events                         | Interactive RLS Transactions
            v                                       v
+-----------------------+              +--------------------------------------------------+
| QUEUE TIER (BullMQ)   |              | DATABASE TIER (PostgreSQL 16)                    |
| Redis (Ephemeral)     |              | - Relational Business Entities                   |
| - Ingestion Worker    |              | - Forced Row-Level Security (Forced RLS)         |
| - APAAR Gateway Worker|              | - Isolated Identity Vault Schema (Envelope Enc)  |
| - Reconciliation Job  |              | - Immutable Append-Only Audit Trail              |
+-----------------------+              +--------------------------------------------------+
            | Optional Internal HTTP
            v
+-----------------------+
| OPTIONAL DOCUMENT AI  |
| Python + FastAPI      |
+-----------------------+
```

---

## 2. Core Architectural Invariants

1. **PostgreSQL is Authoritative:** PostgreSQL is the single source of truth. Redis is strictly ephemeral for BullMQ message transport and transient cache. No business state originates in Redis.
2. **Zero Direct Client Database Access:** The React frontend communicates strictly via versioned REST APIs (`/api/v1`).
3. **Deterministic Calculation:** 100% of admission entitlement arithmetic, quota checks, and mismatch logic is computed in pure deterministic TypeScript code. AI is never used to determine legal compliance.
4. **Tenant-Scoped Workers:** Every background BullMQ job payload carries an explicit `tenantId`. Workers execute within tenant boundaries and cannot leak cross-institution data.
5. **Clean Domain Boundaries:** Inter-module communication occurs via typed service interfaces or transactional domain events. No hidden cross-module database writes are permitted.
