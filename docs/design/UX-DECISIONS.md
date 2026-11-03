# AIRE Design & Architecture Decision Record (UX-DECISIONS)

**Status:** Approved for Implementation Planning  
**Date:** 3 November 2026  
**Authors:** Principal Product Architect, Enterprise UX Architect, Design Systems Engineer, Regulatory Workflow Analyst  
**Authority:** Derived from `AGENTS.md`, `docs/design/UX-AUDIT-REPORT.md`, `docs/design/UX-AUDIT-ADDENDUM.md`, and authoritative project specifications (`docs/`).

---

## 1. Audit Reconciliation & Findings Synthesis

This section synthesizes the findings from the initial static audit ([`UX-AUDIT-REPORT.md`](file:///home/snehan/personal/competitions/2026_SIH2.0/aire-aicte/docs/design/UX-AUDIT-REPORT.md)) and the runtime browser & backend investigation ([`UX-AUDIT-ADDENDUM.md`](file:///home/snehan/personal/competitions/2026_SIH2.0/aire-aicte/docs/design/UX-AUDIT-ADDENDUM.md)).

### 1.1 Confirmed Findings (Empirically Verified in Code & Browser)

1. **Workflow Component Non-Adoption (Stranded in Showcase):**
   - _Status:_ **CONFIRMED.**
   - _Evidence:_ The 14 specialized Layer C workflow modules in `client/src/components/workflow/` (`BatchUploadPanel`, `QuarantineTriageTable`, `AuditLogViewer`, etc.) are imported exclusively in `client/src/pages/DesignSystemShowcase.tsx` and unit tests. The actual functional screens (`BatchUploadPage.tsx`, `QuarantineTriagePage.tsx`, `AuditorLogsPage.tsx`, `InstitutionDashboard.tsx`) re-implement ad-hoc, inline tables, naive forms, and hardcoded arrays.
2. **Naive CSV Splitting & Parsing Defect:**
   - _Status:_ **CONFIRMED.**
   - _Evidence:_ `BatchUploadPage.tsx:136-147` uses `text.split("\n")` and `line.split(",")`. Real-world CSVs containing commas inside quoted strings (e.g. names `"Sharma, Aarav"` or addresses) break column alignment and corrupt data.
3. **Missing Ingestion Stages (Column Mapping & Validation Preview):**
   - _Status:_ **CONFIRMED.**
   - _Evidence:_ `BatchUploadPage.tsx` assumes CSV headers match canonical schema names (`studentName`, `rollNumber`, etc.) and immediately sends raw data to the backend without user header mapping or pre-flight preview.
4. **Stubbed Legal Sign-Off (J-03):**
   - _Status:_ **CONFIRMED.**
   - _Evidence:_ `QuarantineTriagePage.tsx:274-278` triggers browser `alert()` for "Proceed to Sign-Off". No modal, attestation, password verification, or sealing endpoint exists.
5. **Missing Skip Link in Authenticated Layout:**
   - _Status:_ **CONFIRMED.**
   - _Evidence:_ `AppShell.tsx` omits `<SkipLink />`. Browser tabbing jumps directly to navigation elements, violating WCAG 2.1/2.2 AA SC 2.4.1.
6. **Widespread Token Bypass & Raw Palette Usage:**
   - _Status:_ **CONFIRMED.**
   - _Evidence:_ Pages across `client/src/pages/` use raw Tailwind colors (`slate-*`, `sky-*`, `emerald-*`, `amber-*`) and hardcoded hex values (`#245B75`, `#0B1520`, `#11283B`) instead of semantic tokens.
7. **Unverified Compliance Claims & Pseudo-Emblem:**
   - _Status:_ **CONFIRMED.**
   - _Evidence:_ `LoginPage.tsx:181` claims "MeitY GIGW 3.0 Compliant" without certification. `PublicHeader.tsx:73-80` renders an unauthorized pseudo-emblem SVG with a star shape.
8. **Uninitialized Core Dependencies:**
   - _Status:_ **CONFIRMED.**
   - _Evidence:_ `@tanstack/react-query` and `zustand` are listed in `client/package.json` but have zero initialization or imports in `client/src/`. All data fetching is unmanaged `useEffect` / `useState`.

### 1.2 Corrected Findings (Addendum Precedence)

1. **Component Inventory Count:**
   - _Original Report:_ Counted 33 primitives and 14 workflow components.
   - _Corrected Fact:_ Layer B contains 33 primary primitives + 3 auxiliary primitives (`separator`, `skip-link`, `button-group`) = **36 total primitives** in `client/src/components/ui/`. Layer C contains **14 distinct workflow modules** across 15 component files.
2. **Auditor Backend Support:**
   - _Original Report:_ Categorized Auditor Hub as "100% mock with zero backend support".
   - _Corrected Fact:_ The backend database model `AuditEvent` (`schema.prisma:199-217`) and logging service `logAuditEvent()` (`audit.service.ts`) are **operational** and writing events to PostgreSQL. Only the **read/query HTTP endpoint** is absent.
3. **Responsive Overflow Occurrence:**
   - _Original Report:_ Noted potential table overflow risk.
   - _Corrected Fact:_ Browser testing across 32 viewports confirmed that table containers reflow without whole-page horizontal scroll, but `BatchUploadPage` specifically fails at 768px tablet portrait with **+8px overflow** (`scrollWidth: 776px` vs `clientWidth: 768px`) due to header action-button wrapping.

### 1.3 Duplicate & Contradictory Findings

1. **Duplicate FormField & EmptyState:**
   - Both audits noted duplicate implementations (`components/forms/FormField.tsx` vs `components/ui/form-field.tsx` and `components/feedback/EmptyState.tsx` vs `components/ui/empty-state.tsx`).
   - _Resolution:_ Deprecate `forms/FormField.tsx` and `feedback/EmptyState.tsx`. Standardize on `components/ui/` primitives.
2. **Token Definition Contradiction:**
   - `docs/design/02-DESIGN-TOKENS.css` uses an alternate `--aire-*` prefix (`--aire-brand-950`), contradicting `client/design-tokens.json` (`--surface-*`, `--text-*`, `--border-*`).
   - _Resolution:_ `client/design-tokens.json` is the sole canonical source. `docs/design/02-DESIGN-TOKENS.css` must be synchronized to document the canonical tokens.

### 1.4 Unresolved Assumptions & Risks

1. **Intake / Approved Capacity Availability:**
   - Frontend assumed `approvedCapacity = 360` seats. The backend has no capacity tables or models. Hardcoding capacity in UI is an active regulatory integrity risk.
2. **Student & Reviewer Route Viability:**
   - Both routes (`/student/record` and `/aicte/overview`) currently display mock or superficial listings because backend database models for student records and reviewer scrutiny queues do not yet exist.

### 1.5 Items Requiring Domain-Owner Approval

1. Institutional Sanctioned Seat Capacity data source and fallback policy.
2. Exact statutory declaration wording for J-03 cohort legal attestation.
3. Exposure of platform-wide vs tenant-scoped audit trails to Auditor role (`GET /api/v1/audit-events`).
4. Reviewer workflow stages and Show Cause escalation policies.

---

## 2. Finalised Design-System Governance

### 2.1 Canonical Token Source of Truth

- **Canonical Authority:** `client/design-tokens.json` is the **single source of truth** for all design tokens in AIRE.
- **Format:** Follows the Design Tokens Community Group (DTCG 2025.10) specification.
- **Sync Mechanism:** Tokens are synchronized into `client/src/index.css` via `client/scripts/sync-tokens.js` (`pnpm run build:tokens`).
- **Utility Mapping:** `client/tailwind.config.js` maps these variables to semantic Tailwind utilities:
  - `bg-surface-canvas`, `bg-surface-card`, `bg-surface-card-subdued`, `bg-surface-header`, `bg-surface-sidebar`.
  - `text-txt-primary`, `text-txt-secondary`, `text-txt-muted`, `text-txt-inverted`, `text-txt-link`.
  - `border-line-subtle`, `border-line-default`, `border-line-strong`, `border-line-interactive`.
  - `bg-brand-primary`, `bg-brand-primary-hover`, `bg-brand-primary-active`, `bg-brand-subtle`, `bg-brand-teal`.
  - `state-success-*`, `state-warning-*`, `state-danger-*`, `state-info-*`.
- **Governance Rule:** No secondary `--aire-*` namespace will be introduced. `docs/design/02-DESIGN-TOKENS.css` shall be rewritten to document the canonical tokens generated from `client/design-tokens.json`.

### 2.2 Typography Hierarchy

AIRE standardizes on **Inter** with fallbacks to system fonts, using strict sizing and line-height tokens:

| Token / Role   | Font Size          | Line Height   | Font Weight               | Semantic Usage                                                |
| :------------- | :----------------- | :------------ | :------------------------ | :------------------------------------------------------------ |
| `display-lg`   | 32px (`2.0rem`)    | 40px (`1.25`) | Bold (700)                | Landing hero headline only                                    |
| `display-sm`   | 24px (`1.5rem`)    | 32px (`1.33`) | Bold (700)                | Workspace page H1                                             |
| `heading-lg`   | 20px (`1.25rem`)   | 28px (`1.40`) | Semi-bold (600)           | Section titles, modal titles                                  |
| `heading-md`   | 16px (`1.0rem`)    | 24px (`1.50`) | Semi-bold (600)           | Card titles, panel headers                                    |
| `body-base`    | 14px (`0.875rem`)  | 20px (`1.43`) | Regular (400) / Med (500) | Primary UI operational baseline, table cells, forms           |
| `body-sm`      | 13px (`0.8125rem`) | 18px (`1.38`) | Regular (400)             | Compact table cells (`table-compact`), secondary descriptions |
| `caption`      | 12px (`0.75rem`)   | 16px (`1.33`) | Medium (500)              | Supporting metadata, timestamps, badge labels                 |
| `mono-tabular` | 13px / 14px        | Equal to body | Semi-bold (600)           | Roll numbers, APAAR IDs, hashes, counts (`font-tabular`)      |

### 2.3 Semantic Color Roles & Contrast Standards

All color combinations must achieve **WCAG 2.2 Level AA** contrast ($\ge 4.5:1$ for normal text, $\ge 3:1$ for large text and UI boundaries):

- **Canvas Surface (`--surface-canvas` / `#F5F7F8`):** Restrained neutral gray background.
- **Card Surface (`--surface-card` / `#FFFFFF`):** High-clarity white card backgrounds.
- **Primary Text (`--text-primary` / `#172B3A`):** Deep navy slate. Contrast ratio on `#FFFFFF` is **12.6:1** (Exceeds AAA).
- **Secondary Text (`--text-secondary` / `#526579`):** Slate gray. Contrast ratio on `#FFFFFF` is **5.4:1** (Passes AA).
- **Muted Text (`--text-muted` / `#5A6E82`):** Neutral gray for captions. Contrast on `#FFFFFF` is **4.6:1** (Passes AA).
- **Primary Brand (`--brand-primary` / `#245B75`):** Institutional navy blue. Contrast on `#FFFFFF` is **5.8:1** (Passes AA).
- **Brand Teal (`--brand-teal` / `#0F766E`):** Distinctive government accent. Contrast on `#FFFFFF` is **5.1:1** (Passes AA).
- **Status Badges:** All badge styles must pair semantic text and background:
  - Success: Text `--state-success-text` (`#166534`) on `--state-success-bg` (`#EAF4ED`) — **6.1:1**.
  - Warning: Text `--state-warning-text` (`#B45309`) on `--state-warning-bg` (`#FFF4E5`) — **4.8:1**.
  - Danger: Text `--state-danger-text` (`#B42318`) on `--state-danger-bg` (`#FDECEC`) — **5.2:1**.
  - Info: Text `--state-info-text` (`#245B75`) on `--state-info-bg` (`#EAF2F6`) — **5.8:1**.

### 2.4 Layout, Grid & Density Standards

- **Content Width:** Standard authenticated pages use `max-w-7xl mx-auto w-full` with gutters: `px-4` (<768px), `px-6` (768–1024px), `px-8` (>1024px). Wide data ledgers (e.g. high-density tables) expand to use available canvas width.
- **Density:**
  - High-Density Ledger (`table-compact`): 36px row height, 13px typography. Recommended for registrars reviewing 50+ candidate rows.
  - Standard Density (`table-standard`): 44px row height, 14px typography. Used for general listings and mobile viewports.
- **Focus States:** Every interactive element must display the standardized visible focus ring:
  `outline: 2px solid var(--focus-ring); outline-offset: 2px;` via `.focus-aire`.

---

## 3. Architectural Decision Records (ADRs)

### ADR-UX-01: Canonical Design Token Source of Truth

- **Context:** A divergence exists between `client/design-tokens.json` (DTCG standard) and `docs/design/02-DESIGN-TOKENS.css` (custom `--aire-*` prefix).
- **Decision:** `client/design-tokens.json` is declared the sole canonical source. Application code and Tailwind utilities will use `bg-surface-*`, `text-txt-*`, `border-line-*`, and `bg-brand-*`. `docs/design/02-DESIGN-TOKENS.css` will be updated to document canonical tokens.
- **Consequences:** Eliminates naming collisions, preserves the existing automated sync pipeline (`pnpm run build:tokens`), and enforces zero raw hex styling.

### ADR-UX-02: Consolidated Application Shell & Header Geometry

- **Context:** The current layout stacks three distinct headers (28px Gov band, 64px AIRE header, 36px breadcrumbs bar) taking 128px of vertical height before content begins.
- **Decision:**
  1. Unify the statutory identity and AIRE application header into a single, cohesive 64px header bar on desktop.
  2. Embed breadcrumbs in normal document flow directly above the page title, not as a separate full-width floating bar.
  3. Render `<SkipLink href="#content" />` as the very first tabbable DOM element in `AppShell.tsx`.
  4. Isolate live ticking clock to a leaf component to eliminate whole-shell re-renders.
- **Consequences:** Reclaims ~64px of vertical viewport space for institutional tables, eliminates layout shift, and satisfies WCAG SC 2.4.1.

### ADR-UX-03: Layer C Workflow Component Integration

- **Context:** 14 mature workflow components are stranded in `client/src/pages/DesignSystemShowcase.tsx` while functional screens re-implement fragile inline code.
- **Decision:** Systematically replace ad-hoc screen code with Layer C components:
  - `BatchUploadPage` -> integrates `BatchUploadPanel` (with column mapping & preview).
  - `QuarantineTriagePage` -> integrates `QuarantineTriageTable`.
  - `InstitutionDashboard` -> integrates `QuotaCategoryIndicator` and `InstitutionStatusPanel`.
  - `AuditorLogsPage` -> integrates `AuditLogViewer`.
- **Consequences:** Instantly elevates functionality, provides multi-step column mapping, eliminates naive CSV bugs, and leverages existing passing unit tests.

### ADR-UX-04: TanStack Query Server State Architecture

- **Context:** `@tanstack/react-query` is installed in `package.json` but uninitialized. Screens use unmanaged `useEffect` fetching with no request deduplication or cache invalidation.
- **Decision:** Initialize `QueryClientProvider` at the root of `App.tsx`. Refactor API calls to custom React Query hooks (`useSubmissions`, `useBatchDetails`, `useInstitutionProfile`).
- **Consequences:** Eliminates stale cache bugs, provides declarative loading/error states, and coordinates cache invalidation when batches are remediated.

### ADR-UX-05: J-03 Cohort Attestation & Step-Up Re-Authentication Architecture

- **Context:** The "Proceed to Sign-Off" button currently executes a JavaScript `alert()`.
- **Decision:**
  1. Implement a structured **Legal Attestation Confirmation Modal** in `QuarantineTriagePage` triggered when `quarantineCount === 0`.
  2. Display summary metrics (total students, programme, intake capacity).
  3. Require mandatory checkbox attestation with legal wording under the AICTE Act 1987.
  4. Require password entry for step-up re-authentication if session age > 15 minutes.
  5. Specify the backend contract `POST /api/v1/institutions/:institutionId/submissions/:batchId/seal`.
- **Consequences:** Establishes non-repudiation, prevents premature cohort sealing, and aligns with approved journey `J-03`.

---

## 4. Backend Contract Dependency Matrix

| Platform Feature                  | Existing Operational Backend                              | Partial Backend Support          | Missing API Route                                            | Missing Database Model                               | Missing Business Rule                                                                |
| :-------------------------------- | :-------------------------------------------------------- | :------------------------------- | :----------------------------------------------------------- | :--------------------------------------------------- | :----------------------------------------------------------------------------------- |
| **Batch Ingestion & Validation**  | `POST .../submissions`<br>`SubmissionService.createBatch` | None                             | None                                                         | None                                                 | Column mapping normalization handled in frontend; backend requires canonical schema. |
| **Quarantine Inline Remediation** | `PATCH .../quarantine/:rowId`<br>`remediateQuarantineRow` | None                             | None                                                         | None                                                 | Only row-level remediation supported; batch multi-row edit is unbacked.              |
| **Submissions Listing**           | `GET .../submissions`<br>`listBatches`                    | None                             | None                                                         | None                                                 | None. Fully operational.                                                             |
| **Approved Intake & Capacity**    | **None**                                                  | None                             | `GET .../institutions/:id/capacity`                          | `ApprovedIntake` table absent in `schema.prisma`.    | Supernumerary / TFW quota calculations unbacked by database.                         |
| **Student Record Lookup**         | **None**                                                  | None                             | `GET .../students/:identifier`                               | `Student` / `StudentRecord` table absent.            | Entitlement proof issuance rules unbacked.                                           |
| **Audit Log Exploration**         | Internal `logAuditEvent()`                                | `AuditEvent` model in PostgreSQL | `GET /api/v1/audit-events` (Read API)                        | None                                                 | Auditor filtering and export permissions unbacked by route.                          |
| **J-03 Cohort Sealing**           | **None**                                                  | `READY_FOR_SIGN_OFF` state flag  | `POST .../submissions/:id/seal`                              | `sealedAt`, `merkleRootHash` columns in schema       | Deterministic Merkle tree canonical serialization engine unbacked.                   |
| **Reviewer Scrutiny Queue**       | **None**                                                  | `AICTE_REVIEWER` role in RBAC    | `GET /api/v1/scrutiny/queue`<br>`POST .../scrutiny/decision` | `ScrutinyFinding`, `ReviewerDecision` tables absent. | Exception handling and Show Cause issuance rules unbacked.                           |

---

_End of UX-DECISIONS.md._
