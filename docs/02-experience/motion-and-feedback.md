# Motion & Feedback Specification

| Metadata             | Value                                                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/02-experience/motion-and-feedback.md`                                                                                            |
| Authoritative For    | Animation Principles, Transition Timing Boundaries, Reduced-Motion Contracts, Toast Notification Protocols, Feedback Envelopes         |
| Status               | `CONFIRMED`                                                                                                                            |
| Source               | PROJECT_PLAN.md §10.3; ADR-008; [`docs/00-governance/decisions/decision-register.md`](../00-governance/decisions/decision-register.md) |
| Related Requirements | [`AIRE-REQ-078`](../00-governance/requirements-traceability.md), [`AIRE-REQ-082`](../00-governance/requirements-traceability.md)       |
| Last Updated         | 2 November 2026                                                                                                                        |

---

## 1. Core Motion Principles: Quiet Institutional Confidence

In keeping with AIRE's regulatory mission, motion and animation are treated strictly as functional cognitive aids — never as decorative embellishments.

1. **Functional Necessity Only:** Animations are permitted exclusively to communicate spatial orientation (e.g. drawer expanding from side, accordion row opening) or to reassure users during asynchronous processing.
2. **Zero Gratuitous Animation:** The platform completely prohibits floating decorative particles, parallax scrolling, bouncing buttons, pulsing icons, celebratory confetti, or spring physics.
3. **Strict Transition Limits:** All interactive transitions are bounded between **150ms and 200ms** with standard cubic-bezier easing (`ease-out: cubic-bezier(0, 0, 0.2, 1)`).
4. **Instant Response for High-Frequency Actions:** Button clicks, tab switching, and table row selection trigger instantaneous visual feedback ($0\text{ms}$ delay).
5. **Absolute Respect for Reduced Motion:** When `prefers-reduced-motion: reduce` is active, all animated translations and pulses are disabled immediately.

---

## 2. Confirmed Motion Patterns & Timing Boundaries

| Interaction Pattern          | Trigger                   | Animated Element       | Duration & Easing                                                                      | Reduced Motion Fallback                        |
| ---------------------------- | ------------------------- | ---------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **Slide-Over Drawer (S-16)** | Clicking _"Respond"_      | Right-hand container   | `150ms ease-out` (`translate-x-full` $\rightarrow$ `translate-x-0`)                    | Instant appearance (`translate-x-0`)           |
| **Modal Dialog (S-02)**      | Sensitive Action Trigger  | Modal card & backdrop  | `150ms ease-out` (`opacity-0 scale-95` $\rightarrow$ `opacity-100 scale-100`)          | Instant appearance (`opacity-100 scale-100`)   |
| **Toast Arrival**            | Server event / validation | Toast card (top-right) | `150ms ease-out` (`translate-y-2 opacity-0` $\rightarrow$ `translate-y-0 opacity-100`) | Instant appearance                             |
| **Accordion Row Expand**     | Clicking table row        | Table child row        | `150ms ease-out` (Max-height transition)                                               | Instant expansion                              |
| **Skeleton Loader**          | Data fetching in progress | Placeholder shapes     | `1.5s` subtle opacity pulse (`opacity-40` $\rightarrow$ `opacity-75`)                  | Static gray rectangle (`opacity-50`, no pulse) |
| **Button Loading Spinner**   | Submitting form           | Inline SVG spinner     | Continuous `360deg` rotation (`1s linear infinite`)                                    | Static text: _"Processing..."_ (No spin)       |

---

## 3. Skeleton Loaders Specification

To eliminate jarring layout shifts (Core Web Vitals Cumulative Layout Shift = 0):

1. **Geometry Matching:** Skeleton loaders must replicate the exact layout, column widths, and row heights of the target loaded component.
2. **Table Skeletons:** Render 10 skeleton rows with subtle gray cells (`bg-slate-200 rounded`) matching table column alignments.
3. **Card Skeletons:** Render rectangular header and metric placeholders matching the final dimensions of the loaded KPI card.
4. **Replacement Contract:** When data fetching completes, the skeleton is swapped with the actual DOM elements in a single atomic render cycle.

---

## 4. Toast Notification Protocols

Toasts provide non-disruptive, asynchronous operational feedback:

```
+---------------------------------------------------------------------------------+
| [Icon]  Cohort Sealed Successfully                                          [X] |
|         Batch #104 (862 Students) cryptographically locked with Merkle hash.    |
|         Correlation ID: cor-882f-1049                                           |
+---------------------------------------------------------------------------------+
```

### 4.1 Specification Matrix

| Toast Severity | Semantic Color                                                | Auto-Dismiss Duration                              | User Dismissible               | Accessibility Announcement               |
| -------------- | ------------------------------------------------------------- | -------------------------------------------------- | ------------------------------ | ---------------------------------------- |
| **Success**    | Emerald (`border-emerald-500 bg-emerald-50 text-emerald-900`) | 4,000ms                                            | Yes (`X` icon & Enter)         | `role="status"` / `aria-live="polite"`   |
| **Info**       | Sky (`border-sky-500 bg-sky-50 text-sky-900`)                 | 4,000ms                                            | Yes                            | `role="status"` / `aria-live="polite"`   |
| **Warning**    | Amber (`border-amber-500 bg-amber-50 text-amber-900`)         | 6,000ms                                            | Yes                            | `role="status"` / `aria-live="polite"`   |
| **Error**      | Rose (`border-rose-500 bg-rose-50 text-rose-900`)             | **Never auto-dismisses** (Manual dismiss required) | Yes (Explicit action required) | `role="alert"` / `aria-live="assertive"` |

### 4.2 Stack & Overflow Rules

- Toasts render fixed at `top-4 right-4 z-50`.
- Maximum 3 visible toasts. If a 4th toast arrives, the oldest dismisses immediately.
- Error toasts display a monospace **Correlation ID** with an accessible one-click copy button, allowing operators to quote the exact server transaction reference when contacting AICTE technical support.

---

## 5. Inline Banners & Static Feedback

When system states are persistent or affect an entire section, inline banners are used rather than ephemeral toasts:

1. **Regulatory Freeze Warning:** Amber banner anchored above table headers: _"Notice: Annual submission freeze occurs in 48 hours. After 23:59 IST on 15 Nov 2026, all unsealed batches will lock automatically."_
2. **Active Show Cause Alert:** Red banner anchored at the top of the Institution Dashboard: _"Active Show Cause Notice #SC-2026-88 issued by AICTE Western Region. Response deadline: 9 days remaining."_
