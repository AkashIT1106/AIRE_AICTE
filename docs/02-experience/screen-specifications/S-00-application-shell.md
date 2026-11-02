# S-00 — Application Shell & Global Layout Wrapper

| Metadata             | Value                                                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Screen ID            | `S-00`                                                                                                                                    |
| Screen Name          | Application Shell & Global Layout Wrapper                                                                                                 |
| Purpose              | Persistent layout framing, global branding, context switcher, session state monitor, and accessible navigation container across all views |
| User Roles Allowed   | All Authenticated Roles (`AICTE_ADMIN`, `AICTE_REVIEWER`, `INST_ADMIN`, `INST_OPERATOR`, `STUDENT`, `AUDITOR`)                            |
| Related Journeys     | All Journeys (`J-01` through `J-08`)                                                                                                      |
| Primary Route        | Shared Root Layout Wrapper (applies to all `/institution/*`, `/aicte/*`, `/student/*`, `/auditor/*`)                                      |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                     |
| Source Reference     | PROJECT_PLAN.md §10.1, §10.2                                                                                                              |
| Related Requirements | [`AIRE-REQ-078`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-079`](../../00-governance/requirements-traceability.md)    |
| Last Updated         | 2 November 2026                                                                                                                           |

---

## 1. Information Hierarchy & Structural Layout

The Application Shell is composed of three landmark regions obeying semantic HTML5 specifications:

1. **Top Header (`<header role="banner">`):**
   - Brand mark: AIRE emblem + AICTE subtext.
   - Context Switcher: Displays current active tenant / regional scope with dropdown trigger.
   - Integration Mode Pill: Clear badge (`MOCK`, `SANDBOX`, `PRODUCTION`).
   - Session & User Identity: Current user avatar/initials, full legal name, active role, and sign-out control.
2. **Left Navigation Sidebar (`<nav role="navigation">`):**
   - Active Workspace title indicator.
   - Grouped navigational links with SVG icons, label, and dynamic notification counts.
   - Bottom utility actions: Audit shortcut, documentation link, and sidebar collapse/expand toggle.
3. **Main Content Viewport (`<main id="main-content" role="main">`):**
   - Breadcrumbs bar.
   - Contextual workspace header.
   - Dynamic page component surface.

---

## 2. Interaction & State Contracts

### 2.1 Navigation States

- **Active Route:** Marked with `border-l-4 border-indigo-600 bg-slate-100 text-slate-900 font-semibold` and programmatic `aria-current="page"`.
- **Hover / Focus:** Clear focus ring (`focus-visible:ring-2 focus-visible:ring-indigo-500`).
- **Sidebar Collapse:**
  - Viewports $\ge 1280\text{px}$: Expanded default (width: 256px / `w-64`).
  - Viewports between $1024\text{px}$ and $1279\text{px}$: Automatically collapses to icon-only navigation (width: 64px / `w-16`) with hover tooltips (`aria-label`).
  - Viewports $< 1024\text{px}$: Hidden by default; rendered as an off-canvas drawer triggered by header hamburger menu.

### 2.2 Integration Mode Indicator

- A permanent pill in the top header communicates the active backend adapter environment:
  - `MOCK`: Amber badge (`bg-amber-100 text-amber-800 border-amber-300`) with tooltip: _"Mock Mode: Using synthetic adapter data. No real APAAR queries executed."_
  - `SANDBOX`: Blue badge (`bg-sky-100 text-sky-800 border-sky-300`).
  - `PRODUCTION`: Emerald badge (`bg-emerald-100 text-emerald-800 border-emerald-300`).

---

## 3. Data & Privacy Invariants

- **Data Displayed:** Authenticated user full name, email, active role code, active institution name, AICTE Institute ID.
- **Data Masked / Excluded:** Raw API keys, database connection strings, student demographic records.
- **Client Cache Flush:** When the user clicks the sign-out trigger or when a session expires, all TanStack Query caches and session storage items are purged immediately.

---

## 4. Accessibility & Keyboard Expectations

- **Skip Link:** A high-contrast skip navigation button (`<a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>`) is the first focusable element.
- **Tab Sequence:** Skip link $\rightarrow$ Context switcher $\rightarrow$ User menu $\rightarrow$ Sidebar navigation items $\rightarrow$ Breadcrumb links $\rightarrow$ Main content controls.
- **Escape Key:** Dismisses open user menus, context dropdowns, or mobile navigation drawers.
