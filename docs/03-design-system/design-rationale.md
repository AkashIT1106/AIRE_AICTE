# AIRE UX & Visual Design Rationale

| Metadata           | Value                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------ |
| Document           | `docs/03-design-system/design-rationale.md`                                                |
| Authoritative For  | UX Research Foundations, HCI Literature Synthesis, Palette Selection, Contrast Rationale   |
| Status             | `EVIDENCE_INFORMED_FOUNDATION`                                                             |
| Standards Baseline | WCAG 2.2 Level AA, DTCG Format 2025.10, USWDS 3.0, GOV.UK Design System                    |
| Related Documents  | [`design-principles.md`](./design-principles.md), [`design-tokens.md`](./design-tokens.md) |
| Last Updated       | 2 November 2026                                                                            |

---

## 1. Executive Summary & Methodology

AIRE (**AICTE Admission Reconciliation & Evidence Platform**) is a regulatory system supporting admission verification, seat quota reconciliation, discrepancy triage, and Show Cause adjudication under the All India Council for Technical Education.

This design rationale establishes an intentional, evidence-informed visual and interaction language. Rather than relying on unscientific color psychology claims (such as "blue creates trust"), design decisions in AIRE are grounded in:

1. **Cognitive psychology & human-computer interaction (HCI) research** (working memory limits, recognition vs. recall, slip vs. mistake error topologies).
2. **Established public-sector design systems** (USWDS, GOV.UK, Singapore Government Design System).
3. **Accessibility specifications** (W3C WCAG 2.2 Level AA criteria).
4. **Community token specifications** (Design Tokens Community Group DTCG 2025.10).

### Decision Classification Taxonomy

Every design choice in this document is explicitly classified into one of four categories:

- `RESEARCH_SUPPORTED`: Directly backed by peer-reviewed HCI literature, empirical psychology, or published accessibility standards.
- `AIRE_DESIGN_RECOMMENDATION`: Engineering or architectural choice derived to satisfy AIRE domain requirements where multiple valid options exist.
- `REQUIREMENT`: Non-negotiable statutory, legal, or architectural mandate (e.g. WCAG 2.2 AA SC 1.4.3).
- `NEEDS_USER_VALIDATION`: A design hypothesis requiring field validation with university registrars and AICTE scrutiny officers.

---

## 2. Evidence-Based Research Synthesis

### 2.1 Recognition Over Recall in Regulatory Interfaces

- **Classification:** `RESEARCH_SUPPORTED`
- **Authoritative Source:** [Nielsen Norman Group — Recognition Rather Than Recall](https://www.nngroup.com/articles/recognition-and-recall/) (Heuristic #6 per [NN/g 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)).
- **What the Source Supports:** Human working memory is strictly constrained ($4 \pm 1$ informational chunks in active processing per Baddeley's model). Recognizing information previously encountered requires far less mental effort than retrieving facts from memory from scratch without perceptual cues.
- **Application to AIRE:** University registrars manage cohorts of 500–2,000 students across multiple quotas (General, OBC-NCL, EWS, TFW, Management Quota). Users must never be required to recall quota codes, approval handbook clause numbers, or batch identifiers across views. The UI must provide contextual badges, breadcrumbs, persistent workspace headers, and explicit column labels.
- **Distinction (Design Recommendation vs. Research):** While cognitive load theory proves working memory limits, the specific choice to render the active tenant code (`INST-101`) in an immutable top-right header chip is an `AIRE_DESIGN_RECOMMENDATION`.

### 2.2 Error Prevention: Slips vs. Mistakes

- **Classification:** `RESEARCH_SUPPORTED`
- **Authoritative Source:** [Nielsen Norman Group — Error Prevention: Slips and Mistakes](https://www.nngroup.com/articles/slips/) (Heuristic #5).
- **What the Source Supports:** Slips occur during automatic routine actions (e.g., misclicking adjacent targets or entering a typographical error). Mistakes occur when the user has an incorrect mental model. Slips are mitigated by visual constraints, input masks, and clear spacing. Mistakes are mitigated by explicit feedback, consequence warnings, and reversible draft states.
- **Application to AIRE:**
  - _Preventing Slips:_ Numeric inputs (e.g. Course Quota) restrict non-numeric entry via HTML5 number attributes and Zod coercion. Actions with high physical proximity (e.g. "Validate" vs "Reject") have distinct visual weights and spacing.
  - _Preventing Mistakes:_ Consequential, irreversible actions (such as "Seal Admission Cohort" or "Issue Show Cause Notice") require structured modal confirmation with explicit attestation, displaying cryptographic hash digests before commitment.
- **Distinction:** Don Norman's slip/mistake taxonomy is empirical research; the requirement for a dual-action modal dialog for cohort sealing is an `AIRE_DESIGN_RECOMMENDATION`.

### 2.3 Visual Hierarchy & Sensory Independence (Color Alone is Insufficient)

- **Classification:** `REQUIREMENT`
- **Authoritative Source:** [W3C WCAG 2.2 — Success Criterion 1.4.1 (Use of Color)](https://www.w3.org/TR/WCAG22/#use-of-color) and [GOV.UK Design System — Colour Guidance](https://design-system.service.gov.uk/styles/colour/).
- **What the Source Supports:** Color must not be used as the sole visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Approximately 8% of men and 0.5% of women have color-vision deficiencies.
- **Application to AIRE:** Status badges and banners always pair color with text and SVG iconography:
  - Compliant: Green tint + `CheckCircle2` icon + explicit text _"Compliant"_ or _"Reconciled"_.
  - Quarantine: Amber tint + `AlertTriangle` icon + explicit text _"Quarantine (14 Rows)"_.
  - Breach: Red tint + `AlertOctagon` icon + explicit text _"Over-Intake Breach"_.
  - Masked Data: Neutral slate + `Lock` icon + monospace dots `••••-••••-8821`.

### 2.4 Actionable Error Messages

- **Classification:** `RESEARCH_SUPPORTED`
- **Authoritative Source:** [GOV.UK Design System — Error Message Guidance](https://design-system.service.gov.uk/components/error-message/) and [NN/g Heuristic #9 (Help users recognize, diagnose, and recover from errors)](https://www.nngroup.com/articles/ten-usability-heuristics/).
- **What the Source Supports:** Error messages must be placed directly next to the input, state clearly what went wrong in plain English, and provide a direct recovery path. Vague messages ("Invalid input") increase task failure rates.
- **Application to AIRE:** Inline form validation errors explain exact criteria (e.g., _"Course intake quota must be at least 1 seat per AICTE Approval Process Handbook"_). Server API errors display a monospace `Correlation ID` allowing immediate tracing in logs.

### 2.5 Systematic Color Tokens & Theme Grading

- **Classification:** `RESEARCH_SUPPORTED`
- **Authoritative Source:** [U.S. Web Design System (USWDS) — Color Overview & Theme Tokens](https://designsystem.digital.gov/design-tokens/color/overview/).
- **What the Source Supports:** USWDS established that mathematical color grading ensures guaranteed contrast ratios. A 50-grade difference between text and background mathematically guarantees compliance with WCAG Level AA ($4.5:1$).
- **Application to AIRE:** The AIRE token architecture adopts graded primitives (`navy-900`, `slate-900` text on `canvas` / `surface`) ensuring that text-to-background contrast exceeds $10:1$, far surpassing the $4.5:1$ threshold.

---

## 3. Visual Direction: Restrained Institutional Clarity

AIRE deliberately avoids generic commercial SaaS aesthetics:

- **No Neon Gradients or Purple/Indigo Brand Primaries:** Generic AI/crypto dashboards default to purple/indigo (`#4F46E5`). In a statutory compliance portal, these create visual fatigue and lack institutional dignity.
- **No Glassmorphism or Glowing Borders:** Frosted glass blur degrades contrast on low-spec displays and violates WCAG 1.4.3 under variable backdrop content.
- **No Celebratory Gamification:** No confetti or celebratory animations upon sealing cohorts. Regulatory submissions are legal filings; success is marked by a tamper-evident cryptographic receipt with SHA-256 digest and timestamp.
- **Neutral-First Foundation:** 90% of screen real estate is neutral canvas (`#F5F7FA`), container surface (`#FFFFFF`), or subdued surface (`#F0F4F8`). Brand Navy (`#173B57`) and Teal (`#0F766E`) are reserved for intentional actions and focal points.

---

## 4. Palette Selection & Contrast Verification

### 4.1 Core Palette Tokens & Rationale

| Role                   | Token Alias            | Canonical Hex | Rationale                                                                                                                                  | Classification               |
| ---------------------- | ---------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| **Institutional Navy** | `color.action.primary` | `#173B57`     | Primary brand color. Provides deep, authoritative grounding for top header and primary actions. Contrast on white is **11.7:1** (AAA).     | `AIRE_DESIGN_RECOMMENDATION` |
| **Teal Accent**        | `color.focus.ring`     | `#0F766E`     | Intentional secondary accent and focus indicator. Distinct from Navy, provides crisp visual feedback. Contrast on white is **5.5:1** (AA). | `AIRE_DESIGN_RECOMMENDATION` |
| **Canvas**             | `color.surface.canvas` | `#F5F7FA`     | Cool off-white background reducing glare during long working shifts compared to `#FFFFFF`.                                                 | `AIRE_DESIGN_RECOMMENDATION` |
| **Surface**            | `color.surface.card`   | `#FFFFFF`     | Clean white surface for cards, data tables, and modal dialogs.                                                                             | `AIRE_DESIGN_RECOMMENDATION` |
| **Primary Text**       | `color.text.primary`   | `#172B3A`     | Deep slate-navy text. Exceeds WCAG AAA contrast (**14.5:1** on surface, **13.6:1** on canvas).                                             | `REQUIREMENT`                |
| **Secondary Text**     | `color.text.secondary` | `#526579`     | Neutral slate body copy. Exceeds WCAG AA (**6.0:1** on surface, **5.6:1** on canvas).                                                      | `REQUIREMENT`                |
| **Muted Text**         | `color.text.muted`     | `#5A6E82`     | Subdued metadata, column headers, timestamps. Exceeds WCAG AA (**5.3:1** on surface, **4.9:1** on canvas).                                 | `REQUIREMENT`                |
| **Strong Border**      | `color.border.strong`  | `#7B90A2`     | Input border on hover and active boundaries. Meets WCAG 2.2 SC 1.4.11 UI control minimum (**3.3:1** on white).                             | `REQUIREMENT`                |
| **Subtle Border**      | `color.border.subtle`  | `#D8E0E8`     | Table row dividers and container separation without visual noise.                                                                          | `AIRE_DESIGN_RECOMMENDATION` |

### 4.2 Contrast Ratio Verification Table (WCAG 2.2 Level AA / AAA)

All contrast ratios were calculated using the authoritative W3C formula:
$$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$
where $L$ is relative luminance derived from linearized sRGB coefficients ($0.2126R + 0.7152G + 0.0722B$).

| Foreground Element                | Background Surface       | Contrast Ratio | WCAG 2.2 Standard                | Result         |
| --------------------------------- | ------------------------ | -------------- | -------------------------------- | -------------- |
| **Primary Text** (`#172B3A`)      | Surface (`#FFFFFF`)      | **14.55:1**    | AA: $\ge 4.5:1$ / AAA: $\ge 7:1$ | **PASS (AAA)** |
| **Primary Text** (`#172B3A`)      | Canvas (`#F5F7FA`)       | **13.56:1**    | AA: $\ge 4.5:1$ / AAA: $\ge 7:1$ | **PASS (AAA)** |
| **Secondary Text** (`#526579`)    | Surface (`#FFFFFF`)      | **6.01:1**     | AA: $\ge 4.5:1$                  | **PASS (AA)**  |
| **Secondary Text** (`#526579`)    | Canvas (`#F5F7FA`)       | **5.60:1**     | AA: $\ge 4.5:1$                  | **PASS (AA)**  |
| **Muted Text** (`#5A6E82`)        | Surface (`#FFFFFF`)      | **5.27:1**     | AA: $\ge 4.5:1$                  | **PASS (AA)**  |
| **White Button Text** (`#FFFFFF`) | Navy Primary (`#173B57`) | **11.67:1**    | AA: $\ge 4.5:1$ / AAA: $\ge 7:1$ | **PASS (AAA)** |
| **White Accent Text** (`#FFFFFF`) | Teal Accent (`#0F766E`)  | **5.47:1**     | AA: $\ge 4.5:1$                  | **PASS (AA)**  |
| **Teal Link** (`#0D635C`)         | Surface (`#FFFFFF`)      | **7.10:1**     | AA: $\ge 4.5:1$ / AAA: $\ge 7:1$ | **PASS (AAA)** |
| **Focus Ring** (`#0F766E`)        | Surface (`#FFFFFF`)      | **5.47:1**     | SC 2.4.11 UI: $\ge 3:1$          | **PASS (AA)**  |
| **Focus Ring** (`#0F766E`)        | Canvas (`#F5F7FA`)       | **5.10:1**     | SC 2.4.11 UI: $\ge 3:1$          | **PASS (AA)**  |
| **Strong Border** (`#7B90A2`)     | Surface (`#FFFFFF`)      | **3.31:1**     | SC 1.4.11 UI: $\ge 3:1$          | **PASS (AA)**  |
| **Success Text** (`#14532D`)      | Success Bg (`#F0FDF4`)   | **8.70:1**     | AA: $\ge 4.5:1$ / AAA: $\ge 7:1$ | **PASS (AAA)** |
| **Warning Text** (`#78350F`)      | Warning Bg (`#FFFBEB`)   | **8.75:1**     | AA: $\ge 4.5:1$ / AAA: $\ge 7:1$ | **PASS (AAA)** |
| **Danger Text** (`#7F1D1D`)       | Danger Bg (`#FEF2F2`)    | **9.16:1**     | AA: $\ge 4.5:1$ / AAA: $\ge 7:1$ | **PASS (AAA)** |
| **Info Text** (`#0C4A6E`)         | Info Bg (`#F0F9FF`)      | **8.87:1**     | AA: $\ge 4.5:1$ / AAA: $\ge 7:1$ | **PASS (AAA)** |
| **Masked Text** (`#334E68`)       | Subdued Bg (`#F0F4F8`)   | **7.54:1**     | AA: $\ge 4.5:1$ / AAA: $\ge 7:1$ | **PASS (AAA)** |

---

## 5. Token Architecture (DTCG 2025.10)

AIRE token architecture strictly adheres to the **Design Tokens Community Group (DTCG)** format specification, version **2025.10** ([DTCG 2025.10 Spec](https://www.designtokens.org/tr/2025.10/)):

### Three-Layer Structure

```
[Layer 1: Primitives]   color.primitive.brand.navy.900 (#173B57)
                                 │
                                 ▼ (Aliased reference)
[Layer 2: Semantics]    color.semantic.action.primary ({color.primitive.brand.navy.900})
                                 │
                                 ▼ (Consumed in CSS custom properties & Tailwind)
[Layer 3: Components]   button-default { background: var(--brand-primary); }
```

### Format Compliance Details

- **Structured Color Values:** Primitive colors specify `$type: "color"` and `$value: { "colorSpace": "srgb", "components": [r, g, b], "hex": "#..." }`.
- **Reference Syntax:** Semantic tokens use standard bracketed path aliases (`"$value": "{color.primitive.brand.navy.900}"`).
- **Standard Types:** Dimensions use `$type: "dimension"`, weights use `$type: "fontWeight"`, durations use `$type: "duration"`, and curves use `$type: "cubicBezier"`.
- **Single Source of Truth:** `client/design-tokens.json` drives runtime styles via the automated synchronizer `client/scripts/sync-tokens.js`.

---

## 6. Open Hypotheses & User-Validation Register

The following items are functional design recommendations established during Stage 3.5 that must be validated during Phase 2 user testing with institutional stakeholders:

| ID        | Topic                                   | Current Baseline                                     | Validation Question                                                                                                       | Status                  |
| --------- | --------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| **UV-01** | High-Density Row Height                 | `36px` compact height (`.table-compact`)             | Does 36px cause misclicks for operators on touch-trackpads compared to 40px?                                              | `NEEDS_USER_VALIDATION` |
| **UV-02** | Multi-Campus Switcher                   | Header dropdown (`AppShell.tsx`)                     | Do multi-campus registrars need side-by-side comparative views or is atomic switching sufficient?                         | `NEEDS_USER_VALIDATION` |
| **UV-03** | Teal Focus Contrast on Low-Spec Screens | `2px` solid Teal (`#0F766E`) with `2px` white offset | Does the 2px Teal ring provide sufficient perceptual pop on low-contrast VGA/TN panel monitors used in regional colleges? | `NEEDS_USER_VALIDATION` |
| **UV-04** | GIGW 3.0 Regional Language Switcher     | English baseline with Unicode support                | Will AICTE require mandatory bilingual Hindi/regional language UI toggles?                                                | `NEEDS_USER_VALIDATION` |
