# Technology Decisions

| Metadata          | Value                                                                     |
| ----------------- | ------------------------------------------------------------------------- |
| Document          | `docs/03-architecture/technology-decisions.md`                            |
| Authoritative For | Technology Stack, Library Selection, Tooling                              |
| Status            | `CONFIRMED`                                                               |
| Source            | PROJECT_PLAN.md §9.1 to §9.4, §45                                         |
| Related Decisions | [`ADR-001` to `ADR-010`](../00-governance/decisions/decision-register.md) |

---

## 1. Verified Technology Stack

| Layer                  | Technology            | Approved Version / Baseline  | Justification                                                   |
| ---------------------- | --------------------- | ---------------------------- | --------------------------------------------------------------- |
| **Frontend Framework** | React + TypeScript    | React 18.3+, Vite 6          | Fast HMR, strong typing, mature ecosystem.                      |
| **Styling & UI**       | Tailwind CSS          | Tailwind v3.4+               | Utility-first, zero runtime, accessible token integration.      |
| **Data Fetching**      | TanStack Query        | v5.66+                       | Declarative caching, optimistic updates, request deduplication. |
| **Client Routing**     | React Router          | v7.1+                        | Robust route guards, nested layouts, loader support.            |
| **Client Forms**       | React Hook Form + Zod | RHF 7.54+, Zod 3.24+         | Performant uncontrolled inputs, runtime schema validation.      |
| **Backend Runtime**    | Node.js + Express     | Node 20 LTS, Express 4.x     | Broad ecosystem, lightweight REST throughput.                   |
| **Language**           | TypeScript            | v5.5+ (Strict Mode)          | Zero `any` policy, compile-time type safety.                    |
| **Database ORM**       | Prisma                | v6.x / 7.x                   | Type-safe queries, committed migrations, connection pooling.    |
| **Primary Database**   | PostgreSQL            | PostgreSQL 16                | Forced Row-Level Security, JSONB support, ACID transactions.    |
| **Job Queue & Cache**  | BullMQ + Redis        | BullMQ 5.x, Redis 7          | Reliable delayed/retryable jobs, Redis in-memory speed.         |
| **Logging**            | Pino                  | Pino 9.x                     | Ultra-low overhead, structured JSON logs.                       |
| **Authentication**     | Better Auth           | `better-auth`                | Modern, local session management, Prisma adapter.               |
| **Document AI**        | Python + FastAPI      | Python 3.11+, FastAPI 0.110+ | Specialized PDF processing, OCR, machine learning isolation.    |
| **Containerization**   | Docker + Compose      | Docker 26+, Compose v2       | Local developer parity, micro-service isolation.                |
