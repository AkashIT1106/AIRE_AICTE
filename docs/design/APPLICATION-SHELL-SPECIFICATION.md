# AIRE Application Shell Specification

**Status:** Approved Design Specification  
**Date:** 3 November 2026  
**Audience:** Frontend Engineers, Design System Engineers, Accessibility Testers  
**Authority:** Derived from `docs/design/UX-DECISIONS.md`, UX4G 3.0 Government Portal Patterns, and WCAG 2.2 AA.

---

## 1. Architectural Principles & Shell Geometry

The AIRE application shell provides a predictable, accessible, and role-aware operational environment across authenticated workspaces and public entry points.

### 1.1 Resolution of the "Triple-Header" Defect

The audit identified that `AppShell.tsx` stacked three separate headers:
1. 28px Statutory Identity Band (`#0B1520`)
2. 64px AIRE Application Header (`#11283B`)
3. 36px Breadcrumbs Bar (`#F5F7F8`)

This consumed **128px of vertical screen real estate** before page content began, severely compressing data tables on laptops (1366x768 and 1280x800).

```text
PREVIOUS UNCONSOLIDATED SHELL (128px Overhead):
┌─────────────────────────────────────────────────────────────┐
│ 1. भारत सरकार / Government of India • Ministry of Education │  28px (#0B1520)
├─────────────────────────────────────────────────────────────┤
│ 2. AIRE • Institution Switcher • Profile Menu               │  64px (#11283B)
├─────────────────────────────────────────────────────────────┤
│ 3. Breadcrumbs: Institution / Admissions / Dashboard        │  36px (#F5F7F8)
└─────────────────────────────────────────────────────────────┘

CONSOLIDATED UX4G COMPLIANT SHELL (64px Header + In-Flow Breadcrumbs):
┌─────────────────────────────────────────────────────────────┐
│ भारत सरकार | AIRE  [AISHE: DIT-101 ▾]  [Cycle 26-27] [User] │  64px (--surface-header)
├─────────────────────────────────────────────────────────────┤
│ [In-Page Canvas]                                            │
│ Institution > Admissions > Dashboard                        │  In document flow
│ H1: Admission Reporting & Submissions                       │
└─────────────────────────────────────────────────────────────┘
```

#### Approved Consolidation Pattern:
1. **Unified Header (64px Fixed Height):**
   * Incorporates bilingual statutory attribution (*भारत सरकार / Government of India*) alongside the AIRE institutional brand.
   * Houses global utilities: Active Institution Tenant Switcher, Academic Cycle Badge, and User Profile/Logout Dropdown.
   * Uses semantic background `--surface-header` (`#183B56`), eliminating conflicting dark blues.
2. **In-Flow Breadcrumb Navigation:**
   * Removed from the global floating header.
   * Rendered in normal document flow at the top of the `#content` main canvas, directly preceding the page's primary H1.
   * Height: ~24px, zero layout shift, natural keyboard tab order.
3. **Mandatory Skip Navigation:**
   * `<SkipLink href="#content" />` rendered as the very first element in `AppShell.tsx`. Receives immediate focus on initial `Tab` keypress, allowing keyboard and screen-reader users to skip directly to `#content`.

---

## 2. Shell Geometry & Breakpoint Matrix

| Viewport Category | Width Range | Header Layout | Sidebar Navigation | Main Content Max-Width | Gutter Padding |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Large Desktop** | $\ge 1440\text{px}$ | 64px fixed; full bilingual identity & switcher | 256px expanded fixed; toggleable to 64px | `max-w-7xl` (or full width for high-density tables) | `px-8` (32px) |
| **Medium Desktop / Laptop** | $1024\text{px} - 1439\text{px}$ | 64px fixed; full identity & switcher | 256px expanded; user-collapsible to 64px | `max-w-7xl` | `px-6` (24px) |
| **Tablet Portrait** | $768\text{px} - 1023\text{px}$ | 64px fixed; compact switcher | 64px icon rail or off-canvas drawer | `w-full` | `px-6` (24px) |
| **Mobile** | $< 768\text{px}$ | 56px fixed; hamburger trigger + AIRE mark | Off-canvas drawer (280px) with backdrop | `w-full` | `px-4` (16px) |

---

## 3. Workspace Shell Specifications

### 3.1 Public Portal Shell (`/`, `/login`)

* **Target Audience:** Unauthenticated users, prospective candidates, institutional operators seeking login.
* **Header (`PublicHeader.tsx`):**
  * Clean government portal header with bilingual text (*भारत सरकार / Government of India • AICTE*).
  * Direct CTAs: "Sign In to AIRE" (Primary button) and "Verify Entitlement" (Link).
  * Accessibility Controls: Contrast toggle, font resizing (A- / A / A+), language selector.
* **Layout:** Full-width hero section, standard responsive grid container (`max-w-7xl`), zero sidebar.
* **Footer (`PublicFooter.tsx`):** Government statutory copyright, NIC/AICTE attribution, accessibility statement link, privacy policy, and grievance links.

### 3.2 Institution Workspace Shell (`/institution/*`)

* **Target Audience:** `INSTITUTION_ADMIN` (Principal/Dean), `INSTITUTION_OPERATOR` (Registrar/Data Entry).
* **Workspace Theme:** Institutional Navy (`--brand-primary: #245B75`).
* **Header Elements:**
  1. Skip link (`<SkipLink href="#content" />`).
  2. Mobile menu trigger button (visible `<768px`, minimum 44px touch target).
  3. AIRE Identity mark with institutional subtitle.
  4. Active Institution Dropdown: Displays current AISHE code and college name (`DIT-101`); allows multi-institution switching for authorized users.
  5. Academic Cycle Badge (`Cycle 2026–27 Active`).
  6. User Profile Dropdown: Displays user name, role (`Institution Admin`), and "Sign Out" option.
* **Sidebar Navigation Structure:**
  * **Header:** Workspace indicator (`Institution Workspace`).
  * **Primary Links:**
    1. *Dashboard Overview* (`/institution/dashboard`) — Icon: `Building2`
    2. *Submissions Ledger* (`/institution/submissions`) — Icon: `Layers`
    3. *Upload New Batch* (`/institution/submissions/new`) — Icon: `UploadCloud`
  * **Secondary Links (Planned Phase 4):**
    4. *Approved Intake Matrix* (`/institution/intake`) — Icon: `FileSpreadsheet`
    5. *Audit Trail* (`/institution/audit`) — Icon: `FileText`
  * **Collapse Action:** Fixed button at bottom (`PanelLeftClose` / `PanelLeftOpen`) toggling 256px $\leftrightarrow$ 64px width.
  * **Accessibility Rule for Collapsed State:** When collapsed, navigation links MUST wrap icons in accessible Radix Tooltips (`<Tooltip content={item.name} side="right" />`) to prevent loss of accessible names.
* **Footer Status Bar (36px):**
  * Left: Platform version and build stamp (`AIRE v0.1.0 • AICTE Central Engine`).
  * Right: `<InstitutionalClock />` — Isolated leaf component displaying ticking IST (`HH:mm:ss IST (UTC+05:30)`) without triggering parent shell re-renders.

### 3.3 AICTE Reviewer Workspace Shell (`/aicte/*`)

* **Target Audience:** `AICTE_ADMIN`, `AICTE_REVIEWER` (Regional Officer, Scrutiny Committee Member).
* **Workspace Theme:** Executive Regulatory Teal (`--brand-teal: #0F766E`).
* **Header Elements:** Similar to Institution shell, but replaces Institution Switcher with **Regional Jurisdiction Switcher** (`Northern Region / All Jurisdictions`).
* **Sidebar Navigation Structure:**
  1. *National Compliance Overview* (`/aicte/overview`) — Icon: `ShieldCheck`
  2. *Scrutiny Queue* (`/aicte/queue`) — Icon: `Clock`
  3. *Institutional Submissions* (`/aicte/submissions`) — Icon: `Building2`
  4. *Policy Activation Workbench* (`/aicte/policies`) — Icon: `SlidersHorizontal`

### 3.4 Student Portal Shell (`/student/*`)

* **Target Audience:** Individual candidates verifying admission concordance (`STUDENT` / Public Lookup).
* **Layout:** Centered single-column shell (`max-w-4xl mx-auto`), no left sidebar.
* **Header Elements:** Lightweight header with AIRE Student Portal mark and direct help desk link.
* **Navigation:** Tabbed top bar: *My Record*, *Verification Status*, *Download Proof (AEP)*.

### 3.5 Auditor Workspace Shell (`/auditor/*`)

* **Target Audience:** `AUDITOR` (Statutory Auditor, Vigilance Officer).
* **Workspace Theme:** High-Security Dark Slate (`--text-primary: #172B3A`).
* **Sidebar Navigation Structure:**
  1. *Audit Trail Explorer* (`/auditor/logs`) — Icon: `FileText`
  2. *Merkle Root Inspector* (`/auditor/integrity`) — Icon: `Lock`
  3. *Temporal Replay Simulator* (`/auditor/replay`) — Icon: `History`

### 3.6 Administrator Workspace Shell (`/admin/*`)

* **Target Audience:** `SUPER_ADMIN` (Platform Engineering, AICTE System Administrator).
* **Sidebar Navigation Structure:**
  1. *System Health & Telemetry* (`/admin/health`)
  2. *Tenant & Institution Registry* (`/admin/institutions`)
  3. *User Access & Platform Roles* (`/admin/users`)

---

## 4. Mobile & Responsive Layout Contracts

### 4.1 Mobile Off-Canvas Drawer Contract (<768px)

* **Trigger:** Accessible `<button>` in header with `aria-label="Open navigation menu"`, `aria-expanded={isOpen}`, min 44x44px bounding box.
* **Overlay:** Fixed backdrop `bg-black/50 backdrop-blur-xs z-40`.
* **Drawer Panel:** `fixed inset-y-0 left-0 w-72 bg-surface-sidebar z-50 shadow-2xl flex flex-col`.
* **Focus Management:**
  1. Opening drawer moves focus to the first navigation link.
  2. Traps `Tab` key within the drawer.
  3. `Escape` key immediately closes the drawer and restores focus to the hamburger button.
  4. Clicking any route link closes the drawer automatically.

### 4.2 High-Density Table Horizontal Scrolling Contract

All data tables with >5 columns must be wrapped in a compliant scroll container:
```tsx
<div
  role="region"
  aria-label="Batches Ledger"
  tabIndex={0}
  className="w-full overflow-x-auto border border-line-default rounded-md focus-aire"
>
  <table className="w-full text-left border-collapse table-compact font-sans">
    {/* Table contents */}
  </table>
</div>
```
* **Keyboard Rule:** `tabIndex={0}` allows keyboard-only users to focus the region and scroll horizontally using the Left/Right Arrow keys without needing a pointer device.

---
*End of APPLICATION-SHELL-SPECIFICATION.md.*
