# AIRE Design System & Visual Direction

**Document status:** Proposed design contract  
**Version:** 1.0  
**Product:** AIRE — Institutional Records & Verification Engine  
**Primary reference system:** UX4G Design System 3.0  
**Audience:** Product designers, frontend engineers, UX reviewers, accessibility reviewers, and AI coding agents

> This document defines AIRE's product-specific visual language and interaction rules. UX4G remains the primary government-service design-system reference. AIRE-specific decisions in this document customise the brand and page compositions; they do not replace UX4G's documented component behaviour, accessibility requirements, or official guidance.

---

## 1. Product design intent

AIRE is an institutional student-record management, admission reconciliation, validation, verification, and regulatory workflow platform. It must feel like a carefully governed public-sector digital service—not a startup landing-page template, an analytics dashboard, or an AI-generated marketing site.

The interface must communicate:

- Institutional credibility without pretending to be an officially endorsed or certified government service unless that status is formally authorised.
- Accurate distinction between uploaded, ingested, staged, quarantined, sealed, reconciled, and approved records.
- Clear responsibilities and next actions for institutions, reviewers, students, auditors, and administrators.
- Privacy, access control, and auditability through accurate descriptions of implemented controls.
- Confidence through clarity, predictable interaction, readable content, and visible system feedback—not through decorative security imagery or unsupported claims.

### 1.1 Design principles

1. **Clarity before decoration.** Typography, layout, content, and hierarchy do the primary work. Colour, illustration, blur, and motion are supporting tools.
2. **Service-first, not marketing-first.** Help visitors understand AIRE and reach the right task quickly.
3. **Evidence over assertion.** Never communicate a verification, approval, security, compliance, or submission state that the backend has not confirmed.
4. **One concept, one name.** Use domain terminology consistently across navigation, forms, tables, notifications, and help content.
5. **Progressive disclosure.** Show the information needed for the current task; reveal complex details when they become relevant.
6. **Accessible by default.** Semantic HTML, keyboard support, focus visibility, accessible names, readable contrast, and assistive-technology announcements are foundational.
7. **Consistency without repetition.** Shared tokens and components provide consistency; pages may use different compositions when their content and user tasks differ.
8. **Respectful of varied devices and contexts.** Design for mobile devices, desktop workstations, keyboard-only use, screen magnification, slower connections, and multilingual content.
9. **Functional restraint.** Do not add a card, badge, icon, chart, animation, or glass panel unless it communicates information or supports an action.
10. **Honest status.** Clearly distinguish prototype, demo, pending, unavailable, failed, staged, sealed, and approved states.

---

## 2. Design authority and reference hierarchy

Use references for specific purposes; do not copy their visual identities wholesale.

| Authority/reference | What AIRE adopts | What AIRE must not copy blindly |
|---|---|---|
| UX4G Design System 3.0 | Indian government-service foundations, documented components, patterns, responsive and accessibility guidance, content design | Default brand colour as AIRE's complete identity; every component regardless of task; unverified package/API details |
| GIGW 3.0 | Government website/app quality, usability, user-centricity, accessibility, cybersecurity and lifecycle considerations | Any claim of GIGW/STQC certification without the relevant evaluation and authorisation |
| UIDAI's redesigned public site | Service-oriented entry points, useful section rhythm, clear help/resources, strong institutional communication | UIDAI branding, logos, exact layouts, content, metrics, or Aadhaar-specific service patterns that do not apply to AIRE |
| iGOT Karmayogi | Large-portal information organisation, content grouping, audience pathways, distinct content bands | Its learning-platform dashboard, statistics, course cards, or visual motifs where irrelevant |
| GOV.UK Design System | Functional colour roles, restrained use of colour, consistent interaction conventions, plain-language service content | UK-specific branding and patterns that do not fit Indian institutional workflows |
| USWDS | Role-based token approach, accessible colour decisions, reusable tokens and component consistency | US federal branding or its exact palette |
| Material Design guidance | Semantic colour roles, state consistency, adaptable component behaviour | Material's visual style as a mandatory AIRE aesthetic |
| Nielsen Norman Group research | Usability heuristics, hierarchy, recognition over recall, feedback, error prevention, user testing | Treating heuristics as a substitute for testing actual AIRE users |

### 2.1 Reference priority when guidance differs

1. Applicable legal, regulatory, security, and accessibility obligations.
2. Current official UX4G 3.0 documentation and GIGW 3.0 guidance.
3. AIRE's approved domain rules, user journeys, and backend contracts.
4. AIRE design tokens and component contracts.
5. Other design-system references and visual inspiration.
6. Individual designer or agent preference.

An agent must record unresolved conflicts rather than silently choosing a convenient interpretation.

---

## 3. Brand personality and visual direction

### 3.1 Brand attributes

AIRE is:

- **Institutional:** composed, credible, structured.
- **Contemporary:** current and well-crafted, but not trend-driven.
- **Human:** readable, understandable, and respectful.
- **Precise:** clear about data, records, workflow states, and responsibility.
- **Quietly confident:** visual emphasis is deliberate, not loud.

AIRE is not futuristic, playful, neon, crypto-inspired, AI-themed, or luxury-fintech-inspired.

### 3.2 Visual concept: “Civic clarity”

Use a visual language built from:

- Deep blue/blue-green institutional anchors.
- Warm, near-white neutral canvases.
- Teal as a restrained supporting accent for verified/positive information and selected brand moments.
- A muted brass/saffron accent for occasional editorial emphasis—not for generic decoration or all primary buttons.
- Strong typography and open page composition.
- Fine, purposeful rules and borders.
- Custom, concept-specific vector graphics.
- Limited translucent/glass surfaces in selected illustrative layers only.

Do not use the Indian tricolour as a repeating decorative palette. Do not use saffron, white, and green as a shortcut for institutional credibility. National identity assets may only be used when supplied or approved for the project and legally appropriate.

---

## 4. AIRE colour system

The palette below is the proposed AIRE brand palette. It is deliberately distinct from UX4G's default purple-led visual identity while remaining compatible with UX4G's documented primary-colour theming approach. Confirm the exact integration mechanism against the current UX4G developer documentation before implementation.

### 4.1 Core brand palette

| Token | Hex | Role | Usage |
|---|---|---|---|
| `aire-brand-950` | `#142C3D` | Deep ink navy | Main dark surfaces, footer, strong headings on light surfaces, illustration outlines |
| `aire-brand-900` | `#19384E` | Institutional navy | Header treatments, dark section surfaces, active navigation backgrounds when appropriate |
| `aire-brand-800` | `#24536F` | Primary action blue | Primary buttons, important links, selected controls, focus-related brand accents |
| `aire-brand-700` | `#2B6685` | Supporting blue | Secondary emphasis, selected illustration details, links where contrast is verified |
| `aire-teal-800` | `#075E58` | Deep teal | Secondary accent, selected positive/verification emphasis, illustration details |
| `aire-teal-700` | `#08736A` | Teal | Supporting icon/accent use; not a universal success colour |
| `aire-brass-800` | `#8B4F16` | Muted warm accent | Small editorial highlights, limited warm emphasis, selected decorative vector details |

**Primary interaction colour:** `aire-brand-800` (`#24536F`).  
**Deep institutional colour:** `aire-brand-950` (`#142C3D`).  
**Supporting accent:** `aire-teal-800` (`#075E58`).  
**Warm accent:** `aire-brass-800` (`#8B4F16`).

Do not use all four colours with equal prominence. The brand should be recognised primarily through navy/blue, neutral surfaces, and restrained teal.

### 4.2 Neutral and surface palette

| Token | Hex | Role | Usage |
|---|---|---|---|
| `aire-neutral-0` | `#FFFFFF` | White | Main content surface, cards, forms |
| `aire-neutral-25` | `#FBFCFC` | Soft white | Optional subtle section transition |
| `aire-neutral-50` | `#F5F7F7` | Page canvas | Default public page and workspace background |
| `aire-neutral-100` | `#EEF3F3` | Subdued surface | Alternate section, inset panel, table header |
| `aire-neutral-150` | `#E7ECEE` | Divider | Section separators and subtle rules |
| `aire-neutral-200` | `#D8E0E3` | Default border | Inputs, cards where a boundary is needed, tables |
| `aire-neutral-300` | `#AAB7BE` | Strong border | Selected/structural boundaries; use sparingly |
| `aire-neutral-600` | `#536474` | Secondary text | Supporting text, metadata, helper copy |
| `aire-neutral-800` | `#1D2935` | Primary text | Body copy and headings |

### 4.3 Tinted surfaces

| Token | Hex | Usage |
|---|---|---|
| `aire-blue-50` | `#EAF1F5` | Informational panel, selected navigation, illustration backing |
| `aire-teal-50` | `#E7F2EF` | Positive/verification-related subdued surfaces |
| `aire-warm-50` | `#F6EFE4` | Occasional warm editorial surface |
| `aire-lilac-50` | `#F1EFF8` | Optional low-frequency resource/secondary surface only |

Lilac is optional and must remain a minor supporting surface. It must not turn AIRE into a purple-first brand.

### 4.4 Semantic state colours

Status colours are functional and must not be repurposed as decorative brand colours.

| Semantic token | Foreground | Subdued background | Meaning |
|---|---|---|---|
| `state-success` | `#176B45` | `#E7F2EC` | Completed, passed, verified when confirmed by system |
| `state-warning` | `#8A4D0A` | `#F8F0E5` | Attention required, nearing deadline, non-blocking issue |
| `state-error` | `#B42318` | `#FCEDEB` | Failed, rejected, blocking validation error |
| `state-info` | `#245B78` | `#EAF1F5` | Informational guidance or neutral system notice |
| `state-pending` | `#536474` | `#EEF3F3` | Waiting, not yet processed, or not yet decided |

Every state must also include a text label and, where useful, a shape/icon cue. Never communicate state by colour alone. “Validated” must not mean “AICTE approved”; status names must follow AIRE's domain dictionary.

### 4.5 Contrast guardrails

The following foreground/background combinations have been calculated using the WCAG relative-luminance contrast formula. Values are for the specified solid colours, not translucent overlays.

| Foreground | Background | Approx. contrast | Use |
|---|---|---:|---|
| `#24536F` | `#FFFFFF` | 8.26:1 | Primary button/link text on white where used as foreground |
| `#075E58` | `#FFFFFF` | 7.63:1 | Teal text/icon on white |
| `#8B4F16` | `#FFFFFF` | 6.51:1 | Brass text/icon on white |
| `#142C3D` | `#FFFFFF` | 14.41:1 | Navy text on white |
| `#1D2935` | `#F5F7F7` | 13.75:1 | Main text on canvas |
| `#536474` | `#FFFFFF` | 6.10:1 | Secondary text on white |
| `#176B45` | `#E7F2EC` | 5.68:1 | Success text on success surface |
| `#8A4D0A` | `#F8F0E5` | 5.91:1 | Warning text on warning surface |
| `#B42318` | `#FCEDEB` | 5.78:1 | Error text on error surface |
| `#245B78` | `#EAF1F5` | 6.47:1 | Info text on info surface |

These values do not automatically certify a complete component. Test actual text, icon, border, focus, hover, disabled, selected, and translucent states. Normal text should meet at least 4.5:1; large text at least 3:1. Non-text controls and meaningful graphical boundaries must meet the applicable WCAG contrast requirements.

### 4.6 Colour distribution

Use the following as an approximate page-level visual balance, not a rigid mathematical rule:

- 75–85% neutral/white surfaces.
- 10–18% brand blue/navy surfaces, links, and interaction areas.
- 3–7% supporting teal and warm accent details combined.
- Semantic state colours only where actual status information requires them.

Do not make every section colourful. Do not create a different accent colour for every service card.

### 4.7 Colour usage rules

- Primary buttons use the primary blue with white text.
- Secondary buttons use a white/neutral surface, clear border, and primary-colour text.
- Text links use the primary blue and a visible hover/focus treatment.
- Teal is a supporting accent, not a second primary action colour everywhere.
- Brass is for sparse emphasis only; do not use it for warnings unless it is the semantic warning token.
- Large dark navy surfaces are reserved for the header/footer or one important CTA section—not every section.
- Do not place long body text over tinted, patterned, photographic, or translucent backgrounds unless contrast and readability are verified.

---

## 5. Typography and content design

### 5.1 Typeface

Use **Noto Sans** as the primary interface typeface. It is appropriate for English and Indic-script interfaces and is the documented UX4G typography direction. Use the relevant Noto Sans language/script font subsets when multilingual content is introduced. Do not assume one downloaded font file covers every Indic script.

Use a system sans-serif fallback stack. Avoid loading several competing font families. Do not use a fashionable display font that makes government-service content harder to read.

### 5.2 Type scale

| Token | Desktop | Mobile | Weight | Line-height | Usage |
|---|---:|---:|---:|---:|---|
| `display` | 52px | 38px | 600 | 1.08–1.15 | Public hero only |
| `h1` | 36px | 30px | 600 | 1.15 | Page title |
| `h2` | 28px | 24px | 600 | 1.2 | Major section |
| `h3` | 22px | 20px | 600 | 1.25 | Subsection |
| `h4` | 18px | 18px | 600 | 1.35 | Panel heading |
| `body-lg` | 18px | 17px | 400 | 1.6 | Lead paragraph |
| `body` | 16px | 16px | 400 | 1.55–1.65 | Main copy |
| `body-sm` | 14px | 14px | 400 | 1.5 | Supporting copy |
| `label` | 14px | 14px | 500–600 | 1.4 | Form labels |
| `meta` | 12px | 12px minimum | 400–500 | 1.45 | Metadata only |

Do not use 10–11px text for important content, navigation, table values, status labels, or helper text. Dense enterprise data may use 13–14px only when legibility is confirmed at actual device sizes and zoom.

### 5.3 Content width and writing

- Body paragraphs: aim for 55–75 characters per line on desktop.
- Lead text: keep to a comfortable 2–4 lines in the hero.
- Use sentence case, not all-caps headings.
- Prefer plain, direct Indian English.
- Explain specialist terms the first time they appear.
- Avoid marketing language such as “revolutionary”, “seamless”, “next-generation”, “AI-powered” unless it is factually relevant and approved.
- Do not use unexplained abbreviations such as EOA, APAAR, AISHE, or RLS in citizen-facing copy. Expand or explain them at first use.
- Keep English as the initial language only if that is the approved launch scope; architect content for translation and script expansion.

---

## 6. Layout, grid, spacing, and geometry

### 6.1 Spacing scale

Use a 4px base rhythm. Prefer these spacing tokens:

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120px`.

Use 2px adjustments only for optical alignment or fine component details. Do not create arbitrary one-off spacing values for individual pages.

### 6.2 Page grid

- Maximum public content width: 1200–1280px.
- Wide hero/illustration container: maximum 1320px where needed.
- Main desktop page gutters: 48–64px at wide screens, 32px around 1024px, 24px around tablet, 16–20px on mobile.
- Use a 12-column desktop grid, 8-column tablet grid, and 4-column mobile grid where a grid is useful.
- Align section headings, body copy, illustrations, and card edges to a consistent content grid.
- Do not alternate arbitrary max-widths between adjacent sections.

### 6.3 Section rhythm

- Large desktop section spacing: 80–104px vertical.
- Medium viewport: 64–80px.
- Mobile: 48–64px.
- Content inside a section: 16–32px gaps depending on hierarchy.
- Cards should have internal padding appropriate to content, normally 20–28px; do not inflate small content into oversized cards.

### 6.4 Shape and borders

Use modest radii:

- Small controls: 4–6px.
- Standard components/cards: 8–10px.
- Larger hero/information surfaces: 12–16px.
- Pills: only for genuinely compact statuses or tags.

Avoid making every element a pill or using 24–32px radii throughout the application. Use 1px neutral borders for structure. Reserve stronger borders for active or selected states.

### 6.5 Elevation

Use elevation sparingly:

- Level 0: flat page surfaces.
- Level 1: subtle card separation where borders alone are insufficient.
- Level 2: menus, popovers, dropdowns, and floating panels.
- Level 3: dialogs and important overlays.

Never use a shadow on every card. Do not use glow effects.

---

## 7. Glassmorphism policy

Glassmorphism is a **limited decorative enhancement**, not the core component style.

Permitted locations:

- One or two information layers within the hero illustration.
- A small overlay panel in a custom vector scene, if it adds meaning.
- A floating navigation surface only if readability and contrast are maintained.

Rules:

- Use a light, near-opaque surface; default opacity should remain high enough for reliable reading (normally 88–96%).
- Use modest blur (approximately 8–14px) only when a visible background exists behind the surface.
- Use a subtle border and no luminous outer glow.
- Text and controls must meet contrast requirements against the actual composited background.
- Provide a solid-surface fallback when `backdrop-filter` is unsupported or reduced effects are preferred.
- Never apply glass to every card, table, form, navigation item, or section.
- Do not put dense regulatory or student information on a moving or highly textured backdrop.

The default AIRE card is a solid surface with a neutral border—not a glass panel.

---

## 8. Illustration and visual asset direction

### 8.1 Illustration concept

Use **bespoke editorial vector illustration** to explain AIRE's domain: institutional records, document preparation, structured validation, discrepancy resolution, audit trails, and submission lifecycle.

Preferred visual language:

- Clean geometric vector forms.
- Architectural/document motifs.
- Layered sheets, ledgers, structured rows, seals-as-abstract-check-marks (not official emblems), connectors, and workflow paths.
- Controlled line weights.
- Restrained tonal depth.
- Large quiet areas and intentional negative space.
- A small palette derived from AIRE tokens.
- Isometric or shallow perspective only when it improves explanation.
- Consistent geometry and lighting across all illustrations.

### 8.2 Hero illustration

Create one deliberate composition, not a collage of unrelated widgets.

Suggested scene:

- An institutional record ledger or document stack anchors the composition.
- Individual record sheets pass through clearly represented validation stages.
- A central verification structure connects the records to an audit/evidence trail.
- One selected record has a clear, non-governmental verification mark.
- Thin connector paths show movement through the process.
- A few supporting data panels may float in front of the scene, but they must be clearly attached to the illustration and use real AIRE terminology.
- The illustration should feel like a polished editorial vector graphic, not a screenshot of a fake dashboard.

Do not show fake counts, fake institutions, fake approved records, fake signatures, fake official seals, or fictitious system states.

### 8.3 Asset rules

- Prefer authored SVG/React SVG for concept-specific artwork.
- SVG must be responsive, cleanly structured, and optimised.
- Decorative SVG must be hidden from assistive technology; meaningful SVG must have an accessible name or adjacent text description.
- Use supplied/approved institutional logos only.
- Do not generate generic people illustrations, random 3D cubes, floating laptops, random network nodes, or stock-like AI artwork.
- Do not use emojis as interface icons.
- Use one documented icon family. If UX4G's Material Design Icons are used, keep icon sizing and alignment consistent with its documented 24px slot. Do not mix several icon packs.

---

## 9. Public landing page: exact visual specification

The public landing page is a service-oriented institutional portal. It is not a product-marketing SaaS page and not an authenticated dashboard.

### 9.1 Utility strip

- Compact, approximately 28–32px high on desktop.
- Use a deep navy or neutral institutional surface.
- Include only legitimate accessibility, language, and institutional-context functions.
- Keep the strip informational; do not overcrowd it with decorative symbols.
- Do not display a government ministry or national emblem without authorisation.

### 9.2 Primary navigation

- Approximately 64–76px high.
- AIRE wordmark and a concise product descriptor at the left.
- Clear navigation: About AIRE, How It Works, Services/Workflows, Resources, Help.
- One primary “Institution sign in” action.
- Use a solid white surface with a subtle bottom border. Sticky behaviour is optional and must not obscure content.
- Mobile navigation must be keyboard accessible, announce expanded/collapsed state, trap focus only when implemented as a modal drawer, and restore focus on close.

### 9.3 Hero

- Asymmetric two-column composition: approximately 52% text / 48% visual on wide screens.
- Desktop content width around 1200–1280px.
- Vertical padding approximately 76–104px.
- Background: white or a very subtle neutral tint; do not use a full-bleed gradient.
- Small contextual eyebrow is optional and used once—not repeated above every section.
- Headline: “Student records. Verified with confidence.”
- Supporting copy: explain the actual AIRE purpose in two or three short lines.
- Primary action: “Institution sign in” (or the actual approved authentication destination).
- Secondary action: “How AIRE works”.
- Illustration: original AIRE records-verification vector scene as specified in Section 8.
- At mobile sizes, stack text then illustration; avoid shrinking the entire desktop composition.
- Do not use an autoplay carousel. AIRE has no need for multiple rotating hero promotions at launch.

### 9.4 Service discovery

Create a task-oriented section inspired by UIDAI's service discovery, but use only real AIRE destinations.

Recommended entries:
- Institution portal.
- Admission batch submission.
- Record verification guidance.
- Help and resources.

Use a compact service-navigation layout. It may use two to four cards/tiles, but avoid four indistinguishable rounded cards with identical icon squares and paragraphs. Use clear text links and concise descriptions. Each entry must lead to an implemented section, page, or documented destination.

### 9.5 How AIRE works

Show the verified high-level process with four or five clear stages, for example:

1. Prepare institutional records.
2. Upload and map data.
3. Validate records.
4. Resolve discrepancies.
5. Submit and track the batch.

Use a connected horizontal step/process composition on desktop and a vertical timeline on mobile. Avoid repetitive boxed cards. Explain that schema validation/staging is not the same as regulatory approval.

### 9.6 Responsible record management

Use a two-column editorial layout rather than another four-card grid.

Possible content themes:
- Institution-scoped access.
- Purpose-bound access and data minimisation.
- Traceable actions and evidence.
- Human review and accountable decisions.

Only describe controls that actually exist. Label planned capabilities as planned. Do not claim “zero PII”, “fully secure”, “tamper-proof”, “100% compliant”, or similar absolutes without evidence and approval.

### 9.7 About AIRE

Use an editorial section with:
- A clear section heading.
- One concise description of the platform's purpose.
- A small set of key objectives in a structured side panel.
- Links to genuine documentation/resources only.

Avoid long, tiny paragraphs and a fake institutional history.

### 9.8 Help and guidance

- Use the official UX4G accordion where suitable.
- Keep questions in user language.
- Answer concisely and link to more detailed guidance when available.
- Do not fabricate contact information, circulars, downloadable templates, or policies.

### 9.9 Final CTA

- Use one strong navy/blue solid surface or a very restrained tonal treatment.
- One clear message and one primary action.
- A small glass/vector detail is allowed, but the text area remains solid and readable.
- Do not use a generic bright purple gradient banner.

### 9.10 Footer

- Deep navy surface (`aire-brand-950`) with clear columns.
- Group links by purpose: AIRE, resources, accessibility, policies/support.
- Use readable 14px body links and sufficient contrast.
- Include a divider and accurate copyright/project ownership text only when confirmed.
- Do not invent official ministry addresses, phone numbers, partner logos, or external links.

### 9.11 Landing page section rhythm

The page should alternate between:

1. Open white hero.
2. Light neutral service discovery band.
3. White process explanation.
4. Subdued tinted responsibility section.
5. White editorial about section.
6. Light neutral help section.
7. Deep institutional CTA.
8. Deep navy footer.

This rhythm is a starting specification. The designer may adjust section backgrounds when content hierarchy justifies it, but must not produce a random colour stripe for every section.

---

## 10. Authenticated workspace visual direction

The authenticated workspace shares AIRE tokens, typography, component semantics, and iconography with the public site, but has a different information density and layout.

- Use a single primary application header.
- Use one persistent desktop sidebar with task-oriented groups.
- Integrate breadcrumbs into the page heading/context area; avoid multiple stacked navigation bars.
- Keep institution and academic-year context visible where operationally relevant.
- Use a restrained light canvas and solid white working surfaces.
- Use tables and structured data views where they are more efficient than cards.
- Prioritise action-required items and current workflow state.
- Use compact but legible table density; do not reduce text below readable sizes.
- Use status labels with text and icon/shape cues.
- Use cards only for meaningful summaries, not every data group.
- Mobile navigation becomes an accessible drawer; dense tables should provide a deliberate responsive pattern rather than forcing the entire page to overflow.

Do not force the public landing-page composition into authenticated screens.

---

## 11. Component and interaction rules

### 11.1 Use UX4G as the primary component system

- Read the current UX4G 3.0 component documentation before use.
- Use actual documented components for buttons, inputs, selects, date controls, alerts, badges, navigation, accordion, feedback, tables, and other applicable patterns.
- Verify implementation package/version, React compatibility, license, import paths, CSS/JS requirements, and documented APIs before installation.
- Do not invent package names or component APIs.
- Do not silently use a legacy UX4G release.

### 11.2 AIRE portability layer

Expose stable AIRE-owned component APIs for components used by product screens (for example `AireButton`, `AireInput`, `AireAlert`, `AireAccordion`, `AireBadge`, `AireBreadcrumbs`).

- Keep vendor-specific imports and implementation details in the UX4G adapter.
- Keep page composition and feature logic vendor-neutral.
- Keep AIRE semantic tokens independent from vendor class names.
- Do not wrap every trivial HTML element unnecessarily.
- Do not install Radix/shadcn now solely for hypothetical future use.
- If UX4G components cannot be used for a needed interaction, record the gap and implement a small accessible AIRE component behind the same interface.

### 11.3 States

Every interactive component must specify applicable:
- Default.
- Hover.
- Focus-visible.
- Active/pressed.
- Selected.
- Disabled.
- Loading.
- Error.
- Success.
- Empty.

Controls must have clear accessible names and visible feedback. Do not rely on colour alone.

### 11.4 Motion

- Motion is functional, short, and restrained.
- Use approximately 120–220ms for small feedback transitions where appropriate.
- Avoid scroll-jacking, parallax-heavy sections, auto-animated counters, constant pulsing, and attention-seeking motion.
- Respect `prefers-reduced-motion`.
- Essential information must never depend on animation.

---

## 12. Indian user and service-context requirements

Design for people and institutions with varied language preferences, device capabilities, digital familiarity, network conditions, and accessibility needs. Do not stereotype users based on geography or role.

- Plan for English and future Indian-language content; allow longer translated strings and different line breaks.
- Use Noto Sans and relevant Indic font subsets where available.
- Do not use flags as language selectors; use clear language names in their own scripts where supported.
- Avoid icon-only navigation for unfamiliar tasks; pair icons with text labels.
- Keep labels and actions explicit rather than relying on colour, metaphor, or unexplained jargon.
- Make key journeys usable at mobile widths and on slower connections.
- Avoid large autoplay media and unnecessary third-party assets.
- Ensure forms provide examples, field-specific errors, and a clear recovery path.
- Support keyboard navigation, screen readers, zoom, text resizing, and reduced motion.
- Ensure dates, numbers, names, and identifiers are formatted according to documented product/domain rules; do not assume a single display format for all contexts.
- Do not make an essential task depend on hover.

---

## 13. Explicit anti-AI-slop policy

The following are prohibited unless a documented user need justifies an exception:

- The same four-card grid repeated in every section.
- A rounded white card around every paragraph.
- Eyebrow pill badges above every heading.
- Icon inside a coloured rounded square for every feature.
- Random purple/blue gradients.
- Glassmorphism on all surfaces.
- Neon borders, glow, blurred blobs, or aurora effects.
- Floating fake dashboards or fabricated charts in the hero.
- Generic stock people, generic laptop illustrations, random 3D cubes, or meaningless network-node artwork.
- Oversized decorative headings in every section.
- Artificial counters, percentages, ratings, testimonials, or partner logos.
- Unnecessary carousels and autoplay.
- Dense text squeezed into tiny cards.
- Arbitrary font and spacing changes between sections.
- Multiple icon libraries mixed together.
- Motion added only to make the page appear sophisticated.
- Unsupported security, legal, regulatory, or government-endorsement claims.

**Anti-slop acceptance rule:** If a visual element can be removed without losing meaning, clarity, navigation, or task support, remove it. If a section looks like a repeated template, reconsider its composition.

---

## 14. Responsive and accessibility requirements

### 14.1 Required viewport checks

- 1440px desktop.
- 1280px laptop.
- 1024px tablet landscape/small desktop.
- 768px tablet.
- 390px mobile.
- 360px small mobile.

Also test zoom and enlarged text; viewport width alone is not sufficient.

### 14.2 Accessibility baseline

- Target WCAG 2.1 AA as the GIGW 3.0 baseline; evaluate relevant WCAG 2.2 improvements where practical.
- Use semantic HTML and landmarks.
- Provide skip navigation.
- Maintain logical heading order.
- Ensure all actions are keyboard operable.
- Maintain highly visible focus indicators.
- Label form fields and associate errors/help text programmatically.
- Announce asynchronous status changes appropriately.
- Provide accessible names for controls and meaningful graphics.
- Test contrast for all actual combinations and states.
- Do not rely on colour alone to convey state.
- Keep touch targets comfortably usable; target approximately 44×44 CSS px where practical, and follow applicable WCAG criteria.
- Verify mobile drawer focus management and Escape behaviour.

Passing automated checks does not prove complete accessibility. Conduct keyboard and assistive-technology review of critical flows.

---

## 15. Performance and implementation quality

- Load only required font subsets and weights.
- Prefer local/self-hosted assets where licensing and deployment permit.
- Optimise SVGs and raster assets.
- Avoid large hero videos and autoplay carousels.
- Lazy-load below-the-fold imagery.
- Avoid layout shifts by reserving image/media dimensions.
- Keep interaction effects lightweight.
- Provide meaningful loading, error, and empty states.
- Do not hide failed API calls behind invented sample data.
- Do not place secrets or privileged data in frontend code.

---

## 16. Visual QA and design approval gates

No page is accepted solely because it compiles.

### Gate 1 — Design review

Check hierarchy, section rhythm, content, brand identity, component choice, and anti-slop rules.

### Gate 2 — Browser review

Capture full-page and key viewport screenshots at the required dimensions. Inspect actual rendered pages, not only JSX/CSS.

### Gate 3 — Responsive review

Verify no unintended horizontal overflow, clipped content, navigation collision, unreadable text, or misplaced controls.

### Gate 4 — Accessibility review

Run automated checks, then manually test keyboard navigation, focus, form errors, reduced motion, text resize, and critical screen-reader flows.

### Gate 5 — Product truth review

Check every statistic, status, policy statement, service link, security statement, institutional identifier, and workflow claim against an approved source or real backend capability.

### Gate 6 — Code/system review

Verify that pages use AIRE UI abstractions, tokens remain canonical, vendor-specific imports stay isolated, and UX4G components have not been silently forked.

### Definition of done

A page is done only when all relevant gates pass, screenshots are reviewed, tests pass, and unresolved limitations are documented.

---

## 17. Token naming and portability contract

Use semantic, vendor-neutral roles as the public token contract. Example CSS custom properties:

```css
:root {
  --aire-color-brand-primary: #24536F;
  --aire-color-brand-primary-hover: #193F55;
  --aire-color-brand-deep: #142C3D;
  --aire-color-accent-teal: #075E58;
  --aire-color-accent-warm: #8B4F16;

  --aire-color-text-primary: #1D2935;
  --aire-color-text-secondary: #536474;
  --aire-color-surface-page: #F5F7F7;
  --aire-color-surface-default: #FFFFFF;
  --aire-color-surface-subtle: #EEF3F3;
  --aire-color-border-default: #D8E0E3;

  --aire-color-state-success: #176B45;
  --aire-color-state-warning: #8A4D0A;
  --aire-color-state-error: #B42318;
  --aire-color-state-info: #245B78;

  --aire-space-1: 4px;
  --aire-space-2: 8px;
  --aire-space-3: 12px;
  --aire-space-4: 16px;
  --aire-space-6: 24px;
  --aire-space-8: 32px;
  --aire-space-12: 48px;
  --aire-space-16: 64px;

  --aire-radius-control: 6px;
  --aire-radius-card: 10px;
  --aire-radius-feature: 16px;
}
```

These are semantic AIRE tokens, not a mandate to create a conflicting parallel vendor token set. Map UX4G theming and any future Tailwind/Radix/shadcn adapter to this contract. Establish one canonical token source (prefer a structured token file such as DTCG JSON if the project uses one), generate CSS from it, and test that generated outputs are in sync.

---

## 18. Source register

Use current official documentation at implementation time; documentation, packages, and site designs can change.

### Indian government and UX4G

- UX4G Design System 3.0 Foundations: https://www.ux4g.gov.in/foundations
- UX4G Get Started: https://www.ux4g.gov.in/get-started
- UX4G For Designers: https://www.ux4g.gov.in/get-started/for-designers
- UX4G For Developers: https://doc.ux4g.gov.in/web/
- UX4G Components and Patterns: https://www.ux4g.gov.in/site-map
- GIGW 3.0: https://guidelines.india.gov.in/
- GIGW Scope and Objective: https://guidelines.india.gov.in/scope-and-objective/
- GIGW New Features: https://guidelines.india.gov.in/new-features-of-gigw-3-0/
- UIDAI revamped website announcement (PIB): https://www.pib.gov.in/PressReleasePage.aspx?PRID=2316706&lang=1&reg=48
- UIDAI public website: https://uidai.gov.in/en
- iGOT Karmayogi: https://igotkarmayogi.gov.in/

### Additional mature design-system references

- GOV.UK Design System — Colour: https://design-system.service.gov.uk/styles/colour/
- US Web Design System — Colour: https://designsystem.digital.gov/design-tokens/color/overview/
- US Web Design System — Theme colour tokens: https://designsystem.digital.gov/design-tokens/color/theme-tokens/
- US Web Design System — Design tokens: https://designsystem.digital.gov/design-tokens/

### Source-derived principles used in this document

- UX4G 3.0 describes shared foundations for colour, typography, spacing/layout, elevation, iconography, design tokens, accessibility, and content design. It documents a base-4 spacing scale and WCAG 2.1 AA guidance.
- UX4G's designer guidance addresses low-literacy contexts, VLE kiosks, low-bandwidth networks, and India's scheduled languages; it also documents primary-colour and typography customisation and recommends following component/pattern documentation.
- GIGW 3.0 frames government website/app quality around usability, user-centricity, universal accessibility, cybersecurity, and lifecycle management; it references WCAG 2.1 Level AA.
- UIDAI's revamped website announcement describes four primary user needs: understand Aadhaar, access a service, find a document, and seek assistance. AIRE adapts the service-discovery principle, not Aadhaar-specific content.
- GOV.UK and USWDS use role-based functional colour guidance and emphasise contrast and consistency rather than arbitrary per-component colours.

---

## 19. Agent instruction

Before implementing or changing a screen, the coding agent must:

1. Read this entire `design.md`.
2. Read current official UX4G documentation relevant to the component or pattern.
3. Identify the user, task, permissions, and real backend state.
4. Select the correct AIRE semantic tokens and documented component.
5. Explain any deviation from this document before making it.
6. Implement the responsive and accessible states.
7. Capture browser evidence and run the relevant quality checks.

The agent must not treat this document as permission to fabricate UX4G APIs, invent product capabilities, or claim regulatory compliance. When a source, component, API, domain rule, or requirement is unavailable or ambiguous, stop and report the gap rather than guessing.
