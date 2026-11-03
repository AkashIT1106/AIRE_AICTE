# AIRE Frontend Source-Code Read-Only Audit Report

**Date of Audit:** 3 November 2026  
**Auditor:** Engineering Agent (AntiGravity / AIRE Engineering Operating Manual)  
**Audit Scope:** Source code inspection of `@aire/client` (`client/src/`, `client/design-tokens.json`, configuration manifests, tests, and shared workspace packages).  
**Methodology:** Static source code analysis, dependency verification, route and component tracing, token mapping, test harness execution, and contrast verification against WCAG 2.1/2.2 AA and UX4G/GIGW 3.0 governance baselines.  
**Operating Constraints:** Read-only audit; zero changes permitted to application source files, tests, package manifests, or database contracts.

---

## 1. Verified Stack and Architecture

The frontend stack was verified directly from `client/package.json`, `client/vite.config.ts`, `pnpm-lock.yaml`, and active application source trees. Architecture claims in historical documentation (`docs/04-frontend/` and legacy `PROJECT_PLAN.md`) were cross-checked against actual imports and usage.

| Layer / Technology | Declared Version (`package.json`) | Actual Usage in Codebase | Verification Status | Notes & Discrepancies |
| :--- | :--- | :--- | :--- | :--- |
| **Core Framework** | React `^18.3.1`, React DOM `^18.3.1` | Mounted via `client/src/main.tsx` (`createRoot`), StrictMode enabled | **VERIFIED** | Clean React 18 concurrent root. |
| **Build Tooling** | Vite `^6.1.0`, `@vitejs/plugin-react` `^4.3.4` | `client/vite.config.ts` | **VERIFIED** | Fast HMR, alias `@` mapped to `client/src`. |
| **Routing** | `react-router-dom` `^7.1.5` | `createBrowserRouter`, `createMemoryRouter`, `RouterProvider` in `client/src/App.tsx` | **VERIFIED** | Modern data-router architecture with memory router support for unit testing. |
| **Server State / Caching** | `@tanstack/react-query` `^5.66.0` | **ZERO usage** in `client/src/` | **UNINITIALIZED** | Package is installed, but `QueryClientProvider` is absent from `main.tsx` and `App.tsx`. All pages use manual `useState` and `useEffect` with `fetch`. |
| **Client State** | `zustand` `^5.0.3` | **ZERO usage** in `client/src/` | **UNUSED** | Package is installed, but zero stores exist. Global state is managed via React `AuthContext`. |
| **Form Handling** | `react-hook-form` `^7.54.2`, `@hookform/resolvers` `^7.0.1` | Minimal usage in UI tests; pages use unmanaged native forms and local `useState` | **UNDERUTILIZED** | No centralized schema-driven form hook adoption on screens. |
| **Schema Validation** | `zod` `^3.24.2` | Workspace package `@aire/validation` exports schemas used in tests and API types | **VERIFIED** | Validated via `@aire/validation`. |
| **UI Primitives** | Radix UI primitives (`@radix-ui/react-*`), `class-variance-authority` `^0.7.1`, `tailwind-merge` `^3.7.0` | Used across `client/src/components/ui/` | **VERIFIED** | 33 headless accessible primitives wrapped with CVA styling. |
| **CSS & Design Tokens** | Tailwind CSS `^3.4.17`, PostCSS `^8.5.2`, `tailwindcss-animate` `^1.0.7` | `client/tailwind.config.js`, `client/src/index.css`, `client/design-tokens.json` | **VERIFIED (PARTIAL)** | Canonical token JSON exists, but application pages frequently bypass tokens with raw Tailwind utility classes. |
| **Icon Library** | `lucide-react` `^0.475.0` | Imported across layouts, UI primitives, and feature components | **VERIFIED** | Consistent icon set. |
| **Test Runner & Environment** | `vitest` `^3.0.5`, `@testing-library/react` `^16.2.0`, `jsdom` `^26.0.0` | 16 test suites (220 tests total) passing in `client/src/` | **VERIFIED** | Unit and contract test harness is operational and green. |
| **TypeScript** | `typescript` `^5.7.3` | `tsc --noEmit` exits with code 0 | **VERIFIED** | Strict compilation passes cleanly. |

---

## 2. Route and Role Inventory

Routes are centrally registered in `client/src/App.tsx` using `createAppRoutes()`. Workspace isolation is enforced via `WorkspaceGuard` in `client/src/components/auth/WorkspaceGuard.tsx`, which queries `useAuth()` and evaluates permissions via `@aire/authorization`.

| Route Path | Page Component | Loading Mode | Workspace / Role Gate | Navigation Shell | Real Functionality vs Mock |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | `LandingPage` | Eager (`client/src/pages/LandingPage.tsx`) | Public | `PublicHeader` + `PublicFooter` | **Static Content**: Marketing / informational landing page. Interactive buttons link to `/login` or jump to `#how-it-works`. |
| `/login` | `LoginPage` | Eager (`client/src/pages/auth/LoginPage.tsx`) | Public / Unauthenticated | Standalone Split Layout | **Functional**: Connects to `AuthApi.signIn` (`POST /api/auth/sign-in/email`). Contains quick-fill demo buttons for evaluator convenience. |
| `/gateway` | `RootGateway` | Eager (`client/src/pages/RootGateway.tsx`) | Authenticated (Any) | Skeleton during redirect | **Functional**: Dispatches user to workspace based on active roles. |
| `/institution` | Redirect to `/institution/dashboard` | - | `WorkspaceType.INSTITUTION` | `AuthenticatedShellLayout` | **Functional**: Canonical index redirect. |
| `/institution/dashboard` | `InstitutionDashboard` | Lazy (`client/src/pages/institution/InstitutionDashboard.tsx`) | `WorkspaceType.INSTITUTION` | `AuthenticatedShellLayout` (`AppShell`) | **Functional API / Hardcoded Metric**: Fetches batches from `SubmissionsApi.listBatches`. Capacity denominator is hardcoded (`360`). |
| `/institution/submissions` | `SubmissionsHistoryPage` | Lazy (`client/src/pages/institution/SubmissionsHistoryPage.tsx`) | `WorkspaceType.INSTITUTION` | `AuthenticatedShellLayout` (`AppShell`) | **Functional API**: Fetches batches from `SubmissionsApi.listBatches`. Supports client-side filtering. |
| `/institution/submissions/new` | `BatchUploadPage` | Lazy (`client/src/pages/institution/BatchUploadPage.tsx`) | `WorkspaceType.INSTITUTION` | `AuthenticatedShellLayout` (`AppShell`) | **Partial / Fragile API**: Posts to `SubmissionsApi.createBatch`. CSV parsing uses naive `split(',')`. Missing column mapping and preview steps. |
| `/institution/submissions/:batchId` | `QuarantineTriagePage` | Lazy (`client/src/pages/institution/QuarantineTriagePage.tsx`) | `WorkspaceType.INSTITUTION` | `AuthenticatedShellLayout` (`AppShell`) | **Partial API / Stubbed Sign-off**: Fetches batch & remediates rows via `SubmissionsApi.remediateRow`. "Proceed to Sign-Off" triggers browser `alert()`. |
| `/aicte` | Redirect to `/aicte/overview` | - | `WorkspaceType.AICTE` | `AuthenticatedShellLayout` | **Functional**: Canonical index redirect. |
| `/aicte/overview` | `AicteOverviewPage` | Lazy (`client/src/pages/aicte/AicteOverviewPage.tsx`) | `WorkspaceType.AICTE` | `AuthenticatedShellLayout` (`AppShell`) | **Stub / API List Only**: Lists institutions via `AuthApi.listInstitutions()`. No scrutiny queue, verification workflow, or decision engine UI. |
| `/student` | Redirect to `/student/record` | - | `WorkspaceType.STUDENT` | `AuthenticatedShellLayout` | **Functional**: Canonical index redirect. |
| `/student/record` | `StudentRecordPage` | Lazy (`client/src/pages/student/StudentRecordPage.tsx`) | `WorkspaceType.STUDENT` | `AuthenticatedShellLayout` (`AppShell`) | **100% Mock**: Renders hardcoded student record ("Aarav Sharma") regardless of search input. PDF download triggers browser `alert()`. |
| `/auditor` | Redirect to `/auditor/logs` | - | `WorkspaceType.AUDITOR` | `AuthenticatedShellLayout` | **Functional**: Canonical index redirect. |
| `/auditor/logs` | `AuditorLogsPage` | Lazy (`client/src/pages/auditor/AuditorLogsPage.tsx`) | `WorkspaceType.AUDITOR` | `AuthenticatedShellLayout` (`AppShell`) | **100% Mock**: Displays static in-memory array (`SAMPLE_LOGS`). No API connection to server audit endpoints. |
| `/design-system` | `DesignSystemShowcase` | Lazy (`client/src/pages/DesignSystemShowcase.tsx`) | Authenticated (No role gate) | `AuthenticatedShellLayout` (`AppShell`) | **Showcase**: Interactive catalog rendering Layer B and Layer C components. |
| `*` | `NotFoundPage` | Lazy (`client/src/pages/error/NotFoundPage.tsx`) | Public / Any | Standalone | **Functional**: 404 fallback page. |

---

## 3. Component Inventory and Reuse Map

### 3.1 Layer B — Reusable UI Primitives (`client/src/components/ui/`)

All 33 primitives are exported via `client/src/components/ui/index.ts`. They are built on Radix UI, styled with Tailwind classes, and tested in `client/src/components/ui/LayerBPrimitives.test.tsx` and `FoundationComponents.test.tsx`.

1. `button.tsx` (Variants: default, destructive, outline, secondary, ghost, link; Sizes: default, sm, lg, icon)
2. `input.tsx` (Accessible text input with focus ring)
3. `select.tsx` (Radix Select wrapper)
4. `checkbox.tsx` (Radix Checkbox)
5. `radio-group.tsx` (Radix Radio Group)
6. `switch.tsx` (Radix Switch)
7. `textarea.tsx` (Accessible multiline input)
8. `label.tsx` (Radix Label with required indicator support)
9. `form-field.tsx` (Full form field wrapper with `useId()`, `hasError`, and `aria-describedby` wiring)
10. `badge.tsx` (Variants: default, secondary, destructive, outline, success, warning, info)
11. `alert.tsx` (Variants: default, destructive, success, warning, info)
12. `dialog.tsx` (Radix Dialog modal)
13. `drawer.tsx` (Off-canvas slide-out sheet / drawer)
14. `tooltip.tsx` (Radix Tooltip)
15. `tabs.tsx` (Radix Tabs)
16. `breadcrumbs.tsx` (Semantic breadcrumb list using Radix Slot)
17. `table.tsx` (Semantic `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`)
18. `card.tsx` (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`)
19. `pagination.tsx` (Pagination navigation controls)
20. `progress.tsx` (Radix Progress bar)
21. `skeleton.tsx` (Pulse loading skeleton)
22. `toast.tsx` (Notification toast primitive)
23. `accordion.tsx` (Radix Accordion)
24. `dropdown-menu.tsx` (Radix Dropdown Menu)
25. `search-input.tsx` (Input with search icon and clear affordance)
26. `file-upload.tsx` (Drag-and-drop file upload zone)
27. `empty-state.tsx` (Standard empty state container with icon and action)
28. `confirmation-dialog.tsx` (Controlled alert dialog for destructive actions)
29. `error-summary.tsx` (Form-level error announcement box)
30. `stepper.tsx` (Multi-step journey progression indicator)
31. `metric-card.tsx` (KPI display card with trend indicator)
32. `timeline.tsx` (Vertical history / audit progression display)
33. `status-indicator.tsx` (Dot + label status pill)
34. Auxiliary: `separator.tsx`, `skip-link.tsx`, `button-group.tsx`.

### 3.2 Layer C — Domain Workflow Components (`client/src/components/workflow/`)

Exported via `client/src/components/workflow/index.ts`:

- `BatchUploadPanel.tsx` — Complex multi-step ingestion panel.
- `FileProcessingProgress.tsx` — Step progress bar for async processing.
- `UploadValidationSummary.tsx` — Ingestion metrics summary.
- `QuarantineTriageTable.tsx` — Full-featured triage table with inline filtering and batch actions.
- `QuarantineIssueRow.tsx` — Expandable row displaying discrepancy metadata.
- `ValidationIssueSummary.tsx` — Category breakdown of schema and quota errors.
- `RecordVerificationSummary.tsx` — Candidate verification breakdown.
- `QuotaCategoryIndicator.tsx` — Dual-track quota allocation vs intake cap visualizer.
- `DuplicateRecordComparisonPanel.tsx` — Side-by-side duplicate candidate conflict resolution.
- `StudentRecordSummary.tsx` — Student profile and entitlement card.
- `InstitutionStatusPanel.tsx` — Institutional regulatory status card.
- `SubmissionStatusTimeline.tsx` — Milestone timeline for batch lifecycle.
- `AuditLogViewer.tsx` — Paginated, searchable audit log ledger.
- `AuditLogFilter.tsx` — Filter bar for actions, actors, and dates.
- `AuditEventEntry.tsx` — Expanded cryptographic proof inspector.

### 3.3 Component Duplication & Non-Reuse Findings (Critical Discovery)

1. **Workflow Component Non-Adoption (Isolation in Showcase):**
   - The rich Layer C components (`BatchUploadPanel`, `QuarantineTriageTable`, `AuditLogViewer`, `QuotaCategoryIndicator`, `DuplicateRecordComparisonPanel`) are imported **exclusively** in `client/src/pages/DesignSystemShowcase.tsx` and unit tests (`WorkflowEmpiricalChallenge.test.tsx`, `LayerCContractStress.test.tsx`).
   - The actual product pages (`BatchUploadPage.tsx`, `QuarantineTriagePage.tsx`, `AuditorLogsPage.tsx`, `InstitutionDashboard.tsx`) **do not import or use these components**. Instead, they re-implement ad-hoc, inline HTML `<table>`s, inline raw modals, naive CSV parsers, or hardcoded mock arrays.
2. **Duplicate Form Field Components:**
   - `client/src/components/forms/FormField.tsx` (old, unstandardized, manual ID wiring) vs. `client/src/components/ui/form-field.tsx` (new Layer B primitive with React `useId()`, context, and accessibility wiring). Pages import from `components/forms/FormField`.
3. **Duplicate Empty State Components:**
   - `client/src/components/feedback/EmptyState.tsx` (39 lines) vs. `client/src/components/ui/empty-state.tsx` (56 lines). Identical functional role.
4. **Duplicate Breadcrumbs Implementations:**
   - `client/src/components/layout/Breadcrumbs.tsx` manually builds an `<ol>` and `<li>` list rather than composing the Radix-based `client/src/components/ui/breadcrumbs.tsx` primitives.

---

## 4. Design-Token and Styling Audit

### 4.1 Token Architecture & Synchronization

- **Canonical Definition:** `client/design-tokens.json` adheres to the Design Tokens Community Group (DTCG 2025.10) specification.
- **Sync Script:** `client/scripts/sync-tokens.js` parses `design-tokens.json`, resolves token references (`{color.primitive.brand.navy.900}`), computes HSL values, and generates CSS variables into `client/src/index.css`.
- **CSS Custom Properties in `index.css`:**
  - Surface: `--surface-canvas` (`#F5F7F8`), `--surface-card` (`#FFFFFF`), `--surface-card-subdued` (`#F0F4F8`), `--surface-header` (`#183B56`), `--surface-sidebar` (`#FFFFFF`).
  - Text: `--text-primary` (`#172B3A`), `--text-secondary` (`#526579`), `--text-muted` (`#5A6E82`), `--text-inverted` (`#FFFFFF`), `--text-link` (`#0D635C`).
  - Borders: `--border-subtle` (`#D8E0E8`), `--border-default` (`#D8E0E7`), `--border-strong` (`#7B90A2`), `--border-interactive` (`#0F766E`).
  - Brand: `--brand-primary` (`#245B75`), `--brand-primary-hover` (`#1C4666`), `--brand-subtle` (`#E8F0F7`), `--brand-teal` (`#0F766E`).
  - Status: `--state-success-*`, `--state-warning-*`, `--state-danger-*`, `--state-info-*`.
- **Tailwind Mapping:** `client/tailwind.config.js` correctly maps semantic utilities (`bg-surface-canvas`, `text-txt-primary`, `border-line-default`, `bg-brand-primary`).

### 4.2 Discrepancies with Design Documentation

- **Token Namespace Conflict:** `docs/design/02-DESIGN-TOKENS.css` defines an alternate `--aire-*` prefix palette (`--aire-brand-950: #102A3A`, `--aire-text-primary`, `--aire-bg-page`), whereas the codebase and `client/design-tokens.json` define `--surface-*`, `--text-*`, `--border-*`, and `--brand-*`.
- **Widespread Raw Styling Anti-Pattern:**
  Across `LandingPage.tsx`, `LoginPage.tsx`, `InstitutionDashboard.tsx`, `SubmissionsHistoryPage.tsx`, `BatchUploadPage.tsx`, `QuarantineTriagePage.tsx`, `StudentRecordPage.tsx`, and `AicteOverviewPage.tsx`, components bypass the semantic tokens:
  - Hardcoded hex colors: `bg-[#0B1520]`, `bg-[#11283B]`, `bg-[#1C4666]`, `bg-[#245B75]`, `bg-[#0F2438]`, `text-[#0F766E]`, `border-[#1E3B54]`, `text-[#38BDF8]`.
  - Raw default Tailwind palettes: `bg-slate-50`, `bg-slate-100`, `border-slate-200`, `text-slate-900`, `text-slate-500`, `bg-emerald-50`, `border-emerald-200`, `text-emerald-700`, `bg-amber-50`, `border-amber-200`, `text-amber-800`, `bg-sky-50`, `border-sky-200`, `text-sky-950`.
  - Violates AGENTS.md §10: *"Use semantic tokens for all UI styling (`bg-brand-primary`, `text-txt-primary`, `border-line-default`); never use raw Tailwind color utilities or inline hex values."*
- **Broken / Non-Existent Dark Mode Tokens:**
  - `PublicHeader.tsx` toggles `.dark` on `document.documentElement`.
  - However, `client/src/index.css` contains **zero** `.dark` selectors or dark-theme CSS variable overrides.
  - Toggling dark mode in the header has zero effect on background/text tokens and creates broken visual states.

---

## 5. Application Shell and Navigation Assessment

### 5.1 Shell Structure (`client/src/components/layout/AppShell.tsx`)

The authenticated shell is structured as a vertical flex column:
1. **Upper Institutional Identity Band (28px / `h-7`):** Displays Government of India bilingual markers, screen reader access label, and static font size / language indicators.
2. **Global Institutional Header (64px / `h-16`):** Sticky navigation bar with AIRE branding, mobile drawer trigger, statutory cycle badge, active institution dropdown switcher, and user profile / logout dropdown.
3. **Breadcrumbs Bar (36px):** Compact navigation path bar rendered via `client/src/components/layout/Breadcrumbs.tsx`.
4. **Body Area (Flex-1):**
   - **Sidebar Navigation:** Width 256px (`w-64`) on desktop, collapsible to 64px (`w-16`). Renders off-canvas on mobile with backdrop overlay.
   - **Main Content Canvas:** `#content`, centered container with responsive padding (`p-4 sm:p-6 lg:p-8`) and `max-w-7xl`.
5. **Footer Status Bar (36px / `h-9`):** Displays platform title and live ticking IST clock (`HH:mm:ss IST (UTC+05:30)`).

### 5.2 Application Shell Deficiencies

1. **Missing Skip Link in Shell:**
   - Although `client/src/components/ui/skip-link.tsx` and `.skip-link` CSS exist in `client/src/index.css`, `<SkipLink />` is **not rendered** in `AppShell.tsx`! Keyboard users cannot skip header and navigation directly to `#content`.
2. **Shell Header & Public Header Inconsistency:**
   - `AppShell.tsx` and `PublicHeader.tsx` duplicate upper identity bands with conflicting markup, different colors (`#0B1520` vs `#11283B`), and divergent controls.
3. **Sidebar Collapse Accessibility Defect:**
   - When collapsed (`md:w-16`), text labels are hidden and `title={item.name}` is used. Native browser tooltips are inaccessible to keyboard-only and screen reader navigation. Accessible tooltips via `client/src/components/ui/tooltip.tsx` are missing.
4. **Clock Re-render Pollution:**
   - `AppShell.tsx` maintains local state `istTime` with a 1000ms `setInterval`. Every second, the entire `AppShell` component re-evaluates. This clock should be isolated to a leaf component.

---

## 6. Workflow and Domain-State Assessment

### 6.1 Admission Intake & Batch Ingestion (Journey J-02)

- **Source:** `client/src/pages/institution/BatchUploadPage.tsx`
- **Current Behavior:**
  - Form allows selecting Academic Year and Programme.
  - File upload reads CSV text via `FileReader`.
  - **CRITICAL FLAW:** Header parsing and row splitting are performed with `text.split("\n")` and `line.split(",")`. Any CSV with commas inside quoted fields (e.g., student names `"Sharma, Aarav"` or addresses) will silently corrupt the record structure.
  - **MISSING STAGE:** There is **no Column Mapping step**. It assumes the CSV headers already match `studentName, rollNumber, dateOfBirth, category, quota, apaarId`. If an institution uploads an ERP dump with custom headers, it fails immediately.
  - **MISSING STAGE:** There is **no Validation Preview screen**. Submissions jump straight from file selection to creating a backend batch.
  - **TEST SHORTCUT:** A button labeled "Fill Sample Batch" forces hardcoded records (`DEMO_SAMPLE_RECORDS`), bypassing real file ingestion.

### 6.2 Quarantine Triage & Ingestion Progress (Journey J-02)

- **Source:** `client/src/pages/institution/QuarantineTriagePage.tsx`
- **Current Behavior:**
  - Loads batch details from `SubmissionsApi.getBatch`.
  - Tabbed interface separates Quarantined Discrepancies from the Staged Cohort Ledger.
  - Clicking "Remediate" opens a modal dialog that patches fields via `SubmissionsApi.remediateRow`.
  - Date parsing has a hardcoded heuristic (`rawDob.split("/")`) assuming `DD/MM/YYYY`.
  - **CRITICAL FLAW (STUBBED SIGN-OFF):** When all quarantined rows are cleared, the "Proceed to Sign-Off" button executes:
    ```tsx
    onClick={() => alert("Cohort ready for legal certification by Institution Admin (J-03).")}
    ```
    There is no actual sign-off modal, legal disclaimer, OTP verification, or cryptographic submission sealing workflow implemented.

### 6.3 Institution Dashboard

- **Source:** `client/src/pages/institution/InstitutionDashboard.tsx`
- **Current Behavior:**
  - Aggregates metrics from loaded batches.
  - **DOMAIN INTEGRITY FLAW:** Line 96 contains `const approvedCapacity = 360;` hardcoded. Seat capacity must be derived from AICTE institutional approval orders, not invented as a constant.
  - Progress bar showing validated vs quarantined capacity lacks semantic ARIA attributes.

### 6.4 AICTE Reviewer / Regulatory Overview

- **Source:** `client/src/pages/aicte/AicteOverviewPage.tsx`
- **Current Behavior:**
  - Simply fetches a list of institutions from `AuthApi.listInstitutions()`.
  - No scrutiny queue, reviewer decisioning, intake comparison, or discrepancy escalation workflows exist.

### 6.5 Student Entitlement Record

- **Source:** `client/src/pages/student/StudentRecordPage.tsx`
- **Current Behavior:**
  - Completely fabricated mock. Searching any APAAR ID or roll number renders identical static mock details for "Aarav Sharma".
  - PDF download triggers `alert("Downloading digital AEP certificate...")`.

### 6.6 Auditor Hub

- **Source:** `client/src/pages/auditor/AuditorLogsPage.tsx`
- **Current Behavior:**
  - 100% disconnected mock data (`SAMPLE_LOGS`). Bypasses `AuditLogViewer` workflow component and has no backend integration.

---

## 7. Accessibility, Content and Responsive Assessment

### 7.1 Accessibility Findings (WCAG 2.1/2.2 AA & GIGW 3.0)

1. **SC 2.4.1 Bypass Blocks (Level A):**
   - Main application layout (`AppShell.tsx`) does not render `<SkipLink />`.
   - `LandingPage.tsx` has an embedded link in `PublicHeader.tsx`, but internal authenticated pages have no skip navigation.
2. **SC 4.1.2 Name, Role, Value (Level A):**
   - Clickable table rows in `InstitutionDashboard.tsx` (`<tr onClick={...}>`) and `SubmissionsHistoryPage.tsx` are non-semantic. They lack `tabIndex={0}`, `role="link"`, and keyboard `onKeyDown` listeners (Enter/Space do not navigate).
   - Capacity progress bar in `InstitutionDashboard.tsx` uses nested `<div>`s without `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, or `aria-valuemax`.
3. **SC 1.4.3 Contrast (Minimum) (Level AA):**
   - Core token pairings tested in `client/src/test/design-tokens.test.ts` pass WCAG AA.
   - However, raw utility classes used on pages introduce risk (e.g., `text-slate-400` on white card backgrounds produces contrast of ~2.5:1, failing normal text requirements $\ge 4.5:1$).
4. **False Regulatory Claims (GIGW 3.0 Rule):**
   - `client/src/pages/auth/LoginPage.tsx` (line 181) displays: `MeitY GIGW 3.0 Compliant`. This violates governance rules against claiming unverified legal/standards compliance without certification.
   - `client/src/components/layout/PublicHeader.tsx` (lines 73–80) renders a pseudo "National Emblem SVG" containing a star shape. Governance prohibits using or simulating the State Emblem of India unless authorized.

### 7.2 Responsive and Mobile Viewport Behavior

- **Navigation Drawer:** Mobile drawer in `AppShell.tsx` functions on `<768px` viewports, includes backdrop dismissal, and handles `Escape` keypress.
- **High-Density Tables on Mobile:**
  - Tables in `InstitutionDashboard.tsx`, `SubmissionsHistoryPage.tsx`, and `QuarantineTriagePage.tsx` use `overflow-x-auto`.
  - Defect: Scroll containers lack keyboard focusability (`tabIndex={0}`), `role="region"`, and accessible names (`aria-label="Batches Ledger"`), preventing keyboard-only users on narrow viewports from scrolling overflowing table columns.
- **Touch Targets:**
  - Desktop-compact buttons in tables (e.g. `Triage` links and icon action triggers) are 28–32px tall. On touch devices, they fall below the recommended 44px min-dimension target.

---

## 8. Retain / Improve / Consolidate / Remove / Missing Recommendations

### 8.1 Retain
- **Vite 6 + React 18 + TypeScript + React Router v7 data router** foundation.
- **Radix UI headless component primitives** and CVA styling patterns in `client/src/components/ui/`.
- **`client/design-tokens.json`** as the single source of truth for design tokens, backed by `sync-tokens.js`.
- **`WorkspaceGuard`** and RBAC/ABAC route protection architecture linked to `@aire/authorization`.
- **Centralized API client wrapper** (`client/src/lib/api.ts`) with correlation ID tracing and tenant header handling.
- **Comprehensive test harness:** 16 test suites (220 tests) in `client/src/` providing regression safety.

### 8.2 Improve
- **Adoption of Semantic Tokens:** Migrate all pages from raw Tailwind colors (`slate-*`, `sky-*`, `emerald-*`, `amber-*`) and hardcoded hex values to semantic tokens (`surface.*`, `txt.*`, `line.*`, `brand.*`, `state.*`).
- **CSV Ingestion Engine:** Upgrade `BatchUploadPage.tsx` to handle quoted multi-line CSVs and provide header extraction.
- **Accessible Shell:** Add `<SkipLink />` to `AppShell.tsx`, enhance collapsed sidebar navigation with accessible Radix tooltips, and decouple the footer clock into an isolated component to eliminate shell re-renders.
- **TanStack Query Integration:** Connect `QueryClientProvider` at root and replace manual `useEffect` fetching with query hooks for caching, refetching, and pagination.

### 8.3 Consolidate
- **Adopt Workflow Components in Screens:** Replace inline tables and modals in `QuarantineTriagePage.tsx` with `QuarantineTriageTable`, and replace naive upload inputs in `BatchUploadPage.tsx` with `BatchUploadPanel`.
- **Deduplicate Components:**
  - Replace `client/src/components/forms/FormField.tsx` with `client/src/components/ui/form-field.tsx`.
  - Replace `client/src/components/feedback/EmptyState.tsx` with `client/src/components/ui/empty-state.tsx`.
  - Merge `client/src/components/feedback/ErrorState.tsx` into `client/src/components/ui/alert.tsx` and `error-summary.tsx`.
  - Refactor `client/src/components/layout/Breadcrumbs.tsx` to use `client/src/components/ui/breadcrumbs.tsx`.

### 8.4 Remove
- **Remove Fake Compliance Badges:** Delete `MeitY GIGW 3.0 Compliant` claim from `LoginPage.tsx`.
- **Remove Unauthorized Emblem Simulators:** Delete pseudo-emblem SVG star from `PublicHeader.tsx`.
- **Remove Non-Functional Dark Mode Toggle:** Remove dark toggle from `PublicHeader.tsx` until dark mode tokens are fully implemented in `index.css`.
- **Remove Hardcoded Metrics:** Remove `const approvedCapacity = 360` from `InstitutionDashboard.tsx`.

### 8.5 Missing
- **Column Mapping Step (S-11):** UI step allowing institutions to map diverse spreadsheet column names to canonical AIRE student attributes.
- **Pre-Ingestion Validation Preview:** Client-side preview of parsed rows, summary of syntax errors, and confirmation before server ingestion.
- **Attestation & Cohort Sign-off Modal (J-03):** Legally binding submission confirmation dialog with declaration checkboxes and sign-off attestation (replacing `alert()`).
- **Real Student and Auditor API Endpoints:** Backend integration for student entitlement lookup and system audit trails.

---

## 9. Prioritised Issues Register

| ID | Severity | Affected Route & Role | File Path & Line Evidence | Verified Fact vs Hypothesis | User / Regulatory Impact | Recommended Fix | Dependencies & Regression Risk | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ISSUE-01** | **Critical** | `/institution/submissions/new`<br>(Institution Operator) | `client/src/pages/institution/BatchUploadPage.tsx`<br>Lines 136–147 | **Verified Fact:** File reading uses naive `split('\n')` and `split(',')`. Quoted strings with commas break row parsing. | Ingestion failure or severe silent data corruption when uploading real institutional candidate data containing addresses or quoted names. | Replace naive string splitting with an RFC 4180-compliant CSV parser or stream reader supporting escaped characters. | Low risk. Needs unit testing with quoted strings and malformed rows. | Unit test with sample CSVs containing commas inside quotes. |
| **ISSUE-02** | **Critical** | `/institution/submissions/:batchId`<br>(Institution Admin) | `client/src/pages/institution/QuarantineTriagePage.tsx`<br>Lines 274–278 | **Verified Fact:** "Proceed to Sign-Off" button executes a JavaScript `alert()`. | J-03 cohort sealing and submission cannot be completed; institution cannot legally submit verified records. | Implement a structured Sign-Off Confirmation Dialog with regulatory declaration and legal attestation. | Requires backend submission sign-off endpoint contract. | Component test asserting modal open, form attestation, and API call. |
| **ISSUE-03** | **High** | `/institution/submissions/new`<br>(Institution Operator) | `client/src/pages/institution/BatchUploadPage.tsx`<br>Lines 126–187 | **Verified Fact:** Missing Column Mapping step; assumes exact header names. | Institutions cannot upload standard SIS/ERP extracts with non-standard column headers. | Integrate the column mapping workflow step from `BatchUploadPanel.tsx`. | Medium risk. Requires mapping state management. | End-to-end workflow test uploading mismatched header files. |
| **ISSUE-04** | **High** | Authenticated Shell (All routes) | `client/src/components/layout/AppShell.tsx`<br>Lines 150–185 | **Verified Fact:** `<SkipLink />` is never rendered in the authenticated layout. | Keyboard and screen reader users must tab through dozens of header elements on every page navigation (WCAG SC 2.4.1 violation). | Render `<SkipLink href="#content" />` at the very top of `AppShell.tsx`. | Zero risk. | Tab navigation check asserting skip link receives focus first. |
| **ISSUE-05** | **High** | Multiple Screens (`LandingPage`, `InstitutionDashboard`, etc.) | Across `client/src/pages/`<br>(e.g. `InstitutionDashboard.tsx` L104–280) | **Verified Fact:** Extensive use of raw Tailwind colors (`slate-*`, `emerald-*`, `sky-*`) and hardcoded hex values (`#245B75`). | Violates design system governance; breaks white-labeling, accessibility contrast guarantees, and theming. | Refactor classes to use semantic tokens (`bg-surface-card`, `border-line-default`, `text-txt-primary`, etc.). | Low visual regression risk if audited against token values. | Visual regression inspection and automated token contrast tests. |
| **ISSUE-06** | **High** | `/login`<br>(All users) | `client/src/pages/auth/LoginPage.tsx`<br>Line 181 | **Verified Fact:** Displays unverified "MeitY GIGW 3.0 Compliant" claim without certification. | Regulatory non-compliance and reputational liability by claiming official government audit compliance. | Remove the claim and replace with accurate prototype/cycle indicator (e.g. "Designed following GIGW 3.0 principles"). | Zero risk. | Verify DOM text via test. |
| **ISSUE-07** | **High** | `PublicHeader`<br>(Public users) | `client/src/components/layout/PublicHeader.tsx`<br>Lines 73–80 | **Verified Fact:** Renders pseudo State Emblem SVG with a star shape. | Unauthorized display of national emblems violates State Emblem of India regulations. | Remove unauthorized emblem SVG and replace with official text identifier. | Zero risk. | Inspect header markup. |
| **ISSUE-08** | **Medium** | Global Layouts & UI | `client/src/components/forms/FormField.tsx`<br>`client/src/components/feedback/EmptyState.tsx` | **Verified Fact:** Duplicate components exist across `forms/`, `feedback/`, and `ui/`. | Divergent maintenance, inconsistent accessibility attributes, and developer confusion. | Remove redundant components; standardize all imports on `client/src/components/ui/`. | Low risk; update import statements across feature pages. | Run `pnpm test` to verify clean compilation. |
| **ISSUE-09** | **Medium** | `/institution/dashboard`<br>(Institution Admin) | `client/src/pages/institution/InstitutionDashboard.tsx`<br>Line 96 | **Verified Fact:** `approvedCapacity = 360` is hardcoded in component code. | Inaccurate capacity reporting for institutions with approved quotas different from 360 seats. | Fetch approved intake quota from institution profile API endpoint; fallback gracefully if not loaded. | Dependent on institutional quota API endpoint. | Test with different institution profiles having varied intake caps. |
| **ISSUE-10** | **Medium** | `/auditor/logs` and `/student/record`<br>(Auditor & Student) | `client/src/pages/auditor/AuditorLogsPage.tsx`<br>`client/src/pages/student/StudentRecordPage.tsx` | **Verified Fact:** Both screens are 100% hardcoded mock data. | Misleads users and evaluators; cannot display actual audit trails or student records. | Connect screens to backend API endpoints and integrate `AuditLogViewer`. | Requires backend audit and student lookup endpoints. | Verify real API data fetching in test harness. |
| **ISSUE-11** | **Medium** | Authenticated Shell<br>(All roles) | `client/src/components/layout/AppShell.tsx`<br>Lines 52–69 | **Verified Fact:** Shell root re-renders every 1000ms due to un-memoized IST live clock state. | Unnecessary React render cycles and battery consumption on mobile devices. | Extract live clock into a memoized `<InstitutionalClock />` leaf component. | Zero risk. | React Profiler inspection. |
| **ISSUE-12** | **Low** | Global Application Root | `client/src/main.tsx`<br>`client/src/App.tsx` | **Verified Fact:** `@tanstack/react-query` is installed in `package.json` but not initialized. | Missed opportunity for automated server-state caching, background revalidation, and request deduplication. | Wrap application router in `QueryClientProvider`. | Zero regression risk. | Verify app boots with QueryClient in place. |

---

## 10. Staged Implementation Plan

The remediation of findings should be executed in strict stages matching the approved prompt series:

### Phase 1: Governance & Design Foundation (Prompts 02 & 03)
- Reconcile `docs/design/02-DESIGN-TOKENS.css` with `client/design-tokens.json` and generate unified tokens.
- Add `<SkipLink />` to `AppShell.tsx` and `LandingPage.tsx`.
- Remove unverified compliance claims ("MeitY GIGW 3.0 Compliant") and pseudo-emblem SVGs.
- Consolidate duplicate primitives (`FormField.tsx`, `EmptyState.tsx`, `Breadcrumbs.tsx`).
- *Dependencies:* None. Zero backend changes required.

### Phase 2: Application Shell & Layout Unification (Prompt 04)
- Extract live clock into memoized leaf component.
- Enhance collapsed sidebar (64px) with accessible Radix Tooltips.
- Add keyboard accessibility (`tabIndex={0}`, `role="region"`, `aria-label`) to horizontal table scroll containers.
- Align `PublicHeader.tsx` and `AppShell.tsx` top identity banners into a unified component.
- *Dependencies:* Phase 1 token harmonization.

### Phase 3: Shared Components & Architecture Integration (Prompt 05)
- Initialize `QueryClientProvider` at application root in `App.tsx`.
- Refactor Layer B primitives in pages to use semantic tokens (`surface.*`, `txt.*`, `line.*`).
- Wire form fields to standard React Hook Form + Zod resolvers.
- *Dependencies:* Phase 1 & 2.

### Phase 4: Institution Dashboard & Workflow Pages (Prompts 06 & 07)
- Redesign `InstitutionDashboard.tsx` using semantic tokens and dynamic capacity data.
- Replace naive CSV parsing in `BatchUploadPage.tsx` with robust RFC 4180 parsing.
- Integrate the missing **Column Mapping** and **Validation Preview** steps.
- Connect `QuarantineTriagePage.tsx` to the pre-built `QuarantineTriageTable.tsx` component.
- Replace JavaScript `alert()` on sign-off with a legally attested Attestation Modal.
- *Dependencies:* Backend batch and submission endpoints.

### Phase 5: Independent UX & Accessibility QA (Prompt 08)
- Automated axe-core accessibility audit across all routes.
- Full keyboard traversal and screen reader audit (VoiceOver/NVDA).
- Responsive breakpoint verification across 320px, 768px, 1024px, 1440px.
- *Dependencies:* Phases 1–4.

---

## 11. Conclusion and Next Steps

The existing AIRE frontend has established a solid technical baseline (clean React 18, React Router v7, Radix primitives, passing Vitest harness), but exhibits a stark disconnect between the design-system showcase and the actual functional screens:
1. **The rich workflow components created in `components/workflow/` are stranded in the showcase page and not used on the real screens.**
2. **The functional screens rely on raw Tailwind utility classes and inline styles rather than canonical semantic tokens.**
3. **Critical regulatory steps (Column Mapping and Legal Sign-Off Attestation) are absent or stubbed with browser `alert()` dialogs.**
4. **Essential accessibility affordances (Skip Link, accessible table scrolling, accessible collapsed navigation) are missing.**

This audit report is complete. Awaiting user review and authorization before proceeding to subsequent design decision and implementation phases.
