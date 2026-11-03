# Component Foundations Specification

| Metadata             | Value                                                                                                                                                      |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/03-design-system/component-foundations.md`                                                                                                           |
| Authoritative For    | Foundational UI Component Contracts, Variants, States, Behaviors, Accessibility Requirements                                                               |
| Status               | `PROPOSED DESIGN FOUNDATION` (Awaiting Technical Sign-Off in Phase 2)                                                                                      |
| Design Pattern       | Radix UI Primitives + Tailwind CSS (`shadcn/ui` architecture per D-003)                                                                                    |
| Upstream Source      | [`docs/02-experience/interaction-contracts.md`](../02-experience/interaction-contracts.md), [`docs/03-design-system/design-tokens.md`](./design-tokens.md) |
| Related Requirements | [`AIRE-REQ-078`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-083`](../00-governance/requirements-traceability.md)                         |
| Last Updated         | 2 November 2026                                                                                                                                            |

---

## 1. Action Components

### 1.1 Buttons (`Button`)

Interactive triggers for executing workflows, submitting forms, or opening modal dialogs.

| Variant                 | Semantic Role & Visual Style                                                                    | Usage in AIRE                                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Primary**             | Solid `bg-brand-primary text-white hover:bg-brand-primary-hover active:bg-brand-primary-active` | Single primary action per view (e.g. _"Upload Batch"_, _"Seal Cohort"_, _"Sign In"_).                 |
| **Secondary / Outline** | `bg-surface-card border border-line-default text-txt-primary hover:bg-surface-card-subdued`     | Supporting actions (e.g. _"Cancel"_, _"Save Draft"_, _"Download Template"_).                          |
| **Destructive**         | Solid `bg-state-danger-icon text-white hover:bg-state-danger-text`                              | High-friction irreversible actions (e.g. _"Confirm Penalty Seat Reduction"_, _"Deactivate Account"_). |
| **Ghost**               | `bg-transparent text-txt-secondary hover:bg-surface-card-subdued hover:text-txt-primary`        | Table row quick actions, pagination next/prev triggers, icon buttons.                                 |
| **Link**                | `text-txt-link underline-offset-4 hover:underline p-0 h-auto`                                   | Navigational references, handbook citations.                                                          |

#### Component States

- **Idle:** Resting state with crisp 1px border where applicable (`rounded-md`).
- **Hover:** Darkens background slightly ($150\text{ms}$ transition); pointer cursor.
- **Active / Pressed:** Visual compression feedback.
- **Focus:** Visible focus ring (`focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2`).
- **Disabled:** `opacity-50 cursor-not-allowed pointer-events-none` with `aria-disabled="true"`.
- **Loading:** Replaces icon/label with an inline SVG spinner + _"Processing..."_; element is disabled to block double-clicks.

---

## 2. Form & Data Entry Components

### 2.1 Text & Password Input (`Input`)

Text entry fields for roll numbers, names, email credentials, and search queries.

- **Variants:** Standard Text, Password (with toggleable eye icon), Search (with magnifying glass icon and clear `X` button).
- **Height & Padding:** Standard height: `36px` (`py-2 px-3 text-sm`).
- **States:**
  - _Idle:_ `border border-line-default bg-surface-card text-txt-primary`.
  - _Focus:_ `border-line-interactive ring-1 ring-[var(--focus-ring)]`.
  - _Error:_ `border-state-danger-icon ring-1 ring-[var(--state-danger-icon)] text-txt-primary`.
  - _Disabled:_ `bg-surface-card-subdued text-txt-muted cursor-not-allowed`.
- **Accessibility:** Explicit `<label for="...">`, `aria-required="true"`, `aria-invalid="true"` when defective, linked to error via `aria-describedby`.

### 2.2 Select & Combobox (`Select` / `Combobox`)

Constrained selection for academic cycles, reservation categories, quota types, and regions.

- **Interaction Contract:** Opens a clean floating dropdown menu with search filter for lists $> 7$ items.
- **Keyboard Navigation:** `Up`/`Down` arrows navigate options; `Enter` commits selection; `Escape` closes dropdown.
- **Accessibility:** Implements `role="combobox"`, `aria-expanded="true/false"`, `aria-autocomplete="list"`.

### 2.3 Legal Attestation Checkbox (`Checkbox`)

High-visibility confirmation control used for non-repudiation and statutory certifications.

- **Visual Style:** $18 \times 18\text{px}$ box (`rounded-sm border-2 border-slate-400 checked:bg-indigo-600 checked:border-indigo-600`).
- **Attestation Box Variant:** Embedded in a bordered callout card (`p-4 bg-slate-50 border border-slate-300 rounded-md`) with bold legal copy.
- **Accessibility:** `aria-checked="true/false"`, spacebar toggleable, high-contrast checkmark SVG.

### 2.4 File Upload Dropzone (`FileDropzone`)

Multi-part drag-and-drop zone for admission spreadsheets (CSV/XLSX) and Show Cause legal evidence (PDF).

- **Visual Style:** Dashed perimeter (`border-2 border-dashed border-slate-300 rounded-lg p-8 bg-slate-50 text-center hover:bg-slate-100 hover:border-indigo-400`).
- **Interactive Feedback:** Dragging over turns border solid indigo (`border-indigo-600 bg-indigo-50/50`).
- **File Validation:** Rejects unsupported file extensions immediately client-side with an error banner before upload begins.
- **Keyboard Access:** Entire dropzone is keyboard focusable; hitting `Enter` or `Space` opens the system file picker dialog.

---

## 3. Feedback, Alerts & Status Components

### 3.1 Status Badges (`Badge`)

Compact visual indicators communicating reconciliation health, verification status, and batch states.

- **Contract:** Color is **never** the sole indicator. Every badge pairs a semantic tint with an explicit text label and SVG icon:

```
+--------------------------------------------------------------+
| [✓] Compliant (Approved Intake)      (Emerald: bg-emerald-50) |
| [!] Quarantined (12 Rows Defective)  (Amber: bg-amber-50)     |
| [X] Over-Admission (+4 Excess Seats) (Rose: bg-rose-50)       |
| [i] Informational Notice             (Sky: bg-sky-50)         |
| [🔒] Sealed & Tamper-Locked           (Slate: bg-slate-100)    |
+--------------------------------------------------------------+
```

### 3.2 Inline Notice Banners (`Alert`)

Persistent, full-width callouts anchored above data tables or dashboards for critical deadlines or Show Cause notices.

- **Variants:**
  - _Warning (Freeze Notice):_ Amber background with countdown clock and explanation.
  - _Danger (Show Cause Active):_ Red background with notice number and remaining days.
- **Accessibility:** Rendered with `role="region"` and accessible landmark label.

### 3.3 Toast Notifications (`Toast`)

Non-modal, top-right notifications for asynchronous background completions.

- **Contract:** Maximum 3 stacked toasts (`top-4 right-4`). Informational auto-dismisses in 4,000ms. **Error toasts never auto-dismiss** and require explicit dismissal. Error toasts feature a monospace Correlation ID (`cor-882f-1049`) with copy button.

### 3.4 Skeleton Loaders (`Skeleton`)

Geometry-matched placeholder blocks rendered during data fetching to guarantee zero layout shift (CLS = 0).

- **Behavior:** Subtle pulse animation ($1.5\text{s}$ duration); overridden to static gray placeholders when `prefers-reduced-motion` is active.

---

## 4. Overlay & Container Components

### 4.1 Confirmation & Step-Up Modals (`Modal`)

Centered dialogs interrupting the user for irreversible transactions or security re-authentication.

- **Irreversible Sealing Modal Contract:**
  - Displays headcount, APAAR verification percentage, and approved ceiling comparison.
  - Features mandatory attestation checkbox.
  - Action button disabled until attestation is checked.
- **Focus Protocol:** Traps focus inside modal; background scrolling locked; dismissed via `Escape` only if non-destructive.

### 4.2 Contextual Slide-Over Drawer (`Drawer`)

Right-hand slide-out panel allowing users to inspect evidence, edit quarantine rows, or submit Show Cause responses without leaving the main data table.

- **Widths:** Standard: `480px`; Wide (Side-by-side evidence inspection): `640px`.
- **Animation:** Subdued $150\text{ms}$ slide-in (`ease-out`); instant reveal under reduced-motion.
- **Unsaved Changes Interception:** Prompt intercepts if closed while form has uncommitted edits.

---

## 5. Tabular Data & Grid Components

### 5.1 High-Density Data Grid (`DataTable`)

The core workhorse component for the Cohort Ledger (`S-14`), Scrutiny Hub (`S-21`), and Audit Explorer (`S-39`).

- **Geometry:** Compact `36px` row height; monospace tabular figures for roll numbers, APAAR tokens, and timestamps.
- **Sortable Columns:** Clicking `<th>` toggles ascending/descending with visual arrow indicator and `aria-sort`.
- **Row Selection:** Leading checkbox column supporting individual and select-all actions with floating bulk action bar.
- **Server Pagination Bar:** Bottom-anchored bar with record range summary, page jump input, and Next/Prev triggers.

### 5.2 Quarantine Triage Workbench (`QuarantineTable`)

Specialized data grid for isolating defective admission rows (`S-12`).

- **Inline Editable Cells:** Double-clicking an error cell opens a specialized input (category dropdown, date picker) with auto-validation on blur.
- **Defect Highlighting:** Defective cells feature a soft red background (`bg-rose-50 border-rose-400`) and hover tooltip explaining the exact AICTE validation rule failure.
