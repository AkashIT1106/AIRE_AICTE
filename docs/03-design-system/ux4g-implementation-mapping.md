# AIRE — UX4G Implementation Mapping

| Metadata     | Value                                                  |
| ------------ | ------------------------------------------------------ |
| Document     | `docs/03-design-system/ux4g-implementation-mapping.md` |
| Status       | `IMPLEMENTED & VERIFIED`                               |
| Reference    | UX4G Handbook Chapters 7, 8, 9 & DTCG 2025.10          |
| Last Updated | 3 November 2026                                        |

---

## 1. Mapping Overview

This document defines how specific UX4G components, design tokens, and service-design patterns are adapted and implemented in AIRE using React, Radix UI primitives, and Tailwind CSS semantic utility classes.

AIRE does not consume the raw `ux4g-web-components` npm package directly to avoid runtime CSS collisions, un-typed web component wrappers, and violations of AIRE's strict institutional color palette (`#183B56`, `#245B75`, `#0F766E`). Instead, all UX4G interaction patterns, accessibility baselines, and layout guidelines are reconstructed into production-ready React/TypeScript primitives (Layer B) and domain workflow components (Layer C).

---

## 2. Layer B — Reusable Primitives Adaptation Matrix

| Component               | UX4G Pattern & Guidance                               | AIRE Implementation                             | Accessibility & State Contracts                                                                                                                                                             |
| ----------------------- | ----------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Button**              | Public sector action hierarchy, solid primary buttons | `ui/button.tsx`                                 | Variants: default (Navy/Action), secondary, outline, destructive, ghost, link. States: idle, hover, active, focus-visible, disabled, loading (`aria-busy="true"` + anti-double-submission). |
| **Button Group**        | Segmented toggle / toolbars                           | `ui/button-group.tsx`                           | `role="group"`, `aria-label`, responsive flex wrap.                                                                                                                                         |
| **Input**               | Clean text field with 44px touch targets on mobile    | `ui/input.tsx`                                  | States: default, focused, filled, disabled, invalid (`aria-invalid="true"`), read-only. 36px standard / 44px mobile target.                                                                 |
| **Search Input**        | Clearable query field with search landmark            | `ui/search-input.tsx`                           | Search icon, clear button (`Escape` key clear), `type="search"`, accessible name.                                                                                                           |
| **Textarea**            | Administrative remark input                           | `ui/textarea.tsx`                               | Auto-wrap, minimum height, focus ring, invalid state handling.                                                                                                                              |
| **Select**              | Dropdown option list with keyboard navigation         | `ui/select.tsx`                                 | Radix Select primitive with Arrow navigation, Esc to dismiss, accessible trigger and values.                                                                                                |
| **Checkbox**            | Mandatory compliance attestation checkbox             | `ui/checkbox.tsx`                               | Radix Checkbox, 44px hit-box target, visible focus ring.                                                                                                                                    |
| **Radio Group**         | Mutually exclusive quota category selection           | `ui/radio-group.tsx`                            | Radix RadioGroup with Arrow key cycling, visible selection indicator.                                                                                                                       |
| **Switch**              | Binary toggle for enforcement modes                   | `ui/switch.tsx`                                 | Radix Switch with sliding thumb, accessible label linkage.                                                                                                                                  |
| **Label**               | Mandatory visible label with optional required marker | `ui/label.tsx`                                  | Direct `htmlFor` association with inputs.                                                                                                                                                   |
| **Form Field**          | Accessible input wrapper with helper & error text     | `forms/FormField.tsx`, `ui/form-field.tsx`      | `aria-describedby` linking helper and error text to the control; `role="alert"` for errors.                                                                                                 |
| **Error Summary**       | UX4G & GIGW mandatory top error announcement          | `ui/error-summary.tsx`                          | `role="alert"`, focusable landmark (`tabIndex={-1}`), auto-focus on error, anchor jump to invalid fields.                                                                                   |
| **Badge / Status**      | High-contrast status indicators                       | `ui/badge.tsx`, `ui/status-indicator.tsx`       | Semantic colors (Success, Warning, Danger, Info, Masked). Never color alone; includes icons and text labels.                                                                                |
| **Alert**               | Prominent contextual notification banners             | `ui/alert.tsx`                                  | `role="alert"`, Lucide icons, WCAG AA contrast against canvas.                                                                                                                              |
| **Dialog**              | Accessible modal dialog with focus trapping           | `ui/dialog.tsx`                                 | Radix Dialog with backdrop, Esc dismissal, focus restore.                                                                                                                                   |
| **Confirmation Dialog** | Statutory irreversible action modal                   | `ui/confirmation-dialog.tsx`                    | Explicit cancel action, mandatory attestation checkbox before confirm button unlocks, destructive styling option.                                                                           |
| **Drawer**              | Off-canvas sliding detail drawer                      | `ui/drawer.tsx`                                 | Side sheet with focus trap, backdrop dismissal, mobile responsive width.                                                                                                                    |
| **Tooltip**             | Non-critical informative hint                         | `ui/tooltip.tsx`                                | Radix Tooltip with keyboard trigger, non-disruptive placement.                                                                                                                              |
| **Tabs**                | Categorized view switching                            | `ui/tabs.tsx`                                   | Radix Tabs with keyboard Arrow navigation, `aria-selected` tab state.                                                                                                                       |
| **Breadcrumbs**         | Contextual hierarchical navigation trail              | `layout/Breadcrumbs.tsx`, `ui/breadcrumbs.tsx`  | `nav aria-label="Breadcrumb"`, `aria-current="page"` on active trail.                                                                                                                       |
| **Table**               | High-density administrative data grid                 | `ui/table.tsx`                                  | Compact (36px) and standard (44px) density modes, sortable headers with sort announcements, horizontal overflow container (`tabIndex={0}`), row selection state.                            |
| **Pagination**          | Accessible multi-page navigation                      | `ui/pagination.tsx`                             | `<nav aria-label="Pagination">`, previous/next buttons, active page `aria-current="page"`, disabled bounds.                                                                                 |
| **Progress**            | Determinate processing percentage bar                 | `ui/progress.tsx`                               | `role="progressbar"`, `aria-valuenow`, smooth CSS transition with reduced-motion support.                                                                                                   |
| **Skeleton**            | Geometry-matched loading placeholder                  | `ui/skeleton.tsx`, `feedback/*Skeleton.tsx`     | Prevents layout shift (CLS $\le 0.1$). Pulse animation disabled under `prefers-reduced-motion`.                                                                                             |
| **Toast**               | Accessible live-region notifications                  | `ui/toast.tsx`                                  | `aria-live="polite"` (or `"assertive"` for errors), correlation ID copy action, persistent error toasts.                                                                                    |
| **Accordion**           | Collapsible statutory rule sections                   | `ui/accordion.tsx`                              | Radix Accordion with keyboard expand/collapse, animated height transition.                                                                                                                  |
| **Dropdown Menu**       | Action overflow and profile menus                     | `ui/dropdown-menu.tsx`                          | Radix DropdownMenu with click trigger, Esc dismissal, Arrow navigation.                                                                                                                     |
| **File Upload**         | Batch file drag-and-drop ingestion zone               | `ui/file-upload.tsx`                            | Drag-over visual feedback, file type and size restrictions, client-side validation, keyboard file picker activation.                                                                        |
| **Empty State**         | Clear zero-data illustration and recovery trigger     | `feedback/EmptyState.tsx`, `ui/empty-state.tsx` | Contextual icon, descriptive message, primary action button.                                                                                                                                |
| **Stepper**             | Staged multi-step workflow progress                   | `ui/stepper.tsx`                                | Numbered steps (completed, current, upcoming), `aria-current="step"`.                                                                                                                       |
| **Metric Card**         | Operational KPI summary card                          | `ui/metric-card.tsx`                            | Tabular numbers, trend indicators, semantic status badge.                                                                                                                                   |
| **Timeline**            | Chronological audit trail                             | `ui/timeline.tsx`                               | Vertical sequence of timestamped event nodes with status icons.                                                                                                                             |
| **Skip Link**           | First focusable keyboard element                      | `ui/skip-link.tsx`                              | Direct jump to `#main-content`, visible on focus.                                                                                                                                           |

---

## 3. Layer C — AIRE Workflow Components Adaptation Matrix

| Component                          | AIRE Regulatory Purpose                                      | Composed Primitives                                      | Data & Interaction Contract                                                                                    |
| ---------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **BatchUploadPanel**               | Ingestion interface for institutional admission batches      | `FileUpload`, `Select`, `Button`, `Alert`, `Badge`       | Typed `AdmissionBatchInput`, academic year selection, CSV template download, pre-flight parsing.               |
| **FileProcessingProgress**         | Real-time stage progress during batch reconciliation         | `Progress`, `Card`, `Badge`, `Button`                    | Deterministic stages (Parse → Check Quota → Merkle Digest), percentage bar, cancellation callback.             |
| **UploadValidationSummary**        | High-level metrics post-reconciliation                       | `MetricCard`, `Badge`, `Card`, `Button`                  | Total count, valid count, quarantined count, compliance rate, batch digest.                                    |
| **ValidationIssueSummary**         | Categorized list of statutory quota breaches & format errors | `Badge`, `Card`, `Button`                                | Grouped issue list with severity indicators and quick filter callbacks.                                        |
| **QuarantineIssueRow**             | Detail row for a quarantined student admission record        | `Badge`, `Button`, `Dialog`                              | Discrepancy highlights (DOB, category mismatch), inline remediation triggers, discard option.                  |
| **QuarantineTriageTable**          | Operational workbench for reviewing quarantined cohorts      | `Table`, `Checkbox`, `SearchInput`, `Badge`, `Button`    | Compact 36px table, bulk remediation selection, sortable columns, quick triage actions.                        |
| **StudentRecordSummary**           | Individual verified student admission certificate card       | `Card`, `Badge`, `Button`                                | Masked APAAR ID, roll number, quota allocation, merit rank, cryptographic evidence hash.                       |
| **QuotaCategoryIndicator**         | Seat reservation quota capacity meter                        | `Progress`, `Badge`, `Card`                              | Sanctioned capacity vs admitted count, vacancy balance, threshold alert ($\ge 90\%$ warning, $>100\%$ breach). |
| **DuplicateRecordComparisonPanel** | Side-by-side diff comparing conflicting admission records    | `Table`, `Badge`, `Button`                               | Side-by-side field diff highlighting discrepancies (APAAR, Roll, Category), resolve conflict actions.          |
| **SubmissionStatusTimeline**       | Sequential audit pipeline for cohort submission              | `Stepper`, `Timeline`, `Badge`                           | Draft → Uploaded → Automated Validation → Quarantined Issues Resolved → Statutory Sealed.                      |
| **InstitutionStatusPanel**         | AICTE accreditation and compliance overview                  | `MetricCard`, `Badge`, `Card`, `Button`                  | AICTE code, accreditation tier, sanctioned intake, pending quarantine issues, SLA deadline countdown.          |
| **AuditEventEntry**                | Single append-only tamper-evident audit record               | `Card`, `Badge`, `Button`                                | Actor, role, action, timestamp (IST), IP hash, SHA-256 digital digest.                                         |
| **AuditLogViewer**                 | Forensic audit explorer for statutory inspectors             | `Table`, `SearchInput`, `Select`, `Pagination`, `Button` | Filter by role, action, severity; export official CSV manifest.                                                |
| **RecordVerificationSummary**      | Official verification outcome and seal certificate           | `Card`, `Badge`, `Button`                                | Cohort ID, Merkle root hash, attesting authority, verification QR/digest, print/download triggers.             |

---

## 4. Design Token Synchronization Pipeline

1. **Tokens Source:** `client/design-tokens.json` (DTCG 2025.10 specification).
2. **Deterministic Build Pipeline:**
   ```bash
   pnpm run build:tokens
   # Invokes client/scripts/sync-tokens.js
   # Resolves aliases -> converts to CSS Custom Properties in client/src/index.css
   ```
3. **Automated Testing:** `client/src/test/design-tokens.test.ts` validates WCAG 2.2 Level AA contrast ratios ($\ge 4.5:1$ for text, $\ge 3:1$ for UI controls) mathematically for all core token pairs.
