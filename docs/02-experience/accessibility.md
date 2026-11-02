# Accessibility Specification

| Metadata             | Value                                                           |
| -------------------- | --------------------------------------------------------------- |
| Document             | `docs/02-experience/accessibility.md`                           |
| Authoritative For    | WCAG 2.2 AA Compliance, Screen Reader Semantics, Focus Traps    |
| Status               | `CONFIRMED`                                                     |
| Source               | PROJECT_PLAN.md §7, ADR-011                                     |
| Related Requirements | [`AIRE-REQ-065`](../00-governance/requirements-traceability.md) |

---

## 1. Standards Baseline: WCAG 2.2 Level AA

All AIRE user interfaces must adhere strictly to the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA criteria:

- **Contrast Ratios:** Minimum 4.5:1 for standard body text; minimum 3:1 for large text and UI components/icons.
- **Keyboard Operability:** 100% of interactive controls (buttons, inputs, dropdowns, modals) must be navigable via standard `Tab`, `Shift+Tab`, `Enter`, `Space`, and `Escape` keys.
- **Focus Management:** Visible focus rings (`focus-visible:ring-2 focus-visible:ring-indigo-500`). Modals and slide-over drawers must trap keyboard focus until dismissed.
- **Screen Reader Semantics:** Data grids must include accessible `aria-label`, `aria-describedby`, and table `scope="col"` attributes. Dynamic notifications must use `aria-live="polite"` or `aria-live="assertive"`.
- **Form Error Association:** Form validation errors must be explicitly linked to input fields via `aria-invalid="true"` and `aria-errormessage`.

---

## 2. Indian Government Guidelines Verification Note

> [!NOTE]
> While WCAG 2.2 AA is the approved engineering baseline, verification of specific Guidelines for Indian Government Websites (GIGW) mandates remains documented as an open decision item ([`D-004`](../00-governance/decisions/decision-register.md)).
