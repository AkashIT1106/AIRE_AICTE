# UX4G Adoption & Implementation Mapping for AIRE

| Metadata         | Value                                                                  |
| ---------------- | ---------------------------------------------------------------------- |
| Document         | `docs/design/ux4g-adoption.md`                                         |
| Design Authority | UX4G (User Experience for Government) Design System v3.0 / v3.3.2      |
| Framework Stack  | React 18, TypeScript, Tailwind CSS, `ux4g-web-components` (npm v3.0.2) |
| Target Page      | AIRE Institutional Public Landing Page (`/`)                           |

---

## 1. Executive Summary

AIRE adopts the official **UX4G (User Experience for Government)** standard published by the Government of India as its authoritative design framework. UX4G provides standard design tokens, typography ramps, responsive breakpoint systems, and accessibility guidelines optimized for Indian public services.

This document details the mapping between UX4G specifications, npm package exports from `ux4g-web-components`, and the AIRE component layer.

---

## 2. Adoption Model & Technical Architecture

UX4G distributes a unified CSS bundle and runtime package (`ux4g-web-components`). In AIRE, this package is consumed directly as follows:

```
npm: ux4g-web-components (v3.0.2)
  ├── styles.css (Tokens, typography, base resets, layout, elevation)
  └── design-system runtime (Event delegation for interactive behaviors)
       │
       ▼
client/src/main.tsx
  ├── import 'ux4g-web-components/styles.css'
  └── import 'ux4g-web-components/design-system'
       │
       ▼
client/src/components/aire/* (AIRE Reusable Component Layer)
  ├── Encapsulates UX4G CSS classes (e.g. .ux4g-btn, .ux4g-card, .ux4g-accordion)
  ├── Composes semantic layout with Tailwind CSS utility classes
  └── Provides typed, accessible React interfaces without vendor lock-in
```

### Direct Reusability Assessment

| UX4G Component / Asset | Direct Reusability in React                                                | Adaptation Strategy in AIRE                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Typography Scale**   | Direct via CSS classes (`ux4g-heading-xl`, `ux4g-body-m`, etc.)            | Used directly in AIRE layout and text wrappers.                                                                                |
| **Grid & Containers**  | Direct via CSS classes (`ux4g-container`, `ux4g-grid-*`)                   | Augmented with responsive Tailwind layout for precise spacing control.                                                         |
| **Buttons**            | Direct via `ux4g-btn-primary`, `ux4g-btn-outline-primary`, `ux4g-btn-m/lg` | Wrapped in `<AireButton>` to enforce standard types and accessible button semantics.                                           |
| **Cards**              | Direct via `ux4g-card` styling                                             | Wrapped in `<ServiceCard>` with institutional layout, icons, and status tags.                                                  |
| **Accordion**          | Direct styling + accessible React state control                            | Implemented as `<AireAccordion>` with controlled keyboard navigation and ARIA attributes for robust cross-browser reliability. |
| **Badges & Tags**      | Direct via `ux4g-tag-*` and `ux4g-badge-*`                                 | Wrapped in `<AireBadge>` supporting status variations (verified, pending, advisory).                                           |
| **Header & Navbar**    | Direct via `ux4g-navbar-*`                                                 | Encapsulated in `<AireNavbar>` and `<AireUtilityHeader>` with mobile drawer support.                                           |
| **Footer**             | Direct via `ux4g-footer-*`                                                 | Encapsulated in `<AireFooter>` with structured institutional columns and statutory notices.                                    |

---

## 3. Design Tokens Integration

UX4G tokens are exposed as standard CSS custom properties. AIRE configures Tailwind CSS to extend and reference these tokens directly, ensuring zero styling conflicts and full token inheritance:

- `--ux4g-color-neutral-0` (`#FFFFFF`) → Canvas and card backgrounds.
- `--ux4g-color-neutral-50` (`#FAFAFA`) → Page background.
- `--ux4g-color-neutral-100` (`#F5F5F5`) → Soft alternating section surface.
- `--ux4g-color-neutral-200` (`#E5E5E5`) → Dividers and subtle card borders.
- `--ux4g-color-neutral-900` (`#171717`) → Dominant text ink color (high-contrast).
- `--ux4g-color-primary-50` (`#F2EFFF`) → Subtle lavender surface.
- `--ux4g-color-primary-600` (`#4A2BC2`) → Primary action color & interactive state focus.

---

## 4. Accessibility Compliance (WCAG 2.2 AA)

1. **Color Contrast:** All body text meets or exceeds a 7:1 contrast ratio against light backgrounds.
2. **Keyboard Traversal:** All interactive elements support sequential keyboard navigation via standard tab order.
3. **Screen Readers:** Landmark roles (`header`, `nav`, `main`, `section`, `footer`) and ARIA labels are implemented systematically.
4. **Touch Ergonomics:** Click targets for primary actions on mobile satisfy the 44×44px minimum recommendation.
5. **Reduced Motion:** Animations and transitions respect `prefers-reduced-motion: reduce`.
