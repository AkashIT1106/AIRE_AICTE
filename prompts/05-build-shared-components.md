# Prompt 05 — Build or consolidate the AIRE shared component set

Invoke `/aire-design-system` and `/aire-screen-implementation` as relevant.

Using the accepted audit, foundation and shell, implement only the shared components required by the next Institution Dashboard and admission batch workflow.

Prioritise by actual reuse evidence:

- buttons and icon buttons;
- page header and breadcrumbs;
- status badge / status text;
- inline alert and error summary;
- text field, select, date input and file picker (only those needed);
- data table with loading/empty/error states;
- pagination and filter controls if required by existing screens;
- progress/status presentation;
- dialog/drawer only if used in the approved flows.

For each component define its purpose, props/API, variants, states, accessibility behaviour and responsive rules. Reuse the existing UI library if appropriate; do not build duplicate primitives or add another component library by default.

Do not build every possible component. Do not change existing business logic. Provide a component inventory and small examples/stories only if the repository already supports them or the addition is approved. Run checks. Stop for review.
