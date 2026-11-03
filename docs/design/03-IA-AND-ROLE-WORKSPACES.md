# 03 — Information Architecture and Role Workspaces

## 1. Product-level structure

AIRE has two primary experiences:

1. **Public information portal** — explains the platform and directs authorised users to the right service.
2. **Authenticated application** — supports institutional submission, record verification, review, audit and administration.

The experiences share design tokens and components, but not page templates or navigation structures.

## 2. Role model and workspace boundary

The role names below are a UX planning model. They must be reconciled with the actual RBAC model, institution scope, data scope and policy. A role name alone does not grant access to data or actions.

### Institution workspace

**Primary goal:** prepare, submit and track admission records while resolving data-quality and eligibility findings.

Suggested navigation:

- Overview
- Admissions
  - Batches
  - Student records
  - Quarantined records
- Compliance
  - Intake and programme matrix
  - Validation findings
  - Submission and sign-off
- Governance
  - Audit trail (scope-limited)
  - Reports
- Institution settings
  - Institution profile
  - Users and access (only authorised managers)
  - Academic year and programme configuration (only authorised managers)

Keep the first-level navigation small. Use nested items only where users need to distinguish stable task areas. Do not expose links to inaccessible pages merely because they exist in the application.

### AICTE reviewer workspace

**Primary goal:** inspect submissions, evaluate records and evidence, apply policy and record a defensible decision.

Suggested navigation:

- Review overview
- Review queue
- Institutional submissions
- Record verification
- Intake and eligibility checks
- Evidence review
- Decisions and returned submissions
- Review history
- Reports (permission-scoped)

A reviewer dashboard should prioritise assigned, overdue, returned and escalated work. It should not merely duplicate the institution dashboard with different labels.

### Student workspace

**Primary goal:** understand the status of their own record and take permitted corrective action.

Suggested navigation:

- My record
- Verification status
- Correction requests
- Notifications
- Help and support

Use plain language. Do not expose internal reviewer queues, other students' records, institution-wide counts or technical audit details.

### Auditor workspace

**Primary goal:** inspect an authorised, traceable history of events and supporting evidence.

Suggested navigation:

- Audit overview
- Event search
- Submission history
- Evidence register
- Compliance reports
- Access history

The default experience should be read-only. Export and evidence access must follow the actual audit permissions and privacy policy.

### Platform administrator workspace

**Primary goal:** configure and operate the platform safely.

Suggested navigation:

- Platform overview
- Institutions and affiliations
- User provisioning
- Roles and permissions
- Academic cycles
- Programme and regulatory configuration
- Reference data
- Audit and security events
- Platform health

Keep platform-wide controls separate from institution-scoped tasks. High-impact changes require confirmation, explicit scope and an audit event.

## 3. Cross-cutting context model

The authenticated shell should make these context values discoverable where relevant:

- current workspace/role;
- active institution or organisation scope;
- academic year / reporting cycle;
- current page and parent location;
- current workflow object (batch ID, submission ID or student record ID);
- last updated time where data freshness matters.

Do not put all context in a huge header. Display persistent context only when it materially changes the user's actions or interpretation.

## 4. Public portal information architecture

Recommended public navigation:

- Home
- About AIRE
- How the process works
- Roles and responsibilities
- Resources and templates
- Help and support
- Sign in

Recommended homepage sections:

1. Identity and service description.
2. Clear sign-in route for authorised users.
3. Who uses AIRE and what each role does.
4. A factual explanation of the admission-record workflow.
5. Core service capabilities.
6. Official resources, templates and notices.
7. Support and accessibility information.
8. Footer with policies, ownership/contact details and relevant official links.

Avoid invented counters, unsupported claims such as “AI-powered verification”, decorative feature grids and marketing copy that overstates regulatory authority.

## 5. Navigation labels and terminology

Use one preferred term consistently. Proposed examples (confirm with domain owner):

| Prefer                  | Avoid mixing with                                                        |
| ----------------------- | ------------------------------------------------------------------------ |
| Sign in                 | Login, Log in, Enter portal                                              |
| Batch                   | Upload, file, submission (unless they mean different objects)            |
| Student record          | Candidate profile, student entry, record row                             |
| Validation finding      | Issue, error, defect (use a specific term when appropriate)              |
| Quarantined record      | Invalid student, rejected student                                        |
| Returned for correction | Failed, rejected (unless a formal rejection decision occurred)           |
| Submitted               | Uploaded, completed (these are not necessarily equivalent)               |
| Approved                | Verified, validated (only when the workflow state is genuinely approval) |

The terms must be aligned to the approved domain model and regulatory vocabulary before release.

## 6. Critical semantic distinction: capacity versus records

The current dashboard concept needs a domain-level correction before visual refinement.

Do not label `13 / 360 records ingested` as “intake capacity utilisation” unless those numbers really represent a valid intake calculation.

Keep these concepts separate:

- **Sanctioned intake:** approved capacity for a programme/category/academic cycle, from an authoritative source.
- **Rows received:** rows present in an uploaded batch.
- **Records passing validation:** records that passed the defined validation rules.
- **Quarantined records:** records withheld for correction or review.
- **Admitted count:** a domain-defined count of admissions, not automatically the same as rows uploaded.
- **Available capacity:** a calculated value only when AIRE has the authoritative capacity and a formally defined eligible-admission count, scope and cut-off.

Every metric needs a definition, source, time/cycle scope, unit and denominator. If those are unavailable, show the underlying counts without a derived percentage.

## 7. Information architecture review checklist

- Can a user predict where a task lives from the navigation label?
- Are related tasks grouped by the user's mental model rather than backend modules?
- Is the primary task reachable without reading multiple sections?
- Are role-specific items hidden when not authorised?
- Can users tell which institution and cycle they are working in?
- Are breadcrumb labels consistent with navigation labels?
- Are destructive/high-impact administration actions separated from routine tasks?
- Does the mobile navigation preserve access to every permitted task?
