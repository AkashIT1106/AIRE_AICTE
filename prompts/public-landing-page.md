# Task Prompt: AIRE Public Landing Page at `/`

| Metadata  | Value                                                                                         |
| --------- | --------------------------------------------------------------------------------------------- |
| Status    | `COMPLETED`                                                                                   |
| Date      | 3 November 2026                                                                               |
| Scope     | Public Landing Page at `/`, UX4G utility header, role pathways, verification stepper, footer |
| Non-goals | Modifying auth backend, database models, RLS policies, or operational workflow pages          |

## Goal

Implement the public-facing landing page at `/` for AIRE (AICTE Institutional Records & Verification Engine), visually inspired by the provided reference while applying AIRE's strict design tokens (`DESIGN.md`, `client/design-tokens.json`), UX4G government design standards, NN/g cognitive design heuristics, and Apple design principles (clarity, deference, depth, subtle elevation).

## Sources

- User uploaded reference mockup: `.user_uploaded/media_1793706931277_589c66de.jpg`
- `DESIGN.md`: AIRE Visual Direction, Canonical Color Palette, Anti-Slop Dials
- `client/design-tokens.json`: Canonical DTCG 2025.10 tokens
- `docs/03-design-system/README.md`: Design system guidelines and WCAG 2.2 AA contrast rules
- UX4G guidelines: Official bilingual institutional header, accessibility bar (font scaling, high contrast / dark mode toggle, skip link), persona cards
- NN/g heuristics: F-pattern layout, recognition over recall, explicit linear mental model (6-step verification flow)
- Apple design psychology: Restrained elevation, crisp typography hierarchy, subtle border definitions, polished mockup card with live visual feedback

## Inspected Code & Assets

- `client/src/App.tsx`: Centralized route definition using `createBrowserRouter`
- `client/src/pages/RootGateway.tsx`: Currently redirects unauthenticated users to `/login`
- `client/src/pages/auth/LoginPage.tsx`: Standalone authentication page with government header band
- `client/public/assets/aicte-logo.png`: Official AICTE emblem asset
- `client/src/components/ui/*`: Existing Radix/shadcn UI library (Button, Badge, Card, etc.)

## Assumptions

1. The landing page is public and mounted at `/` without requiring authentication.
2. If a user is authenticated, the landing page navigation adapts to provide a direct "Go to Workspace" action, while unauthenticated users see "Sign in to AIRE" directing to `/login`.
3. The visual mockup is treated as structural and thematic direction: AIRE tokens and typography hierarchy are strictly preserved without introducing neon colors, raw Tailwind colors, or arbitrary hex values.
4. The 4 persona pathway cards ("For Institutions", "For AICTE Reviewers", "For Students", "For Auditors") route directly to `/login` (with prefilled or role-appropriate intent) or relevant information modals/anchors.
5. Interactive features include:
   - UX4G accessibility bar: Skip to content, font-size adjustment (A- / A / A+), dark mode toggle, and language indicator.
   - Smooth anchor navigation to sections ("How It Works", "About AIRE", "Why AIRE").
   - Responsive design from 320px mobile to 1440px+ desktop.

## Affected Modules

- `client/src/pages/LandingPage.tsx`: New component containing the landing page.
- `client/src/components/layout/PublicHeader.tsx`: UX4G bilingual accessibility bar + AIRE navigation header.
- `client/src/components/layout/PublicFooter.tsx`: Statutory government portal footer with policy links.
- `client/src/App.tsx`: Route `/` points to `LandingPage`, maintaining workspace security and routing.
- `client/src/App.test.tsx`: Tests updated to cover landing page rendering at `/` and login page at `/login`.

## Security, Privacy & Data Implications

- Purely public presentational view. No access to protected tenant databases or student PII.
- No confidential credentials or unmasked data displayed.
- WCAG 2.2 AA compliant contrast and keyboard accessibility.

## Acceptance Criteria

1. Route `/` displays the full AIRE public landing page:
   - UX4G top bar (Ashoka/Govt of India + AICTE identity, accessibility controls: skip link, font scaling, theme toggle).
   - Navigation header with AIRE logo, navigation links, and "Sign in to AIRE" CTA.
   - Hero section with badge ("An AICTE Digital Initiative"), headline, subtitle, dual CTAs ("Sign in to AIRE" & "How AIRE Works").
   - Hero illustration/card depicting the AIRE submission workflow with status badges ("24,860 Records Validated", "128 Issues to Review") and architectural motif.
   - 4 role-based pathway cards ("For Institutions", "For AICTE Reviewers", "For Students", "For Auditors").
   - 6-step linear verification journey ("1. Prepare Records" -> "2. Upload a Batch" -> "3. Validate Data" -> "4. Review Issues" -> "5. Submit Records" -> "6. Track Status").
   - "Why use AIRE?" 5-pillar benefit section.
   - Pre-footer CTA banner ("Get started with AIRE").
   - Complete statutory footer with organizational links, policies, and AICTE support notice.
2. All styling adheres strictly to `client/design-tokens.json` semantic tokens (`bg-surface-canvas`, `bg-surface-card`, `text-txt-primary`, `text-brand-teal`, `border-line-default`, etc.).
3. Fully responsive across mobile, tablet, and desktop viewports.
4. Zero regressions in client test suite (`pnpm --filter @aire/client test`) and typecheck.

## Checks

- `pnpm --filter @aire/client typecheck`
- `pnpm --filter @aire/client test`
- `pnpm --filter @aire/client build`
