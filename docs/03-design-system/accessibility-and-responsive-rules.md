# Accessibility & Responsive Rules Specification

| Metadata             | Value                                                                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/03-design-system/accessibility-and-responsive-rules.md`                                                                           |
| Authoritative For    | Concrete Accessibility Rules (WCAG 2.2 AA), Screen Reader Semantics, Responsive Breakpoints, Touch Targets, Reduced-Motion Enforcements |
| Status               | `CONFIRMED RULES` (Baseline WCAG 2.2 AA) · `OPEN` (GIGW 3.0 Verification Item D-004)                                                    |
| Upstream Source      | [`docs/02-experience/accessibility.md`](../02-experience/accessibility.md); ADR-011                                                     |
| Related Requirements | [`AIRE-REQ-065`](../00-governance/requirements-traceability.md), [`AIRE-REQ-078`](../00-governance/requirements-traceability.md)        |
| Last Updated         | 2 November 2026                                                                                                                         |

---

## 1. Concrete Accessibility Rules (WCAG 2.2 Level AA)

AIRE enforces accessibility as a non-negotiable compile-time and runtime rule across all client components.

### Rule 1: Minimum Contrast Ratios (SC 1.4.3 & 1.4.11)

- **Standard Body Text:** Must achieve at least **4.5:1** contrast against its background. In AIRE, `text-primary` (`#0f172a`) on `surface-card` (`#ffffff`) delivers **16.1:1**, and on `surface-canvas` (`#f8fafc`) delivers **15.4:1**.
- **Secondary / Helper Text:** `text-muted` (`#475569`) delivers **4.6:1** on white surfaces (satisfying the 4.5:1 threshold).
- **Interactive Boundaries & Icons:** Non-text UI components (input borders, active checkboxes, status icons) must achieve at least **3.0:1** contrast against adjacent backgrounds.
- **Verification Rule:** Every color combination must be verified with an automated contrast tool before new tokens are introduced.

### Rule 2: Non-Color Dependent Communication (SC 1.4.1)

- Color must **never be the sole visual cue** to convey status, errors, or regulatory outcomes.
- Every colored badge must pair a semantic color with:
  1. An explicit text label (e.g. _"Compliant"_, _"Over-Admission (+4)"_).
  2. A distinct SVG icon (`CheckCircle2` for success, `AlertTriangle` for warning, `AlertOctagon` for danger, `Lock` for sealed/masked).
- Form inputs in error state must not rely only on a red border; they must render an explicit error message below the field and an error icon within the input box.

### Rule 3: 100% Keyboard Operability & No Traps (SC 2.1.1 & 2.1.2)

- All interactive elements must be focusable and operable via standard keys:
  - `Tab` / `Shift+Tab`: Forward and backward navigation in logical visual order.
  - `Enter`: Activates buttons, links, and commits dropdown selections.
  - `Space`: Toggles checkboxes, expands accordions.
  - `Escape`: Closes open dropdowns, slide-over drawers, and non-destructive modals.
- **Zero Keyboard Traps:** Focus must never be trapped in a control or sub-tree unless deliberately confined in an active modal dialog.
- **Skip Navigation:** A visible skip link (`<a href="#main-content">Skip to main content</a>`) must be the very first focusable element on every page.

### Rule 4: Visible Focus Rings (SC 2.4.11 & 2.4.13)

- All interactive controls must display a high-contrast focus indicator whenever focused via keyboard (`:focus-visible`).
- **Standard Focus Utility:** `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2`.
- Removing focus outlines with `outline: none` without providing an equal or higher contrast Tailwind ring is strictly prohibited.

### Rule 5: Modal & Drawer Focus Trapping (SC 2.4.3)

- When a modal (`Modal`) or drawer (`Drawer`) mounts:
  1. Keyboard focus shifts programmatically to the first interactive input or container (`tabIndex="-1"`).
  2. `Tab` and `Shift+Tab` cycle strictly within the overlay boundaries.
  3. Background scrolling is locked (`document.body.style.overflow = "hidden"`).
  4. When dismissed, focus returns automatically to the element that triggered the overlay.

### Rule 6: Form Error Association & Screen Readers (SC 3.3.1 & 3.3.2)

- All form inputs must feature an explicit `<label for="field-id">`.
- When an input fails validation:
  1. Set `aria-invalid="true"` on the input.
  2. Render the error message with `id="field-id-error"`.
  3. Attach `aria-describedby="field-id-error"` to the input.
- On failed form submission, focus automatically shifts to the first invalid input in DOM order.

### Rule 7: Dynamic Announcements via Live Regions (SC 4.1.3)

- Asynchronous status updates must be announced to assistive technology:
  - **Toasts & Informational Updates:** Declared with `role="status"` and `aria-live="polite"`.
  - **High-Severity Errors & Session Warnings:** Declared with `role="alert"` and `aria-live="assertive"`.
  - **Real-Time Ingestion Progress Bars:** Declared with `role="progressbar"`, `aria-valuenow="75"`, `aria-valuemin="0"`, `aria-valuemax="100"`, and `aria-label="Ingestion progress"`.

### Rule 8: Minimum Touch Target Sizes (SC 2.5.8)

- All interactive targets must meet or exceed **$24 \times 24\text{ CSS pixels}$**, or provide at least $24\text{px}$ clearance between adjacent targets.
- Primary workflow buttons (e.g. _"Upload Batch"_, _"Seal Cohort"_) maintain a touch-friendly standard height of **$44\text{px}$** (`min-h-[44px]`).

### Rule 9: Absolute Respect for Reduced Motion (SC 2.3.3)

- When `prefers-reduced-motion: reduce` is enabled in the user's operating system:
  1. All transitions and animation durations are forced to `0.01ms`.
  2. Skeleton loaders render as static light-gray shapes without pulsing.
  3. Slide-over drawers and modals appear instantly without translation or scaling.

---

## 2. External Standards Verification Note (GIGW 3.0)

> [!NOTE]
> AIRE's binding engineering baseline is **WCAG 2.2 Level AA** under architectural decision `ADR-011`. Whether additional mandates from the **Guidelines for Indian Government Websites (GIGW 3.0)** apply (e.g. mandatory Indian national portal header emblems, multilingual language switchers, or specific accessibility certification seals) remains documented as an active open decision item ([`D-004`](../00-governance/decisions/decision-register.md)). Engineering implementation must strictly satisfy WCAG 2.2 AA without asserting unverified legal GIGW certifications until confirmed by AICTE.

---

## 3. Concrete Responsive Rules

AIRE implements a desktop-optimized, responsive-adaptive strategy to support institutional workflows while ensuring mobile accessibility for students and public verifiers.

```
+----------------------------------------------------------------------------------------------------------+
| VIEWPORT WIDTH           | RESPONSIVE LAYOUT RULE                                                        |
+----------------------------------------------------------------------------------------------------------+
| >= 1280px (Desktop Wide) | Full expanded shell (256px sidebar). Full 9-column data table visible.        |
| 1024px - 1279px (Compact)| Sidebar auto-collapses to 64px icon-only rail. Table maintains 36px density.  |
| 768px - 1023px (Tablet)  | Sidebar moves to off-canvas drawer. Horizontal table scroll with sticky IDs.  |
| < 768px (Mobile)         | Stacked layout. Tables collapse into card accordions. Action bar sticky bottom.|
+----------------------------------------------------------------------------------------------------------+
```

### 3.1 Breakpoint Token Scale

| Breakpoint Key | Minimum Width | Target Devices                      | Primary Layout Adaptation                                       |
| -------------- | ------------- | ----------------------------------- | --------------------------------------------------------------- |
| `sm`           | `640px`       | Large smartphones, small tablets    | Single-column form containers (`max-w-form`).                   |
| `md`           | `768px`       | iPads, portrait tablets             | Off-canvas sidebar navigation. 2-column KPI grids.              |
| `lg`           | `1024px`      | Standard laptops, landscape tablets | Icon-only sidebar navigation (64px). Tables unscrollable.       |
| `xl`           | `1280px`      | Standard desktop monitors (1080p)   | Fully expanded sidebar (256px). Split-panel evidence workbench. |
| `2xl`          | `1536px`      | Large desktop displays              | Maximum content container width: 1440px centered (`mx-auto`).   |

### 3.2 High-Density Table Responsive Adaptation

- **Desktop ($\ge 1024\text{px}$):** Full multi-column tabular grid. Compact 36px row height.
- **Tablet ($768\text{px} - 1023\text{px}$):** Table renders inside an accessible scroll container (`overflow-x-auto`). The leading identification column (Roll Number / Institute ID) remains sticky left with a visual boundary shadow.
- **Mobile ($< 768\text{px}$):** Data tables transform into vertical card stacks. Each card represents one student or institution row, with secondary columns accessible via an accordion toggle.
