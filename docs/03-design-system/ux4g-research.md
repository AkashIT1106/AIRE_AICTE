# UX4G Research Notes (AIRE)

| Metadata  | Value                                                                           |
| --------- | ------------------------------------------------------------------------------- |
| Document  | `docs/03-design-system/ux4g-research.md`                                        |
| Status    | `RESEARCH SNAPSHOT`                                                             |
| Retrieved | 3 November 2026                                                                 |
| Authority | Official UX4G sites listed below. Not a mandate to copy UX4G visuals into AIRE. |

UX4G is used as **proven interaction and service-design patterns**. AIRE visual identity and `client/design-tokens.json` remain canonical.

## 1. Official sources used

| Source                                                                                                                                                                     | Retrieved             | Notes                                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [https://www.ux4g.gov.in/](https://www.ux4g.gov.in/)                                                                                                                       | Yes                   | UX4G Design System v3.0. 50+ components, DPDP/GIGW/DARPG claims on marketing pages. npm + Figma + Storybook mentioned.                                                   |
| [https://www.ux4g.gov.in/components](https://www.ux4g.gov.in/components)                                                                                                   | Yes                   | Categories: Form Elements (18), Feedback (13), Data Display (17), Navigation (9), Others (2). States WCAG **2.1 AA**, keyboard, 4.5:1 contrast.                          |
| [https://www.ux4g.gov.in/patterns](https://www.ux4g.gov.in/patterns)                                                                                                       | Yes                   | Pattern groups P-01..P-09 (identity, consent, application, status, payments, search, dashboard, notifications, feedback).                                                |
| [https://www.ux4g.gov.in/get-started](https://www.ux4g.gov.in/get-started)                                                                                                 | Yes                   | Pillars: Foundations, Components, Patterns, Accessibility. Designer / Developer / Build with AI tracks.                                                                  |
| [https://www.ux4g.gov.in/site-map](https://www.ux4g.gov.in/site-map)                                                                                                       | Partial               | Get Started links only in fetched snapshot.                                                                                                                              |
| [https://www.ux4g.gov.in/get-started/for-developers](https://www.ux4g.gov.in/get-started/for-developers)                                                                   | **Failed (HTTP 500)** | UNVERIFIED developer setup page.                                                                                                                                         |
| [https://doc.ux4g.gov.in/](https://doc.ux4g.gov.in/)                                                                                                                       | Partial               | Home fetch returned **403**. Search snippets and some `/components/*.php` pages retrieved. Docs resemble Bootstrap-class APIs (`.btn`, `.alert`, `.table`, `data-bs-*`). |
| [https://web.ux4g.gov.in/?path=/story/getting-started-quick-start-guide--quick-start](https://web.ux4g.gov.in/?path=/story/getting-started-quick-start-guide--quick-start) | **Failed (HTTP 403)** | Storybook UNVERIFIED in this session.                                                                                                                                    |
| [npm `ux4g-web-components` 3.0.2](https://www.npmjs.com/package/ux4g-web-components)                                                                                       | Yes                   | Official `ux4g.npm` package: CSS bundle + runtime, 53 components, tokens, dark mode. Companion: `ux4g-react-native-components`.                                          |

## 2. Relevant components and patterns (verified at overview level)

From the official component index and npm keyword list (per-component keyboard specs beyond marketing copy are **UNVERIFIED** unless noted from `doc.ux4g.gov.in` PHP pages):

**Forms:** button, icon-button, button-group, input, select, checkbox, radio, switch, textarea, form-field-group, file-upload, search, OTP, date-time.

**Feedback:** alert, toast/feedback, spinner, progress-indicator, empty-state, draft-status, tooltip.

**Data display:** table, card, badge/chip/tag, accordion, tabs, stepper, pagination, timeline-equivalent status pipeline.

**Navigation:** breadcrumb, navbar, drawer, dropdown, skip/accessibility controls (accessibility bar listed in third-party summaries; official page “Others: Accessibility and identity verification” **UNVERIFIED detail**).

**Verified from PHP docs (when fetch succeeded via search cache):**

- Buttons: native `<button>` preferred; colour is not meaning for AT; disabled needs `disabled` / `aria-disabled` on anchors.
- Forms: visible labels; `aria-describedby` for helper text; placeholder is not a label.
- Modal: `aria-labelledby` to title; optional `aria-describedby`; one modal at a time; no nested modals.
- Tables: opt-in `.table`; colour-only status forbidden; wrap in responsive container for overflow.
- Button group: `role="group"` or `toolbar` plus accessible name.
- Dropdown: click to open, not hover; authors must add ARIA themselves (UX4G does not auto-apply menu roles).
- Navbar: `nav` landmark or `role="navigation"`; `aria-current="page"` for current item.

**Patterns useful to AIRE (P-03, P-04, P-06, P-08, P-09):** staged application/submission, validation and acknowledgement, status/timeline/SLA, search with no-results, in-app notifications, clear error messaging.

## 3. UX4G-to-AIRE mapping

| UX4G                             | AIRE decision                                                                           |
| -------------------------------- | --------------------------------------------------------------------------------------- |
| Semantic tokens + theming        | Keep AIRE DTCG tokens. Do not import UX4G colour CSS.                                   |
| WCAG 2.1 AA marketing            | AIRE target remains WCAG **2.2 AA** (`AIRE-REQ-065`). Do not claim either is certified. |
| Visible focus, keyboard path     | Implement with 2px ring + 2px offset, teal `#0F766E`.                                   |
| Status never colour-only         | Status badge/indicator always includes text label + icon.                               |
| Modal focus and single dialog    | Radix Dialog (already in repo).                                                         |
| Responsive tables                | Horizontal scroll wrapper + compact/standard row tokens.                                |
| File upload / validation summary | Presentational AIRE compositions, not citizen document-upload kits.                     |
| Status pipeline / stepper        | Submission timeline + stepper primitives.                                               |
| Skip link / landmarks            | Skip link + existing AppShell banner/nav/main/contentinfo.                              |
| npm CSS/runtime                  | **Do not install.** See exclusions.                                                     |

## 4. Patterns that should NOT be applied to AIRE

| Exclusion                                                       | Why                                                                                                                                         |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `ux4g-web-components` CSS/JS runtime                            | Conflicts with Tailwind/Radix; ships UX4G tokens/fonts; large CSS; not token-compatible with AIRE.                                          |
| Third-party `ux4gdesign-react-core`                             | Not on official `ux4g.npm` account; maturity mixed; extra UI library.                                                                       |
| Aadhaar / PAN / OTP / biometric capture                         | Identity capture is out of AIRE UI scope; vault/adapters own identity.                                                                      |
| Citizen payment / UPI / CSC patterns (P-05)                     | AIRE is not a payments portal.                                                                                                              |
| Accessibility widget overlay / A− A A+ widget as product chrome | Existing identity-band widgets are not this library; do not add unauthenticated font scalers that look official without a product decision. |
| Dark mode theme from UX4G                                       | AIRE ships a light institutional workbench. Dark theme is OPEN (not in this task).                                                          |
| Bootstrap `data-bs-*` APIs                                      | AIRE uses React + Radix.                                                                                                                    |
| Grievance escalation trees, slot booking, carousel              | Not AIRE workflows.                                                                                                                         |
| Copying UX4G indigo/gradient marketing visuals                  | Would erase AIRE navy/teal identity.                                                                                                        |
| Declaring GIGW 3.0 / DPDP “handled by UX4G”                     | Legal/compliance claims require evidence; UX4G marketing is not AIRE certification.                                                         |

## 5. Implementation decisions

1. Three layers: Foundations (tokens/CSS) → Primitives (`components/ui`, `forms`, `feedback`) → AIRE workflow compositions (`components/workflow`), presentational only.
2. Reuse existing Radix/shadcn primitives; add missing Radix packages only for radio, tabs, accordion, tooltip, progress.
3. Toast is a small live-region primitive (no Sonner). Drawer is a side Dialog (no extra drawer library).
4. Showcase at `/design-system` stays inside the authenticated shell.
5. Later page migration is documented, not executed.

## 6. Verified vs AIRE-specific

| Item                                                               | Classification                                     |
| ------------------------------------------------------------------ | -------------------------------------------------- |
| Component category counts and WCAG 2.1 AA statement on ux4g.gov.in | Verified from official site                        |
| Per-component keyboard matrices, exact dimensions, token values    | **UNVERIFIED** (Storybook 403, developer page 500) |
| Official npm CSS package exists                                    | Verified                                           |
| AIRE navy/action/teal/canvas palette                               | AIRE-specific (authoritative tokens)               |
| Compact 36px / standard 44px rows                                  | AIRE-specific                                      |
| Inter + JetBrains Mono                                             | AIRE-specific                                      |
| Workflow compositions (quarantine, quota, audit)                   | AIRE-specific                                      |

## 7. Research limitations

- `doc.ux4g.gov.in` and Storybook were often 403 from this environment.
- Component catalogue pages under `/components/{category}` 404 (e.g. `/components/form-elements`).
- Handbook chapter numbers cited in older AIRE mapping docs could not be re-verified against a live handbook URL in this session; treat those chapter cites as **UNVERIFIED**.
- npm README is a component inventory, not interaction specs.
