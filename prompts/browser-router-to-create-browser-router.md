# Task Prompt: Migrate BrowserRouter to createBrowserRouter with Lazy Loading and Bundle Isolation

| Metadata  | Value                                                                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Status    | `COMPLETED`                                                                                                                                     |
| Date      | 3 November 2026                                                                                                                                 |
| Scope     | Client routing (`client/src/App.tsx`, route definitions), lazy loading of protected workspaces, error boundaries, bundle splitting verification |
| Non-goals | Modifying backend APIs, modifying authorization rules/policies, redesigning pages                                                               |

## 1. Goal

Replace `BrowserRouter` with `createBrowserRouter` and `RouterProvider` in `@aire/client`. Implement code-splitting and dynamic `import()` (lazy loading) for all protected workspace routes (`/institution/*`, `/aicte/*`, `/student/*`, `/auditor/*`, `/design-system`) so that unauthenticated or unauthorized users visiting `/login` or public endpoints never load the JavaScript bundles containing sensitive internal workflows, forms, or data structures. Add route-level error boundaries to prevent exception/trace leaks.

## 2. Sources & Documentation Consulted

- `docs/README.md`, `docs/00-governance/documentation-map.md`, `docs/00-governance/source-of-truth-policy.md`
- `docs/03-design-system/frontend-architecture.md`
- `docs/05-security-privacy/authorization-and-tenant-isolation.md`
- Skills:
  - `.agents/skills/vercel-react-best-practices/SKILL.md` (`bundle-dynamic-imports`, `bundle-conditional`, `async-suspense-boundaries`)
  - `.agents/skills/typescript-advanced-types/SKILL.md`
  - `.agents/skills/shadcn/SKILL.md`

## 3. Inspected Code & Current Baseline

- `client/src/App.tsx`: Currently wraps routes in `<BrowserRouter>` and statically imports all 11 page components (`LoginPage`, `RootGateway`, `InstitutionDashboard`, `SubmissionsHistoryPage`, `BatchUploadPage`, `QuarantineTriagePage`, `AicteOverviewPage`, `StudentRecordPage`, `AuditorLogsPage`, `DesignSystemShowcase`, `NotFoundPage`).
- `client/src/components/auth/WorkspaceGuard.tsx`: Enforces authentication and RBAC/ABAC workspace authorization before rendering `<Outlet />`.
- Build baseline: Produces a monolithic `dist/assets/index-ybFFYiDX.js` of **795.08 kB** (218.09 kB gzipped), where unauthenticated visitors on `/login` download the full application bundle.
- Tests: `pnpm --filter @aire/client test` passes 206 tests across 14 test files.

## 4. Architectural Design & Security Measures

1. **Data Router Migration:**
   - Migrate route hierarchy to React Router 7 data router using `createBrowserRouter` and `RouterProvider`.
   - Provide route error boundary (`errorElement: <RouteErrorBoundary />`) to intercept route-level rendering errors gracefully without exposing runtime call stacks or system details to end users.
2. **Bundle Isolation & Lazy Loading:**
   - Keep public entry points (`LoginPage`, `RootGateway`) lightweight.
   - Code-split protected workspaces (`InstitutionDashboard`, `SubmissionsHistoryPage`, `BatchUploadPage`, `QuarantineTriagePage`, `AicteOverviewPage`, `StudentRecordPage`, `AuditorLogsPage`, `DesignSystemShowcase`, `NotFoundPage`) using dynamic `import()` and `React.lazy`.
   - Wrap lazy route elements with `<Suspense fallback={<PageLoadingSkeleton />}>` ensuring zero layout shift.
   - Because `WorkspaceGuard` evaluates authentication and role access prior to rendering the guarded `<Outlet />`, unauthenticated users or unauthorized roles are redirected or shown `AccessDeniedPage` immediately, preventing the browser from ever requesting or executing the lazy JavaScript chunk for unauthorized workspaces.
3. **Rollup / Vite Chunk Splitting (Security & Performance):**
   - Configure Rollup manual chunking in `client/vite.config.ts` or allow dynamic imports to isolate workspace bundles (`workspace-institution`, `workspace-aicte`, `workspace-auditor`, `workspace-student`, `workspace-showcase`).
   - Validate through production build analysis that the initial unauthenticated chunk excludes protected workspace code.
4. **Test Harness Compatibility:**
   - Support test environments (jsdom / Vitest) where memory router or parameterization might be needed, while ensuring `<App />` works out of the box in `App.test.tsx` and all existing tests pass without regressions.

## 5. Scope & Non-Goals

- **In Scope:**
  - `client/src/App.tsx`: Refactoring to `createBrowserRouter`, `RouterProvider`, lazy imports, Suspense fallbacks.
  - `client/src/components/feedback/RouteErrorBoundary.tsx`: Non-leaking accessible route error boundary.
  - `client/vite.config.ts`: Ensuring clean chunking if necessary.
  - Updating/adding tests in `client/src/App.test.tsx` and adding a new test verifying lazy loading / bundle protection.
- **Non-Goals:**
  - Modifying backend server, authentication cookies, or `@aire/authorization` policies.
  - Changing UI designs or component logic of the individual pages.

## 6. Acceptance Criteria

1. `BrowserRouter` is fully replaced with `createBrowserRouter` and `RouterProvider`.
2. All protected workspaces are code-split and loaded asynchronously on demand.
3. Unauthorized/unauthenticated visitors on `/login` do not load protected workspace code.
4. Route error boundary handles uncaught route exceptions gracefully with semantic tokens and no leaked stack traces.
5. `pnpm --filter @aire/client typecheck` passes with zero errors.
6. `pnpm --filter @aire/client test` passes with all tests passing.
7. `pnpm --filter @aire/client build` succeeds and produces code-split chunks.

## 7. Checks to Run

- `pnpm --filter @aire/client typecheck`
- `pnpm --filter @aire/client test`
- `pnpm --filter @aire/client build`
