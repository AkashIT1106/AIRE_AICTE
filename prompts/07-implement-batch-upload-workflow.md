# Prompt 07 — Implement the admission batch upload workflow incrementally

Invoke `/aire-screen-implementation`.

Implement one approved workflow step at a time. Do not build the entire upload journey in one autonomous pass.

Recommended order:

1. File selection and upload feedback.
2. Column mapping and source/target preview.
3. Record preview and confirmation.
4. Validation summary.
5. Quarantine findings and correction/revalidation.
6. Submission confirmation and server acknowledgement.

For each step, inspect existing endpoints, schemas, file constraints, upload state management, validation logic and RBAC. Use actual contracts; do not invent request/response shapes or validation rules. Preserve user-entered mappings and recoverable state when errors occur where feasible.

Every step must specify loading, empty, error, partial, success and permission-denied states where applicable. Clearly distinguish warnings from blocking errors. Explain why a row was quarantined and what the permitted correction path is. Do not imply that a locally fixed row is accepted until server validation confirms it.

Before coding each step, provide a bounded implementation brief and files-to-change list. Stop for approval after each step, run relevant tests, and report exact outcomes. Do not move to the next step until the current one passes its acceptance criteria.
