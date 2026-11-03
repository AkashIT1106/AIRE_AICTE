# Task Prompt: AIRE Public Landing Page Visual Quality Redesign & High-End Illustration Pass

## 1. Goal
Elevate the AIRE public landing page from a generic, repetitive SaaS-like layout into an authoritative, art-directed institutional digital service experience inspired by UIDAI (Aadhaar) and iGOT Karmayogi portals. Introduce original high-craft SVG vector illustrations, eliminate visual monotony and excessive purple badges, apply restrained glassmorphism, and maintain 100% adherence to UX4G Design System v3.0 contracts and WCAG 2.2 AA accessibility.

## 2. Authoritative Sources & References
- `AGENTS.md` (Operating Manual, design tokens, UX4G governance)
- `docs/03-design-system/` (Design system architecture, tokens, accessibility rules)
- `docs/design/ux4g-adoption.md` & `docs/design/component-inventory.md`
- Primary visual reference: Current Aadhaar / UIDAI public website (`uidai.gov.in`)
- Secondary visual reference: Current iGOT Karmayogi portal (`igotkarmayogi.gov.in`)
- Component authority: UX4G Design System v3.0 (`ux4g-web-components`)

## 3. Inspected Code & Baseline Evidence
- Captured baseline screenshot: `docs/design/screenshots/original_desktop_1440.png`
- Landing page structure: `client/src/pages/LandingPage.tsx`
- Section components in `client/src/components/aire/`:
  - `AireHero.tsx`, `AireServices.tsx`, `AireWorkflow.tsx`, `AireResponsibleManagement.tsx`, `AireInstitutionalInfo.tsx`, `AireFaq.tsx`, `AirePreFooterCta.tsx`, `AireFooter.tsx`, `AireNavbar.tsx`, `AireUtilityHeader.tsx`
- CSS / Tailwind setup: `client/src/index.css`, `client/tailwind.config.js`

## 4. Skills Consulted
- `.agents/skills/ux4g-design/SKILL.md`
- `antislop`, `antislop-ui`, `antislop-human`, `antislop-copywriting`

## 5. Scope & Non-Goals
### In Scope:
1. Diagnosis and remediation of visual anti-patterns (repetitive card grids, generic purple accents, repetitive eyebrow pills, small crowded text, fake mock cards).
2. Two major custom art-directed SVG vector illustrations:
   - `AireHeroIllustration.tsx`: Institutional Administrative Gateway + Deterministic Verification Matrix + restrained glassmorphism floating badges.
   - `AireSecurityIllustration.tsx`: Multi-tier Security Architecture (Tenant Isolation Walls, Identity Vault, Deterministic Rule Engine, Append-Only Ledger).
3. Section-by-section compositional redesign:
   - Hero: Editorial split layout, authoritative headline, dual CTA, custom hero vector art.
   - Services: Aadhaar-inspired institutional service dossier (categorized/tabbed architecture replacing 4 identical vertical cards).
   - Workflow: iGOT Karmayogi-inspired connected sequential horizontal stepper pipeline with stage progression and verification artifacts.
   - Governance: Editorial split layout with custom security vector illustration.
   - About: Dignified institutional narrative, statutory policy context, and structured platform objectives.
   - FAQ: High-contrast accessible accordion with nodal helpdesk guidance.
   - Pre-Footer CTA: Deep institutional midnight blue canvas with geometric architectural motif (no generic purple gradient).
   - Footer: Structured national portal hierarchy with GIGW/WCAG compliance declarations.
4. Multi-viewport verification (1440px desktop, 1024px tablet landscape, 768px tablet portrait, 390px mobile, 360px small mobile).

### Non-Goals:
- No changes to backend APIs, authentication handlers, database schemas, or Prisma/RLS code.
- No introduction of arbitrary third-party component libraries outside UX4G and Radix/shadcn abstractions.
- No fake vanity statistics or unverified official partnerships.

## 6. Acceptance Criteria
- Full compliance with UX4G tokens and semantic CSS classes.
- Zero repetitive 4-card generic SaaS grids.
- Elimination of repetitive purple pill tags on every heading.
- High-craft, bespoke SVG illustrations that scale cleanly without blur or expensive filter lag.
- WCAG 2.2 AA contrast compliance (minimum 4.5:1 body text, 3:1 UI boundaries).
- Responsive fidelity across 1440px, 1024px, 768px, 390px, 360px without horizontal overflow.
- Verifiable before-and-after screenshot evidence.
