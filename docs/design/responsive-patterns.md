# AIRE Responsive Patterns & Navigation Rules

| Viewport Category | Screen Width (px) | Grid Columns | Margin            | Spacing Behavior                                                                                            |
| ----------------- | ----------------- | ------------ | ----------------- | ----------------------------------------------------------------------------------------------------------- |
| **Mobile**        | 320px – 767px     | 1 Column     | 16px              | Stacked vertical flow, collapsed mobile hamburger menu drawer, 44px min tap targets, card padding 16px.     |
| **Tablet**        | 768px – 1023px    | 2 Columns    | 24px              | 2-column service card grid, stacked hero with adjusted typography, compact process stepper.                 |
| **Laptop**        | 1024px – 1439px   | 3 Columns    | 32px              | Full horizontal navigation bar, 3-column service grid, side-by-side hero layout, 4-step horizontal stepper. |
| **Desktop XL**    | $\ge 1440px$      | 3/4 Columns  | Auto (Max 1280px) | Centered container, maximum readable line lengths, optimal whitespace balance.                              |

---

## Navigation & Header Responsive Behaviors

1. **Utility Header:**
   - Desktop: Shows full accessibility strip (A- / A / A+ font size, theme toggle, language options, institutional notice).
   - Mobile: Consolidates accessibility actions into a compact top strip and collapses text labels to high-contrast icons.

2. **Main Navigation:**
   - Desktop ($\ge 1024px$): Standard horizontal list of links with clear hover and active indicators, flanked by the primary "Institution Portal" button.
   - Mobile ($< 1024px$): Displays AIRE wordmark and an accessible hamburger button with `aria-expanded` and `aria-controls`. When opened, displays a clean sliding drawer with complete navigation links and call-to-action buttons.

3. **Hero Layout:**
   - Desktop: 2-column layout (Left: Headline, editorial lead, CTA buttons, trust indicators; Right: Interactive verification ledger card graphic).
   - Mobile: 1-column layout (Stacked vertically; headline, CTA buttons, followed by the ledger summary card).

4. **Service Grid & Workflows:**
   - Cards automatically reflow from 1 column on mobile to 2 columns on tablet and 3 columns on desktop using CSS grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
   - Process steps use a responsive horizontal stepper on desktop and a vertical connected timeline on mobile for optimal scannability.
