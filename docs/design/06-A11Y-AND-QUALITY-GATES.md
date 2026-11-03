# 06 — Accessibility, Content and Quality Gates

## 1. Compliance baseline

- Treat WCAG 2.1 Level AA and applicable GIGW 3.0 guidance as the baseline to assess.
- Maintain a separate checklist for legal, privacy, information-security and certification obligations; visual design does not satisfy them by itself.
- Consider useful WCAG 2.2 criteria as additional improvements where relevant, but label them separately from GIGW 3.0's stated WCAG 2.1 baseline.
- Automated scans are necessary but do not replace manual keyboard, screen-reader and user testing.

## 2. Accessibility requirements

### Keyboard and focus

- All functionality is available by keyboard.
- Focus order follows reading and task order.
- Focus is visible and not obscured by sticky headers, drawers or dialogs.
- Dialogs manage focus correctly and restore it to the opener.
- No keyboard trap except inside a properly modal dialog, with a reliable escape path.
- Menus, tabs, comboboxes and tables follow their documented keyboard model.

### Semantics and screen readers

- Use landmarks: header, nav, main, footer and complementary regions when appropriate.
- Use one meaningful H1 per page and properly nested headings.
- Use actual buttons for actions and links for navigation.
- Tables use semantic headers and captions where useful.
- Form fields have visible labels and associated descriptions/errors.
- Dynamic status updates use appropriate live regions; reserve assertive announcements for critical events.
- Icons and decorative graphics have appropriate accessible treatment.

### Contrast and non-colour cues

- Normal text: at least 4.5:1 contrast.
- Large text: at least 3:1.
- Essential UI boundaries and graphical indicators: at least 3:1 where required.
- Never communicate status using colour alone; include text and/or an appropriate icon/shape.
- Test actual component states, not only the default screen.

### Zoom, reflow and touch

- Support browser zoom to 200% without loss of core content or functionality.
- Test narrow viewports and reflow; avoid fixed-width forms and hidden actions.
- Interactive targets must have usable size and spacing. Use 44px as a practical AIRE touch target target where layout permits; check applicable WCAG criterion and component context rather than claiming every target rule is identical.
- Do not disable browser zoom.

### Motion and time

- Respect `prefers-reduced-motion`.
- Avoid auto-advancing carousels and decorative movement.
- Do not impose artificial time limits on data-entry flows unless there is a documented security reason.
- Warn users before session expiry and preserve safe work where possible.

## 3. Content design rules

- Use plain English and consistent terminology.
- Use sentence case for labels and navigation.
- Prefer action-oriented labels: `Save changes`, `Upload batch`, `Review findings`.
- State the problem and the remedy in error messages.
- Avoid blame: say `The date format isn't recognised. Use DD/MM/YYYY.` rather than `You entered an invalid date.`
- Use full, unambiguous dates in important regulatory contexts, e.g. `15 November 2026`; include timezone for event timestamps where relevant.
- Avoid unexplained abbreviations, internal codes and developer vocabulary.
- Ensure English/Hindi and future language support do not break layouts. Do not hard-code widths that only fit English.
- Do not rely on placeholders to explain required formats.

## 4. Workflow and data integrity UX

For every consequential operation, the UI must tell the user:

1. What object is affected?
2. What action will happen?
3. Which records are included or excluded?
4. Is the action reversible?
5. What authority/permission is needed?
6. What state will follow?
7. How can the user retrieve proof or reference of the action?

For async work:

- distinguish queued, processing, completed, failed and outcome-unknown states;
- prevent accidental double submission;
- provide retry/recovery that does not duplicate the operation;
- show timestamps and last-updated context where important;
- do not optimistically display an irreversible success before backend confirmation.

## 5. Design gates

A new or materially changed screen cannot skip these gates.

| Gate                   | Required evidence                                                                   | Exit condition                                               |
| ---------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| G0 — Requirements      | Role, permissions, task, domain terms, API/data dependencies                        | User goal and constraints understood                         |
| G1 — Flow and IA       | User flow, state transitions, navigation location, error paths                      | Happy path and failure/recovery paths defined                |
| G2 — Wireframe         | Layout, hierarchy, responsive intent, content priority                              | Task can be understood without visual styling                |
| G3 — Design conformity | Tokens, component reuse, status semantics, accessibility annotations                | No unexplained design-system deviation                       |
| G4 — Implementation    | Functional screen, loading/empty/error states, real data bindings                   | Behaviour matches approved specification                     |
| G5 — QA                | Responsive, keyboard, screen reader, contrast, visual regression, domain validation | Acceptance checklist passed or issues documented and triaged |

## 6. Per-screen acceptance checklist

### Product correctness

- [ ] Correct role and permission scope.
- [ ] Correct institution/cycle/object context.
- [ ] All counts and derived values have approved definitions and reconcile.
- [ ] Status labels reflect actual backend workflow state.
- [ ] No fabricated demo data in production mode.
- [ ] Primary action is clear and safe.

### Visual consistency

- [ ] Uses semantic design tokens.
- [ ] Uses approved typography scale and spacing.
- [ ] Uses existing components where possible.
- [ ] No arbitrary colours, shadows, radii or icon styles.
- [ ] Clear hierarchy and alignment.
- [ ] No unnecessary cards, banners or decoration.
- [ ] No overlapping or duplicated shell elements.

### Interaction

- [ ] Loading, empty, error and success states exist.
- [ ] Errors explain the issue and remedy.
- [ ] Retry and cancellation behaviour is clear.
- [ ] Destructive/irreversible action has appropriate safeguards.
- [ ] Focus and keyboard behaviour work.
- [ ] No action is presented as successful before the server confirms it.

### Responsive

- [ ] Desktop layout works at 1440px and 1280px.
- [ ] Tablet layout works around 1024px and 768px.
- [ ] Mobile layout works at 390px and 360px.
- [ ] No unintended horizontal page overflow.
- [ ] Navigation and actions remain reachable.
- [ ] Tables retain access to all critical data.

### Accessibility

- [ ] Semantic headings, landmarks, controls and tables.
- [ ] Visible focus and logical focus order.
- [ ] Labels and descriptions associated programmatically.
- [ ] Contrast measured for text and UI controls.
- [ ] Status not conveyed by colour alone.
- [ ] Keyboard-only task completion tested.
- [ ] Screen-reader smoke test completed for critical journeys.
- [ ] 200% zoom/reflow tested.
- [ ] Reduced-motion preference respected.

## 7. Recommended QA tooling

Tool choice should be checked against the actual repository and current supported versions.

- Accessibility automation: axe-core through the chosen test runner; Lighthouse as a supplementary signal.
- Browser workflows: Playwright or the repository's established equivalent.
- Visual regression: Playwright screenshot comparisons or an established visual-testing platform.
- Component documentation: Storybook or an existing component-workbench solution.
- Manual: keyboard-only, NVDA/JAWS/VoiceOver as available, browser zoom, contrast checks and representative user testing.

A clean automated scan does not prove full accessibility conformance.
