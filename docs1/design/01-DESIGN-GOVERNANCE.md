# 01 — AIRE Design Governance

## 1. Product design position

AIRE should feel like a **mature institutional records and regulatory operations platform**: trustworthy, restrained, clear, precise and accountable.

It must not look like:

- a generic SaaS admin template with government logos added afterwards;
- an analytics dashboard where every number becomes a chart or card;
- an AI-themed product full of gradients, glow, glassmorphism and decorative animation;
- a collection of screens designed independently by different agents;
- a public marketing website reused as the authenticated application shell.

AIRE's visual quality must come from information hierarchy, reliable interaction, consistency, readable content and transparent status communication.

## 2. Design authority hierarchy

Use references for the decisions they are qualified to guide. Do not blend every reference into one visual style.

| Authority                       | Governs                                                                                     | How AIRE uses it                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| UX4G Design System 3.0          | Government-service foundations, components, patterns, accessibility and content guidance    | Primary reusable design foundation                    |
| GIGW 3.0                        | Government website/application quality, accessibility, cybersecurity and lifecycle guidance | Applicable requirements and evaluation reference      |
| Nielsen Norman Group            | Usability heuristics, research, IA and interaction evaluation                               | UX decision and testing reference                     |
| Apple HIG                       | Clarity, consistency, user control, feedback and recovery                                   | Craft and interaction refinement                      |
| UIDAI, myScheme, iGOT Karmayogi | Real-world government service organisation and communication                                | Reference examples, never copied wholesale            |
| AIRE domain requirements        | Regulatory workflows, roles, data meaning and permissions                                   | Final authority for product behaviour and terminology |

### Conflict resolution

1. Applicable law, official government requirements and approved AIRE policy take precedence.
2. Accessibility and security requirements cannot be weakened for visual preference.
3. AIRE domain rules determine whether a user may see or perform an action.
4. UX4G component behaviour should be retained unless a documented AIRE requirement makes an adaptation necessary.
5. NNG and Apple principles guide interpretation and refinement; they do not override domain correctness.
6. Record material deviations in `UX-DECISIONS.md` with reason, impact, owner and review date.

## 3. Design constitution — non-negotiable principles

### 3.1 Institutional trust

- Use a restrained palette, consistent typography and stable navigation.
- Make the organisation, workspace, academic year/cycle and current task understandable.
- Distinguish prototype identity from official government ownership or endorsement.
- Use official marks only when their use is authorised and the correct asset is available.

### 3.2 Clarity before decoration

Every visible element must perform at least one job: identify, explain, organise, indicate status, accept input, navigate or support a decision. Remove decorative objects that do none of these.

### 3.3 Task orientation

Design from the user's next task and decision, not from a desire to fill the viewport. Put the most important action and information where the user expects them.

### 3.4 Information integrity

- UI labels must match the domain state.
- A record passing schema validation is not automatically regulator-approved.
- A batch being uploaded is not the same as being submitted.
- A submitted batch is not automatically accepted.
- Every aggregate must have a clear definition, unit, denominator and source.
- Never fabricate progress, compliance percentages, counts, deadlines or audit events for a production UI.

### 3.5 Progressive disclosure

Show the essential summary first; reveal row-level errors, technical details, evidence and secondary configuration when they are relevant. Do not hide information needed to make a safe decision.

### 3.6 Consistency

One concept has one stable name. One component type has one stable visual and behavioural contract. A new page should compose existing patterns before inventing new ones.

### 3.7 Accessibility by default

Semantic HTML, keyboard operation, visible focus, programmatic labels, announced status changes, contrast and zoom support are design requirements, not polishing tasks.

### 3.8 Privacy by design

- Only show data required for the role and task.
- Mask sensitive identifiers where full values are not necessary.
- Do not leak data in browser titles, toast messages, URLs, screenshots or exports.
- Do not imply that a UI-only restriction is authorisation. Backend and database controls remain authoritative.

### 3.9 Recoverability

Explain what happened, what is affected and how to proceed. Preserve user work where possible. Make reversible actions reversible and destructive actions deliberate.

### 3.10 Resilience

Design for constrained devices, interrupted networks, slower connections, multilingual text, 200% zoom and keyboard-only operation.

## 4. AIRE visual direction

**Personality:** official, calm, precise, service-oriented, information-dense when necessary, never ornamental.

**Palette direction:** deep navy + restrained blue + limited teal accent + neutral surfaces. Semantic colours are reserved for genuine system meaning.

**Typography:** Noto Sans as the primary UI typeface; use a sensible system fallback. Noto Sans Display may be reserved for large public-facing hero typography, not routine app screens.

**Iconography:** use one consistent icon family. UX4G's designer guidance specifies Material Design Icons as its default and 24px icon slots; if AIRE retains another family, map icons consistently and keep optical size/stroke consistent. Do not mix icon packs ad hoc.

**Surfaces:** mostly flat, white or neutral panels with subtle borders. Shadows are for clear layering (menus, popovers, dialogs), not decoration.

**Shape:** use a restrained radius scale. Avoid making every control and container pill-shaped.

**Imagery:** use real, relevant institutional/process imagery only when it adds meaning. No random stock illustrations, pseudo-3D dashboards or fake AI visuals.

## 5. Anti-slop policy

### Prohibited by default

- purple AI aesthetics or uncontrolled rainbow palettes;
- gradients, glow, glassmorphism and blur effects as decoration;
- excessive rounded cards, pills and floating panels;
- huge empty hero sections in operational workspaces;
- giant decorative icons and arbitrary illustrations;
- charts for values better communicated as text or a table;
- multiple competing primary buttons;
- inconsistent icon sets, typography, radii or shadows;
- card grids used as a substitute for information architecture;
- large banners for non-critical notices;
- fabricated counters, percentages, status labels or activity;
- novelty navigation patterns that make common tasks harder;
- animations that do not explain state or provide meaningful feedback.

Exceptions require a documented reason and review. A prohibition is not an excuse to remove useful visual hierarchy or meaningful feedback.

## 6. Public portal versus authenticated product

Treat these as two products sharing foundations, not one page template.

### Public information portal

Purpose: explain what AIRE is, who it serves, what the process involves, where to get help and how authorised users access the service.

- Use a compact identity/utility area and a conventional primary navigation.
- Prefer direct service information over promotional claims.
- Explain the roles and real process in plain language.
- Provide policy, accessibility, help and contact information.
- Use restrained imagery only when it improves understanding.

### Authenticated workspaces

Purpose: complete admission, verification, review, audit and administration tasks.

- Use a persistent app shell.
- Give role-specific navigation.
- Make institution, academic year/cycle and record context clear.
- Prioritise action queues, workflow state and data tables.
- Do not reuse a landing-page hero or public navigation inside the workspace.

## 7. UX decision record template

For any non-trivial design choice, record:

- **Decision:** What will be done?
- **Context:** Which role, task and workflow does it affect?
- **Evidence:** Which research, UX4G pattern, GIGW criterion or user finding supports it?
- **Alternatives:** What else was considered?
- **Impact:** Accessibility, responsive, privacy, performance and engineering effects.
- **Owner/date:** Who approved it and when?
- **Review trigger:** What evidence would cause reconsideration?

## 8. Reference principles to test against

- NNG: visibility of system status, match to real world, user control, consistency, error prevention, recognition over recall, flexibility, minimalist but sufficient information, error recovery and help.
- Apple HIG: clarity, consistency, feedback, familiarity, user control, recovery, privacy and responsibility.
- UX4G: progressive disclosure, immediate feedback, consistent navigation, mobile-first approach, accessibility and multilingual readiness.

Do not quote these as slogans in a prompt; convert each into an observable screen requirement and test case.
