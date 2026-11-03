# AIRE Design Specification — `design.md`

> **Canonical AIRE Institutional Design Contract**  
> **Status:** APPROVED & ACTIVE  
> **Authority:** UX4G (User Experience for Government) Design System v3.0 / v3.3.2  
> **Package Reference:** npm `ux4g-web-components` v3.0.2  
> **Visual Reference Architecture:** Aadhaar (UIDAI), iGOT Karmayogi, UX4G Official Foundations

---

## 1. Visual Principles & Institutional Identity

AIRE (AICTE Admission Reconciliation & Evidence Platform) is a public-sector digital service engineered to support the secure management, validation, and deterministic reconciliation of student records across AICTE-approved institutions.

### Core Principles

1. **Institutional Trustworthiness:** Predominantly white and soft-neutral canvas with purposeful visual hierarchy. No neon accents, dark sci-fi gradients, or generic SaaS aesthetics.
2. **Deterministic Clarity:** Interfaces communicate unambiguous status, clear sequential processes, and verified facts. Uncertainty or missing evidence is explicitly stated.
3. **UX4G-First:** Direct alignment with UX4G foundations, class architectures, and semantic tokens. Components compose official UX4G primitives and CSS modules.
4. **Restrained Color & Surface Design:** Crisp primary ink tones, restrained royal indigo/brand accents (`--ux4g-color-primary-600`), subtle neutral and lavender surfaces (`--ux4g-color-primary-50`), and warm notices (`--ux4g-color-secondary-50` / `--ux4g-color-secondary-600`) used strictly for callouts.
5. **Human Authority & Purpose Limitation:** The visual presentation reflects that deterministic code verifies records while authorized humans govern policy and final decisions. Student privacy and role boundaries are visibly respected.

---

## 2. Design Tokens & Foundations

AIRE binds directly to the documented UX4G token tiers. Custom styling must consume these CSS custom properties.

### 2.1 Color Foundations

| Token Name | Light Value | Semantic Role in AIRE |
|---|---|---|
| `--ux4g-color-neutral-0` | `#FFFFFF` | Primary canvas & card surface background |
| `--ux4g-color-neutral-50` | `#FAFAFA` | Page background & soft utility bands |
| `--ux4g-color-neutral-100` | `#F5F5F5` | Neutral alternating section background |
| `--ux4g-color-neutral-200` | `#E5E5E5` | Structural dividers & functional borders |
| `--ux4g-color-neutral-300` | `#D9D9D9` | Interactive element borders (resting) |
| `--ux4g-color-neutral-700` | `#404040` | Secondary metadata and supporting copy |
| `--ux4g-color-neutral-900` | `#171717` | High-contrast body text & display headings |
| `--ux4g-color-primary-50` | `#F2EFFF` | Subtle lavender surface for badges and highlights |
| `--ux4g-color-primary-100` | `#DCD4FF` | Light brand accent border |
| `--ux4g-color-primary-600` | `#4A2BC2` | Brand primary (actions, active links, primary CTA) |
| `--ux4g-color-primary-700` | `#3D239F` | Hover state for primary interactive elements |
| `--ux4g-color-primary-800` | `#301C7D` | Active / focused state for primary actions |
| `--ux4g-color-green-50` | `#F2FCEF` | Success notification background |
| `--ux4g-color-green-700` | `#006C35` | Verified / reconciliation pass badge text |
| `--ux4g-color-red-50` | `#FFF8F8` | Error / discrepancy notice surface |
| `--ux4g-color-red-700` | `#B3251E` | High-priority exception / validation failure text |
| `--ux4g-color-secondary-50` | `#FFF5EA` | Warm institutional notice banner background |
| `--ux4g-color-secondary-700` | `#764A00` | Warm notice text & advisory boundary |

### 2.2 Semantic Color Aliases

```css
:root {
  --aire-surface-canvas: var(--ux4g-color-neutral-0);
  --aire-surface-neutral: var(--ux4g-color-neutral-50);
  --aire-surface-lavender: var(--ux4g-color-primary-50);
  --aire-surface-card: #ffffff;
  --aire-text-primary: var(--ux4g-color-neutral-900);
  --aire-text-secondary: var(--ux4g-color-neutral-700);
  --aire-text-brand: var(--ux4g-color-primary-600);
  --aire-border-subtle: var(--ux4g-color-neutral-200);
  --aire-border-default: var(--ux4g-color-neutral-300);
  --aire-focus-ring: var(--ux4g-color-primary-600);
}
```

---

## 3. Typography Scale

All typography uses **Noto Sans** (with standard system-ui fallbacks), following UX4G's documented scale. Every text style binds to a defined heading, title, body, or label level.

| Scale | Font Size | Line Height | Weight | Element Mapping |
|---|---|---|---|---|
| `Display/L` | 60px / 3.75rem | 80px | SemiBold / Bold | Hero headline banner |
| `Heading/XL` | 32px / 2.0rem | 36px | SemiBold (600) | Section primary headings (`h2`) |
| `Heading/L` | 28px / 1.75rem | 32px | SemiBold (600) | Subsection headers (`h3`) |
| `Heading/M` | 24px / 1.5rem | 28px | SemiBold (600) | Service and card titles (`h4`) |
| `Body/L` | 18px / 1.125rem | 28px | Regular (400) | Hero lead paragraphs |
| `Body/M` | 16px / 1.0rem | 24px | Regular (400) | Standard body paragraphs & descriptions |
| `Body/S` | 14px / 0.875rem | 20px | Regular (400) | Supporting notes, metadata, table rows |
| `Label/L` | 14px / 0.875rem | 18px | Medium (500) | Button labels, navigation links |
| `Label/S` | 11px / 0.6875rem | 14px | SemiBold (600) | Status tags, category badges |

---

## 4. Spacing, Layout & Elevation

UX4G divides spacing into 4 functional semantic axes:

- **`Inline/*`:** Horizontal spacing between inline elements (e.g. icon and text: 8px, button groups: 12px–16px).
- **`Stack/*`:** Vertical spacing between stacked elements within a block (e.g. title to text: 8px–12px).
- **`Section/*`:** Vertical rhythm between major page sections (48px–64px desktop, 32px–40px mobile).
- **`Padding/*`:** Internal container padding (Cards: 24px desktop, 16px mobile; Hero: 48px–64px).

### Elevation Matrix

AIRE enforces subtle, crisp elevation. Heavy blurred drop-shadows are prohibited.

- **Level 0 (Flat):** `0 0 0 0` — Standard cards on bordered neutral canvas.
- **Level 1 (Subtle):** `0 1px 2px 0 rgba(0, 0, 0, 0.05)` — Interactive card resting state.
- **Level 2 (Hover/Focus):** `0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)` — Card hover state.

---

## 5. Component Standards & Reusable Architecture

AIRE implements a clean component layer (`client/src/components/aire/`) that isolates presentation, applies UX4G CSS classes, and keeps business content distinct.

| AIRE Component | UX4G Source / Pattern | Role & Behavior |
|---|---|---|
| `AireUtilityHeader` | Government Utility Strip | Accessibility controls (Font size A-/A/A+, high contrast, skip link), language indicator. |
| `AireNavbar` | `ux4g-navbar` | AIRE wordmark, primary navigation links, responsive mobile drawer, sign-in CTA. |
| `AireHero` | Editorial Hero | Aadhaar-inspired institutional composition with headline, lead text, primary/secondary CTAs, and verification ledger graphic. |
| `ServiceCard` | `ux4g-card` | Accessible service category cards with icon, badge, description, and action link. |
| `ProcessStep` | `ux4g-stepper` | 4-stage sequential workflow demonstrating admission data intake, validation, reconciliation, and audit trail. |
| `Accordion` | `ux4g-accordion` | Keyboard-navigable collapsible FAQ panels with ARIA expanded states and icon rotation. |
| `Button` | `ux4g-btn-primary`, `outline-primary` | Accessible action buttons with 44px touch targets and visible focus ring. |
| `Badge` | `ux4g-tag-*` | Status tags for service readiness, security categories, and workflow states. |
| `AireFooter` | `ux4g-footer-*` | Multi-column institutional footer with quick links, legal/privacy notices, helpdesk contacts, and standard disclaimer. |

---

## 6. Accessibility & Compliance Requirements (WCAG 2.2 AA)

1. **Color Contrast:** Body copy on white/neutral backgrounds maintains $\ge 7:1$ contrast (exceeding the 4.5:1 requirement). Secondary text maintains $\ge 4.5:1$.
2. **Keyboard Navigation:** All interactive elements (`<button>`, `<a>`, `<input>`) are fully accessible via `Tab` and `Enter`/`Space`.
3. **Visible Focus Rings:** All interactive controls display a crisp 2px primary focus ring (`Focus/Outline`) with a 2px offset.
4. **Skip to Main Content:** Accessible link rendered as the first focusable DOM element, targeting `#main-content`.
5. **Heading Hierarchy:** Strict monotonic hierarchy (`h1` for hero banner, `h2` for section titles, `h3`/`h4` for sub-panels). No skipped heading levels.
6. **Touch Targets:** All interactive buttons and links satisfy a minimum clickable area of 44×44px on mobile viewports.
7. **Screen Reader Landmarks:** Correct semantic HTML elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<footer>`) with explicit `aria-label` landmarks where applicable.

---

## 7. Responsive Breakpoint Rules

| Mode | Viewport Width | Layout & Columns |
|---|---|---|
| **Mobile** | 320px – 767px | Single column (1 col), full-width cards, collapsible hamburger menu, 16px page margin. |
| **Tablet** | 768px – 1023px | 2-column service grid, stacked hero with adjusted typography, 24px page margin. |
| **Laptop / Desktop** | 1024px – 1439px | 3-column service grid, 4-step horizontal process flow, side-by-side hero layout, 32px page margin. |
| **Desktop XL** | $\ge 1440px$ | Max content width capped at 1280px, centered container. |

---

## 8. Prohibited Design Patterns

- **No Generic AI SaaS Templates:** Avoid floating decorative blobs, purple-to-pink gradient meshes, or neon cards.
- **No Fabricated Seals or National Emblems:** Do not display the State Emblem of India (Ashoka Lion Capital) or unauthorized official seals unless provided and legally cleared.
- **No Fake Compliance or Data Claims:** Do not display fabricated student counts, fake testimonials, or unsubstantiated regulatory badges.
- **No Direct Frontend-to-Database Patterns:** All portal actions must be represented as secure institutional authenticated boundaries.
- **No Unlabeled Interactive Elements:** All icon buttons and interactive toggles must have explicit `aria-label` attributes.
