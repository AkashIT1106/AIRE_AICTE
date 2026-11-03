# AIRE Component Adoption & Migration Matrix

**Status:** Approved Component Architecture  
**Date:** 3 November 2026  
**Audience:** Frontend Engineers, Design System Engineers, QA Engineers  
**Authority:** Derived from `docs/design/UX-DECISIONS.md`, `client/src/components/ui/`, and `client/src/components/workflow/`.

---

## 1. Inventory Summary & Classification Schema

This matrix provides the complete adoption, integration, and deprecation roadmap for all frontend components in `@aire/client`.

### Classification Schema

- **`RETAIN_UNCHANGED`**: Meets accessibility, DTCG token, and functional requirements. Zero code changes required.
- **`RETAIN_WITH_REFINEMENT`**: Robust foundation; requires minor styling token alignment or accessibility attribute additions.
- **`INTEGRATE`**: Mature workflow component currently stranded in `DesignSystemShowcase.tsx`; must be wired into functional production routes.
- **`REFACTOR`**: Architectural or logic adjustments needed (e.g. replace naive string parsing, decouple state, or replace `alert()`).
- **`DEPRECATE`**: Redundant, duplicate, or anti-pattern component to be cleanly removed after migrating call sites.
- **`REQUIRES_VERIFICATION`**: Dependent on unverified backend APIs or external domain policy approval.

---

## 2. Layer B — Reusable UI Primitives (`client/src/components/ui/`)

Total: **36 Primitives** (33 Primary + 3 Auxiliary).

| Component Name       | File Path                    | Current Status | Classification           | Target Screens / Usage       | Integration Notes & Required Tests                                                         |
| :------------------- | :--------------------------- | :------------- | :----------------------- | :--------------------------- | :----------------------------------------------------------------------------------------- |
| `Button`             | `ui/button.tsx`              | Operational    | `RETAIN_UNCHANGED`       | All screens                  | 6 CVA variants, 4 sizes. Verified in `LayerBPrimitives.test.tsx`.                          |
| `Input`              | `ui/input.tsx`               | Operational    | `RETAIN_UNCHANGED`       | Forms, search bars           | Accessible focus-ring, full type support.                                                  |
| `Select`             | `ui/select.tsx`              | Operational    | `RETAIN_UNCHANGED`       | Batch upload, filters        | Built on Radix Select. Tested in `LayerBPrimitives.test.tsx`.                              |
| `Checkbox`           | `ui/checkbox.tsx`            | Operational    | `RETAIN_UNCHANGED`       | Attestation, table selection | Radix Checkbox primitive.                                                                  |
| `RadioGroup`         | `ui/radio-group.tsx`         | Operational    | `RETAIN_UNCHANGED`       | Conflict resolution          | Radix RadioGroup primitive.                                                                |
| `Switch`             | `ui/switch.tsx`              | Operational    | `RETAIN_UNCHANGED`       | Settings toggles             | Radix Switch primitive.                                                                    |
| `Textarea`           | `ui/textarea.tsx`            | Operational    | `RETAIN_UNCHANGED`       | Notes, explanations          | Accessible multiline input.                                                                |
| `Label`              | `ui/label.tsx`               | Operational    | `RETAIN_UNCHANGED`       | All form inputs              | Radix Label with required asterisk support.                                                |
| `FormField`          | `ui/form-field.tsx`          | Operational    | `RETAIN_UNCHANGED`       | All forms                    | Built-in `useId()`, context, and `aria-describedby` wiring. Replace `forms/FormField.tsx`. |
| `Badge`              | `ui/badge.tsx`               | Operational    | `RETAIN_UNCHANGED`       | Statuses, chips              | 7 semantic variants (`success`, `warning`, `destructive`, etc.).                           |
| `Alert`              | `ui/alert.tsx`               | Operational    | `RETAIN_UNCHANGED`       | Notices, errors              | Semantic status banners (`info`, `warning`, `destructive`, `success`).                     |
| `Dialog`             | `ui/dialog.tsx`              | Operational    | `RETAIN_UNCHANGED`       | Modals, drawers              | Radix Dialog modal.                                                                        |
| `Drawer`             | `ui/drawer.tsx`              | Operational    | `RETAIN_UNCHANGED`       | Proof inspector, mobile      | Slide-out sheet.                                                                           |
| `Tooltip`            | `ui/tooltip.tsx`             | Operational    | `RETAIN_UNCHANGED`       | Action buttons, sidebar      | Radix Tooltip primitive. Wire to collapsed sidebar navigation.                             |
| `Tabs`               | `ui/tabs.tsx`                | Operational    | `RETAIN_UNCHANGED`       | Triage workbench             | Radix Tabs primitive.                                                                      |
| `Breadcrumbs`        | `ui/breadcrumbs.tsx`         | Operational    | `RETAIN_UNCHANGED`       | Page headers                 | Radix Slot breadcrumbs. Replace `layout/Breadcrumbs.tsx`.                                  |
| `Table`              | `ui/table.tsx`               | Operational    | `RETAIN_WITH_REFINEMENT` | Ledgers, logs                | Add keyboard-accessible scroll container wrapper contract (`tabIndex={0}`).                |
| `Card`               | `ui/card.tsx`                | Operational    | `RETAIN_UNCHANGED`       | Dashboard widgets            | Standard card composition primitive.                                                       |
| `Pagination`         | `ui/pagination.tsx`          | Operational    | `RETAIN_UNCHANGED`       | Long ledgers                 | Accessible pagination controls.                                                            |
| `Progress`           | `ui/progress.tsx`            | Operational    | `RETAIN_UNCHANGED`       | Ingestion progress           | Radix Progress bar.                                                                        |
| `Skeleton`           | `ui/skeleton.tsx`            | Operational    | `RETAIN_UNCHANGED`       | Loading states               | Pulse loading placeholder.                                                                 |
| `Toast`              | `ui/toast.tsx`               | Operational    | `RETAIN_UNCHANGED`       | Action feedback              | Non-critical feedback notifications.                                                       |
| `Accordion`          | `ui/accordion.tsx`           | Operational    | `RETAIN_UNCHANGED`       | Issue breakdowns             | Radix Accordion primitive.                                                                 |
| `DropdownMenu`       | `ui/dropdown-menu.tsx`       | Operational    | `RETAIN_UNCHANGED`       | Profile, tenant selector     | Radix DropdownMenu primitive.                                                              |
| `SearchInput`        | `ui/search-input.tsx`        | Operational    | `RETAIN_UNCHANGED`       | Table search bars            | Search icon + clear affordance.                                                            |
| `FileUpload`         | `ui/file-upload.tsx`         | Operational    | `RETAIN_UNCHANGED`       | Batch upload zone            | Drag-and-drop zone with validation feedback.                                               |
| `EmptyState`         | `ui/empty-state.tsx`         | Operational    | `RETAIN_UNCHANGED`       | Zero-state tables            | Replace `feedback/EmptyState.tsx`.                                                         |
| `ConfirmationDialog` | `ui/confirmation-dialog.tsx` | Operational    | `RETAIN_UNCHANGED`       | Destructive actions          | Accessible confirmation modal.                                                             |
| `ErrorSummary`       | `ui/error-summary.tsx`       | Operational    | `RETAIN_UNCHANGED`       | Form validation errors       | WCAG G199 form error summary box.                                                          |
| `Stepper`            | `ui/stepper.tsx`             | Operational    | `RETAIN_UNCHANGED`       | Multi-step workflows         | Journey step progression indicator.                                                        |
| `MetricCard`         | `ui/metric-card.tsx`         | Operational    | `RETAIN_UNCHANGED`       | KPI dashboards               | Metric card with status and trend support.                                                 |
| `Timeline`           | `ui/timeline.tsx`            | Operational    | `RETAIN_UNCHANGED`       | Audit history                | Vertical progression timeline.                                                             |
| `StatusIndicator`    | `ui/status-indicator.tsx`    | Operational    | `RETAIN_UNCHANGED`       | Status tables                | Dot + text status indicator.                                                               |
| `Separator` (Aux)    | `ui/separator.tsx`           | Operational    | `RETAIN_UNCHANGED`       | Menus, cards                 | Radix Separator.                                                                           |
| `SkipLink` (Aux)     | `ui/skip-link.tsx`           | Operational    | `INTEGRATE`              | `AppShell.tsx`               | Mount immediately inside `AppShell.tsx` body.                                              |
| `ButtonGroup` (Aux)  | `ui/button-group.tsx`        | Operational    | `RETAIN_UNCHANGED`       | Segmented controls           | Multi-button group.                                                                        |

---

## 3. Layer C — Domain Workflow Components (`client/src/components/workflow/`)

Total: **14 Workflow Modules** across 15 Source Files.

| Component Name                       | File Path                                     | Current Status | Classification     | Target Production Route             | Action & Required Test                                                                                                                                    |
| :----------------------------------- | :-------------------------------------------- | :------------- | :----------------- | :---------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`BatchUploadPanel`**               | `workflow/BatchUploadPanel.tsx`               | Showcase only  | `INTEGRATE`        | `/institution/submissions/new`      | Replace naive upload form in `BatchUploadPage.tsx`. Connect `onUpload` to `SubmissionsApi.createBatch()`. Test multi-step transitions and header mapping. |
| **`FileProcessingProgress`**         | `workflow/FileProcessingProgress.tsx`         | Showcase only  | `INTEGRATE`        | Batch upload async modal            | Mount when upload is in-flight. Verify live region announcements.                                                                                         |
| **`UploadValidationSummary`**        | `workflow/UploadValidationSummary.tsx`        | Showcase only  | `INTEGRATE`        | `/institution/submissions/new`      | Embed in Preview step of `BatchUploadPanel`.                                                                                                              |
| **`QuarantineTriageTable`**          | `workflow/QuarantineTriageTable.tsx`          | Showcase only  | `INTEGRATE`        | `/institution/submissions/:batchId` | Replace inline table in `QuarantineTriagePage.tsx`. Connect `onRemediate` to `SubmissionsApi.remediateRow()`.                                             |
| **`QuarantineIssueRow`**             | `workflow/QuarantineIssueRow.tsx`             | Sub-component  | `RETAIN_UNCHANGED` | `QuarantineTriageTable`             | Verified in `LayerCContractStress.test.tsx`.                                                                                                              |
| **`ValidationIssueSummary`**         | `workflow/ValidationIssueSummary.tsx`         | Sub-component  | `RETAIN_UNCHANGED` | `QuarantineTriageTable`             | Accordion error breakdown.                                                                                                                                |
| **`RecordVerificationSummary`**      | `workflow/RecordVerificationSummary.tsx`      | Showcase only  | `INTEGRATE`        | `/institution/submissions/:batchId` | Mount in batch details tab to summarize APAAR verification rate.                                                                                          |
| **`QuotaCategoryIndicator`**         | `workflow/QuotaCategoryIndicator.tsx`         | Showcase only  | `INTEGRATE`        | `/institution/dashboard`            | Replace hardcoded 360 capacity bar in `InstitutionDashboard.tsx`. Connect to live quota allocations.                                                      |
| **`DuplicateRecordComparisonPanel`** | `workflow/DuplicateRecordComparisonPanel.tsx` | Showcase only  | `INTEGRATE`        | Remediation modal                   | Mount when duplicate candidate conflict occurs in quarantine triage.                                                                                      |
| **`StudentRecordSummary`**           | `workflow/StudentRecordSummary.tsx`           | Showcase only  | `INTEGRATE`        | `/student/record`                   | Replace hardcoded HTML card in `StudentRecordPage.tsx`.                                                                                                   |
| **`InstitutionStatusPanel`**         | `workflow/InstitutionStatusPanel.tsx`         | Showcase only  | `INTEGRATE`        | `/institution/dashboard`            | Mount at top of `InstitutionDashboard.tsx` to display official regulatory standing.                                                                       |
| **`SubmissionStatusTimeline`**       | `workflow/SubmissionStatusTimeline.tsx`       | Showcase only  | `INTEGRATE`        | `/institution/submissions/:batchId` | Mount in sidebar or header of batch details to show lifecycle milestones.                                                                                 |
| **`AuditLogViewer`**                 | `workflow/AuditLogViewer.tsx`                 | Showcase only  | `INTEGRATE`        | `/auditor/logs`                     | Replace static table in `AuditorLogsPage.tsx`. Connect to audit read API when available.                                                                  |
| **`AuditLogFilter`**                 | `workflow/AuditLogFilter.tsx`                 | Sub-component  | `RETAIN_UNCHANGED` | `AuditLogViewer`                    | Self-contained filter bar.                                                                                                                                |
| **`AuditEventEntry`**                | `workflow/AuditEventEntry.tsx`                | Sub-component  | `RETAIN_UNCHANGED` | `AuditLogViewer`                    | Cryptographic proof inspector drawer.                                                                                                                     |

---

## 4. Components Slated for Deprecation & Removal

To maintain documentation and codebase integrity, redundant components must be cleanly eliminated:

| Deprecated Component   | File Path                                       | Replacement Component                      | Motivation & Migration Action                                                                                                                                              |
| :--------------------- | :---------------------------------------------- | :----------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FormField` (legacy)   | `client/src/components/forms/FormField.tsx`     | `client/src/components/ui/form-field.tsx`  | Legacy component lacks React `useId()`, accessibility context, and error-linkage. Update imports across all pages to `@/components/ui/form-field`, then delete file.       |
| `EmptyState` (legacy)  | `client/src/components/feedback/EmptyState.tsx` | `client/src/components/ui/empty-state.tsx` | Exact functional duplicate of Layer B primitive. Update imports in `InstitutionDashboard` and `SubmissionsHistoryPage` to `@/components/ui/empty-state`, then delete file. |
| `Breadcrumbs` (legacy) | `client/src/components/layout/Breadcrumbs.tsx`  | `client/src/components/ui/breadcrumbs.tsx` | Legacy layout component renders custom `<ol>` instead of standard Radix Slot primitives. Refactor `Breadcrumbs.tsx` to compose `ui/breadcrumbs.tsx`.                       |

---

## 5. Integration Verification & Quality Gates

Before marking any component migration as complete, the following automated checks must execute and pass:

1. **Unit Contract Tests:** Run Vitest suite: `pnpm --filter @aire/client test`.
2. **TypeScript Compilation:** Strict compilation check: `pnpm --filter @aire/client typecheck`.
3. **Accessibility Pass:** Axe-core accessibility assertions (zero `critical` or `serious` violations).
4. **Zero Layout Shift:** Confirm CLS score $\le 0.1$ across all 7 standard viewports using `infrastructure/scripts/ux4g-browser-check.py`.

---

_End of COMPONENT-ADOPTION-MATRIX.md._
