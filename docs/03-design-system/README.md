# AIRE Design System & Foundations

| Metadata             | Value                                                                                                                                                                                                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Document             | `docs/03-design-system/README.md`                                                                                                                                                                                                                                                    |
| Authoritative For    | Design System Architecture, Token Governance, Component Contracts, Visual Hierarchy Standards                                                                                                                                                                                        |
| Status               | `PROPOSED DESIGN FOUNDATION` (Awaiting Formal Product Sign-Off)                                                                                                                                                                                                                      |
| Baseline Standards   | WCAG 2.2 Level AA (ADR-011), Tailwind CSS v3, Radix UI Primitives (`shadcn/ui` pattern per D-003)                                                                                                                                                                                    |
| Upstream Sources     | [`docs/02-experience/experience-overview.md`](../02-experience/experience-overview.md), [`docs/02-experience/information-architecture.md`](../02-experience/information-architecture.md), [`docs/02-experience/interaction-contracts.md`](../02-experience/interaction-contracts.md) |
| Related Requirements | [`AIRE-REQ-078`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-083`](../00-governance/requirements-traceability.md), [`AIRE-REQ-065`](../00-governance/requirements-traceability.md)                                                                                  |
| Last Updated         | 2 November 2026                                                                                                                                                                                                                                                                      |

---

## 1. Purpose & Scope

The **AIRE Design System** translates the approved Stage 1 Product Experience Specifications into a deterministic, accessible, implementation-ready visual and interaction toolkit.

AIRE is a regulatory admission reconciliation and evidence platform operating under the statutory authority of the All India Council for Technical Education (AICTE). The interface supports high-stakes institutional reporting, automated multi-pass quota reconciliation, Show Cause adjudication, and verifiable student credential issuance.

Consequently, the design system serves two distinct interaction modes:

1. **High-Density Institutional Workbench:** Compact, information-dense, keyboard-operable data grids, side-by-side evidence inspectors, and auditable diff viewers designed for university registrars and AICTE regional scrutiny officers.
2. **Clear, Accessible Public Surfaces:** High-contrast, dignified, uncluttered verification terminals for enrolled technical students, employers, and statutory auditors.

---

## 2. Design System Documentation Index

The design system is partitioned into modular, focused specifications:

| Document                                                                           | Focus & Scope                       | Core Contents                                                                                                                      |
| ---------------------------------------------------------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [`design-rationale.md`](./design-rationale.md)                                     | UX Research & Empirical Foundations | Literature synthesis (NN/g, USWDS, GOV.UK, WCAG 2.2), palette selection, contrast verification table, validation register.         |
| [`design-principles.md`](./design-principles.md)                                   | Practical UX & Developer Axioms     | 8 operational principles (Recognition over recall, Error prevention, Hierarchy, Density, Privacy), Developer DOs & DON'Ts.         |
| [`design-tokens.md`](./design-tokens.md)                                           | Semantic Token Specifications       | Formal token scales: Surface, Border, Text, Status, Focus, Spacing, Layout Widths, Radii, Motion (driven by `design-tokens.json`). |
| [`typography-and-layout.md`](./typography-and-layout.md)                           | Typography & Grid Hierarchy         | Type scale, tabular monospace numerics, layout shell geometry, content density modes, and responsive adaptations.                  |
| [`component-foundations.md`](./component-foundations.md)                           | Core Component Specifications       | Detailed contracts for Buttons, Form Controls, Tables, Badges, Modals, Drawers, Toast Alerts, and Skeletons.                       |
| [`accessibility-and-responsive-rules.md`](./accessibility-and-responsive-rules.md) | WCAG 2.2 AA & Responsive Protocols  | Contrast minimums, visible focus rings, keyboard traps, ARIA live announcements, touch targets, and reduced-motion overrides.      |
| [`frontend-architecture.md`](./frontend-architecture.md)                           | Implementation & Developer Guide    | Vite + React 18 + Tailwind v3 + Radix UI architecture, token consumption, component inventory, and verification.                   |
| [`design-decisions.md`](./design-decisions.md)                                     | Token & Visual Decision Log         | Dedicated decision records (`DD-001` to `DD-011`) tracking rationale, alternatives, impact, and sign-off status.                   |

---

## 3. Governance & Decision Rules

To preserve documentation integrity and prevent unauthorized drift:

1. **Binding Requirements are Invariant:** All functional boundaries, RBAC permissions, PostgreSQL forced RLS requirements, and legal separation-of-duties rules defined in Stage 1 and master specifications are binding. The design system must visually reinforce these boundaries, never circumvent or simplify them.
2. **Status Distinction (Approved vs. Proposed):**
   - Architectural decisions (`ADR-001` through `ADR-011`) are **Approved**.
   - Specific color hex values, typography pairings, and component dimensions proposed herein are **Proposed Design Foundations** until verified in Phase 2 frontend implementation.
   - External government mandates (e.g. GIGW 3.0 certification) remain marked as **Needs Input / Verification**.
3. **No Feature Invention:** No component, variant, or state exists in this design system unless it directly traces to a confirmed user journey (`J-01` through `J-08`), screen (`S-00` through `S-40`), or interaction contract.
4. **Zero Code Changes in Stage 2:** This stage produces authoritative documentation only. No client files, Tailwind configurations, or package dependencies are modified during this phase.

---

## 4. Usage Guide for Implementation Teams

When Phase 2 frontend engineering begins, developers must follow these operational rules:

1. **Token Consumption:** Never use raw Tailwind palette colors (e.g. `text-blue-600` or `bg-slate-900`) directly in component JSX. Consume semantic token utilities (e.g. `text-primary`, `bg-surface-header`, `bg-brand-primary`) configured via CSS custom properties and Tailwind themes as defined in [`design-tokens.md`](./design-tokens.md).
2. **Component Composition:** Base components must follow the accessible unstyled Radix UI primitive patterns documented in [`component-foundations.md`](./component-foundations.md) (aligning with `shadcn/ui` conventions).
3. **Density Adherence:** High-density grids (Cohort Ledger, Regional Scrutiny Hub, Audit Explorer) must enforce compact 36px–40px row heights and tabular monospace figures for numerical IDs.
4. **State Completeness:** Every interactive view must implement all 6 states (Idle, Loading, Success, Partial, Error, Disabled) defined in the interaction contracts.
