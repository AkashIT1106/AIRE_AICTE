# Frontend Foundation Architecture & Design System Integration

| Metadata             | Value                                                                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/03-design-system/frontend-architecture.md`                                                                                        |
| Authoritative For    | Frontend Technical Architecture, Component Library Integration, Token Consumption, Developer Guide                                      |
| Status               | `APPROVED`                                                                                                                              |
| Upstream Documents   | [`docs/03-design-system/README.md`](./README.md), [`docs/03-design-system/design-tokens.md`](./design-tokens.md)                        |
| Related Requirements | [`AIRE-REQ-078`](../00-governance/requirements-traceability.md) through [`AIRE-REQ-083`](../00-governance/requirements-traceability.md) |
| Last Updated         | 2 November 2026                                                                                                                         |

---

## 1. Overview & Core Technology Stack

The AIRE client is architected as a high-density, accessible, type-safe Single Page Application (SPA) built with:

- **Build Tooling & Runtime:** Vite 6 with React 18.3 (`@vitejs/plugin-react`), TypeScript 5.7+ in strict mode (`tsc -b`).
- **Styling Engine:** Tailwind CSS v3 with CSS Custom Properties and `tailwindcss-animate`.
- **Component Architecture:** Unstyled **Radix UI Primitives** styled with AIRE semantic design tokens using the **shadcn/ui** pattern (`client/src/components/ui/`).
- **Form & Validation Engine:** React Hook Form (`react-hook-form` v7) with Zod runtime resolvers (`@hookform/resolvers/zod`).
- **Iconography:** Lucide React (`lucide-react`) exclusively.
- **Client Routing & State:** React Router v7 (`react-router-dom`) and TanStack Query v5 (`@tanstack/react-query`).

### 1.1 Licensing & Open Source Compliance

Per project instructions and institutional constraints:

- All installed primitive packages (`@radix-ui/react-*`, `clsx`, `tailwind-merge`, `class-variance-authority`, `tailwindcss-animate`) are **100% free, permissive open-source software (MIT or Apache-2.0)**.
- Zero commercial, paid, or closed-source libraries (e.g. shadcn Pro blocks, commercial UI kits) are introduced.

---

## 2. Design Token Implementation

Tokens are structured into a 3-layer architecture driven from `client/design-tokens.json`:

### Canonical Source: `client/design-tokens.json` (DTCG 2025.10)

The single authoritative source for all colors, typography, spacing, layout, elevation, and motion. Run `pnpm run build:tokens` (executing `client/scripts/sync-tokens.js`) to generate runtime styles deterministically.

### Tier 1: CSS Custom Properties (`client/src/index.css`)

Defined under `:root` in `client/src/index.css`, enforcing WCAG 2.2 Level AA contrast ratios directly:

- **Surfaces:** `--surface-canvas` (`#F5F7FA`), `--surface-card` (`#FFFFFF`), `--surface-card-subdued` (`#F0F4F8`), `--surface-header` (`#0E1B26`), `--surface-overlay` (`rgba(23, 43, 58, 0.6)`).
- **Text:** `--text-primary` (`#172B3A`, 14.5:1 contrast AAA), `--text-secondary` (`#526579`, 6.0:1 contrast AA), `--text-muted` (`#5A6E82`, 5.3:1 contrast AA), `--text-inverted` (`#FFFFFF`), `--text-link` (`#0D635C`, 7.1:1 contrast AAA).
- **Borders:** `--border-subtle` (`#D8E0E8`), `--border-default` (`#CBD5E1`), `--border-strong` (`#7B90A2`, 3.3:1 contrast), `--border-interactive` (`#0F766E`).
- **Brand:** `--brand-primary` (`#173B57`), `--brand-primary-hover` (`#1C4666`), `--brand-primary-active` (`#0D2233`), `--brand-subtle` (`#E8F0F7`), `--brand-teal` (`#0F766E`).
- **Semantic Statuses:**
  - Success: `--state-success-bg` (`#F0FDF4`), `--state-success-border` (`#BBF7D0`), `--state-success-text` (`#14532D`, 8.7:1), `--state-success-icon` (`#16A34A`).
  - Warning: `--state-warning-bg` (`#FFFBEB`), `--state-warning-border` (`#FDE68A`), `--state-warning-text` (`#78350F`, 8.8:1), `--state-warning-icon` (`#D97706`).
  - Danger: `--state-danger-bg` (`#FEF2F2`), `--state-danger-border` (`#FECACA`), `--state-danger-text` (`#7F1D1D`, 9.2:1), `--state-danger-icon` (`#DC2626`).
  - Info: `--state-info-bg` (`#F0F9FF`), `--state-info-border` (`#BAE6FD`), `--state-info-text` (`#0C4A6E`, 8.9:1), `--state-info-icon` (`#0284C7`).
- **Privacy & Masking:** `--masked-data-bg` (`#F0F4F8`), `--masked-data-border` (`#CBD5E1`), `--masked-data-text` (`#334E68`, 7.5:1), `--masked-data-icon` (`#526579`).
- **Focus Indicator:** `--focus-ring` (`#0F766E`, 5.5:1 contrast, 2px solid, 2px offset).

### Tier 2: Tailwind Configuration Mapping (`client/tailwind.config.js`)

Configured to expose semantic token classes rather than raw primitives:

```tsx
// Correct - using semantic tokens
<div className="bg-surface-card text-txt-primary border-line-default" />

// Correct - using Radix/shadcn mapping
<div className="bg-card text-card-foreground border-border" />

// Prohibited - ad-hoc hardcoded styling
<div className="bg-[#ffffff] text-slate-800" />
```

---

## 3. Foundation Component Inventory

All components are located under `client/src/components/`:

### 3.1 UI Primitives (`client/src/components/ui/`)

- [`button.tsx`](../../client/src/components/ui/button.tsx): Variants (`default`, `secondary`, `outline`, `destructive`, `ghost`, `link`), sizes (`sm`, `default`, `lg`, `icon`), built-in spinner loading state (`loading?: boolean`), Radix `Slot` for `asChild` composition.
- [`input.tsx`](../../client/src/components/ui/input.tsx): Accessible text/number input with `error` state and `aria-invalid` bindings.
- [`textarea.tsx`](../../client/src/components/ui/textarea.tsx): Accessible multi-line input.
- [`label.tsx`](../../client/src/components/ui/label.tsx): `@radix-ui/react-label` primitive with optional `required` asterisk indicator.
- [`checkbox.tsx`](../../client/src/components/ui/checkbox.tsx): `@radix-ui/react-checkbox` primitive with check icon.
- [`switch.tsx`](../../client/src/components/ui/switch.tsx): `@radix-ui/react-switch` accessible boolean toggle.
- [`badge.tsx`](../../client/src/components/ui/badge.tsx): Status badge with variants (`default`, `secondary`, `outline`, `success`, `warning`, `danger`, `info`, `masked`).
- [`alert.tsx`](../../client/src/components/ui/alert.tsx): Accessible alert banner with variants (`default`, `info`, `success`, `warning`, `destructive`), `AlertTitle`, and `AlertDescription`.
- [`card.tsx`](../../client/src/components/ui/card.tsx): Composable card container (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`).
- [`dialog.tsx`](../../client/src/components/ui/dialog.tsx): `@radix-ui/react-dialog` accessible modal with backdrop overlay, focus trapping, ESC dismiss, and mandatory `DialogTitle`.
- [`select.tsx`](../../client/src/components/ui/select.tsx): `@radix-ui/react-select` dropdown with items, trigger, and groups.
- [`separator.tsx`](../../client/src/components/ui/separator.tsx): `@radix-ui/react-separator` semantic dividing line.
- [`skeleton.tsx`](../../client/src/components/ui/skeleton.tsx): Accessible loading skeleton placeholder with zero layout shift.
- [`dropdown-menu.tsx`](../../client/src/components/ui/dropdown-menu.tsx): `@radix-ui/react-dropdown-menu` for header workspace switcher and table context menus.

### 3.2 Form Presentation (`client/src/components/forms/`)

- [`FormField.tsx`](../../client/src/components/forms/FormField.tsx): Combines `Label`, input control, helper description, and accessible error message (`role="alert"`), integrating seamlessly with `react-hook-form` and `zodResolver`.

### 3.3 Feedback Presentation (`client/src/components/feedback/`)

- [`EmptyState.tsx`](../../client/src/components/feedback/EmptyState.tsx): Standard empty state display with icon, title, message, and call-to-action button.
- [`ErrorState.tsx`](../../client/src/components/feedback/ErrorState.tsx): Error display featuring correlation ID chip and retry handler.
- [`LoadingState.tsx`](../../client/src/components/feedback/LoadingState.tsx): High-density skeleton row and spinner loading indicators.

### 3.4 Application Shell (`client/src/components/layout/`)

- [`AppShell.tsx`](../../client/src/components/layout/AppShell.tsx): Comprehensive application frame featuring:
  1. **Top Regulatory Header:** Institutional banner with logo, title, environment badge, and workspace context switcher.
  2. **Collapsible Desktop/Mobile Sidebar:** Navigation links with active indicators and responsive drawer toggle.
  3. **Main Content Canvas:** Responsive bounded canvas with standard padding.
  4. **Institutional Footer:** Persistent compliance metadata.

---

## 4. Developer Consumption Guide: Building Future Features

When authoring new screens (e.g. `S-10` Institution Dashboard, `S-11` Upload Batch, `S-20` National Overview):

1. **Wrap in `AppShell` or Page Container:** Page components should reside in `client/src/pages/` and be rendered inside `AppShell`.
2. **Use `FormField` for Inputs:**
   ```tsx
   <FormField
     id="roll-no"
     label="Student Roll Number"
     required
     error={errors.rollNumber?.message}
   >
     <Input
       id="roll-no"
       {...register("rollNumber")}
       error={!!errors.rollNumber}
     />
   </FormField>
   ```
3. **Use 36px Compact Rows for Tables:** Apply `.table-compact` and `.font-tabular` on table elements for dense data views.
4. **Use `Badge` for Statuses:**
   ```tsx
   <Badge variant="success">Reconciled</Badge>
   <Badge variant="warning">Quarantine</Badge>
   <Badge variant="danger">Show Cause</Badge>
   ```
5. **Masked Data Presentation:** Always wrap Identity Vault tokens in `Badge variant="masked"` with monospaced tabular numerals.

---

## 5. Verification & Quality Gates

The frontend foundation is verified against four parallel automated gates:

| Check                        | Tool / Command                                              | Result                              |
| :--------------------------- | :---------------------------------------------------------- | :---------------------------------- |
| **Typecheck**                | `pnpm --filter @aire/client typecheck` (`tsc --noEmit`)     | Pass (0 errors)                     |
| **Production Build**         | `pnpm --filter @aire/client build` (`tsc -b && vite build`) | Pass (0 errors, 488kB JS, 34kB CSS) |
| **Unit & Integration Tests** | `pnpm --filter @aire/client test` (`vitest run`)            | Pass (6 of 6 tests passed)          |
| **Workspace CI Pipeline**    | `bash infrastructure/scripts/ci-local.sh`                   | Pass (Completed in 13s)             |
| **Formatting & Linting**     | `oxlint` and `prettier --check`                             | Pass (0 warnings, 0 errors)         |
