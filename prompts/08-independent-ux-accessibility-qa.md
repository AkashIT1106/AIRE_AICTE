# Prompt 08 — Independent AIRE UX, visual and accessibility QA

Invoke `/aire-ux-qa`.

Review the implemented scope independently. Do not modify files during the initial review.

Inspect the live application in a browser when available and compare it to the approved screen brief and AIRE governance. Test representative workflows, not screenshots alone.

Required checks:

- role, permission and data scope;
- primary task clarity and terminology;
- navigation and breadcrumb consistency;
- design-token and component conformity;
- realistic data and accurate state meaning;
- loading/empty/error/partial/success states;
- keyboard-only operation and focus return;
- semantic headings, landmarks, fields, tables and status announcements;
- colour contrast and non-colour status cues;
- 200% zoom/reflow;
- reduced motion;
- responsive widths 1440, 1280, 1024, 768, 390 and 360 where possible;
- no overlapping shell regions or unintended horizontal overflow;
- no inaccessible action hidden behind hover-only behaviour.

Use the repo's existing test tools. If axe-core, Playwright or visual regression tooling is absent, recommend the smallest compatible addition but do not install it without approval.

Produce a defect report with severity, affected route, viewport, reproduction steps, evidence, user impact, expected result and correction. Separate release blockers from refinements. Do not claim WCAG/GIGW certification. Await approval before fixing defects.
