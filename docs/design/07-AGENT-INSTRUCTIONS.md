# 07 — AI Agent Instructions for AIRE UI/UX

Paste the concise rules into the repository's `AGENTS.md`, then keep this file as the detailed source of truth. Adapt file paths to the actual repository after inspecting it.

## 1. Mandatory instruction for every UI task

Before changing any UI, read:

- `01-DESIGN-GOVERNANCE.md`
- `02-DESIGN-TOKENS.css`
- `03-IA-AND-ROLE-WORKSPACES.md`
- `04-APPLICATION-SHELL-AND-SCREEN-PATTERNS.md`
- `05-COMPONENT-STANDARDS.md`
- `06-A11Y-AND-QUALITY-GATES.md`

Also inspect the existing implementation, design tokens, route structure, component library, RBAC contracts and relevant API schemas. Do not assume the markdown files override a newer approved product decision; report conflicts and resolve them explicitly.

## 2. Research before implementation

When the task depends on UX4G, GIGW, WCAG, browser, framework or library behaviour:

1. Locate the current official documentation.
2. Record the URL, version/date where provided and the specific requirement.
3. Do not invent API props, component behaviour or compliance rules.
4. Prefer official sources over blogs and prompt snippets.
5. If a rule cannot be verified, mark it as an assumption and request review rather than presenting it as an official requirement.

Do not browse randomly. Research only the design/technical decisions relevant to the task.

## 3. Required task workflow

Before writing code, produce a short design implementation brief containing:

- target role and permission scope;
- user task and success outcome;
- route and navigation location;
- data entities and API contracts involved;
- primary and secondary actions;
- screen states (loading, empty, error, success, partial, permission denied);
- applicable UX4G pattern/component;
- responsive behaviour;
- accessibility risks;
- components/tokens to reuse;
- files likely to change.

For a new complex screen, create or update a wireframe/specification before high-fidelity implementation. For a small change to an existing approved component, do not create unnecessary process overhead.

## 4. Hard implementation constraints

- Use design tokens; do not introduce raw hex colours, arbitrary Tailwind palette classes, random spacing or local one-off radii in product components.
- Reuse existing shared components before adding a new one.
- Never introduce gradients, glassmorphism, glow, random purple, rainbow palettes or decorative animation unless explicitly approved in a UX decision record.
- Do not add a new icon library for one screen.
- Do not turn every piece of data into a card.
- Do not invent chart data, statuses, deadlines, compliance values or workflow transitions.
- Do not use UI visibility as a substitute for backend authorisation.
- Do not change RBAC, data contracts, validation logic or business rules during a visual-only task.
- Do not claim GIGW/STQC/WCAG certification without evidence and formal assessment.
- Preserve existing working behaviour unless the task explicitly changes it.

## 5. Quality gate before reporting completion

The agent must report:

1. Files changed.
2. Existing components reused and new components added.
3. Tokens used or modified.
4. Routes/roles affected.
5. Loading/empty/error/success states addressed.
6. Responsive viewports checked.
7. Accessibility checks performed and any remaining manual checks.
8. Tests, typecheck, lint and build results actually executed.
9. Known gaps and decisions requiring product-owner approval.

Never say a test passed unless it was actually run and passed.

## 6. Suggested repository structure

Adapt to the current project; do not reorganise the entire repository just to match this example.

```text
src/
  app/
    layouts/
      PublicLayout.tsx
      InstitutionLayout.tsx
      ReviewerLayout.tsx
      StudentLayout.tsx
      AuditorLayout.tsx
      AdminLayout.tsx
  components/
    ui/                 # stable reusable primitives
    patterns/           # AIRE workflow compositions
    layout/             # header, sidebar, breadcrumbs, page header
  features/
    institution/
    admissions/
    validation/
    submissions/
    review/
    audit/
    students/
    administration/
  styles/
    tokens.css
    globals.css
  docs/
    design/
      01-DESIGN-GOVERNANCE.md
      02-DESIGN-TOKENS.css
      03-IA-AND-ROLE-WORKSPACES.md
      04-APPLICATION-SHELL-AND-SCREEN-PATTERNS.md
      05-COMPONENT-STANDARDS.md
      06-A11Y-AND-QUALITY-GATES.md
      UX-DECISIONS.md
```

## 7. Suggested PR checks

Gradually automate these controls:

- lint rule or style check discouraging raw colour literals in feature components;
- token inventory check to identify unapproved token additions;
- component-story coverage for important states;
- axe accessibility smoke tests on critical routes;
- Playwright keyboard and workflow smoke tests;
- screenshot regression at desktop/tablet/mobile viewport sizes;
- no unintended horizontal overflow;
- typecheck, lint, unit tests and production build.

Start with warnings and reporting, then make stable checks blocking. Avoid brittle scripts that forbid legitimate exceptions without a review mechanism.

## 8. Prompt template for a screen redesign

```text
Redesign/implement [SCREEN NAME] for [ROLE] in AIRE.

First inspect the existing route, feature code, API contracts, permissions,
shared components and AIRE design governance files.
Do not start by inventing a visual layout.

Return a brief covering:
- the user's primary task and expected outcome;
- domain data and permissions;
- information hierarchy and page structure;
- applicable UX4G component/pattern;
- primary and secondary actions;
- loading, empty, error, partial and success states;
- desktop, tablet and mobile behaviour;
- keyboard and screen-reader requirements;
- existing components and tokens to reuse.

Then implement only after the structure is consistent with the design system.
Do not introduce unapproved colours, gradients, card styles, radii, shadows,
icon sets or animations. Do not change business logic or RBAC as part of
visual work. Use real API states and never invent successful outcomes.

Before completion, run the relevant checks and report actual results,
files changed, known gaps and any design-system deviations.
```

## 9. Multi-agent workflow (if agents are used)

Use sequential ownership, not several agents independently styling the same page:

1. **Product/domain analyst:** validates role, task, terms, states and data meaning.
2. **UX architect:** defines flow, IA, wireframe and error recovery.
3. **Design-system engineer:** confirms tokens, components and patterns.
4. **Frontend implementer:** builds within the approved specification.
5. **Accessibility/QA reviewer:** independently tests the implementation.
6. **Design owner:** approves deviations and closes the gate.

Agents must pass artefacts forward. The implementer must not reinterpret the business workflow from a screenshot alone.
