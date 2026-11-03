# Prompt 02 — Review audit and approve a bounded remediation plan

Read `docs/design/UX-AUDIT-REPORT.md` and all AIRE design governance documents. Do not change application code.

Produce a decision register in `docs/design/UX-DECISIONS.md` and a bounded implementation plan.

For every high/critical finding:

- verify the evidence against source;
- state whether it is a visual issue, interaction issue, accessibility issue, data/domain issue, or architectural issue;
- identify the smallest safe correction;
- identify dependencies and regression risks;
- identify what must remain untouched;
- state the acceptance test.

Reconcile the proposed tokens with the existing implementation. Identify which tokens can be adopted directly, which conflict with established project conventions, and which require contrast validation. Do not mass-rewrite Tailwind classes or replace the UI library without evidence.

Create an ordered plan with separate tasks for: foundation, shell, shared components, institution dashboard, batch workflow, and QA. Define a stop/approval gate after each task. Do not implement anything. Await approval of the plan.
