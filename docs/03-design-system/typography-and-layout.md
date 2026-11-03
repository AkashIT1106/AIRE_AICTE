# Typography & Layout Architecture

| Metadata             | Value                                                                                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/03-design-system/typography-and-layout.md`                                                                                                                 |
| Authoritative For    | Typographic Hierarchy, Reading Dynamics, Layout Shell Geometry, Grid Density Modes, Responsive Adaptations                                                       |
| Status               | `PROPOSED DESIGN FOUNDATION` (Awaiting Technical Sign-Off in Phase 2)                                                                                            |
| Upstream Source      | [`docs/02-experience/information-architecture.md`](../02-experience/information-architecture.md), [`docs/03-design-system/design-tokens.md`](./design-tokens.md) |
| Related Requirements | [`AIRE-REQ-078`](../00-governance/requirements-traceability.md), [`AIRE-REQ-065`](../00-governance/requirements-traceability.md)                                 |
| Last Updated         | 2 November 2026                                                                                                                                                  |

---

## 1. Typographic Architecture & Font Pairings

AIRE pairs a high-legibility geometric sans-serif for UI labels and institutional body copy with a dedicated tabular monospace typeface for numerical data, identifiers, and cryptographic artifacts.

### 1.1 Font Stacks & Rendering Disciplines

1. **Primary Interface Font (`font-sans`):**
   - **Stack:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`.
   - **Rendering Optimization:** Subpixel font smoothing enabled (`-webkit-font-smoothing: antialiased`).
   - **Characteristics:** Tall x-height, open apertures, distinct uppercase `I` vs lowercase `l` vs numeral `1` to prevent identification errors in student roll numbers.
2. **Tabular Monospace Font (`font-mono`):**
   - **Stack:** `'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace`.
   - **Tabular Numerics Rule:** Monospace characters guarantee that multi-row numerical columns (e.g. Sanctioned Intake, Admitted Count, Surplus Variance) align vertically down decimal points.
   - **Applications:** Roll numbers, APAAR tokens, Merkle root SHA-256 digests, correlation IDs, and server timestamps.

---

## 2. Type Hierarchy & Practical Usage

| Level / Token                                   | Size & Line Height | Weight            | Letter Spacing | Concrete Usage in AIRE Workspaces                                                        |
| ----------------------------------------------- | ------------------ | ----------------- | -------------- | ---------------------------------------------------------------------------------------- |
| **Display / H1** (`font-size-2xl`)              | `24px` / `32px`    | Bold (`700`)      | `-0.02em`      | Workspace Top Title (e.g. _"National Compliance Overview"_, _"Cohort Ledger"_).          |
| **Section Title / H2** (`font-size-xl`)         | `20px` / `28px`    | Semibold (`600`)  | `-0.015em`     | Major Panel Headers (e.g. _"Quarantine Triage Workbench"_, _"Show Cause Queue"_).        |
| **Card Header / H3** (`font-size-lg`)           | `18px` / `24px`    | Semibold (`600`)  | `-0.01em`      | Modal Dialog Titles, Metric Summary Card Headers, Drawer Titles.                         |
| **Body Standard** (`font-size-base`)            | `14px` / `20px`    | Normal (`400`)    | `0em`          | Form labels, input text, dialog explanations, legal attestation clauses.                 |
| **Table Data / Dense** (`font-size-sm`)         | `13px` / `18px`    | Normal / Medium   | `0em`          | **Primary Data Grid Cells**, column headers (`font-medium text-slate-700`), breadcrumbs. |
| **Captions & Metadata** (`font-size-xs`)        | `12px` / `16px`    | Medium / Semibold | `+0.01em`      | Status badges, error messages below inputs, timestamps, helper tooltips.                 |
| **Monospace Identifiers** (`font-size-mono-sm`) | `13px` / `18px`    | Tabular Normal    | `0em`          | Student Roll Numbers, APAAR Tokens, Merkle Hashes, Correlation IDs.                      |

### 2.1 Reading Line Lengths & Truncation Invariants

- **Body & Legal Text:** Maximum line length constrained to **65–75 characters** (`max-w-prose` / ~640px) to maintain optimal reading cadence and prevent eye fatigue during lengthy legal review.
- **Table Cell Truncation:** Cells containing lengthy strings (e.g. full Programme Title or Institution Name) truncate with an ellipsis (`truncate`), with the full string preserved in an accessible browser tooltip (`title="..."`).
- **Cryptographic Hashes:** Monospace hash digests exceeding 16 characters truncate in tables (e.g. `e3b0c442...855`) and feature an instant one-click copy button.

---

## 3. Page Layout & Grid Geometry

AIRE standardizes a 3-zone layout model across all authenticated screens:

```
+----------------------------------------------------------------------------------------------------+
| TOP APPLICATION HEADER (Fixed: 64px height)                                                        |
+----------------------------------------------------------------------------------------------------+
| SIDEBAR (Width: 256px / 64px) | MAIN VIEWPORT (Fluid: max-w-[1440px] centered)                    |
|                               | - Breadcrumb Trail (Height: 36px)                                  |
|                               | - Page Title & Provenance Bar (Height: 48px)                       |
|                               | - Content Container (Padding: 24px)                                |
|                               |   + Metric KPI Grid (4-Column)                                     |
|                               |   + Filter Bar & Debounced Search                                  |
|                               |   + High-Density Data Grid (Compact: 36px row height)               |
+----------------------------------------------------------------------------------------------------+
| FOOTER STATUS BAR (Fixed: 36px height)                                                             |
+----------------------------------------------------------------------------------------------------+
```

### 3.1 Content Density Modes

AIRE provides two purpose-driven density profiles:

1. **High-Density Institutional Mode (Default for `/institution` & `/aicte`):**
   - **Row Height:** `36px` (`height-table-row-compact`).
   - **Cell Padding:** `py-1.5 px-3` (6px vertical, 12px horizontal).
   - **Typography:** `13px` base (`font-size-sm`) with 12px badges.
   - **Information Goal:** Permits 18–22 student admission records or institutional scrutiny rows to be displayed simultaneously on a standard 1080p monitor without scrolling.
2. **Comfortable Public Mode (Default for `/student` & `/verify`):**
   - **Touch Target / Row Height:** `44px` minimum (`height-table-row-standard`).
   - **Cell / Card Padding:** `p-6` (24px).
   - **Typography:** `14px` base (`font-size-base`) with 18px card headers.
   - **Information Goal:** Approachable, spacious, high-contrast readability on mobile devices and public kiosks.

---

## 4. Form & Filter Bar Layout

1. **Standard Form Geometry:**
   - Forms (e.g. Login `S-01`, Correction Request `S-32`) are single-column containers constrained to `max-w-form` (640px).
   - Field vertical stacking: `space-y-4` (16px vertical gap between input groups).
   - Label-to-input gap: `space-1.5` (6px).
   - Field Error text renders immediately beneath input: `text-rose-600 text-xs mt-1`.
2. **Data Table Filter Bars:**
   - Rendered immediately above high-density tables.
   - Left-aligned: Debounced search input (width: 320px) + active filter dropdowns (Programme, Quota, Category).
   - Right-aligned: Action triggers (_"Export Filtered CSV"_, _"Upload Batch"_).
   - Single horizontal bar layout (`flex items-center justify-between gap-4 py-3`).

---

## 5. Responsive Viewport Adaptations

| Breakpoint                  | Viewport Range                  | Sidebar Navigation Behavior                                                 | High-Density Table Adaptation                                                               |
| --------------------------- | ------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Desktop Wide (`2xl`)**    | $\ge 1536\text{px}$             | Fully expanded (256px). Permanent visibility.                               | Full data table visible (all 9 columns, no horizontal scroll).                              |
| **Desktop Standard (`xl`)** | $1280\text{px} - 1535\text{px}$ | Fully expanded (256px).                                                     | Standard layout; less critical columns (e.g. Gender, Submitter) hide into accordion.        |
| **Desktop Compact (`lg`)**  | $1024\text{px} - 1279\text{px}$ | **Auto-collapses to icon-only rail (64px)** with accessible hover tooltips. | Table maintains 36px density; horizontal overflow scroll with sticky left columns.          |
| **Tablet (`md`)**           | $768\text{px} - 1023\text{px}$  | Hidden; rendered as off-canvas drawer triggered by header menu.             | Filter bar wraps to 2 lines; table cells render in responsive scroll container.             |
| **Mobile (`sm`)**           | $< 768\text{px}$                | Off-canvas drawer. Student & Verifier cards stack vertically.               | Complex tables present child-row accordion card view. Primary actions remain sticky bottom. |
