# AIRE — UX4G + Anti-Slop Product Experience Implementation Plan

| Metadata             | Value                                                              |
| -------------------- | ------------------------------------------------------------------ |
| Task                 | Complete UX4G + Anti-Slop Product Experience Implementation        |
| Authoritative Source | UX4G Handbook, Anti-Slop (miqdadbadjuber), AIRE Architecture Specs |
| Date                 | 3 November 2026                                                    |
| Mode                 | `during` (session override)                                        |
| Status               | `IN_PROGRESS`                                                      |

---

## 1. Goal

Deliver AIRE as a coherent, production-oriented, accessible, mobile-first regulatory platform across all five UX layers (Strategy, Scope, Structure, Skeleton, Surface) using the UX4G Handbook and the Anti-Slop quality filter.

Preserve existing architectural boundaries:

- React + TypeScript frontend (Vite).
- Express + TypeScript backend.
- PostgreSQL + Prisma with forced Row-Level Security (RLS).
- Centralized RBAC + ABAC authorization.
- Canonical design tokens (`client/design-tokens.json`).
- Zero fake student data, zero demo credentials, zero decorative non-functional UI.

---

## 2. Inspected Code & Context

- `client/src/App.tsx`: Clean routing separating public (`/login`) from authenticated shell (`AppShell`).
- `client/src/components/layout/AppShell.tsx`: Currently has 64px header, breadcrumbs, sidebar, footer. Needs upper institutional identity band (GoI/MoE), refined application band, accessible mobile drawer (focus trapping, Esc dismiss), and removal of any fallback demo IDs.
- `client/design-tokens.json`: Canonical DTCG 2025.10 token file. Reconciled to Section 7.4 approved palette (Navy `#183B56`, Action `#245B75`, Teal `#0F766E`, Canvas `#F5F7F8`, Surface `#FFFFFF`, Text `#172B3A`/`#526579`, Border `#D8E0E7`, Statuses).
- `client/scripts/sync-tokens.js`: Automated script synchronizing tokens into `client/src/index.css`.
- `client/src/pages/auth/LoginPage.tsx`: Standalone layout, high-contrast, no demo credentials.
- `client/src/pages/institution/`: Submissions ledger, batch upload, quarantine triage vertical slice.

---

## 3. Skills Consulted

- `antislop`: Core filter. Working mode set to `during`.
- `antislop-ui`: Visual design, color palette purpose, elevation, border radii discipline.
- `antislop-human`: Contrast formulas, keyboard traps, focus indicator requirements (WCAG 2.2 AA).
- `antislop-layoutmobile`: Mobile-first reflow, 320px..1440px breakpoints, no horizontal overflow.
- `antislop-copywriting`: Plain Indian English, zero buzzwords, evidence-based copy.
- `shadcn`: Radix primitives, unstyled components.

---

## 4. Scope and Non-Goals

### In-Scope

1. **Strategy & Discovery Documentation**:
   - `docs/04-frontend/ux-strategy.md`
   - `docs/04-frontend/user-research.md`
   - `docs/04-frontend/personas.md`
   - `docs/04-frontend/user-journeys.md`
   - `docs/04-frontend/service-blueprints.md`
2. **Scope & Structure Documentation**:
   - `docs/04-frontend/ux-scope-and-content.md`
   - `docs/04-frontend/navigation-specification.md`
   - `docs/02-experience/information-architecture.md` (reconciled)
   - `docs/02-experience/interaction-contracts.md` (reconciled)
3. **Surface & Design System**:
   - `DESIGN.md` (root-level, Anti-Slop companion)
   - `docs/03-design-system/ux4g-implementation-mapping.md`
   - `client/design-tokens.json` & `client/src/index.css` (reconciled palette)
4. **Product Implementation**:
   - Two-tier institutional header in `AppShell.tsx`:
     - Upper Identity Band: Government of India / Ministry of Education text hierarchy.
     - Application Band: AICTE / AIRE title, tenant indicator, live IST clock, user session menu.
   - Mobile-first drawer navigation with full keyboard accessibility (Esc key, focus restoration).
   - Institution Submission Vertical Slice (`SubmissionsHistoryPage.tsx`, `BatchUploadPage.tsx`, `QuarantineTriagePage.tsx`): clean, real workflows, elimination of hardcoded demo fallback IDs.
5. **Compliance & Validation**:
   - `docs/04-frontend/ux4g-compliance-matrix.md` (complete Chapter 1-11 mapping).
   - Automated tests in `client/` passing (design tokens, contrast, layout stability, authorization).

### Non-Goals

- Do not build fake MeriPehchaan or DigiLocker backend integrations (respect ADR-004 SSO boundary).
- Do not add fake student data or fabricated statistics in production code.
- Do not replace working Vite/React/Express architecture.
- Do not invent unapproved regulatory policies.

---

## 5. Security, Privacy & Data Implications

- **Authorization**: Backend RBAC + ABAC remain authoritative; UI elements hide or disable based on verified user claims.
- **Tenant Isolation**: Institution switcher derives tenant ID directly from authenticated memberships; never allow spoofed tenant IDs.
- **Privacy**: No cleartext Aadhaar/APAAR numbers shown unmasked; operational tables use pseudonymous tokens.
- **Audit**: All cohort sealing and triage actions are audited server-side with actor, tenant, timestamp, and diffs.

---

## 6. Acceptance Criteria

1. All documentation deliverables created and aligned with UX4G Handbook and Anti-Slop rules.
2. `DESIGN.md` defines product identity, dials (Energy, Rhythm, Motion), typographic hierarchy, and token usage.
3. `client/design-tokens.json` reconciled and verified via `client/src/test/design-tokens.test.ts`.
4. `AppShell.tsx` features two-tier institutional header, mobile drawer navigation with zero horizontal overflow at 320px..1440px, and keyboard accessibility.
5. Standalone public `/login` remains separate from authenticated shell.
6. Batch submission vertical slice runs without runtime errors or demo-credentials exposure.
7. `pnpm --filter client test` and root `pnpm test` pass with 100% success.
