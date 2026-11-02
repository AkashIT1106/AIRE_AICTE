# Central Decision Register

| Metadata     | Value                                               |
| ------------ | --------------------------------------------------- |
| Document     | `docs/00-governance/decisions/decision-register.md` |
| Status       | `APPROVED`                                          |
| Last Updated | 2 November 2026                                     |
| Decision Key | `Open` · `Proposed` · `Approved` · `Rejected`       |

---

## 1. Architectural Decisions (Locked)

### ADR-001 — Primary Architecture: Modular Monolith

- **Status:** `Approved`
- **Context:** PROJECT_PLAN.md §8.1, §45. Distributed microservices introduce high operational complexity, distributed transaction failure modes, and security boundary leakage.
- **Decision:** AIRE is built as a single Node.js/Express modular monolith with independently scalable BullMQ background workers and shared database persistence.

### ADR-002 — Persistence & Authority: PostgreSQL Authoritative, Redis Ephemeral

- **Status:** `Approved`
- **Context:** PROJECT_PLAN.md §8.3, §12.1, §45. Regulatory admissions require ACID guarantees, relational integrity, and forced row-level isolation.
- **Decision:** PostgreSQL is the sole authoritative persistence store for all business entities, audit logs, and entitlements. Redis is strictly an ephemeral transport layer for BullMQ queues and volatile caches. Business state must never originate or rely solely on Redis.

### ADR-003 — Local Authentication Baseline: Better Auth

- **Status:** `Approved`
- **Context:** Phase 2 Task Scope, PROJECT_PLAN.md §16.1. AIRE requires secure email/password authentication, session management, CSRF prevention, and Prisma-backed session tables.
- **Decision:** Better Auth (`better-auth`) is adopted for core local authentication and session token issuance.

### ADR-004 — Decoupled External Identity & SSO Boundary

- **Status:** `Approved`
- **Context:** User instruction, `docs/SSO_PROVIDER_INTEGRATION_BOUNDARY.md`. External SSO providers (AICTE SSO, MeriPehchaan, DigiLocker) require official government credentials, verified endpoints, and legal onboarding agreements which are unavailable in early phases.
- **Decision:** External SSO is decoupled and marked as future scope. Better Auth handles local sessions. External SSO providers will connect later via standard OIDC callbacks without changing AIRE's internal user memberships, tenant isolation, or RLS.

### ADR-005 — Database Multi-Tenancy: PostgreSQL Forced Row-Level Security (RLS)

- **Status:** `Approved`
- **Context:** PROJECT_PLAN.md §12.5, §17. Multi-tenant security must not rely solely on application middleware `WHERE tenant_id = ?` clauses.
- **Decision:** Tenant isolation is enforced natively in the PostgreSQL engine via `ENABLE ROW LEVEL SECURITY` and `FORCE ROW LEVEL SECURITY`. Application queries run under a restricted non-superuser role `aire_app_user` within interactive transactions setting `SET LOCAL app.current_tenant_id`.

### ADR-006 — Prerequisite Database Migration Discipline

- **Status:** `Approved`
- **Context:** Phase 1 audit finding, AGENTS.md §9. `server/package.json` was using `prisma db push` with no committed migration history. In PostgreSQL, superusers bypass RLS.
- **Decision:** `prisma db push` is rejected for development and production workflows. All schema evolutions must be performed via committed Prisma migrations (`prisma migrate dev`). Database roles must include restricted `aire_app_user` (`NOSUPERUSER`, `NOBYPASSRLS`).

### ADR-007 — Regulatory Evaluation Determinism

- **Status:** `Approved`
- **Context:** PROJECT_PLAN.md §4.3, §8.3. AI or probabilistic models cannot establish regulatory policy, declare fraud, or modify approval records.
- **Decision:** 100% of admission entitlement calculations, quota reservation arithmetic, mismatch detections, and AEP generation are performed by deterministic TypeScript code.

### ADR-008 — Identity Vault & Envelope Encryption for PII

- **Status:** `Approved`
- **Context:** PROJECT_PLAN.md §15, §18, DPDP Act 2023. Raw national identity numbers (Aadhaar, APAAR) and student demographic data must not be stored in cleartext in operational admission tables.
- **Decision:** PII is isolated in a separate Identity Vault schema, protected by AES-256-GCM envelope encryption (DEK + KEK). Operational tables reference pseudonymous student tokens.

### ADR-009 — Immutable Append-Only Audit Trail

- **Status:** `Approved`
- **Context:** PROJECT_PLAN.md §19. Regulatory accountability requires non-repudiation and complete traceability of all administrative actions.
- **Decision:** Audit log tables are append-only. `UPDATE` and `DELETE` grants are revoked from all application database roles. Sensitive actions include actor ID, role, tenant ID, correlation ID, and payload diffs.

### ADR-010 — Optional Document AI Service: Python FastAPI

- **Status:** `Approved`
- **Context:** PROJECT_PLAN.md §9.3. Document extraction (PDF approvals, OCR, document classification) requires specialized Python machine learning ecosystems.
- **Decision:** Document AI is isolated in an optional, stateless Python FastAPI microservice that communicates with Node.js workers via internal HTTP APIs. It has zero direct access to the primary database.

---

## 2. Accessibility & Standards Decisions

### ADR-011 — Accessibility Standard: WCAG 2.2 AA Baseline

- **Status:** `Approved` (with Open Verification item)
- **Context:** PROJECT_PLAN.md §7, `docs/04-frontend/design-foundations-audit.md`. Web interfaces must be accessible to students and administrators with disabilities.
- **Decision:** WCAG 2.2 Level AA is the binding technical accessibility baseline.
- **Open Item:** Whether additional Guidelines for Indian Government Websites (GIGW) or AICTE portal branding mandates apply is open for regulatory confirmation (`D-004`).

---

## 3. UI/UX Decisions Register (Stage 0 Audit Import)

The following decisions were identified during the Stage 0 UI/UX audit (`docs/04-frontend/ui-ux-decisions.md`):

### D-001 — External Verifier Workspace Placement

- **Question:** Is the External Verifier workspace intentionally excluded from the Phase 1 placeholder tiles in `App.tsx`, or was it an oversight?
- **Options:** (a) Intentional — External Verifier accesses via standalone public verification portal. (b) Oversight — Add tile to placeholder navigation.
- **Decision Owner:** Product Owner
- **Status:** `Open`

### D-002 — Navigation Pattern for Multi-Campus/Institution Roles

- **Question:** How should users with memberships in multiple institutions or campuses navigate between them?
- **Options:** (a) Global institution switcher dropdown in header shell. (b) Re-authentication / session switch on change.
- **Decision Owner:** UX Lead
- **Status:** `Open` (Proposed: Option a)

### D-003 — UI Component Library Adoption

- **Question:** Should AIRE adopt shadcn/ui (Radix primitives + Tailwind CSS) or maintain raw bespoke Tailwind components?
- **Options:** (a) Adopt shadcn/ui for accessible, composable, unstyled primitives. (b) Continue bespoke Tailwind components.
- **Decision Owner:** Frontend Lead / Engineering Agent
- **Status:** `Open` (Proposed: Option a — aligns with `.agents/skills/shadcn/`)

### D-004 — Accessible Color Palette & Contrast Tokens

- **Question:** How should brand colors be tokenized to guarantee WCAG 2.2 AA contrast ratios (>4.5:1 text, >3:1 UI)?
- **Options:** (a) Tokenized semantic palette (primary, secondary, destructive, surface, text) via CSS custom properties. (b) Inline Tailwind utility classes.
- **Decision Owner:** UI Designer
- **Status:** `Open` (Proposed: Option a)

### D-005 — Form Validation Strategy

- **Question:** Standardize form validation across all institution submission and review workflows.
- **Options:** (a) React Hook Form + Zod resolvers. (b) Custom native HTML5 validation.
- **Decision Owner:** Frontend Lead
- **Status:** `Open` (Proposed: Option a — packages already installed in `client/package.json`)

### D-006 — High-Density Data Tables

- **Question:** Component standard for viewing large admission cohorts, reconciliation findings, and audit logs.
- **Options:** (a) TanStack Table with virtualized scrolling. (b) Simple paginated HTML tables.
- **Decision Owner:** Frontend Lead
- **Status:** `Open` (Proposed: Option a)

### D-007 — Verifiable Credential (AEP) Presentation

- **Question:** Visual format and verification experience for Admission Entitlement Proofs (AEP).
- **Options:** (a) Digital certificate card with dynamic SVG QR code and offline cryptographic signature validation badge. (b) Raw downloadable PDF only.
- **Decision Owner:** Product Owner
- **Status:** `Open` (Proposed: Option a)

### D-008 — Motion & Animation Defaults

- **Question:** Standard motion and animation behavior across the UI.
- **Options:** (a) Zero decorative animations; all transitions respect `prefers-reduced-motion` strictly. (b) Fluid animated micro-interactions.
- **Decision Owner:** UX Lead
- **Status:** `Open` (Proposed: Option a)
