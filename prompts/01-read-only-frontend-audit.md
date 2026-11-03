# Prompt 01 — AIRE read-only frontend audit

Invoke `/aire-frontend-audit` (or read `.agents/skills/aire-frontend-audit/SKILL.md`).

Conduct a comprehensive evidence-based audit of the existing partially implemented AIRE frontend. This is a source-code read-only audit. The only permitted write is `docs/design/UX-AUDIT-REPORT.md`.

Inspect the actual framework and versions, routes, role gates, layouts, components, design tokens, styling conventions, icon packages, forms, tables, upload flow, validation, quarantine, submission, audit screens, responsive rules and tests. Trace critical interactions into the existing API client and state handling where possible.

Do not assume the proposed architecture in design docs matches the code. Do not install dependencies, refactor, redesign, update tokens, modify source files, routes, API contracts, RBAC, package files or tests. Do not delete or reset anything.

The report must contain:

- verified stack and architecture;
- route and role inventory;
- component inventory and reuse map;
- design-token/style audit;
- application-shell assessment;
- workflow and domain-state assessment;
- accessibility and responsive assessment;
- retain / improve / consolidate / remove / missing recommendations;
- prioritised issues with severity, affected route, file path/line evidence, impact, fix and verification;
- staged implementation plan with dependencies and regression risks.

Mark inferred/unverified items clearly. Stop after writing the report and present the highest-priority findings. Await approval.
