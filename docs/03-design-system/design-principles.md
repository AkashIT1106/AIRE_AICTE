# Practical Design Principles

| Metadata             | Value                                                                                                                                         |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/03-design-system/design-principles.md`                                                                                                  |
| Authoritative For    | Behavioral Axioms, UX Philosophy, Developer Operational Rules                                                                                 |
| Status               | `CONFIRMED AXIOMS`                                                                                                                            |
| Upstream Source      | [`docs/02-experience/experience-overview.md`](../02-experience/experience-overview.md) §1, §2, [`design-rationale.md`](./design-rationale.md) |
| Related Requirements | [`AIRE-REQ-078`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-083`](../00-governance/requirements-traceability.md)            |
| Last Updated         | 2 November 2026                                                                                                                               |

---

## 1. Visual Direction: Restrained Institutional Clarity

AIRE is designed around **Restrained Institutional Clarity**.

Technical education regulation involves statutory consequences: institutional approval revocation, candidate admission invalidation, penalty seat reductions, and judicial review. An interface serving this domain cannot adopt generic commercial SaaS dashboard tropes (such as purple gradients, floating cards, or mascot illustrations), nor can it mimic obsolete, unstyled government portals.

```
+-------------------------------------------------------------------------------------------+
| PROHIBITED AESTHETICS (Generic SaaS)        | APPROVED PRINCIPLE (Institutional Clarity)  |
| - Purple/neon/indigo default styling        | - Restrained Institutional Navy (#173B57)   |
| - Decorative gradients & glassmorphism      | - High-contrast, opaque surface cards       |
| - Decorative AI artwork & glowing cards     | - Neutral-first canvas with focused accents |
| - Color as sole carrier of status           | - Color + SVG icon + explicit text badge    |
| - Confetti animations on completion         | - Monospace Merkle receipt with timestamp   |
| - Unlabeled icon-only triggers              | - Explicitly labeled buttons with tooltips  |
+-------------------------------------------------------------------------------------------+
```

---

## 2. Operational UX Principles & Developer Rules

### Principle 1: Recognition Over Recall

Users should not need to remember record identifiers, previously entered values, selections, or workflow context unnecessarily.

- **Developer DO:**
  - Display persistent workspace context chips in the global header (e.g. `Delhi Institute of Technology (INST-101)`).
  - Use structured breadcrumbs and badges so users can identify cohort cycle (`2026-27`) and branch without memorizing IDs.
  - Pre-populate known institution codes and quota ceilings from the backend rather than asking users to re-enter them.
- **Developer DON'T:**
  - Do not require users to remember batch IDs or row numbers when navigating from triage to remediation views.
  - Do not clear form inputs when a single field validation fails.
  - Do not use ambiguous icon-only table action buttons without explanatory labels or accessible tooltips.

---

### Principle 2: Error Prevention and Recovery

Prevent foreseeable mistakes, explain errors clearly, preserve user input, and provide a meaningful recovery path.

- **Developer DO:**
  - Enforce input constraints at entry time (e.g., numeric input types, restricted date pickers, constrained dropdowns).
  - Group and clearly highlight defective fields in quarantine tables with actionable inline remediation modals.
  - Provide a distinct `Correlation ID` on server error messages with a one-click copy button and a retry trigger.
- **Developer DON'T:**
  - Do not reject an entire 500-student batch because 3 rows have typographical defects (use AIRE Quarantine Isolation).
  - Do not emit vague error messages such as `"Invalid input"` or `"Server Error"`.
  - Do not auto-dismiss error alerts or notifications while the user is actively working.

---

### Principle 3: Clear Information Hierarchy

Use typography, grouping, spacing, and layout before relying on color or decoration.

- **Developer DO:**
  - Establish visual hierarchy through the canonical type scale: H1 (`font-size-2xl`), H2 (`font-size-xl`), Card Header (`font-size-lg`), Body (`font-size-base`).
  - Reserve the solid Brand Navy button (`bg-brand-primary`) for the single most consequential primary action on a view.
  - Separate logical sections using standard container borders (`border-border-default`) and consistent spacing (`space-6`).
- **Developer DON'T:**
  - Do not create multiple solid primary buttons competing for visual priority on the same screen.
  - Do not use bright accent colors merely to make a passive card or metric look visually interesting.
  - Do not rely on decorative background patterns or drop-shadows to define content boundaries.

---

### Principle 4: Consistent Interaction Patterns

The same action, status, error, and component should behave consistently across workspaces.

- **Developer DO:**
  - Consume established Radix + shadcn/ui components (`client/src/components/ui/`) across all workspaces (AICTE, Institution, Student, Auditor).
  - Ensure status badges always render the same semantic color-icon-text triplet across all views (e.g., `CheckCircle2` for Compliant, `AlertTriangle` for Quarantine).
  - Maintain consistent keyboard navigation (`Enter` to submit, `Escape` to close modals, `Tab` to traverse controls).
- **Developer DON'T:**
  - Do not invent custom ad-hoc button styles, non-standard badge colors, or arbitrary padding in individual page files.
  - Do not create one-off modal dialogs with inconsistent button placements (always place `Cancel` on the left and primary confirm on the right).
  - Do not use disparate date formats (standardize on `YYYY-MM-DD` or `DD MMM YYYY`).

---

### Principle 5: Progressive Disclosure

Expose the information needed for the current task without hiding essential context or making critical information difficult to discover.

- **Developer DO:**
  - Keep high-density data tables focused on primary scanning attributes (Roll Number, Candidate Name, Quota, Merit Rank, Status).
  - Surface deep statutory citations, rule traces, and uploaded affidavit evidence inside slide-over contextual drawers.
  - Use accordion rows or expandable drawer inspectors to preserve the operator's scroll position and context.
- **Developer DON'T:**
  - Do not dump 30 columns into a single unfilterable data table forcing endless horizontal scrolling.
  - Do not hide critical error details or regulatory breach warnings behind obscure multi-step navigation paths.
  - Do not navigate users away to separate full-page screens for minor single-record triage tasks.

---

### Principle 6: Privacy Awareness

Make data visibility, masking, and purpose-related context understandable without unnecessarily exposing sensitive information.

- **Developer DO:**
  - Apply the `masked` semantic token (`bg-masked-bg border-masked-border text-masked-text`) to all pseudonymized fields.
  - Display protected student identifiers in masked monospace format (e.g., `••••-••••-8821` for APAAR).
  - Pair masked data with the `Lock` icon to communicate active Identity Vault shielding.
- **Developer DON'T:**
  - Do not render raw Aadhaar numbers or full personal identity numbers in DOM elements or client network responses.
  - Do not display unneeded personal student details (e.g. personal phone numbers or caste certificates) on public verification terminals.
  - Do not log sensitive student attributes to browser console logs or error reports.

---

### Principle 7: Appropriate Information Density

Support institutional data-heavy workflows without sacrificing readability, navigation, keyboard access, or responsive behavior.

- **Developer DO:**
  - Enforce `36px` compact row heights (`.table-compact`) for institutional cohort ledgers and triage workbenches.
  - Use tabular monospace numerals (`font-mono font-tabular`) for roll numbers, rank figures, quota ratios, and hash digests.
  - Ensure all high-density table cells maintain sufficient padding (`py-1 px-3`) and text contrast ($\ge 4.5:1$).
- **Developer DON'T:**
  - Do not use consumer SaaS table row heights ($64\text{px}$–$72\text{px}$) for registrar workbenches, as this shows only 6–8 rows per screen.
  - Do not sacrifice touch accessibility on mobile or tablet views (provide responsive adaptations or standard `44px` density).
  - Do not truncate roll numbers or quota counts with ellipsis when numerical precision is critical.

---

### Principle 8: Predictable Consequential Actions

Distinguish routine actions from consequential actions. Use confirmation or review patterns only where supported by requirements and risk.

- **Developer DO:**
  - Allow routine actions (e.g. filtering, searching, editing draft remarks) to execute immediately without annoying confirmation modals.
  - Require double-confirmation dialogs exclusively for irreversible regulatory actions (e.g. Sealing a Cohort, Issuing a Show Cause notice).
  - In confirmation dialogs, clearly describe the irreversible consequences and display the calculated cryptographic checksum.
- **Developer DON'T:**
  - Do not prompt confirmation modals on standard data entry or harmless reversible filter changes.
  - Do not provide a generic "Are you sure?" modal without explaining the exact legal or data consequence of the action.
  - Do not style routine buttons with destructive red styling.
