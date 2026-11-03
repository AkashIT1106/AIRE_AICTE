# AIRE — UX4G Implementation Mapping

| Metadata     | Value                                                  |
| ------------ | ------------------------------------------------------ |
| Document     | `docs/03-design-system/ux4g-implementation-mapping.md` |
| Status       | `APPROVED`                                             |
| Reference    | UX4G Handbook Chapters 7, 8, 9                         |
| Last Updated | 3 November 2026                                        |

---

## 1. Mapping Overview

This document defines how specific UX4G components, design tokens, and interaction patterns are adapted and implemented in AIRE using Radix UI primitives and Tailwind CSS.

---

## 2. Component Adaptation Matrix

| UX4G Component / Pattern        | UX4G Reference      | AIRE Implementation                       | Architectural & Accessibility Details                                                |
| ------------------------------- | ------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------ |
| **Top Identity Band**           | Handbook §5.2, §6.2 | `AppShell.tsx` (Top Band)                 | 32px height, inverted text, statutory MoE / AICTE identity.                          |
| **Primary Header**              | Handbook §6.2       | `AppShell.tsx` (Header)                   | 56px height, tenant switcher, user profile, live IST clock.                          |
| **Breadcrumbs**                 | Handbook §6.6       | `Breadcrumbs.tsx`                         | Dynamic route mapping, `aria-label="Breadcrumb"`, `aria-current="location"`.         |
| **Mobile Drawer Navigation**    | Handbook §5.2       | `AppShell.tsx` (Aside Drawer)             | Off-canvas drawer, focus trap, backdrop click, `Escape` key dismissal.               |
| **Primary / Secondary Buttons** | Handbook §8.3       | `client/src/components/ui/button.tsx`     | Institutional Navy & Action Blue, minimum 36px/44px touch targets.                   |
| **High-Density Data Tables**    | Handbook §7.3       | Compact tables (`.table-compact`)         | 36px rows, sticky headers, tabular figures, accessible row actions.                  |
| **Form Inputs & Validation**    | Handbook §7.4       | `FormField.tsx`, `input.tsx`              | Explicit `<Label>`, inline error alert, Zod schema integration.                      |
| **Status Badges & Chips**       | Handbook §8.2       | `badge.tsx`                               | High-contrast status badges (Success, Warning, Error, Info). Zero color-only status. |
| **Alerts & Callouts**           | Handbook §7.7       | `alert.tsx`                               | Warning & danger callouts with rule citations and recovery actions.                  |
| **Confirmation Modals**         | Handbook §7.8       | `dialog.tsx` (Radix Dialog)               | Focus trapped, explicit cancel button, step-up auth for irreversible sealing.        |
| **Loading Skeletons**           | Handbook §7.10      | `skeleton.tsx`, `PageLoadingSkeleton.tsx` | Geometry-matched skeletons, `aria-busy="true"`, zero layout shift (CLS $\le 0.1$).   |
| **Empty States**                | Handbook §7.9       | `EmptyState.tsx`                          | Illustrated icon, clear explanation, and primary action trigger.                     |
| **Status Bar Footer**           | Handbook §6.2       | `AppShell.tsx` (Footer)                   | 36px height, live server time in IST (UTC+05:30), confidentiality notice.            |

---

## 3. UX4G Design Token Synchronization

1. **Design Tokens Source:** `client/design-tokens.json` adheres strictly to DTCG 2025.10 standards.
2. **Deterministic Build Pipeline:**
   ```bash
   pnpm run build:tokens
   # Invokes client/scripts/sync-tokens.js
   # Resolves aliases -> converts to CSS Custom Properties in client/src/index.css
   ```
3. **Automated Testing:** `client/src/test/design-tokens.test.ts` validates WCAG 2.2 AA contrast ratios mathematically for every core token pair.
