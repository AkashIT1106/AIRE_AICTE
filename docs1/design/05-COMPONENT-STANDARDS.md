# 05 — Component Standards and Inventory

## 1. Component governance

Build a component once, document its contract and reuse it. Components must be driven by semantic tokens, not page-specific colour and spacing values.

Every component specification includes:

- purpose and user need;
- when to use / when not to use;
- anatomy and content rules;
- variants and sizes;
- states (default, hover, focus, active, disabled, loading, error, success as applicable);
- responsive behaviour;
- keyboard behaviour;
- accessible name/role/state requirements;
- analytics or audit requirements, if applicable;
- examples and anti-examples.

## 2. Core components

### Navigation

- App header, sidebar, mobile drawer, breadcrumbs, tabs and pagination.
- Current location must be conveyed in text and programmatic state.
- Avoid nested navigation deeper than needed.
- Use links for route changes and buttons for actions.

### Buttons

Suggested variants:

- Primary: the single most important action in a context.
- Secondary: a supporting action.
- Tertiary/ghost: low-emphasis action.
- Destructive: deletion/revocation or another genuinely destructive action.
- Link: navigation or inline action that should read as a link.

Rules:

- Usually one primary button per clear action region.
- Button labels begin with an action verb: `Upload batch`, `Save mapping`, `Submit for review`.
- Do not use icon-only buttons without an accessible name and a visible tooltip where appropriate.
- Disabled buttons need an understandable reason when the user might reasonably expect to act.
- Loading state must prevent duplicate submission and communicate ongoing work.

### Form fields

- Visible label above the control by default.
- Required/optional status communicated consistently.
- Helper text explains format or consequence, not repeats the label.
- Errors appear next to the field and in a form-level summary after failed submission.
- Associate helper/error text programmatically.
- Use native input types and mobile keyboard hints where appropriate.
- Do not use placeholder as the only label.
- Preserve user-entered values after recoverable validation errors.

### Tables and ledgers

Use a semantic table for structured comparison and administrative datasets. UX4G's table guidance calls for semantic table markup, proper header cells, responsive overflow treatment, labelled sort/filter controls and status meaning that is not colour-only.

Rules:

- Every column has a clear label and consistent meaning.
- Align numeric values consistently; use tabular numerals for counts and IDs where appropriate.
- Keep row actions in a predictable location.
- Use sortable headers only when sorting works and the current sort is communicated.
- Keep filters visible and understandable.
- Show total/filtered row counts and pagination for large datasets.
- Do not use hover as the only way to reveal an action.
- Avoid unnecessary zebra stripes; use subtle row separation and only introduce striping when it improves long-table scanning.
- At small widths, use an explicit scroll container or a carefully designed alternative; do not silently omit critical columns.

### Status badge

A badge communicates one concise state. It does not replace detailed status text or a workflow history.

- Status must have a text label.
- Colour is supplementary, never the only signal.
- Keep a controlled set of approved status labels.
- Do not use green for every state that sounds positive.
- Distinguish validation status, submission status and regulatory decision.

### Alert and notification

- Inline alerts belong near the affected content.
- Persistent notices are reserved for information users need to retain.
- Toasts are for brief, non-critical confirmation; don't use them for information users must act on later.
- Critical errors must not disappear automatically.
- Include an action only when a clear next step exists.
- Do not show the same notice in a banner, toast and card simultaneously.

### Progress and stepper

- Use for a genuine ordered workflow, not unrelated navigation.
- Derive progress from actual state.
- Make completed/current/upcoming states understandable without colour alone.
- Provide accessible labels and communicate any blocking issue.
- Do not force users to move linearly when the task permits safe revision.

### Dialog and drawer

- Use a dialog for a focused decision or short interaction, not as a substitute for a page.
- Use a drawer for contextual details when keeping the parent list visible helps.
- Manage focus on open/close; support Escape where safe; prevent background interaction for modal dialogs.
- Destructive confirmation explains the object, scope and consequence.

### Data summary

Use a simple definition list or grouped text for a handful of key-value facts. Use cards only when separate grouping or navigation is beneficial. Do not convert every metric into an elevated card.

### File upload

- File picker is always available; drag-and-drop is an optional enhancement.
- Show accepted formats and size limits before selection.
- Provide progress and failure recovery.
- Show file name and status after selection.
- Never say `Uploaded` until the server confirms receipt.
- If upload outcome is unknown, show `Checking upload status` or an equivalent recovery state instead of success.

## 3. Controlled component inventory

| Component family | First components to standardise                                           |
| ---------------- | ------------------------------------------------------------------------- |
| Shell            | AppHeader, Sidebar, MobileNavDrawer, Breadcrumbs, PageHeader              |
| Navigation       | NavGroup, NavItem, Tabs, Pagination                                       |
| Actions          | Button, IconButton, LinkButton, MenuButton                                |
| Forms            | TextField, Select, DatePicker, Checkbox, RadioGroup, Textarea, FilePicker |
| Feedback         | InlineAlert, Toast, EmptyState, ErrorSummary, ProgressIndicator           |
| Data display     | DataTable, StatusBadge, DefinitionList, MetricSummary, Timeline           |
| Workflow         | Stepper, ValidationSummary, FindingRow, EvidenceReference, DecisionPanel  |
| Overlay          | Dialog, Drawer, Popover, Tooltip                                          |

## 4. AIRE-specific patterns

These are compositions of shared components, not unrelated one-off widgets:

- Batch upload and column mapping.
- Validation summary and row-level findings.
- Quarantine work queue.
- Intake/programme compliance summary.
- Submission readiness and sign-off.
- Reviewer evidence and decision workspace.
- Audit event search and detail.

Each pattern should specify its domain state model and data contract before implementation.

## 5. Icon rules

- Choose one family and use it consistently.
- Use the same baseline size for the same component context.
- Prefer familiar, literal icons; accompany ambiguous icons with visible text.
- Do not place an icon before every line of content.
- Decorative icons should be hidden from assistive technology.
- Never use emoji as production navigation or status iconography.
