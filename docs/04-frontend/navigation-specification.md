# AIRE — Navigation Specification & Shell Architecture

| Metadata     | Value                                             |
| ------------ | ------------------------------------------------- |
| Document     | `docs/04-frontend/navigation-specification.md`    |
| Status       | `APPROVED`                                        |
| Reference    | UX4G Handbook Chapter 5 & 6 (Layout & Navigation) |
| Last Updated | 3 November 2026                                   |

---

## 1. Shell Composition Principles

The application shell provides consistent orientation, identity, and context across all viewports.

```
+-----------------------------------------------------------------------------------+
| Top Identity Band (Height: 32px)                                                  |
| Government of India | Ministry of Education                                        |
+-----------------------------------------------------------------------------------+
| Primary Application Header (Height: 56px)                                         |
| [Logo] AIRE - Admission Reconciliation Portal      [Tenant Dropdown] [User Menu]  |
+-----------------------------------------------------------------------------------+
| Breadcrumb Navigation Trail (Height: 36px)                                        |
| Home > Institution > Submissions > Batch #2026-CSE-01                             |
+---------------------+-------------------------------------------------------------+
| Sidebar (w-64)      | Main Content Canvas                                         |
| - Dashboard         |                                                             |
| - Submissions       | (Dynamic responsive content)                                |
| - Upload Batch      |                                                             |
| - Collapse View     |                                                             |
+---------------------+-------------------------------------------------------------+
| Statutory Status Bar (Height: 36px)                                               |
| AIRE Platform v1.0 • Confidential Institutional System       10:15:30 IST         |
+-----------------------------------------------------------------------------------+
```

---

## 2. Desktop Shell Mechanics

1. **Top Identity Band:**
   - 32px height, slate surface (`#0E1B26` or `#183B56`), inverted high-contrast text (`#FFFFFF`).
   - Plain typography: "Government of India &bull; Ministry of Education &bull; AICTE".
   - Links to statutory portals where authorized.
2. **Primary Application Header:**
   - 56px height, persistent sticky top navigation.
   - Brand mark (ShieldCheck icon) with high-contrast AIRE descriptor.
   - Active statutory cycle badge (e.g. `Cycle 2026–27 Active`).
   - Tenant Switcher: Allows operators with multiple institutional affiliations to switch context cleanly. Sets `activeInstitutionId` and triggers authorized queries.
   - Profile Dropdown: Displays user name, email, verified role badge, and Sign Out action.
3. **Structured Breadcrumb Trail:**
   - 36px height, muted canvas background (`#F5F7F8`), clear hierarchical path (`Home > Institution > Submissions`).
   - Each crumb has an accessible link and proper ARIA landmarks (`aria-label="Breadcrumb"`).
4. **Adaptive Sidebar:**
   - Width: 256px (`w-64`) expanded; 64px (`w-16`) collapsed.
   - Purposeful task-oriented links depending on active workspace.
   - Active link highlighted with high-contrast institutional navy background and left border indicator.
   - Includes an explicit toggle button ("Collapse View" / "Expand View") with keyboard support.
5. **Footer Status Bar:**
   - 36px height, fixed or sticky bottom.
   - Shows live server clock in IST (`UTC+05:30`) to establish temporal context for deadlines.

---

## 3. Mobile Navigation Architecture (320px – 768px)

1. **Header Reflow:**
   - Top Identity Band collapses to compact text.
   - Primary Header retains hamburger menu trigger, AIRE wordmark, tenant indicator, and user avatar.
   - Secondary decorative badges hide automatically to prevent horizontal overflow.
2. **Off-Canvas Navigation Drawer:**
   - Triggered by hamburger button (`aria-expanded` and `aria-controls` bindings).
   - Slides smoothly from left, occupying max 85% of screen width (`w-72` max-w-xs).
   - Semi-transparent backdrop (`bg-black/50`) traps focus within the drawer.
   - Pressing `Escape` or clicking the backdrop dismisses the drawer immediately and restores focus to the trigger button.
   - Zero horizontal scrollbar on the viewport at 320px, 360px, 390px.
3. **Bottom Navigation Bar (Optional Mobile Utility):**
   - Essential primary actions (Upload, Ledger, Profile) remain within thumb reach on mobile screens.
