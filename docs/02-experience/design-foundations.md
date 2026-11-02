# Design Foundations

| Metadata          | Value                                                                 |
| ----------------- | --------------------------------------------------------------------- |
| Document          | `docs/02-experience/design-foundations.md`                            |
| Authoritative For | Color Tokens, Typography Scale, Density Standards                     |
| Status            | `CONFIRMED`                                                           |
| Source            | PROJECT_PLAN.md §10.3, `docs/04-frontend/design-foundations-audit.md` |
| Related Decisions | [`D-003`, `D-004`](../00-governance/decisions/decision-register.md)   |

---

## 1. Design Tokens & Palette

AIRE utilizes Tailwind CSS semantic tokens to guarantee visual hierarchy and contrast compliance:

| Token Name       | Tailwind Class   | Hex Value | Semantic Purpose                                  |
| ---------------- | ---------------- | --------- | ------------------------------------------------- |
| `surface-bg`     | `bg-slate-50`    | `#f8fafc` | Application canvas background                     |
| `surface-card`   | `bg-white`       | `#ffffff` | Content containers, modals, table cards           |
| `surface-header` | `bg-slate-900`   | `#0f172a` | Top shell navigation header                       |
| `text-primary`   | `text-slate-900` | `#0f172a` | Body copy, table text, headers                    |
| `text-muted`     | `text-slate-600` | `#475569` | Secondary captions, timestamps, column labels     |
| `brand-primary`  | `bg-indigo-600`  | `#4f46e5` | Primary buttons, active navigation markers        |
| `state-success`  | `bg-emerald-600` | `#059669` | Reconciled status, verified APAAR badge           |
| `state-warning`  | `bg-amber-600`   | `#d97706` | Ingestion warnings, pending exception responses   |
| `state-danger`   | `bg-rose-600`    | `#e11d48` | Quota over-admissions, Show Cause notices, errors |

---

## 2. Typography & Density

- **Font Family:** Inter or system sans-serif (`font-sans`).
- **Data Table Density:** Compact row height (36px–40px) to maximize visible records on 1080p displays.
- **Monospace Numerics:** Tabular figures (`font-mono`) for APAAR IDs, admission counts, and cryptographic hashes.
