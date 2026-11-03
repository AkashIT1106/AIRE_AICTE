# 04 — Application Shell and Screen Patterns

## 1. Workspace shell — desktop

The authenticated workspace should use one stable shell. Avoid the current multi-header/overlap problem shown in the early dashboard screenshot.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ AIRE   Institutional Records & Verification       Help  Notifications  User │  64px
├──────────────────────────────────────────────────────────────────────────────┤
│ Breadcrumbs: Institution  /  Admissions  /  Dashboard                        │
├──────────────────────┬───────────────────────────────────────────────────────┤
│                      │                                                       │
│ WORKSPACE            │  Page title                         Primary action    │
│                      │  Institution / cycle context                         │
│ Overview             │                                                       │
│                      │  Page-specific content                               │
│ ADMISSIONS           │                                                       │
│  Batches             │  Tables / forms / panels / review details             │
│  Student records     │                                                       │
│  Quarantined         │                                                       │
│                      │                                                       │
│ COMPLIANCE           │                                                       │
│  Intake matrix       │                                                       │
│  Validation          │                                                       │
│  Submission          │                                                       │
│                      │                                                       │
│ GOVERNANCE           │                                                       │
│  Audit trail         │                                                       │
│  Reports             │                                                       │
│                      │                                                       │
│ SETTINGS             │                                                       │
│  Institution setup   │                                                       │
├──────────────────────┴───────────────────────────────────────────────────────┤
│ AIRE · Help · Privacy · Last updated / system status                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Shell geometry — proposed starting values

- App header: 64px high.
- Sidebar: 256px expanded; 72px collapsed only on wide screens where icon-only navigation remains usable with accessible names and tooltips.
- Desktop content gutter: 24–32px.
- Main content maximum width: 1440px; let genuinely wide tables use available width.
- Breadcrumb row: compact, in normal document flow; do not create an additional floating header layer.
- Main heading: one H1 per route, aligned with the content grid.
- Use one scroll owner for the main content. Avoid nested scroll regions unless the interaction genuinely needs them.

### Header responsibilities

The top bar should contain only global actions and context:

- AIRE identity;
- institution/workspace selector if multiple scopes are supported;
- active cycle only if it affects the current task;
- help/support;
- notifications;
- account menu.

Do not place a second dark context bar below the main header. Do not repeat institution, cycle, profile, role and platform labels in several stacked bars.

### Sidebar behaviour

- Group items by stable task area, not by technical service or database entity.
- Show active location clearly using background + border/accent + text weight; do not rely on colour alone.
- Use icons only as supporting recognition cues. Labels remain visible on the expanded desktop sidebar.
- Keep collapse/expand controls predictable and labelled.
- On mobile, replace the fixed sidebar with a menu button and an accessible navigation drawer.
- Close the drawer after navigation; preserve focus and return focus to the trigger when dismissed.

## 2. Responsive rules

Breakpoints below are implementation starting points, not rigid UX4G values. Adjust after observing the actual content and target devices.

| Range            | Layout behaviour                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------------------- |
| 1440px and above | Expanded sidebar; full content grid; wide ledger tables                                                  |
| 1024–1439px      | Expanded or user-collapsible sidebar; reduce gutters; preserve table usability                           |
| 768–1023px       | Sidebar becomes collapsible/drawer; use two-column summaries only when they remain readable              |
| Below 768px      | Mobile-first single column; drawer navigation; stack actions; tables use deliberate responsive treatment |
| Below 480px      | Single-column form controls and summary; avoid compressed multi-column cards                             |

Do not solve mobile tables by hiding critical columns without an alternative. Options include a labelled horizontal scroll container, a concise record list with a details route, or a responsive table design that preserves all fields and actions.

## 3. Page composition standard

Most authenticated pages should follow this order:

1. Breadcrumb / location context.
2. H1 and concise explanation.
3. Relevant context (institution, academic year, batch, status).
4. Primary action, if applicable.
5. Critical alert or action-required summary, if applicable.
6. Primary task content.
7. Secondary supporting information.
8. Pagination / footer metadata where applicable.

This is a compositional guideline, not a requirement to insert an alert or card on every page.

## 4. Institution dashboard specification

### Primary user questions

1. Which institution and academic cycle am I viewing?
2. What is the current reporting/submission state?
3. What needs my attention now?
4. How many batches and records are involved?
5. What is the next safe action?
6. Where can I inspect the underlying records?

### Recommended order

**A. Page heading and context**

- H1: `Institution overview` or the approved equivalent.
- Institution name and institutional identifier.
- Academic year/reporting cycle.
- A clearly defined cycle status and source date.
- Primary action: `Upload admission batch` where the role has permission.

**B. Intake/cycle summary**

- Sanctioned intake only if authoritative capacity data is available.
- Validated admission count and scope.
- Quarantined/pending count.
- Available capacity only if the business calculation is approved and correct.
- Show the denominator and the source/cut-off for derived figures.

**C. Action required**

- Put blocking work first: records requiring correction, mapping not completed, returned submission, sign-off required, or deadline requiring action.
- If nothing requires action, say so in a neutral all-clear message. Do not render a large empty warning banner.

**D. Batch ledger**

- Recent batches, status, cycle, received date, row count, validated count, quarantined count and a clear `View` action.
- Add `View all batches` rather than displaying a very large table on the dashboard.

**E. Supporting information**

- Recent workflow events or relevant regulatory notices only when they help users act.

### Avoid

- Four or more equal-weight coloured statistic cards by default.
- `100% compliance` without a defined checklist, denominator and calculation.
- `Seats ingested` when the value is a number of rows or records.
- Unexplained labels such as `Journey J-02`, `Platform` or `Staged` unless those are recognised domain terms.
- An alert that merely restates information already shown above.

## 5. Batch upload workflow

Recommended step sequence (subject to approved product workflow):

1. **Select file** — accepted formats, template, size limit, privacy/handling guidance.
2. **Map columns** — map source columns to AIRE fields; show unmatched and ambiguous fields.
3. **Preview data** — representative rows, normalised values and row count.
4. **Validate records** — show processing status and validation summary.
5. **Resolve findings** — correct or quarantine records according to policy.
6. **Submit batch** — show what will be submitted, who is submitting and any declaration/confirmation required.
7. **Acknowledgement** — receipt/reference, timestamp, batch status and next steps.

Do not let a stepper imply that all steps are complete when the backend job is still processing. Progress must be driven by actual workflow state.

### File selection screen

- Visible label and accepted file formats.
- State size limit and template version.
- Provide a normal file-picker button; drag-and-drop is an enhancement, not the only method.
- Explain what data is processed and any relevant retention/handling notice.
- Once selected, show filename, size, selected time and a remove/replace action.
- Support cancel/retry and interrupted uploads where feasible.

### Column mapping screen

- Show the destination AIRE field and source column together.
- Use explicit labels, not placeholder-only values.
- Explain required versus optional fields.
- Highlight unmatched, duplicated or ambiguous mappings with text and icons.
- Provide sample values and transformation expectations.
- Do not auto-map silently where ambiguity could corrupt data.

### Preview and validation screen

- Give totals with clearly named units.
- Provide filters for all, passed, warning, blocking and quarantined records where these states exist in the domain model.
- Show a row-level reason and remediation instruction.
- Offer export only when permitted and safe.
- Distinguish record-level validation from batch-level submission readiness.

### Submission confirmation

Before a consequential submit/sign-off action, show:

- exact batch and institution;
- academic cycle;
- number of records included/excluded;
- remaining blocking findings;
- declaration or authority required;
- whether the action is reversible;
- what happens after submission.

Do not use a generic `Are you sure?` dialog without meaningful consequence information.

## 6. Validation and quarantine screen

The page should answer: what failed, why, how many records are affected, what can be corrected, who may correct it, and what happens next?

Recommended structure:

- Heading and batch context.
- Summary: total processed, passed, warnings, blocked/quarantined. Totals must reconcile.
- Filter controls: severity, rule, programme, status and search, as relevant.
- Findings table with record reference, field/rule, finding, severity, remediation, status and action.
- Record detail drawer/page for full context.
- Bulk actions only when the same safe action applies to every selected record.

### Finding severity

Use domain-approved categories and labels. A suggested UI distinction:

- **Blocking error:** cannot proceed until resolved or formally handled.
- **Warning:** user should review; may or may not block according to policy.
- **Information:** explanatory result; no remediation needed.
- **Quarantined:** workflow treatment applied to isolate a record pending resolution.

Do not use `error`, `warning` and `quarantined` interchangeably. A quarantined record may have one or more underlying findings.

## 7. Student record detail

Use a structured detail page, not a giant form by default.

Suggested sections/tabs:

- Record overview
- Identity and personal details (scope- and permission-controlled)
- Programme and admission details
- Eligibility and intake checks
- Evidence/documents
- Validation findings
- History and audit events (role-controlled)

Requirements:

- Mask sensitive identifiers by default when full display is unnecessary.
- Explain data provenance/source where relevant.
- Distinguish source-submitted value from normalised/verified value.
- Show corrections as a traceable change, not silent overwrites.
- Keep actions separate from read-only values.
- Never expose another student's record through navigation, search or cached state.

## 8. Reviewer decision screen

Use a decision-support layout that keeps the submission, evidence and findings connected.

- Submission summary and institution/cycle context.
- Review checklist based on approved regulatory rules.
- Findings grouped by rule/criterion with evidence references.
- Source data and submitted evidence accessible without losing review context.
- Decision options only when authorised.
- Required reason/comment for return, rejection or exception where policy requires it.
- Preview of the decision/notice before final confirmation.
- Clear confirmation and immutable event reference after the decision.

Do not use colour or a single badge as a substitute for the actual decision rationale.

## 9. Audit trail screen

An audit view should be factual and reconstructable.

Columns/fields may include:

- timestamp with timezone;
- actor and role;
- action/event type;
- target object and stable reference;
- institution/tenant scope;
- old/new values only where policy permits;
- reason/decision reference;
- event correlation/reference ID.

Provide date and event filters. Use a chronological timeline only when it helps reconstruct a single object's history; use a table for large searchable event sets. Export is a privileged action and must be logged.

## 10. Empty, loading, error and partial states

Every major page must have designed states:

- Loading: explain what is loading; use skeletons only when they preserve the expected content structure.
- Empty: state why there is no data and what action is available.
- No search results: repeat the search term and provide a clear reset action.
- Permission denied: explain that access is unavailable without revealing restricted data.
- Network error: say whether the action was saved, not saved or has an unknown outcome. Never imply success when outcome is uncertain.
- Partial success: identify exactly which records succeeded and which did not.
- Stale data: show last updated time and refresh guidance when freshness matters.
- Session expiry: preserve safe work where feasible and give a clear re-authentication path.
