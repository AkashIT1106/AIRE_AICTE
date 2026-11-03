# Task Prompt: UX4G-inspired AIRE Design System Library

| Metadata  | Value                                                                                       |
| --------- | ------------------------------------------------------------------------------------------- |
| Status    | `IN PROGRESS`                                                                               |
| Date      | 3 November 2026                                                                             |
| Scope     | Design-system foundations, primitives, presentational workflow compositions, showcase route |
| Non-goals | Page redesigns, backend/DB/auth/authorization/business workflow changes                     |

## Goal

Reconstruct a production-quality, UX4G-inspired design system **inside AIRE's existing stack**, preserving AIRE tokens and identity. Integrate an interactive showcase at `/design-system`. Use UX4G as interaction and service-design patterns, not a visual clone or npm CSS takeover.

## Sources

- `docs/README.md`, `docs/00-governance/documentation-map.md`, `docs/00-governance/source-of-truth-policy.md`
- `docs/03-design-system/*`, `client/design-tokens.json`
- Official UX4G: https://www.ux4g.gov.in/, `/components`, `/patterns`, `/get-started`, `/site-map`, https://doc.ux4g.gov.in/ (partial 403), npm `ux4g-web-components@3.0.2`
- Skills: shadcn, vercel-react-best-practices, zod, antislop (+ ui/human/layoutmobile), accessibility

## Inspected code (verified)

- Client: Vite 6, React 18.3, Tailwind 3.4, Radix + shadcn under `client/src/components/ui/`, Lucide, RHF + Zod
- Tokens: `client/design-tokens.json` (DTCG 2025.10) synced via `pnpm run build:tokens`
- Showcase already routed: `/design-system` inside `AuthenticatedShellLayout`
- Missing primitives: radio, tabs, accordion, tooltip, drawer, table, pagination, progress, toast, search, file upload, stepper, skip link, workflow compositions
- Do **not** adopt `ux4g-web-components` (CSS/runtime bundle, Bootstrap-era docs, conflicts with Tailwind/Radix, would replace AIRE tokens)

## Assumptions

- UX4G details not in reachable official pages are `UNVERIFIED`.
- Showcase demo data is fictional and labelled as such. No real student PII.
- Focus ring maps to teal `#0F766E` per explicit product token list (updates alias currently pointing at action blue).
- Design-system route remains in the authenticated shell (auth boundary preserved).

## Security / privacy

- Presentational components only. No backend, no unmasked PII, no auth bypass.
- Status never colour-only.

## Acceptance criteria

1. Research docs under `docs/03-design-system/` with sources, mapping, exclusions, migration notes.
2. Three layers: foundations, primitives, AIRE workflow compositions.
3. Semantic tokens only in components; token sync via `build:tokens`.
4. Interactive showcase covering foundations, states, forms, feedback, navigation, data, workflows, empty/loading/error.
5. Applicable client typecheck, lint, unit tests, and build run honestly.
6. No unrelated page/backend changes.

## Checks

- `pnpm --filter @aire/client typecheck`
- `pnpm --filter @aire/client test`
- `pnpm --filter @aire/client build`
- `pnpm lint` (oxlint) if feasible
- Browser exercise of `/design-system` if tools available
