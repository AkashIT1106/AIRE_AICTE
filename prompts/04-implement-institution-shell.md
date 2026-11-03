# Prompt 04 — Implement the AIRE Institution application shell

Invoke `/aire-screen-implementation` (or read `.agents/skills/aire-screen-implementation/SKILL.md`).

Implement only the Institution Workspace application shell, based on the accepted shell specification and audited existing architecture.

First inspect the current route hierarchy, auth/RBAC layout wrappers, navigation definitions and responsive conventions. Propose the shell brief and exact files to change, then wait for approval before coding.

The shell must establish:

- one coherent application header;
- institution workspace identity/context;
- role-aware navigation;
- fixed desktop sidebar with an accessible collapse option if appropriate;
- responsive mobile navigation drawer/hamburger;
- breadcrumb/page-context area;
- consistent content container and page gutters;
- usable keyboard/focus behaviour;
- footer/status context only where useful.

Do not add duplicate header bars, overlapping fixed regions, fake institution data, role-inappropriate navigation or visual-only authorization. Respect existing route guards and backend permissions.

Use only approved design tokens and shared components. Do not redesign dashboard content in this task. Verify at 1440, 1280, 1024, 768, 390 and 360 CSS-pixel widths where possible. Test keyboard opening/closing and focus return for the mobile drawer. Run project checks and report results. Stop for visual approval.
