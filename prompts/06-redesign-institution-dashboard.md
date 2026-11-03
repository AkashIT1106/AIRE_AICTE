# Prompt 06 — Redesign the AIRE Institution Dashboard

Invoke `/aire-screen-implementation` followed by `/aire-ux-qa` for independent review.

Redesign only the Institution Dashboard using the approved governance, audit, design foundations, application shell and shared components.

Before coding, write a screen brief covering:

- institution role and permission scope;
- primary operator tasks;
- authoritative API data and loading states;
- metric definitions, units and denominators;
- regulatory reporting context;
- action-required priority;
- submissions ledger fields and actions;
- empty/error/partial/success states;
- responsive layout and accessibility.

Information hierarchy should answer:

1. Which institution and academic/reporting cycle am I viewing?
2. What is the current reporting status and deadline, from authoritative data?
3. What needs my attention now?
4. What batches/records can I inspect or act on?
5. What is the next permissible action?

Critical domain safeguards:

- Do not conflate admitted student count, ingested row count, validated record count, sanctioned intake, occupied seats or remaining capacity.
- Do not calculate capacity by subtracting uploaded rows unless the approved domain rule explicitly defines that calculation.
- Schema validation is not regulatory approval.
- A batch being ready for sign-off is not a submitted/accepted batch.
- Never invent deadlines, percentages, batches, statuses or compliance claims.
- Keep institution-specific information inside the authorised institution scope.

Visual constraints: restrained navy/blue/teal, neutral surfaces, clear type hierarchy, minimal borders/shadows, no gradients, glassmorphism, random purple, decorative charts or a card for every data point.

Implement only after the brief is approved. Preserve existing APIs and RBAC. Verify all page states and responsive widths. Run tests, typecheck, lint and build. Then request an independent QA review. Do not continue into the batch workflow.
