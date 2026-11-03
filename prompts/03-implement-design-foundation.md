# Prompt 03 — Implement AIRE design foundations only

Invoke `/aire-design-system` (or read `.agents/skills/aire-design-system/SKILL.md`).

Implement only the approved design-foundation changes from the accepted audit and decision register. Do not redesign application screens in this task.

Scope may include, only if approved:

- semantic CSS variables / design tokens;
- typography and font fallback;
- spacing and layout primitives;
- border, radius, shadow and focus tokens;
- semantic status tokens;
- reduced-motion defaults;
- a minimal token usage example or verification page using existing project tooling.

Before changing files, list exact files and migration impact. Preserve existing framework, styling architecture and dependencies. Do not upgrade packages, add a new component library, replace the icon family or mass-convert classes unless separately approved.

Validate actual foreground/background contrast for relevant pairs. Check body text, muted text, links, buttons, borders, focus indicators, success, warning and error states. Do not claim every combination passes without measuring it.

Run relevant format, lint, typecheck, tests and build commands already defined in the repo. Report exact commands and outcomes. Stop after foundations; do not continue to shell or pages.
