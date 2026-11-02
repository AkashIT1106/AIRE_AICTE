# Changelog

All notable changes to the AIRE platform will be documented in this file.

## [Unreleased] - Phase 1 Foundation

### Added

- Monorepo workspace configuration with npm workspaces.
- Shared packages: `shared-types`, `validation`, `api-contracts`, `authorization`, `policy-engine`.
- Express backend application with structured Pino logging, correlation ID tracking, and centralized error handling.
- React frontend with Vite, Tailwind CSS, and TanStack Query foundation.
- Worker skeleton with BullMQ and Redis connection management.
- PostgreSQL database integration with Prisma ORM and foundational schema.
- Docker Compose multi-service development infrastructure (Postgres, Redis, MinIO).
- Test infrastructure using Vitest and Supertest.
- GitHub Actions CI pipeline configuration.
