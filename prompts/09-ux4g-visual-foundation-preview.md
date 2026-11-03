# Prompt 09: AIRE UX4G 3.0 Visual Foundation & Design Token Implementation

| Field                  | Value                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| **Task**               | Establish AIRE Design Token Source, UX4G 3.0 Component Abstraction Layer, and Visual Foundation Preview |
| **Status**             | APPROVED (Direct User Authorization: "Use /antislop during the project (1), proceed")                   |
| **Document Authority** | `design.md` (v1.0), `AGENTS.md`, `docs/00-governance/source-of-truth-policy.md`                         |
| **Skills Consulted**   | `antislop`, `ux4g-design`, `shadcn`, `vercel-react-best-practices`, `zod`, `typescript-advanced-types`  |

---

## 1. Goal

Execute the 10 tasks requested by the user under `design.md` governance:

1. Verify `design.md` against official UX4G 3.0 documentation (`ux4g-web-components@3.0.2`).
2. Identify conflicts between UX4G baseline and AIRE-specific customisation.
3. Verify proposed UX4G components and theming integration against documented APIs.
4. Establish canonical semantic AIRE design-token source (`client/design-tokens.json`), token generator script (`client/scripts/build-tokens.mjs`), and CSS custom properties mapped to UX4G tokens.
5. Implement a clean, maintainable AIRE component abstraction layer (`client/src/components/aire/`).
6. Build a comprehensive visual foundation preview page (`client/src/pages/VisualFoundationPreview.tsx`) covering typography, colour palette, buttons, form fields, navigation/breadcrumbs, cards, alerts, status indicators/tags, and editorial illustration.
7. Integrate original high-craft SVG vector artwork (records verification, audit ledger, and security architecture).
8. Demonstrate restrained glassmorphism only in specified illustrative layers (88-96% opacity, 8-14px blur, solid fallback).
9. Capture browser screenshots via Playwright/Chromium across viewports and verify visual quality.
10. Report all deviations and findings with high fidelity.

---

## 2. Inspected Sources & Codebase State

- `design.md`: Master visual and UX contract v1.0.
- `node_modules/ux4g-web-components`: Official UX4G 3.0.2 package containing `styles/ux4g.css` and runtime.
- `client/src/index.css`: Root styling, currently containing outdated `--ux4g-color-primary-600: #1d4ed8` overrides.
- `client/tailwind.config.js`: Tailwind config linking to `--ux4g-*` variables.
- `client/src/components/aire/`: Existing components currently mixing inline hexes and legacy class names.
- `infrastructure/scripts/ux4g-browser-check.py`: Playwright browser testing harness.

---

## 3. Assumptions & Scope Boundaries

- Scope is strictly the visual foundation, design tokens, component abstractions, and preview page as specified.
- No backend endpoints, databases, or remaining workspaces (Institution/AICTE/Student/Auditor) are modified before approval.
- Pure SVG vector art authored directly without external generative image models or raster placeholders.

---

## 4. Verification & Quality Gates

- Automated token contrast check: WCAG 2.1 AA ($\ge 4.5:1$ normal text, $\ge 3:1$ UI controls).
- Typecheck: `pnpm --filter @aire/client typecheck`.
- Tests: `pnpm --filter @aire/client test`.
- Build: `pnpm --filter @aire/client build`.
- Headless Chromium screenshot capture: 1440px desktop, 1024px tablet, 390px mobile.
