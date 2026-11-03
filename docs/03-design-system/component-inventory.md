# AIRE Component Inventory

| Metadata     | Value                                          |
| ------------ | ---------------------------------------------- |
| Document     | `docs/03-design-system/component-inventory.md` |
| Status       | `IMPLEMENTATION REGISTER`                      |
| Last Updated | 3 November 2026                                |

Layer A: tokens in `client/design-tokens.json`. Layer B: primitives. Layer C: workflow compositions (no backend).

## Layer B — Primitives

| Component                      | Variants / states                                                                                                  | A11y baseline                                                         | Location                                  |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- | ----------------------------------------- |
| Button                         | primary, secondary, outline, destructive, ghost, link; sm/default/lg/icon; hover, focus, active, disabled, loading | Native button; `aria-busy` when loading; icon-only needs `aria-label` | `ui/button.tsx`                           |
| Icon button                    | size icon; same states                                                                                             | Accessible name required                                              | Button `size="icon"`                      |
| Button group                   | grouped actions                                                                                                    | `role="group"` + `aria-label`                                         | `ui/button-group.tsx`                     |
| Input                          | idle, focus, error, disabled, readonly                                                                             | Visible label via FormField; `aria-invalid`; describedby              | `ui/input.tsx`                            |
| Search input                   | idle, filled, clear, disabled                                                                                      | `type="search"`; labelled                                             | `ui/search-input.tsx`                     |
| Textarea                       | same as input                                                                                                      | Same                                                                  | `ui/textarea.tsx`                         |
| Select                         | open/closed, disabled                                                                                              | Radix combobox/listbox pattern                                        | `ui/select.tsx`                           |
| Checkbox                       | checked, unchecked, disabled                                                                                       | Radix checkbox                                                        | `ui/checkbox.tsx`                         |
| Radio group                    | selected, disabled                                                                                                 | Radix radio group                                                     | `ui/radio-group.tsx`                      |
| Switch                         | on/off, disabled                                                                                                   | Radix switch                                                          | `ui/switch.tsx`                           |
| Label                          | optional required marker                                                                                           | `htmlFor`                                                             | `ui/label.tsx`                            |
| Form field                     | helper, error                                                                                                      | Error `role="alert"`; describedby                                     | `forms/FormField.tsx`                     |
| Error summary                  | list of field errors                                                                                               | Landmark/alert; links to fields                                       | `ui/error-summary.tsx`                    |
| Badge / status                 | success, warning, danger, info, masked, outline                                                                    | Text label; never colour-only                                         | `ui/badge.tsx`, `ui/status-indicator.tsx` |
| Alert                          | default, info, success, warning, destructive                                                                       | `role="alert"`                                                        | `ui/alert.tsx`                            |
| Dialog                         | open/close                                                                                                         | Focus trap/restore (Radix); title required                            | `ui/dialog.tsx`                           |
| Confirmation dialog            | attest/disabled confirm                                                                                            | Same + explicit cancel                                                | `ui/confirmation-dialog.tsx`              |
| Drawer                         | right sheet                                                                                                        | Dialog semantics, Escape                                              | `ui/drawer.tsx`                           |
| Tooltip                        | delay, disabled                                                                                                    | Radix tooltip                                                         | `ui/tooltip.tsx`                          |
| Tabs                           | selected                                                                                                           | keyboard arrows (Radix)                                               | `ui/tabs.tsx`                             |
| Accordion                      | collapsed/expanded                                                                                                 | Radix                                                                 | `ui/accordion.tsx`                        |
| Dropdown menu                  | open                                                                                                               | Radix menu                                                            | `ui/dropdown-menu.tsx`                    |
| Breadcrumbs                    | current page                                                                                                       | `nav` + `aria-current`                                                | `layout/Breadcrumbs.tsx`                  |
| Table                          | compact/standard; empty                                                                                            | caption, `th` scope                                                   | `ui/table.tsx`                            |
| Pagination                     | first/prev/next; disabled ends                                                                                     | nav labelled                                                          | `ui/pagination.tsx`                       |
| Progress                       | determinate                                                                                                        | `role="progressbar"` valuemin/max/now                                 | `ui/progress.tsx`                         |
| Skeleton                       | pulse / reduced-motion static                                                                                      | `aria-hidden`                                                         | `ui/skeleton.tsx`                         |
| Toast                          | info, success, warning, error; error persists                                                                      | `aria-live` polite/assertive                                          | `ui/toast.tsx`                            |
| Card                           | header/content/footer                                                                                              | heading in title                                                      | `ui/card.tsx`                             |
| File upload                    | idle, drag, selected, error, disabled                                                                              | keyboard opens picker                                                 | `ui/file-upload.tsx`                      |
| Empty / loading / error states |                                                                                                                    | descriptive text + action                                             | `feedback/*`                              |
| Skip link                      |                                                                                                                    | first focusable; jumps to `#main-content`                             | `ui/skip-link.tsx`                        |
| Stepper                        | complete, current, upcoming                                                                                        | ordered list + current announced                                      | `ui/stepper.tsx`                          |
| Filter bar                     | fields + apply/reset                                                                                               | form                                                                  | `ui/filter-bar.tsx`                       |
| Metric card                    | labelled value + status                                                                                            | text, not colour-only                                                 | `ui/metric-card.tsx`                      |
| Timeline                       | complete/current/upcoming                                                                                          | ol                                                                    | `ui/timeline.tsx`                         |

## Layer C — AIRE workflow compositions

Presentational. Typed props/callbacks. Fictional demo data only in the showcase.

| Composition                 | Purpose                                      |
| --------------------------- | -------------------------------------------- |
| `BatchUploadPanel`          | Dropzone + file meta + primary upload action |
| `FileProcessingProgress`    | Named stages + percent                       |
| `UploadValidationSummary`   | Counts accepted / quarantined / rejected     |
| `ValidationIssueSummary`    | Grouped issue list with severity labels      |
| `QuarantineIssueRow`        | Single defective row with reason             |
| `QuarantineTriageTable`     | Dense table of quarantine rows               |
| `StudentRecordSummary`      | Masked identifiers + programme               |
| `QuotaCategoryIndicator`    | Category vs approved intake                  |
| `DuplicateRecordComparison` | Side-by-side field diff                      |
| `SubmissionStatusTimeline`  | Draft → sealed → locked                      |
| `InstitutionStatusPanel`    | Approval / reporting status                  |
| `AuditEventEntry`           | Actor, action, time, correlation id          |
| `AuditLogFilter`            | Date, action, actor filters                  |
| `RecordVerificationSummary` | Verification outcome with labels             |

## Exclusions (not useful to AIRE now)

OTP, Aadhaar/PAN inputs, biometric, payments, carousel, rating, time-slot booking, social links, citizen accessibility widget. See `ux4g-research.md`.
