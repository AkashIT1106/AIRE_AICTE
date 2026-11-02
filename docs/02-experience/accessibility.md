# Accessibility Specification (WCAG 2.2 AA)

| Metadata             | Value                                                                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/02-experience/accessibility.md`                                                                                               |
| Authoritative For    | WCAG 2.2 Level AA Compliance, Accessible Keyboard Navigation, Color Contrast Standards, Screen Reader Semantics, Focus Management   |
| Status               | `CONFIRMED` (Baseline WCAG 2.2 AA) · `OPEN` (GIGW Verification Item D-004)                                                          |
| Source               | PROJECT_PLAN.md §7; ADR-011; [`docs/00-governance/decisions/decision-register.md`](../00-governance/decisions/decision-register.md) |
| Related Requirements | [`AIRE-REQ-065`](../00-governance/requirements-traceability.md), [`AIRE-REQ-078`](../00-governance/requirements-traceability.md)    |
| Last Updated         | 2 November 2026                                                                                                                     |

---

## 1. Compliance Baseline & Scope

In accordance with architectural decision [`ADR-011`](../00-governance/decisions/decision-register.md), all user-facing interfaces across AIRE must strictly adhere to the **Web Content Accessibility Guidelines (WCAG) 2.2 Level AA** criteria.

> [!NOTE]
> While WCAG 2.2 AA is the approved binding engineering baseline, formal verification of specific requirements under the **Guidelines for Indian Government Websites (GIGW 3.0)** remains documented as an active open decision item ([`D-004`](../00-governance/decisions/decision-register.md)). Engineering implementations must comply with WCAG 2.2 AA without asserting unverified legal GIGW certifications.

---

## 2. Color & Visual Contrast Ratios

All text, icons, borders, and interactive state indicators must meet or exceed WCAG 2.2 Success Criterion 1.4.3 (Contrast Minimum) and 1.4.11 (Non-text Contrast):

| UI Element Type                                         | WCAG Minimum Contrast | AIRE Standard Baseline                | Applied Context                              |
| ------------------------------------------------------- | --------------------- | ------------------------------------- | -------------------------------------------- |
| **Standard Body Text**                                  | $\ge 4.5:1$           | $\ge 7.0:1$ (`#0f172a` on `#ffffff`)  | Table cells, body paragraphs, form labels    |
| **Secondary / Muted Text**                              | $\ge 4.5:1$           | $\ge 4.6:1$ (`#475569` on `#ffffff`)  | Timestamps, column captions, helper text     |
| **Large Text ($\ge 18\text{pt}$ / $14\text{pt}$ Bold)** | $\ge 3.0:1$           | $\ge 10.0:1$ (`#0f172a` on `#f8fafc`) | Page headers, KPI metric figures             |
| **Interactive UI Components**                           | $\ge 3.0:1$           | $\ge 4.2:1$ (`#4f46e5` on `#ffffff`)  | Input borders, checkboxes, button boundaries |
| **Status Indicators (Green/Amber/Red)**                 | $\ge 3.0:1$           | $\ge 4.5:1$ on light backgrounds      | Reconciled badges, Show Cause warning badges |

### Non-Color Dependency Rule (SC 1.4.1)

Color is **never the sole carrier of meaning** in AIRE:

- Green compliance badges must include an explicit text label and a checkmark SVG icon (`CheckCircle2`).
- Red discrepancy alerts must pair red borders with explicit error text and an alert SVG icon (`AlertOctagon`).
- Focus states must not rely solely on color shifts; they must include a visible outline/ring.

---

## 3. Keyboard Operability & Focus Management

100% of interactive capabilities must be operable via standard keyboard alone without requiring a pointing device (SC 2.1.1):

### 3.1 Standard Keyboard Interaction Matrix

| Key / Shortcut | Target Component             | Expected Behavior                                                      |
| -------------- | ---------------------------- | ---------------------------------------------------------------------- |
| `Tab`          | Global Navigation            | Moves focus forward through interactive elements in natural DOM order. |
| `Shift + Tab`  | Global Navigation            | Moves focus backward.                                                  |
| `Enter`        | Buttons, Links               | Activates the focused button or follows the link.                      |
| `Space`        | Checkboxes, Switches         | Toggles checked state.                                                 |
| `Escape`       | Modals, Drawers, Dropdowns   | Dismisses open overlay and restores focus to triggering element.       |
| `Arrow Keys`   | Dropdown Menus, Radio Groups | Navigates through options within a closed composite widget.            |

### 3.2 Visible Focus Indicators (SC 2.4.11 / 2.4.13)

- All interactive controls feature a prominent, high-contrast focus ring:
  ```css
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2
  ```
- Focus rings must never be disabled with `outline: none` unless replaced by an equal or higher contrast Tailwind ring utility.

### 3.3 Focus Traps & Restoration (SC 2.4.3)

- **Modal Overlays & Drawers:** When a modal opens (e.g. S-02 Re-authentication, S-16 Evidence Drawer), focus is programmatically shifted to the modal container or its first interactive input. Focus is trapped within the overlay until dismissed.
- **Focus Restoration:** Upon closing an overlay, focus returns precisely to the trigger element that launched it.
- **Skip Navigation:** A _"Skip to main content"_ link is positioned as the very first focusable item on every page, allowing keyboard users to bypass global headers and sidebar navigation directly to `#main-content`.

---

## 4. Screen Reader Semantics & ARIA Landmarks

1. **Semantic Structure:**
   - `<header role="banner">`: Contains platform branding, context switcher, user profile.
   - `<nav role="navigation" aria-label="Main Navigation">`: Sidebar workspace links.
   - `<main id="main-content" role="main">`: Unique workspace content.
   - `<footer role="contentinfo">`: Regulatory disclaimers and server timestamp.
2. **Data Tables & Roster Grids:**
   - Tabular data must utilize semantic HTML: `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th scope="col">`, `<td>`.
   - Sortable columns declare dynamic `aria-sort="ascending"`, `aria-sort="descending"`, or `aria-sort="none"`.
   - Table summaries use `<caption class="sr-only">` explaining table purpose and record count.
3. **Form Error Association (SC 3.3.1 / 3.3.2):**
   - Inputs must link to explicit `<label for="field-id">`.
   - Defective inputs declare `aria-invalid="true"`.
   - Error messages declare an `id="field-id-error"` and are referenced on the input via `aria-describedby="field-id-error"`.
4. **Dynamic Notifications & Live Regions (SC 4.1.3):**
   - Non-critical status toasts declare `role="status"` and `aria-live="polite"`.
   - Critical alerts and session expiration warnings declare `role="alert"` and `aria-live="assertive"`.
   - Real-time batch ingestion progress bars declare `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`.

---

## 5. Touch Target Sizing (SC 2.5.8)

In accordance with WCAG 2.2 AA SC 2.5.8 (Target Size Minimum):

- All interactive pointer targets (buttons, links, table row actions, checkbox hit areas) must have a minimum bounding size of **$24 \times 24\text{ CSS pixels}$**, or provide at least $24\text{px}$ spacing between adjacent targets.
- Primary actions (e.g. _"Upload Batch"_, _"Seal Cohort"_) maintain a comfortable standard touch target of **$44 \times 44\text{px}$** (`min-h-[44px]`).

---

## 6. Reduced Motion Support (SC 2.3.3)

All CSS animations and transitions must honor the user's operating system setting for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  ::before,
  ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- Skeleton loaders render as static light-gray placeholders rather than pulsing.
- Slide-over drawers appear instantly without sliding animations.
