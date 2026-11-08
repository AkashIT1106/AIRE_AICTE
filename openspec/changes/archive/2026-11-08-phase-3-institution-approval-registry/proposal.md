# Proposal: Phase 3 Institution, Programme & Approval Registry

## Why

AIRE requires an authoritative ground truth for institutions, campuses, approved programmes, and sanctioned seat entitlements before institution admissions can be ingested or reconciled. Without canonical registry references and annual AICTE approval orders, the system cannot validate student admissions or detect excess enrollments against sanctioned quotas.

Implementing Phase 3 establishes the foundation for Developer A's core domain modules (M02: Institution & Programme Registry and M03: Approval & Seat Entitlement Registry) in alignment with `docs/09-delivery/implementation-roadmap.md` and `docs/04-domain/domain-model.md`.

## What Changes

- **Institution & Programme Registry (M02)**:
  - Extend the `Institution` model with authoritative metadata (`aicteId`, `status`, `address`, `state`, `district`, `pincode`).
  - Introduce `Campus` entity under institutions for multi-campus support.
  - Introduce `Programme` entity with canonical codes, degree levels, disciplines, and duration.
  - Introduce `ProgrammeAlias` entity for fuzzy-matching normalization and mapping historical or institutional naming variations.
  - Implement CRUD services and REST endpoints with tenant/admin authorization and audit logging.
- **Approval & Seat Entitlement Registry (M03)**:
  - Introduce `ApprovalOrder` entity capturing annual AICTE regulatory orders (EOA/LOA/Extension of Approval) with status, academic year, order number, and supersession links.
  - Introduce `SeatEntitlement` entity capturing sanctioned seat counts per programme, quota distributions (OPEN, SC, ST, OBC, EWS, TFW, supernumerary quotas).
  - Implement approval order ingestion/creation, validation rules (intake arithmetic consistency), and read APIs.
- **Database Migrations & Test Suites**:
  - Committed Prisma migration extending schema with indexes, foreign keys, and RLS policies for registry tables.
  - Unit and integration test suites validating data integrity, quota math constraints, and role-based permissions.

## Capabilities

### New Capabilities
- `institution-registry`: Authoritative lifecycle management for institutions, campuses, academic programmes, and programme aliases.
- `approval-entitlement-registry`: Management of annual AICTE approval orders (EOA/LOA) and granular seat entitlements (sanctioned intake, reservation breakdown).

### Modified Capabilities
<!-- No existing OpenSpec capabilities to modify -->

## Impact

- **Database**: Add `campuses`, `programmes`, `programme_aliases`, `approval_orders`, and `seat_entitlements` tables via committed Prisma migrations; update `institutions` table with regulatory fields.
- **Server**: New domain modules under `server/src/modules/institution-registry` and `server/src/modules/approval-registry` (or respective routes and services); register endpoints under `/api/v1/institutions` and `/api/v1/approvals`.
- **Packages**: Update `@aire/shared-types` and `@aire/validation` with schemas for campuses, programmes, approval orders, and seat entitlements.
- **Security & Authorization**: RLS policies ensuring tenant institutions can only view their own campuses and approval orders while AICTE admins retain platform-wide management access.
