# Semantic Design Tokens Specification

| Metadata             | Value                                                                                                                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/03-design-system/design-tokens.md`                                                                                                                                                            |
| Authoritative For    | Color Roles, Typography Tokens, Spacing Scales, Layout Dimensions, Radii, Elevation, Focus, Motion Parameters                                                                                       |
| Canonical Source     | [`client/design-tokens.json`](../../client/design-tokens.json) (DTCG Specification 2025.10)                                                                                                         |
| Status               | `CANONICAL SPECIFICATION`                                                                                                                                                                           |
| Upstream Source      | [`docs/03-design-system/design-rationale.md`](./design-rationale.md), [`docs/02-experience/accessibility.md`](../02-experience/accessibility.md)                                                    |
| Related Requirements | [`AIRE-REQ-078`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-083`](../00-governance/requirements-traceability.md), [`AIRE-REQ-065`](../00-governance/requirements-traceability.md) |
| Last Updated         | 2 November 2026                                                                                                                                                                                     |

---

## 1. Token Architecture & Naming Conventions

AIRE tokens are organized hierarchically following the **Design Tokens Community Group (DTCG) 2025.10** specification:

```
[Layer 1: Primitives]   color.primitive.brand.navy.900 (#173B57)
                                 │
                                 ▼ (Aliased reference)
[Layer 2: Semantics]    color.semantic.action.primary ({color.primitive.brand.navy.900})
                                 │
                                 ▼ (Consumed in CSS custom properties & Tailwind)
[Layer 3: Components]   button-default { background: var(--brand-primary); }
```

1. **Global / Primitive Level (`color.primitive.*`):** Raw color values with explicit sRGB component objects and hex values.
2. **Semantic / Alias Level (`color.semantic.*`):** Meaningful names defining functional intent (e.g. `color.surface.canvas`, `color.text.primary`, `color.action.primary`).
3. **Component Level (`component.*`):** Component-specific bindings (e.g. `button.height-default`, `radii.md`).

> [!IMPORTANT]
> The single canonical source of truth is `client/design-tokens.json`. Developers must **never** hardcode primitive color hex codes or raw Tailwind palette classes (`text-indigo-600`, `bg-slate-900`) directly in application components. Run `pnpm run build:tokens` to synchronize changes to CSS custom properties.

---

## 2. Color Tokens

### 2.1 Surfaces & Canvases

| Semantic Token Name    | Canonical Hex           | Primitive Reference                   | Intended Role & Usage                                                   | Contrast / Accessibility             |
| ---------------------- | ----------------------- | ------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------ |
| `surface-canvas`       | `#F5F7FA`               | `{color.primitive.neutral.canvas}`    | Global page canvas background. Neutral off-white reducing screen glare. | Surrounds content cards.             |
| `surface-card`         | `#FFFFFF`               | `{color.primitive.neutral.surface}`   | Container surface for data grids, form cards, and dialogs.              | Base layer for records.              |
| `surface-card-subdued` | `#F0F4F8`               | `{color.primitive.neutral.slate.50}`  | Subdued surface for table headers, zebra striping, read-only cards.     | Distinct from white card.            |
| `surface-header`       | `#0E1B26`               | `{color.primitive.neutral.slate.950}` | Top global shell banner providing institutional grounding.              | Dark background with inverted text.  |
| `surface-sidebar`      | `#FFFFFF`               | `{color.primitive.neutral.surface}`   | Left-hand navigation rail with subtle right border.                     | Clean structural vertical container. |
| `surface-overlay`      | `rgba(23, 43, 58, 0.6)` | `{color.primitive.neutral.overlay}`   | Modal dimmer scrim preserving focus trap.                               | Obscures backdrop content.           |

### 2.2 Typography Colors

| Semantic Token Name | Canonical Hex | Primitive Reference                   | Intended Role & Usage                                       | Contrast vs Surface (#FFFFFF)             |
| ------------------- | ------------- | ------------------------------------- | ----------------------------------------------------------- | ----------------------------------------- |
| `text-primary`      | `#172B3A`     | `{color.primitive.neutral.slate.900}` | High-priority headings, table data, active form values.     | **14.55:1** (Exceeds WCAG AAA 7:1)        |
| `text-secondary`    | `#526579`     | `{color.primitive.neutral.slate.600}` | Secondary descriptive paragraphs, helper text, breadcrumbs. | **6.01:1** (Exceeds WCAG AA 4.5:1)        |
| `text-muted`        | `#5A6E82`     | `{color.primitive.neutral.slate.500}` | Timestamps, column sorting indicators, unselected tabs.     | **5.27:1** (Exceeds WCAG AA 4.5:1)        |
| `text-inverted`     | `#FFFFFF`     | `{color.primitive.neutral.surface}`   | White text on dark navy buttons or global header banner.    | **11.67:1** on Navy, **17.5:1** on Header |
| `text-link`         | `#0D635C`     | `{color.primitive.brand.teal.800}`    | Interactive hyperlinks and handbook citations.              | **7.10:1** (Exceeds WCAG AAA 7:1)         |

### 2.3 Borders & Separators

| Semantic Token Name  | Canonical Hex | Primitive Reference                   | Intended Role & Usage                                        | Contrast / Accessibility                        |
| -------------------- | ------------- | ------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------- |
| `border-subtle`      | `#D8E0E8`     | `{color.primitive.neutral.slate.100}` | Low-prominence dividers for table rows and list items.       | Subtle separation without visual noise.         |
| `border-default`     | `#CBD5E1`     | `{color.primitive.neutral.slate.200}` | Standard container perimeters, card borders, resting inputs. | Structural container boundary.                  |
| `border-strong`      | `#7B90A2`     | `{color.primitive.neutral.slate.400}` | Active input hover borders and interactive controls.         | **3.31:1** (Meets WCAG 2.2 SC 1.4.11 $\ge 3:1$) |
| `border-interactive` | `#0F766E`     | `{color.primitive.brand.teal.700}`    | Active navigation indicator and selected row borders.        | **5.47:1** against white surface.               |

### 2.4 Brand & Interactive Tokens

| Semantic Token Name    | Canonical Hex | Primitive Reference                | Intended Role & Usage                                          | Contrast / Accessibility           |
| ---------------------- | ------------- | ---------------------------------- | -------------------------------------------------------------- | ---------------------------------- |
| `brand-primary`        | `#173B57`     | `{color.primitive.brand.navy.900}` | Primary action background (_"Upload Batch"_, _"Seal Cohort"_). | **11.67:1** with white text (AAA). |
| `brand-primary-hover`  | `#1C4666`     | `{color.primitive.brand.navy.800}` | Primary action hover state.                                    | Darkens slightly on pointer hover. |
| `brand-primary-active` | `#0D2233`     | `{color.primitive.brand.navy.950}` | Primary action pressed/active click state.                     | Tactile pressed feedback.          |
| `brand-subtle`         | `#E8F0F7`     | `{color.primitive.brand.navy.100}` | Selected row tint or active navigation pill background.        | Subdued tinting with navy text.    |
| `brand-teal`           | `#0F766E`     | `{color.primitive.brand.teal.700}` | Secondary accent color and visible focus indicator.            | **5.47:1** on white surface (AA).  |

### 2.5 Semantic Status & Regulatory Outcome Tokens

AIRE enforces strict pairing: background tint, border, high-contrast readable text, and accompanying SVG icon:

| Status Role                 | Token Name                                                                                   | Canonical Hex                                    | Paired Icon     | Contrast vs Background |
| --------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------ | --------------- | ---------------------- |
| **Compliant / Reconciled**  | `state-success-bg`<br>`state-success-border`<br>`state-success-text`<br>`state-success-icon` | `#F0FDF4`<br>`#BBF7D0`<br>`#14532D`<br>`#16A34A` | `CheckCircle2`  | **8.70:1** (AAA)       |
| **Warning / Quarantine**    | `state-warning-bg`<br>`state-warning-border`<br>`state-warning-text`<br>`state-warning-icon` | `#FFFBEB`<br>`#FDE68A`<br>`#78350F`<br>`#D97706` | `AlertTriangle` | **8.75:1** (AAA)       |
| **Danger / Show Cause**     | `state-danger-bg`<br>`state-danger-border`<br>`state-danger-text`<br>`state-danger-icon`     | `#FEF2F2`<br>`#FECACA`<br>`#7F1D1D`<br>`#DC2626` | `AlertOctagon`  | **9.16:1** (AAA)       |
| **Informational**           | `state-info-bg`<br>`state-info-border`<br>`state-info-text`<br>`state-info-icon`             | `#F0F9FF`<br>`#BAE6FD`<br>`#0C4A6E`<br>`#0284C7` | `Info`          | **8.87:1** (AAA)       |
| **Masked / Identity Vault** | `masked-data-bg`<br>`masked-data-border`<br>`masked-data-text`<br>`masked-data-icon`         | `#F0F4F8`<br>`#CBD5E1`<br>`#334E68`<br>`#526579` | `Lock`          | **7.54:1** (AAA)       |

### 2.6 Focus Ring Tokens

| Semantic Token Name | Canonical Value  | Accessibility Contract                                                                           |
| ------------------- | ---------------- | ------------------------------------------------------------------------------------------------ |
| `focus-ring`        | `#0F766E` (Teal) | **5.47:1** contrast on white surface; **5.10:1** on canvas (Meets WCAG 2.2 SC 2.4.11 $\ge 3:1$). |
| `focus-ring-offset` | `#FFFFFF`        | 2px white gap separating control boundary from focus stroke.                                     |
| `focus-ring-width`  | `2px`            | Meets WCAG 2.2 SC 2.4.11 ($2\text{px}$ stroke minimum).                                          |

---

## 3. Typography Tokens

### 3.1 Font Family Stacks

```css
/* Inter UI sans-serif stack */
--font-sans:
  "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
  Arial, sans-serif;

/* Tabular monospace stack for roll numbers, APAAR IDs, hashes */
--font-mono:
  "JetBrains Mono", "Fira Code", Menlo, Monaco, Consolas, "Courier New",
  monospace;
```

### 3.2 Type Scale & Hierarchy

| Token Name         | Size                 | Line Height         | Weight                            | Usage                                           |
| ------------------ | -------------------- | ------------------- | --------------------------------- | ----------------------------------------------- |
| `fontSize.2xl`     | `24px` / `1.5rem`    | `32px` / `2.0rem`   | Bold (`700`)                      | Page Title (H1)                                 |
| `fontSize.xl`      | `20px` / `1.25rem`   | `28px` / `1.75rem`  | Semibold (`600`)                  | Section Header (H2)                             |
| `fontSize.lg`      | `18px` / `1.125rem`  | `24px` / `1.5rem`   | Semibold (`600`)                  | Modal Titles, Card Headers, Primary KPIs        |
| `fontSize.base`    | `14px` / `0.875rem`  | `20px` / `1.25rem`  | Regular (`400`) / Medium (`500`)  | Body copy, form inputs, button labels           |
| `fontSize.sm`      | `13px` / `0.8125rem` | `18px` / `1.125rem` | Regular (`400`) / Medium (`500`)  | **High-Density Data Grid Cells**, table headers |
| `fontSize.xs`      | `12px` / `0.75rem`   | `16px` / `1.0rem`   | Medium (`500`) / Semibold (`600`) | Status badges, form errors, timestamps          |
| `fontSize.mono-sm` | `13px` / `0.8125rem` | `18px` / `1.125rem` | Regular (`400`) + Tabular         | Monospace Roll Numbers, APAAR tokens            |

---

## 4. Spacing, Geometry & Layout Tokens

### 4.1 Spacing Scale (4px Base Grid)

| Token Name   | Value  | Usage                                            |
| ------------ | ------ | ------------------------------------------------ |
| `spacing.1`  | `4px`  | Inline icon gap, tight badge padding             |
| `spacing.2`  | `8px`  | Compact element gap, table cell vertical padding |
| `spacing.3`  | `12px` | Form input padding, badge horizontal padding     |
| `spacing.4`  | `16px` | Standard card internal padding, button padding   |
| `spacing.5`  | `20px` | Intermediate container padding                   |
| `spacing.6`  | `24px` | Card section gap, modal padding                  |
| `spacing.8`  | `32px` | Major workspace section division                 |
| `spacing.10` | `40px` | Major page gutters                               |
| `spacing.12` | `48px` | Top header clearance                             |

### 4.2 Layout Dimensions

| Token Name                 | Value    | Structural Context                         |
| -------------------------- | -------- | ------------------------------------------ |
| `layout.sidebar-expanded`  | `256px`  | Expanded desktop navigation rail           |
| `layout.sidebar-collapsed` | `64px`   | Collapsed icon-only navigation rail        |
| `layout.header-height`     | `64px`   | Global regulatory shell header height      |
| `layout.max-width-content` | `1440px` | Max width for high-density data tables     |
| `layout.max-width-form`    | `640px`  | Max readable single-column form width      |
| `layout.row-compact`       | `36px`   | Compact table row height for dense rosters |
| `layout.row-standard`      | `44px`   | Standard table row height for touch/mobile |

---

## 5. Elevation, Radii & Motion Tokens

### 5.1 Corner Radii

| Token Name   | Value    | Component Binding                                                   |
| ------------ | -------- | ------------------------------------------------------------------- |
| `radii.none` | `0px`    | Table cell dividers                                                 |
| `radii.sm`   | `2px`    | Checkboxes, code chips                                              |
| `radii.md`   | `4px`    | Form controls, select dropdowns, standard buttons, data table cards |
| `radii.lg`   | `8px`    | Modal dialogs, floating toast notifications                         |
| `radii.full` | `9999px` | Badges, status pills                                                |

### 5.2 Motion & Transition Constraints

| Token Name                | Value                        | Interaction Context                              | Reduced-Motion Override |
| ------------------------- | ---------------------------- | ------------------------------------------------ | ----------------------- |
| `motion.duration-instant` | `0ms`                        | High-frequency button clicks, row selection      | `0ms`                   |
| `motion.duration-fast`    | `150ms`                      | Slide-over drawer entry, modal fade, toast entry | `0.01ms` (Instant)      |
| `motion.duration-normal`  | `200ms`                      | Accordion row expansion, dropdown menu reveal    | `0.01ms` (Instant)      |
| `motion.ease-standard`    | `cubic-bezier(0, 0, 0.2, 1)` | Standard natural deceleration curve              | `linear`                |
| `motion.ease-in`          | `cubic-bezier(0.4, 0, 1, 1)` | Dismissal of toasts or closing drawers           | `linear`                |
