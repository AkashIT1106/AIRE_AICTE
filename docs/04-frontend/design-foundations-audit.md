# AIRE — Design Foundations Audit

**Stage 0: Existing Product and Interface Audit**

| Field      | Value                                                                                                                                                                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document   | `docs/04-frontend/design-foundations-audit.md`                                                                                                                                                                                                  |
| Audit date | 2 November 2026                                                                                                                                                                                                                                 |
| Sources    | [`client/src/App.tsx`](../../client/src/App.tsx) · [`client/src/index.css`](../../client/src/index.css) · [`client/index.html`](../../client/index.html) · [`client/package.json`](../../client/package.json) · PROJECT_PLAN.md §7, §9.1, §10.3 |
| Status     | `DRAFT`                                                                                                                                                                                                                                         |
| Related    | [ui-ux-audit.md](./ui-ux-audit.md) · [ui-ux-decisions.md](./ui-ux-decisions.md)                                                                                                                                                                 |

> [!CAUTION]
> This document records only what is found in the current source. **No design decisions are made here.** Token values are not selected. No existing values are replaced. All decisions requiring resolution are documented in [ui-ux-decisions.md](./ui-ux-decisions.md).

---

## 1. Color

### 1.1 What exists

The application uses **Tailwind CSS v3 with default configuration**. No `tailwind.config.js` or `tailwind.config.ts` was found in the repository. All colors in use are from Tailwind's default palette, referenced as inline utility classes.

**Colors observed in `App.tsx`:**

| Usage                          | Tailwind class     | Hex (Tailwind v3 default) |
| ------------------------------ | ------------------ | ------------------------- |
| Page background                | `bg-slate-50`      | #f8fafc                   |
| Header background              | `bg-slate-900`     | #0f172a                   |
| Header border                  | `border-slate-800` | #1e293b                   |
| Card/surface background        | `bg-white`         | #ffffff                   |
| Card border                    | `border-slate-200` | #e2e8f0                   |
| Status tile background         | `bg-slate-50`      | #f8fafc                   |
| Status tile border             | `border-slate-200` | #e2e8f0                   |
| Phase badge background         | `bg-slate-800`     | #1e293b                   |
| Phase badge border             | `border-slate-700` | #334155                   |
| Body text (primary)            | `text-slate-800`   | #1e293b                   |
| Body text (secondary)          | `text-slate-600`   | #475569                   |
| Body text (tertiary)           | `text-slate-500`   | #64748b                   |
| Header text (white)            | `text-white`       | #ffffff                   |
| Header subtext                 | `text-slate-400`   | #94a3b8                   |
| Phase badge text               | `text-slate-300`   | #cbd5e1                   |
| API Monolith icon              | `text-indigo-600`  | #4f46e5                   |
| Database icon                  | `text-sky-600`     | #0284c7                   |
| Security icon                  | `text-teal-600`    | #0d9488                   |
| AIRE logo icon                 | `text-sky-400`     | #38bdf8                   |
| "Configured" status text       | `text-emerald-700` | #047857                   |
| "Configured" icon              | `text-emerald-700` | #047857                   |
| Phase indicator dot            | `bg-emerald-400`   | #34d399                   |
| Placeholder tile text          | `text-slate-700`   | #334155                   |
| Placeholder tile subtext       | `text-slate-400`   | #94a3b8                   |
| Footer text                    | `text-slate-500`   | #64748b                   |
| Dashed placeholder tile border | `border-slate-300` | #cbd5e1                   |
| Footer border                  | `border-slate-200` | #e2e8f0                   |

> [!NOTE]
> Colors above are documented from code inspection, not from a rendered screenshot. They represent the **current state**, not design intent.

### 1.2 What is missing / undecided

- No semantic color roles (brand, background, surface, border, on-surface, error, warning, success, info, interactive).
- No dark mode support.
- No color contrast verification.
- No official AIRE or AICTE brand color specification.

**Decision required:** D-004 — Brand and semantic color palette.

---

## 2. Typography

### 2.1 What exists

**Font family (from `client/src/index.css`):**

```css
body {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
}
```

This is a standard system font stack. No web font is loaded.

**Type sizes observed in `App.tsx` (Tailwind utility classes):**

| Usage                  | Class                              | Approx. size     |
| ---------------------- | ---------------------------------- | ---------------- |
| App title "AIRE"       | `text-lg font-bold tracking-tight` | 18px / bold      |
| App subtitle           | `text-xs text-slate-400`           | 12px             |
| Phase badge            | `text-xs`                          | 12px             |
| Section heading (h2)   | `text-xl font-semibold`            | 20px             |
| Section description    | `text-sm text-slate-600`           | 14px             |
| Card heading (h3)      | `text-sm font-semibold`            | 14px             |
| Card body              | `text-xs text-slate-500`           | 12px             |
| Status badge           | `text-xs`                          | 12px             |
| Second section heading | `text-lg font-semibold`            | 18px             |
| Placeholder label      | `text-xs font-medium`              | 12px             |
| Placeholder sublabel   | `text-[11px]`                      | 11px (arbitrary) |
| Footer                 | `text-xs`                          | 12px             |

**Observations:**

- No heading scale is formally defined. `text-xl`, `text-lg`, and `text-sm font-semibold` are used inconsistently across headings.
- `text-[11px]` is an arbitrary value not in Tailwind's scale (evidence of ad-hoc adjustment).
- No line-height, letter-spacing, or paragraph measure decisions made.

### 2.2 What is missing / undecided

- No custom type scale.
- No web font specification.
- No heading hierarchy definition (h1–h4 equivalents).
- No body copy size or line-height decision.
- No label / caption conventions.

**Decision required:** D-005 — Typography: font family, type scale, hierarchy.

---

## 3. Spacing and Layout

### 3.1 What exists

Spacing is applied via Tailwind's default 4px-base scale (`p-`, `m-`, `space-`, `gap-`).

**Layout structure in `App.tsx`:**

- `max-w-7xl` content width (1280px) centered with `mx-auto`.
- Outer padding: `p-6 md:p-8`.
- Section spacing: `space-y-8`.
- Card internal padding: `p-4` (tiles) and `p-6` (cards).
- Grid: `grid-cols-1 md:grid-cols-3` and `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`.

### 3.2 What is missing / undecided

- No content width tokens (sidebar width, main content width, form width).
- No responsive layout shell defined.
- No spacing scale customization.

**Decision required:** D-007 — Layout: content width, sidebar width, page padding.

---

## 4. Grid and Responsive Breakpoints

### 4.1 What exists

Tailwind v3 default breakpoints:

| Breakpoint | Width  |
| ---------- | ------ |
| `sm`       | 640px  |
| `md`       | 768px  |
| `lg`       | 1024px |
| `xl`       | 1280px |
| `2xl`      | 1536px |

These are unmodified Tailwind defaults. The application applies `md:` and `sm:` / `lg:` modifiers in `App.tsx` grid declarations.

### 4.2 What is missing / undecided

- No product-specific breakpoint names.
- No layout behavior defined for mobile (<640px), tablet, or wide desktop.
- No responsive shell layout designed.

**Decision required:** D-008 — Responsive breakpoints and viewport strategy.

---

## 5. Icons

### 5.1 What exists

**Lucide React** (`lucide-react@^0.475.0`) is installed. The following icons are used in `App.tsx`:

| Icon         | Component      | Context                          |
| ------------ | -------------- | -------------------------------- |
| Shield check | `ShieldCheck`  | AIRE logo mark and Security card |
| Server       | `Server`       | API Monolith card                |
| Database     | `Database`     | Data Architecture card           |
| Check circle | `CheckCircle2` | "Configured" status badge        |

### 5.2 What is missing / undecided

- Icon size convention is inconsistent: `w-8 h-8` for logo, `w-5 h-5` for cards, `w-4 h-4` for inline badges.
- No icon grid or usage guidelines.
- No decision on icon library extension or custom icons.

**Decision required:** D-014 — Icon usage conventions and size scale.

---

## 6. Borders, Elevation, and Surfaces

### 6.1 What exists

**Borders:** `rounded-lg`, `rounded-md`, `rounded`, `rounded-full`, `rounded-full` are all used in `App.tsx`. No consistent corner-radius token exists.

**Elevation/shadow:** `shadow-sm` is used on content cards. No shadow scale defined.

**Surfaces:**

| Surface type    | Color          |
| --------------- | -------------- |
| Page background | `bg-slate-50`  |
| Card surface    | `bg-white`     |
| Status tile     | `bg-slate-50`  |
| Header          | `bg-slate-900` |
| Phase badge     | `bg-slate-800` |

### 6.2 What is missing / undecided

- No surface hierarchy tokens (base, elevated, overlay, overlay-elevated).
- No shadow/elevation scale.
- No consistent border-radius scale.

**Decision required:** D-015 — Surface levels, shadow scale, border-radius tokens.

---

## 7. Focus and Selection

### 7.1 What exists

No custom focus styles are defined. Browser default `:focus` outlines apply.

### 7.2 What is missing / undecided

- No focus ring color, width, or offset defined.
- No `:focus-visible` handling.
- PROJECT_PLAN.md §7 requires WCAG 2.2 AA, which includes success criterion 2.4.11 (Focus Appearance) under AA in WCAG 2.2.

**Decision required:** D-006 — Accessibility and focus style standards.

---

## 8. Motion and Transitions

### 8.1 What exists

The only animation in the codebase is `animate-pulse` on the phase indicator dot in the header badge (line 20 of `App.tsx`). This is a decorative element with no functional purpose.

No transitions are applied to interactive elements. No motion scale is defined.

### 8.2 What is missing / undecided

- No transition duration or easing tokens.
- No reduced-motion (`prefers-reduced-motion`) handling.
- No enter/exit animation patterns.

**Decision required:** D-016 — Motion and transition principles (including reduced-motion support).

---

## 9. Form Controls

### 9.1 What exists

No form controls are implemented. `react-hook-form` and `zod` are installed but not used.

### 9.2 What is missing / undecided

- No input, textarea, select, checkbox, radio, or file upload styles.
- No validation error presentation pattern.
- No label positioning convention.
- No required field indicator convention.

**Decision required:** D-002 (component library will determine default form control appearance).

---

## 10. Tables and Data Presentation

### 10.1 What exists

No tables or data lists are implemented.

### 10.2 What is missing / undecided

- No table component, column header, sort indicator, or row selection pattern.
- No pagination pattern.
- No empty state for tables.
- `chart.js` is planned (§9.1) but **not installed**.

**Decision required:** D-002 (component library); D-017 (table and pagination conventions); D-018 (chart library confirmation).

---

## 11. Feedback and Status Communication

### 11.1 What exists

The current screen uses a `CheckCircle2` icon with `text-emerald-700` and the text "Configured" as a status indicator. The `animate-pulse` dot indicates "live" status visually with no accessible label.

No toast, alert, notification, or confirmation pattern exists.

### 11.2 What is missing / undecided

- No toast/notification component.
- No inline alert component (info, warning, error, success).
- No confirmation dialog or destructive action pattern.
- No progress indicator (spinner, skeleton, progress bar).
- No status language convention (what words are used for each state — e.g. "Processing", "Submitted", "Validated").

**Decision required:** D-002 (component library); D-019 (status language and feedback patterns).

---

## 12. Summary of Existing vs. Missing Foundations

| Foundation area   | Existing                          | Missing / Undecided                        |
| ----------------- | --------------------------------- | ------------------------------------------ |
| Color palette     | Tailwind defaults, ad-hoc classes | Semantic tokens, brand palette, dark mode  |
| Typography        | System font stack, ad-hoc sizes   | Custom font, type scale, heading hierarchy |
| Spacing           | Tailwind defaults                 | Custom tokens, layout measurements         |
| Breakpoints       | Tailwind defaults                 | Product-specific behavior, mobile layout   |
| Icons             | Lucide React (4 icons used)       | Size conventions, usage guidelines         |
| Borders/elevation | Ad-hoc `rounded-*`, `shadow-sm`   | Token scale, surface hierarchy             |
| Focus styles      | Browser defaults                  | Custom focus ring, WCAG 2.2 compliance     |
| Motion            | `animate-pulse` (decorative)      | Transition scale, reduced-motion           |
| Form controls     | Not implemented                   | All                                        |
| Tables            | Not implemented                   | All                                        |
| Feedback patterns | Not implemented                   | All                                        |

> [!NOTE]
> No token values are proposed in this document. This table is a factual gap inventory. All values must be determined in Stage 1 after the design decisions in [ui-ux-decisions.md](./ui-ux-decisions.md) are approved.
