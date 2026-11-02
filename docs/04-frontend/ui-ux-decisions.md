# AIRE — UI/UX Decisions Register

**Stage 0: Existing Product and Interface Audit**

| Field      | Value                                                                                                                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document   | `docs/04-frontend/ui-ux-decisions.md`                                                                                                                                                             |
| Audit date | 2 November 2026                                                                                                                                                                                   |
| Status     | `DRAFT` — all decisions `Open` unless noted                                                                                                                                                       |
| Related    | [ui-ux-audit.md](./ui-ux-audit.md) · [design-foundations-audit.md](./design-foundations-audit.md) · [screen-inventory.md](./screen-inventory.md) · [journey-inventory.md](./journey-inventory.md) |

> [!IMPORTANT]
> An agent recommendation is **not** an approved product decision. All decisions below require explicit approval from the product owner or designated decision authority before implementation begins.

---

## Decision Status Key

| Status     | Meaning                                    |
| ---------- | ------------------------------------------ |
| `Open`     | Not yet decided                            |
| `Proposed` | A recommendation exists; awaiting approval |
| `Approved` | Explicitly approved by decision owner      |
| `Rejected` | Considered and declined                    |

---

## D-001 — External Verifier Workspace Placeholder

| Field                | Detail                                                                                                                                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision ID**      | D-001                                                                                                                                                                                                                                              |
| **Question**         | Is the External Verifier workspace intentionally excluded from the Phase 1 placeholder tiles in `App.tsx`, or was it an oversight?                                                                                                                 |
| **Why it matters**   | PROJECT_PLAN.md §10.1 defines five workspace areas including the External Verifier. Only four appear as placeholders. If the omission is intentional, the screen inventory and navigation plan must reflect a different entry point for verifiers. |
| **Affected screens** | S-40 (External Verifier Workspace); S-00 (Shell navigation)                                                                                                                                                                                        |
| **Options**          | (a) Omission was intentional — External Verifier accesses via a separate entry point or micro-workflow. (b) It was an oversight — add to placeholder and future navigation.                                                                        |
| **Risks**            | If omitted from navigation design, the verifier workflow may require a separate design approach (e.g. a lightweight standalone verification portal).                                                                                               |
| **Decision owner**   | Product owner                                                                                                                                                                                                                                      |
| **Status**           | `Open`                                                                                                                                                                                                                                             |

---

## D-002 — UI Component Library

| Field                | Detail                                                                                                                                                                                                                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision ID**      | D-002                                                                                                                                                                                                                                                                               |
| **Question**         | What component library should AIRE use for its design system?                                                                                                                                                                                                                       |
| **Why it matters**   | The AGENTS.md skill table references `shadcn` and `vercel-react-best-practices`. No component library is currently installed. The choice determines default form control appearance, accessibility primitives (Radix UI), icon set integration, and how much custom work is needed. |
| **Affected screens** | All screens; all journeys                                                                                                                                                                                                                                                           |
| **Options**          | (a) **shadcn/ui** (Radix primitives + Tailwind CSS; accessible; pairs with existing Lucide icons; recommended in AGENTS.md). (b) **Custom components** (maximum control; higher build cost). (c) **Other library** (e.g. Headless UI, Ark UI).                                      |
| **Risks**            | (a) shadcn components are unstyled building blocks — full visual language still requires custom tokens. (b) Custom is highest effort. Defer vs. decide now: delaying blocks Stage 1 design work.                                                                                    |
| **Decision owner**   | Engineering lead + product owner                                                                                                                                                                                                                                                    |
| **Status**           | `Open`                                                                                                                                                                                                                                                                              |

---

## D-003 — Authentication Provider and OIDC Configuration

| Field                 | Detail                                                                                                                                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision ID**       | D-003                                                                                                                                                                                                                                                                          |
| **Question**          | Which OIDC provider will AIRE use, and will MFA be provider-hosted or in-app?                                                                                                                                                                                                  |
| **Why it matters**    | The login screen (S-01) and MFA screen (S-02) design depend on whether authentication is provider-hosted (redirect) or in-app. `better-auth` is installed on the server; the provider it connects to is not specified. This affects the appearance of the authentication flow. |
| **Affected journeys** | J-01, J-12                                                                                                                                                                                                                                                                     |
| **Affected screens**  | S-01, S-02                                                                                                                                                                                                                                                                     |
| **Options**           | (a) Provider-hosted SSO (minimal custom login screen; redirect flow). (b) Custom credential + TOTP (in-app form design needed for every auth screen). (c) Hybrid (identifier-first with provider selection).                                                                   |
| **Risks**             | Provider selection is a security decision, not just a UI decision. Must be confirmed before any login screen design work begins.                                                                                                                                               |
| **Decision owner**    | Security lead + product owner                                                                                                                                                                                                                                                  |
| **Status**            | `Open`                                                                                                                                                                                                                                                                         |

---

## D-004 — Brand and Semantic Color Palette

| Field                | Detail                                                                                                                                                                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision ID**      | D-004                                                                                                                                                                                                                                                         |
| **Question**         | What are the official AIRE semantic color tokens — brand primary, surface levels, status colors, and text hierarchy?                                                                                                                                          |
| **Why it matters**   | Current color usage is ad-hoc Tailwind defaults with no semantic roles assigned. The "Quiet Institutional Confidence" direction requires a deliberate, consistent palette. Without this decision, every component will have conflicting ad-hoc color choices. |
| **Affected screens** | All                                                                                                                                                                                                                                                           |
| **Options**          | Requires design exploration. The current slate/sky/indigo ad-hoc selection is not a decision — it is a starting point for design work only. Any government branding requirements (NIC, AICTE) must be reviewed.                                               |
| **Risks**            | Selecting colors without contrast verification risks WCAG 2.2 AA non-compliance.                                                                                                                                                                              |
| **Decision owner**   | Product owner / designer                                                                                                                                                                                                                                      |
| **Status**           | `Open`                                                                                                                                                                                                                                                        |

---

## D-005 — Typography: Font Family, Type Scale, and Hierarchy

| Field                | Detail                                                                                                                                                                                                                |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision ID**      | D-005                                                                                                                                                                                                                 |
| **Question**         | What typeface(s) and type scale will AIRE use?                                                                                                                                                                        |
| **Why it matters**   | Current typography is the system font stack at ad-hoc sizes. A consistent type scale is required for readable data-dense institutional interfaces.                                                                    |
| **Affected screens** | All                                                                                                                                                                                                                   |
| **Options**          | (a) System font stack (current — lowest load, least control). (b) A Google Font or open-source typeface. (c) A licensed typeface. Government web guidelines (https://guidelines.india.gov.in/) may have requirements. |
| **Risks**            | Typeface selection affects branding, readability, performance, and licensing. Government guidelines may restrict choices.                                                                                             |
| **Decision owner**   | Product owner / designer                                                                                                                                                                                              |
| **Status**           | `Open`                                                                                                                                                                                                                |

---

## D-006 — Accessibility Conformance Target and Applicable Standards

| Field                | Detail                                                                                                                                                                                                                                                      |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision ID**      | D-006                                                                                                                                                                                                                                                       |
| **Question**         | Which accessibility standard(s) apply — WCAG 2.2 AA, Government of India GIGW, or both? What is the conformance gate before any screen can be shipped?                                                                                                      |
| **Why it matters**   | PROJECT_PLAN.md §7 requires "WCAG 2.2 AA target, subject to applicable government requirements." Indian government web guidelines (https://guidelines.india.gov.in/) may require GIGW compliance. Without a clear target, accessibility cannot be verified. |
| **Affected screens** | All                                                                                                                                                                                                                                                         |
| **Options**          | (a) WCAG 2.2 AA only. (b) WCAG 2.2 AA + GIGW 3.0. (c) WCAG 2.2 AA + GIGW 3.0 + any AICTE-specific guidelines.                                                                                                                                               |
| **Risks**            | GIGW requirements may restrict font choices, color usage, and layout patterns. Must be confirmed before design token work.                                                                                                                                  |
| **Decision owner**   | Product owner; verified against applicable government direction                                                                                                                                                                                             |
| **Status**           | `Open`                                                                                                                                                                                                                                                      |

---

## D-007 — Layout: Content Width, Sidebar Width, and Page Padding

| Field                | Detail                                                                                                                                                                                                                       |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision ID**      | D-007                                                                                                                                                                                                                        |
| **Question**         | What is the layout model for each workspace — full-width, fixed sidebar + content area, or responsive drawer navigation?                                                                                                     |
| **Why it matters**   | Institutional workflows (exception review, data tables, form workflows) require consistent, predictable layout. Current layout uses a simple `max-w-7xl` wrapper. No sidebar, panels, or multi-column content layout exists. |
| **Affected screens** | All workspace screens                                                                                                                                                                                                        |
| **Options**          | (a) Fixed sidebar + scrollable content area (common for regulatory tools). (b) Top-nav + content area (simpler; less space for nav items). (c) Hybrid (collapsible sidebar on smaller viewports).                            |
| **Risks**            | Dense data screens (exceptions, submissions, approval registry) require significant horizontal space. Sidebar reduces available content width.                                                                               |
| **Decision owner**   | Product owner / designer                                                                                                                                                                                                     |
| **Status**           | `Open`                                                                                                                                                                                                                       |

---

## D-008 — Responsive Viewport Strategy

| Field                | Detail                                                                                                                                                                                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision ID**      | D-008                                                                                                                                                                                                                                                                                            |
| **Question**         | What is the minimum supported viewport width, and how should the application behave on mobile and tablet?                                                                                                                                                                                        |
| **Why it matters**   | AIRE is a complex regulatory workflow tool. Many workflows (data upload, exception review, approval tables) are impractical on small screens. A minimum viewport decision affects all layout and component design.                                                                               |
| **Affected screens** | All                                                                                                                                                                                                                                                                                              |
| **Options**          | (a) Desktop-first with responsive adaptations (minimum ~1024px primary target; mobile shows degraded but usable view). (b) Fully responsive down to 320px (significantly more design and build effort). (c) Student workspace is mobile-friendly; institutional/AICTE workspaces target 1024px+. |
| **Risks**            | Option (b) increases design complexity substantially. Option (c) creates two design tracks.                                                                                                                                                                                                      |
| **Decision owner**   | Product owner                                                                                                                                                                                                                                                                                    |
| **Status**           | `Open`                                                                                                                                                                                                                                                                                           |

---

## D-009 — Primary Navigation Pattern

| Field                | Detail                                                                                                                                                                                                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision ID**      | D-009                                                                                                                                                                                                                                                                      |
| **Question**         | What navigation pattern should AIRE use to support five distinct workspaces and multiple sub-sections within each?                                                                                                                                                         |
| **Why it matters**   | The current header has no navigation. Five workspaces and ~20 screens need a coherent navigation hierarchy. The pattern must support role-appropriate visibility, not just as a usability feature but with awareness that UI visibility is not an authorization mechanism. |
| **Affected screens** | S-00 (shell), all workspace roots                                                                                                                                                                                                                                          |
| **Options**          | (a) Sidebar with workspace sections and collapsed sub-navigation. (b) Top navigation with mega-dropdown for sub-sections. (c) Tab-based workspace switcher with contextual left-nav.                                                                                       |
| **Risks**            | Navigation must reflect authorized access only. Hidden items still require backend authorization. Pattern chosen here informs the shell design entirely.                                                                                                                   |
| **Decision owner**   | Product owner / designer                                                                                                                                                                                                                                                   |
| **Status**           | `Open`                                                                                                                                                                                                                                                                     |

---

## D-010 — Authentication Error and Edge-Case Copy

| Field                 | Detail                                                                                                                                                                                                                                                   |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision ID**       | D-010                                                                                                                                                                                                                                                    |
| **Question**          | What copy should appear for authentication failures, account lockout, session expiry, and provider unavailability?                                                                                                                                       |
| **Why it matters**    | PROJECT_PLAN.md §11.3 requires that error messages never include stack traces or sensitive details. Auth error copy must be informative without leaking identity information (e.g. "user not found" vs. "incorrect credentials" is a security decision). |
| **Affected journeys** | J-01, J-12                                                                                                                                                                                                                                               |
| **Affected screens**  | S-01, S-02                                                                                                                                                                                                                                               |
| **Options**           | Requires product + security review. No recommendation made here.                                                                                                                                                                                         |
| **Decision owner**    | Security lead + product owner                                                                                                                                                                                                                            |
| **Status**            | `Open`                                                                                                                                                                                                                                                   |

---

## D-011 — Evidence Viewer Design

| Field                | Detail                                                                                                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision ID**      | D-011                                                                                                                                                                                                   |
| **Question**         | How should evidence documents (PDF, images, structured data) be presented to reviewers within the exception workflow?                                                                                   |
| **Why it matters**   | M11 requires evidence attachment and viewing. The design must ensure private object storage links are never exposed directly. The evidence viewer must be embedded or proxied, not a raw presigned URL. |
| **Affected screens** | S-16 (Exception Detail — Reviewer), S-26 (Exception Response)                                                                                                                                           |
| **Options**          | (a) In-app document viewer (iframe with proxied content). (b) Secure download with audit trail. (c) Both (preview + download).                                                                          |
| **Risks**            | Option (b) only may be acceptable for initial implementation. Option (a) requires more frontend work.                                                                                                   |
| **Decision owner**   | Product owner + security lead                                                                                                                                                                           |
| **Status**           | `Open`                                                                                                                                                                                                  |

---

## D-012 — Field-Level Masking Rules in Reviewer Views

| Field                | Detail                                                                                                                                                                                                                                                                                    |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision ID**      | D-012                                                                                                                                                                                                                                                                                     |
| **Question**         | Precisely which fields are masked or hidden for each role in the exception detail view?                                                                                                                                                                                                   |
| **Why it matters**   | PROJECT_PLAN.md §16.5 specifies that a reviewer sees finding, approval, rule, and evaluation trace but not the raw APAAR identifier or full personal contact details. The UI must implement masking correctly; the backend enforces it. Frontend must not display what the backend omits. |
| **Affected screens** | S-16                                                                                                                                                                                                                                                                                      |
| **Options**          | Requires a field-level authorization matrix from the product/security specification. `docs/03-user-management/PERMISSION_MATRIX.md` is planned but not yet created.                                                                                                                       |
| **Decision owner**   | Security lead + product owner                                                                                                                                                                                                                                                             |
| **Status**           | `Open` — blocked on `PERMISSION_MATRIX.md`                                                                                                                                                                                                                                                |

---

## D-013 — Application Route Convention

| Field                | Detail                                                                                                                                                                                                            |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision ID**      | D-013                                                                                                                                                                                                             |
| **Question**         | What is the URL route structure for AIRE's workspaces and screens?                                                                                                                                                |
| **Why it matters**   | All routes in [screen-inventory.md](./screen-inventory.md) are marked "(tentative)." `docs/04-frontend/APPLICATION_ROUTES.md` is planned but not created. Routes must be designed before routing code is written. |
| **Affected screens** | All                                                                                                                                                                                                               |
| **Options**          | Requires a documented routing specification. Preliminary options: `/aicte/*`, `/institution/:id/*`, `/student/*`, `/auditor/*` — but these require product approval.                                              |
| **Decision owner**   | Engineering lead + product owner                                                                                                                                                                                  |
| **Status**           | `Open`                                                                                                                                                                                                            |

---

## D-014 — Icon Size Conventions

| Field                | Detail                                                                                                                       |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Decision ID**      | D-014                                                                                                                        |
| **Question**         | What are the canonical icon sizes for each usage context (logo mark, card icon, inline status, action button)?               |
| **Why it matters**   | Current icon sizes (`w-8 h-8`, `w-5 h-5`, `w-4 h-4`) are ad-hoc. Consistent sizing is required for a coherent design system. |
| **Affected screens** | All                                                                                                                          |
| **Decision owner**   | Designer                                                                                                                     |
| **Status**           | `Open`                                                                                                                       |

---

## D-015 — Surface Levels, Shadow Scale, and Border-Radius Tokens

| Field                | Detail                                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Decision ID**      | D-015                                                                                                                           |
| **Question**         | What is the visual elevation hierarchy (page → card → overlay → modal) and the associated shadow and border-radius tokens?      |
| **Why it matters**   | Current surface hierarchy is ad-hoc. A consistent elevation model is required for tables, cards, drawers, modals, and overlays. |
| **Affected screens** | All                                                                                                                             |
| **Decision owner**   | Designer                                                                                                                        |
| **Status**           | `Open`                                                                                                                          |

---

## D-016 — Motion and Transition Principles

| Field                | Detail                                                                                                                                                                                                                                  |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision ID**      | D-016                                                                                                                                                                                                                                   |
| **Question**         | What are the AIRE motion principles — duration tokens, easing functions, and reduced-motion behavior?                                                                                                                                   |
| **Why it matters**   | The "Quiet Institutional Confidence" direction implies subdued, purposeful motion — not decorative animation. No transitions are defined. `prefers-reduced-motion` must be respected per WCAG 2.1 SC 2.3.3 (AAA) / best practice at AA. |
| **Affected screens** | All                                                                                                                                                                                                                                     |
| **Decision owner**   | Designer                                                                                                                                                                                                                                |
| **Status**           | `Open`                                                                                                                                                                                                                                  |

---

## D-017 — Table and Pagination Conventions

| Field                | Detail                                                                                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision ID**      | D-017                                                                                                                                                                                                  |
| **Question**         | What is the standard table component and pagination pattern for AIRE's data-dense screens?                                                                                                             |
| **Why it matters**   | Submission batch results, exception queues, approval registries, and admission lists are all table-based. PROJECT_PLAN.md §32.5 requires server-side pagination. No table component or pattern exists. |
| **Affected screens** | S-11, S-12, S-13, S-15, S-21, S-23, S-25, S-50                                                                                                                                                         |
| **Decision owner**   | Engineering lead + designer                                                                                                                                                                            |
| **Status**           | `Open`                                                                                                                                                                                                 |

---

## D-018 — Chart Library Confirmation

| Field                | Detail                                                                                                                                                                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision ID**      | D-018                                                                                                                                                                                                 |
| **Question**         | Is `chart.js` the confirmed chart library, and which chart types are required for each dashboard?                                                                                                     |
| **Why it matters**   | PROJECT_PLAN.md §9.1 lists `chart.js` as planned but it is **not installed**. Dashboard screens (S-10, S-17, S-20) require charts. The library must be decided and installed before dashboard design. |
| **Affected screens** | S-10, S-17, S-20, S-24                                                                                                                                                                                |
| **Decision owner**   | Engineering lead + product owner                                                                                                                                                                      |
| **Status**           | `Open`                                                                                                                                                                                                |

---

## D-019 — Status Language and Feedback Patterns

| Field                | Detail                                                                                                                                                                                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision ID**      | D-019                                                                                                                                                                                                                                                            |
| **Question**         | What are the canonical status labels, colours, and feedback patterns for each workflow state in AIRE?                                                                                                                                                            |
| **Why it matters**   | PROJECT_PLAN.md defines many status enumerations (submission lifecycle, exception states, evaluation statuses, reconciliation statuses, identity verification statuses). The UI must represent each consistently. No visual or copy conventions are established. |
| **Affected screens** | S-22, S-23, S-14, S-15, S-16, S-24, S-25                                                                                                                                                                                                                         |
| **Options**          | Requires status label mapping, color assignment per semantic status type, and badge/chip component definition.                                                                                                                                                   |
| **Decision owner**   | Product owner + designer                                                                                                                                                                                                                                         |
| **Status**           | `Open`                                                                                                                                                                                                                                                           |

---

## Decision Summary

| Decision ID | Area                           | Status | Blocked by              |
| ----------- | ------------------------------ | ------ | ----------------------- |
| D-001       | External Verifier workspace    | `Open` | —                       |
| D-002       | Component library              | `Open` | —                       |
| D-003       | OIDC provider + MFA            | `Open` | Security decision       |
| D-004       | Brand color palette            | `Open` | D-006 (WCAG target)     |
| D-005       | Typography                     | `Open` | D-006 (GIGW)            |
| D-006       | Accessibility standard         | `Open` | Government directive    |
| D-007       | Layout model                   | `Open` | D-008                   |
| D-008       | Viewport / responsive strategy | `Open` | —                       |
| D-009       | Navigation pattern             | `Open` | D-007                   |
| D-010       | Auth error copy                | `Open` | Security review         |
| D-011       | Evidence viewer design         | `Open` | Security review         |
| D-012       | Field-level masking rules      | `Open` | `PERMISSION_MATRIX.md`  |
| D-013       | Route convention               | `Open` | `APPLICATION_ROUTES.md` |
| D-014       | Icon size conventions          | `Open` | D-002                   |
| D-015       | Surface / elevation tokens     | `Open` | D-004                   |
| D-016       | Motion principles              | `Open` | D-006                   |
| D-017       | Table and pagination           | `Open` | D-002                   |
| D-018       | Chart library                  | `Open` | —                       |
| D-019       | Status language                | `Open` | Product domain review   |

**Priority decisions that unblock most others:** D-002 (component library), D-003 (auth), D-004 (color), D-006 (accessibility standard).
