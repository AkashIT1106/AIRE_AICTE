# Motion and Feedback Specification

| Metadata          | Value                                                      |
| ----------------- | ---------------------------------------------------------- |
| Document          | `docs/02-experience/motion-and-feedback.md`                |
| Authoritative For | Animation Guidelines, Reduced Motion, Toast Protocols      |
| Status            | `CONFIRMED`                                                |
| Source            | PROJECT_PLAN.md §10.3, ADR-008                             |
| Related Decisions | [`D-008`](../00-governance/decisions/decision-register.md) |

---

## 1. Motion Principles

1. **Subtle & Functional:** Animations are used exclusively to clarify spatial transitions (e.g. drawer open, accordion expand). No gratuitous decorative animations.
2. **Instant Transitions:** Maximum transition duration is 150ms–200ms.
3. **Respect for `prefers-reduced-motion`:** All CSS and Tailwind transitions must disable animations when `prefers-reduced-motion: reduce` is active (`motion-reduce:transition-none`).

---

## 2. Notification Protocols

- **Toasts:** Non-modal, positioned top-right. Auto-dismiss after 4,000ms for informational feedback. High-severity error toasts require explicit manual dismissal.
- **Inline Banners:** Used inside form drawers and above tables to communicate persistent system states (e.g. _"Submission window closes in 48 hours"_).
