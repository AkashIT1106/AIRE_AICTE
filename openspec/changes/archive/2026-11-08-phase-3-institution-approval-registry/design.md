# Design: Phase 3 Institution, Programme & Approval Registry

## Context

AIRE's Phase 2 established user authentication with Better Auth, multi-tenant authorization middleware, PostgreSQL forced Row-Level Security (RLS) with the `aire_app_user` restricted role, and immutable audit logging.

To progress to Phase 3 according to `docs/09-delivery/implementation-roadmap.md`, Developer A's modules (M02: Institution & Programme Registry and M03: Approval & Seat Entitlement Registry) must be vertically implemented. See `proposal.md` for background and problem motivation.

## Goals / Non-Goals

**Goals:**
- Provide complete relational modeling for Institutions, Campuses, Programmes, Programme Aliases, Approval Orders, and Seat Entitlements in Prisma with PostgreSQL RLS.
- Implement strictly validated CRUD services for institution profiles and multi-campus management.
- Implement programme catalog queries and programme alias resolution for admission normalization.
- Ingest and manage AICTE annual approval orders with supersession tracking and deterministic seat entitlement quota verification.
- Enforce role-based access control (AICTE Admin vs Institution Operator) and audit event emission for all registry operations.

**Non-Goals:**
- Ingesting student admission batches (Phase 5 / M05 & M06).
- Student identity verification with APAAR (Phase 6 / M07).
- Cross-institution cohort reconciliation execution (Phase 7 / M09 & M10).
- External automated scraping of AICTE portal approval letters.

## Decisions

### 1. Data Model & Relational Structure
- **Decision**: Model `Institution` as the top-level aggregate root with child `Campus` entities. Programmes are system-wide canonical entities (`canonical_code`, degree level, discipline) referenced by `ProgrammeAlias` and `SeatEntitlement`.
- **Alternatives Considered**: 
  - Making programmes scoped to single institutions: Rejected because AICTE programmes have standardized codes across technical education.
  - Storing quota breakdowns in a JSON column: Rejected because admission reconciliation requires deterministic SQL aggregation and constraint checking over quota categories (OPEN, SC, ST, OBC, EWS, TFW).

### 2. Approval Order Supersession Pattern
- **Decision**: Use an explicit `superseded_by_id` self-referential foreign key and an enumeration status (`DRAFT`, `ACTIVE`, `SUPERSEDED`). When an active order is superseded by a newer AICTE notification, updating the status occurs inside a database transaction alongside the creation of the new order.
- **Alternatives Considered**: 
  - Overwriting the existing approval order: Violates the regulatory requirement for immutable audit trails and historic reconciliation reproducibility.

### 3. Tenant Isolation & PostgreSQL RLS
- **Decision**: 
  - Tenant entities (`campuses`, `approval_orders`, `seat_entitlements`) have RLS policies permitting access if `current_setting('app.current_tenant_id') = institution_id` OR if the requesting user holds platform administrative roles (`SUPER_ADMIN`, `AICTE_ADMIN`, `AICTE_REVIEWER`).
  - Reference tables (`programmes`) permit SELECT for all authenticated users, while mutations require platform admin roles.
- **Alternatives Considered**: 
  - Middleware-only checks: Violates AIRE's defense-in-depth architectural invariant (§17 of `PROJECT_PLAN.md` and `AGENTS.md`).

### 4. Quota Validation Invariants
- **Decision**: Sanctioned seat entitlements require deterministic arithmetic validation:
  $$\text{Sanctioned Intake} = \text{Open} + \text{SC} + \text{ST} + \text{OBC} + \text{EWS}$$
  Supernumerary quotas (such as TFW and J&K quota) are explicitly tracked as additional allowed seats over and above the base intake.
- **Alternatives Considered**: 
  - Unvalidated intake limits: Allows erroneous data entry to invalidate downstream reconciliation engines.

## Risks / Trade-offs

- **[Risk]** Divergent naming of academic programmes across universities and state boards.
  - **Mitigation**: `ProgrammeAlias` table supports normalized fuzzy and exact matching mappings with confidence scores, requiring manual operator confirmation when ambiguity occurs.
- **[Risk]** Complex quota structures across different state reservation policies.
  - **Mitigation**: Quota columns cover all national statutory categories, with optional supernumerary breakdown extensible per state policy pack.
- **[Risk]** RLS performance impact on large registry queries.
  - **Mitigation**: Indexed foreign keys (`institution_id`, `approval_order_id`, `programme_id`) and simple equality checks in RLS policies.

## Migration Plan

1. Create Prisma migration adding `campuses`, `programmes`, `programme_aliases`, `approval_orders`, and `seat_entitlements` tables and altering `institutions`.
2. Apply RLS policies to new tables via raw SQL migration step, granting permissions to `aire_app_user`.
3. Add seed data in `prisma/seed.ts` for AICTE canonical programmes and sample institutions with approved intake.
4. Execute test suite covering RLS boundaries, quota math validation, and API routes.
