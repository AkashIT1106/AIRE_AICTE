# Design Decisions Log

| Metadata             | Value                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/03-design-system/design-decisions.md`                                                                                        |
| Authoritative For    | Design System Technical Choices, Component Strategy, Token Architecture, Formal Recommendations                                    |
| Status               | `PROPOSED DESIGN DECISIONS` (Synchronized with Central Governance Register)                                                        |
| Central Register     | [`docs/00-governance/decisions/decision-register.md`](../00-governance/decisions/decision-register.md)                             |
| Related Requirements | [`AIRE-REQ-078`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-083`](../00-governance/requirements-traceability.md) |
| Last Updated         | 2 November 2026                                                                                                                    |

---

## 1. Overview & Decision Methodology

This log tracks significant technical and visual choices established during Stage 2. To preserve governance integrity under [`docs/00-governance/source-of-truth-policy.md`](../00-governance/source-of-truth-policy.md), design proposals are explicitly marked as `PROPOSED` or `NEEDS-INPUT` until verified and approved by the product authority.

---

## 2. Design System Decisions

### DD-001 — Component Architecture: Radix UI Primitives + Tailwind CSS (`shadcn/ui` Pattern)

- **Central Register Link:** [`D-003`](../00-governance/decisions/decision-register.md)
- **Status:** `APPROVED` (Approved in Stage 3 by explicit project requirement)
- **Decision:** Adopt the `shadcn/ui` architecture (composable, unstyled Radix UI primitives styled with AIRE semantic Tailwind CSS utility tokens).
- **Rationale:**
  - Radix primitives handle complex WAI-ARIA keyboard navigation, focus trapping, and screen reader announcements natively.
  - Zero lock-in: components are maintained directly in the codebase (`client/src/components/ui/`), giving full ownership over code and avoiding heavyweight opinionated UI libraries.
  - Aligns with the project's installed packages (`@radix-ui/react-*` fully compatible with React 18 and Tailwind v3). All dependencies are free, open-source MIT-licensed packages.
- **Impacted Documents:** [`component-foundations.md`](./component-foundations.md), [`README.md`](./README.md), [`frontend-architecture.md`](./frontend-architecture.md).
- **Revisit Trigger:** If AICTE mandates an external government component library with incompatible markup.

---

### DD-002 — Canonical Design Tokens (DTCG 2025.10) & Institutional Navy/Teal Palette

- **Central Register Link:** [`D-004`](../00-governance/decisions/decision-register.md)
- **Status:** `APPROVED` (Approved in Stage 3.5 per Research Rationale)
- **Decision:** Establish `client/design-tokens.json` as the single canonical source of truth adhering strictly to the Design Tokens Community Group (DTCG) 2025.10 format. Replace provisional SaaS indigo with an evidence-informed institutional palette: Institutional Navy (`#173B57`), Teal Accent (`#0F766E`), Canvas (`#F5F7FA`), and Slate Neutrals (`#172B3A` to `#F0F4F8`).
- **Rationale:**
  - Prevents generic SaaS visual fatigue and eliminates unsupported color psychology assumptions.
  - Generates synchronized CSS custom properties in `client/src/index.css` via deterministic build script (`client/scripts/sync-tokens.js`).
  - Mathematically verifies WCAG 2.2 Level AA contrast: Primary Text ($14.5:1$ AAA), Navy Action ($11.7:1$ AAA), Teal Focus Ring ($5.5:1$ AA), Muted Text ($5.3:1$ AA).
  - Eliminates duplicate hardcoded values across CSS, Tailwind, and components.
- **Impacted Documents:** [`design-rationale.md`](./design-rationale.md), [`design-tokens.md`](./design-tokens.md), [`accessibility-and-responsive-rules.md`](./accessibility-and-responsive-rules.md), [`frontend-architecture.md`](./frontend-architecture.md).
- **Revisit Trigger:** Formal delivery of official statutory AICTE brand guidelines altering primary colors.

---

### DD-003 — Form Validation Engine: React Hook Form + Zod Resolvers

- **Central Register Link:** [`D-005`](../00-governance/decisions/decision-register.md)
- **Status:** `APPROVED` (Approved in Stage 3)
- **Decision:** Standardize form validation using `react-hook-form` coupled with `@hookform/resolvers/zod` and shared validation schemas from `@aire/validation`.
- **Rationale:**
  - Packages are installed and operational in `client/package.json`.
  - Enables sharing the exact same Zod validation schemas between the backend Express ingestion pipeline and client forms, eliminating schema drift.
  - Rerenders only invalid inputs, maintaining high performance during complex multi-field quarantine editing.
- **Impacted Documents:** [`component-foundations.md`](./component-foundations.md) §2, [`interaction-contracts.md`](../02-experience/interaction-contracts.md), [`frontend-architecture.md`](./frontend-architecture.md).
- **Revisit Trigger:** If form performance degrades on low-end institutional hardware ($> 500$ rows).

---

### DD-004 — High-Density Data Tables: TanStack Table with 36px Compact Row Height

- **Central Register Link:** [`D-006`](../00-governance/decisions/decision-register.md)
- **Status:** `PROPOSED`
- **Recommendation:** Implement institutional data grids using `@tanstack/react-table` with compact `36px` row heights, server-side pagination, and monospace tabular figures.
- **Rationale:**
  - Institutional registrars review cohorts of 500–2,000 students. Comfortable SaaS tables (64px row height) show only 8–10 records per screen, causing severe navigation fatigue.
  - Compact 36px rows display 20+ records per screen on standard 1080p displays.
  - Monospace tabular numbers ensure vertical decimal alignment for seat counts and quota metrics.
- **Impacted Documents:** [`typography-and-layout.md`](./typography-and-layout.md), [`component-foundations.md`](./component-foundations.md) §5.
- **Revisit Trigger:** User testing indicating that 36px density causes touch/pointer misclicks on laptops.

---

### DD-005 — Verifiable Credential Presentation: Dynamic SVG QR Code + Guilloche Certificate Card

- **Central Register Link:** [`D-007`](../00-governance/decisions/decision-register.md)
- **Status:** `PROPOSED`
- **Recommendation:** Present Admission Entitlement Proofs (AEP) in the student portal (`S-31`) as a digital certificate featuring guilloche border styling, an offline-verifiable vector SVG QR code, and a download action for a tamper-evident signed PDF.
- **Rationale:**
  - Establishes institutional dignity and immediate visual authenticity.
  - SVG QR codes scale crisply across smartphone displays and printed media without pixelation.
  - Offline cryptographic signature validation enables third-party verification without requiring a live database lookup.
- **Impacted Documents:** [`component-foundations.md`](./component-foundations.md), [`docs/02-experience/user-journeys/J-06-student-verification.md`](../02-experience/user-journeys/J-06-student-verification.md).
- **Revisit Trigger:** If AICTE specifies an alternative national academic certificate layout.

---

### DD-006 — Motion & Animation Bounds: 150ms–200ms Max; Zero Decorative Motion

- **Central Register Link:** [`D-008`](../00-governance/decisions/decision-register.md)
- **Status:** `APPROVED` (Approved in Stage 3)
- **Decision:** Strictly cap interactive transitions between 150ms and 200ms; prohibit all celebratory or decorative animations; enforce instant 0.01ms transitions under `prefers-reduced-motion: reduce`.
- **Rationale:**
  - In a regulatory tool, slow or bouncy animations feel frivolous and frustrate operators working under tight freeze deadlines.
  - Satisfies WCAG 2.2 AA SC 2.3.3. Configured in `client/src/index.css` and `client/tailwind.config.js`.
- **Impacted Documents:** [`design-tokens.md`](./design-tokens.md) §6, [`docs/02-experience/motion-and-feedback.md`](../02-experience/motion-and-feedback.md), [`frontend-architecture.md`](./frontend-architecture.md).
- **Revisit Trigger:** Ergonomic testing showing transition stutter on low-end displays.

---

### DD-007 — Search Input Debounce Timing: Standard 300ms

- **Central Register Link:** [`D-011`](../00-governance/decisions/decision-register.md)
- **Status:** `PROPOSED`
- **Recommendation:** Standardize a 300ms debounce on all text query inputs across data tables.
- **Rationale:**
  - 300ms is the optimal perceptual threshold: it feels instantaneous to users while preventing client query storms during typing.
- **Impacted Documents:** [`component-foundations.md`](./component-foundations.md), [`docs/02-experience/interaction-contracts.md`](../02-experience/interaction-contracts.md).
- **Revisit Trigger:** If backend latency during typing justifies increasing debounce to 500ms.

---

### DD-008 — Toast Notification Stacking & Manual Error Dismissal

- **Central Register Link:** [`D-013`](../00-governance/decisions/decision-register.md)
- **Status:** `PROPOSED`
- **Recommendation:** Limit concurrent visible toasts to 3; informational toasts auto-dismiss in 4,000ms; error toasts **never auto-dismiss** and must display a monospace Correlation ID with copy button.
- **Rationale:**
  - Operators reviewing regulatory batches must never miss an ingestion failure because a toast auto-dismissed while they were looking at another screen.
  - Correlation IDs allow direct tracing of failed requests in Pino server logs.
- **Impacted Documents:** [`component-foundations.md`](./component-foundations.md) §3.3, [`design-tokens.md`](./design-tokens.md).
- **Revisit Trigger:** User feedback regarding notification screen clutter.

---

### DD-009 — Multi-Tenant Organization Switcher in Shell Header

- **Central Register Link:** [`D-002`](../00-governance/decisions/decision-register.md)
- **Status:** `PROPOSED`
- **Recommendation:** Position the active tenant / campus switcher prominently in the top shell header (`S-04`); switching tenants triggers atomic client cache eviction and resets database transactions to the new `tenant_id`.
- **Rationale:**
  - Prominent header placement guarantees that multi-campus operators and regional reviewers always know which legal entity they are acting on behalf of.
  - Immediate TanStack cache eviction eliminates cross-tenant data leakage in browser memory.
- **Impacted Documents:** [`typography-and-layout.md`](./typography-and-layout.md), [`docs/02-experience/information-architecture.md`](../02-experience/information-architecture.md).
- **Revisit Trigger:** User requests for tabbed multi-tenant side-by-side comparison.

---

### DD-010 — Guidelines for Indian Government Websites (GIGW 3.0) Applicability

- **Central Register Link:** [`D-004`](../00-governance/decisions/decision-register.md)
- **Status:** `NEEDS-INPUT`
- **Recommendation:** Maintain WCAG 2.2 AA as the verified engineering baseline; record GIGW 3.0 (e.g. multilingual regional language switchers, Indian emblem placement mandates) as an active open requirement awaiting formal AICTE regulatory clarification.
- **Rationale:**
  - Avoids asserting legal or regulatory compliance without verifiable statutory audit evidence.
  - WCAG 2.2 AA ensures a rock-solid technical accessibility baseline that covers >90% of GIGW technical criteria.
- **Impacted Documents:** [`accessibility-and-responsive-rules.md`](./accessibility-and-responsive-rules.md), [`README.md`](./README.md).
- **Revisit Trigger:** Written directive from AICTE or NIC regarding mandatory GIGW compliance badges.
