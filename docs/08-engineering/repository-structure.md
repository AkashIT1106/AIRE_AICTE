# Repository Structure

| Metadata          | Value                                         |
| ----------------- | --------------------------------------------- |
| Document          | `docs/08-engineering/repository-structure.md` |
| Authoritative For | Monorepo Directory Layout, Workspace Packages |
| Status            | `CONFIRMED`                                   |
| Source            | PROJECT_PLAN.md §35.1                         |

---

## 1. Monorepo Organization (pnpm Workspaces)

```text
aire-aicte/
├── client/                     # React 18 + Vite SPA application
│   ├── src/                    # UI components, pages, hooks, state
│   └── package.json            # @aire/client
├── server/                     # Node.js + Express backend API
│   ├── src/                    # Routes, controllers, services, repositories
│   ├── prisma/                 # Prisma schema, committed migrations
│   └── package.json            # @aire/server
├── workers/                    # BullMQ asynchronous background workers
│   ├── src/                    # Ingestion, APAAR, and reconciliation jobs
│   └── package.json            # @aire/workers
├── packages/                   # Shared TypeScript library packages
│   ├── types/                  # Shared domain types, DTOs, enums
│   ├── validation/             # Zod input schemas, environment validation
│   ├── reconciliation/         # Deterministic quota arithmetic & matching logic
│   └── policy-engine/          # Regulatory policy packs and test fixtures
├── services/                   # Optional microservices
│   └── document-ai/            # Optional Python FastAPI OCR/extraction service
├── infrastructure/             # Docker Compose, Nginx, PostgreSQL configs
├── docs/                       # Modular authoritative documentation system
├── prompts/                    # Task planning prompts and execution records
└── pnpm-workspace.yaml         # Monorepo workspace configuration
```
