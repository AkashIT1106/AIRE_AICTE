# AIRE — AICTE Admission Reconciliation & Evidence Platform

> Authoritative product, architecture, engineering, security, privacy, and regulatory reconciliation platform for AICTE.

## Phase 1 — Engineering Foundation

This repository contains the monorepo workspace for AIRE, implemented strictly according to [`PROJECT_PLAN.md`](./PROJECT_PLAN.md).

### Repository Structure

```text
aire/
├── client/          # React + Vite + Tailwind CSS frontend
├── server/          # Express + TypeScript + Prisma API service
├── workers/         # BullMQ + Redis background workers
├── packages/        # Shared domain packages
│   ├── shared-types/    # Core DTOs and API envelope types
│   ├── validation/      # Shared Zod validation schemas
│   ├── api-contracts/   # Standard endpoint contracts
│   ├── authorization/   # RBAC & scope definitions
│   └── policy-engine/   # Policy rule engine types
├── infrastructure/  # Docker, PostgreSQL, Redis, Nginx configurations
├── docs/            # Architecture and implementation documentation
└── tests/           # Integration and cross-cutting tests
```

### Prerequisites

- Node.js >= 22.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose

### Quick Start

1. **Setup environment variables:**

   ```bash
   cp .env.example .env
   ```

2. **Start infrastructure services (PostgreSQL & Redis):**

   ```bash
   docker compose up -d postgres redis
   ```

3. **Install dependencies:**

   ```bash
   pnpm install
   ```

4. **Run database migrations:**

   ```bash
   pnpm run prisma:generate
   pnpm run prisma:migrate
   ```

5. **Run test suites:**

   ```bash
   pnpm run test
   ```

6. **Verify build and typecheck:**

   ```bash
   pnpm run typecheck
   pnpm run build
   ```

7. **Start development servers:**
   - API Server: `pnpm --filter @aire/server dev`
   - Client: `pnpm --filter @aire/client dev`
   - Worker: `pnpm --filter @aire/workers dev`
