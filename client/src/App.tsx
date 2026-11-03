import React from "react";
import {
  createBrowserRouter,
  createMemoryRouter,
  RouterProvider,
  RouteObject,
  Navigate,
  Outlet,
} from "react-router-dom";
import { WorkspaceType } from "@aire/authorization";
import { AuthProvider } from "@/context/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import { WorkspaceGuard } from "@/components/auth/WorkspaceGuard";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { RouteErrorBoundary } from "@/components/feedback/RouteErrorBoundary";

// Public lightweight entry points (eagerly loaded for zero-hop initial interaction)
import { RootGateway } from "@/pages/RootGateway";
import { LoginPage } from "@/pages/auth/LoginPage";

// Protected workspace pages — code-split dynamically to prevent unauthorized bundle leakage
const InstitutionDashboard = React.lazy(() =>
  import("@/pages/institution/InstitutionDashboard").then((m) => ({
    default: m.InstitutionDashboard,
  })),
);
const SubmissionsHistoryPage = React.lazy(() =>
  import("@/pages/institution/SubmissionsHistoryPage").then((m) => ({
    default: m.SubmissionsHistoryPage,
  })),
);
const BatchUploadPage = React.lazy(() =>
  import("@/pages/institution/BatchUploadPage").then((m) => ({
    default: m.BatchUploadPage,
  })),
);
const QuarantineTriagePage = React.lazy(() =>
  import("@/pages/institution/QuarantineTriagePage").then((m) => ({
    default: m.QuarantineTriagePage,
  })),
);
const AicteOverviewPage = React.lazy(() =>
  import("@/pages/aicte/AicteOverviewPage").then((m) => ({
    default: m.AicteOverviewPage,
  })),
);
const StudentRecordPage = React.lazy(() =>
  import("@/pages/student/StudentRecordPage").then((m) => ({
    default: m.StudentRecordPage,
  })),
);
const AuditorLogsPage = React.lazy(() =>
  import("@/pages/auditor/AuditorLogsPage").then((m) => ({
    default: m.AuditorLogsPage,
  })),
);
const DesignSystemShowcase = React.lazy(() =>
  import("@/pages/DesignSystemShowcase").then((m) => ({
    default: m.DesignSystemShowcase,
  })),
);
const NotFoundPage = React.lazy(() =>
  import("@/pages/error/NotFoundPage").then((m) => ({
    default: m.NotFoundPage,
  })),
);

/**
 * Authenticated Layout: Renders the institutional application shell (header, sidebar, breadcrumbs, footer)
 * strictly for authenticated workspaces with a Suspense boundary for code-split components.
 * Public routes such as /login are rendered outside this layout.
 */
const AuthenticatedShellLayout: React.FC = () => {
  return (
    <AppShell>
      <React.Suspense fallback={<PageLoadingSkeleton />}>
        <Outlet />
      </React.Suspense>
    </AppShell>
  );
};

/**
 * Route Manifest Definition:
 * Centralized declarative route configuration tree compatible with React Router data routers.
 */
export const createAppRoutes = (): RouteObject[] => [
  {
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/",
        element: <RootGateway />,
      },
      {
        element: <AuthenticatedShellLayout />,
        children: [
          {
            path: "/institution",
            element: (
              <WorkspaceGuard requiredWorkspace={WorkspaceType.INSTITUTION} />
            ),
            children: [
              {
                index: true,
                element: <Navigate to="/institution/dashboard" replace />,
              },
              {
                path: "dashboard",
                element: <InstitutionDashboard />,
              },
              {
                path: "submissions",
                element: <SubmissionsHistoryPage />,
              },
              {
                path: "submissions/new",
                element: <BatchUploadPage />,
              },
              {
                path: "submissions/:batchId",
                element: <QuarantineTriagePage />,
              },
            ],
          },
          {
            path: "/aicte",
            element: <WorkspaceGuard requiredWorkspace={WorkspaceType.AICTE} />,
            children: [
              {
                index: true,
                element: <Navigate to="/aicte/overview" replace />,
              },
              {
                path: "overview",
                element: <AicteOverviewPage />,
              },
            ],
          },
          {
            path: "/student",
            element: (
              <WorkspaceGuard requiredWorkspace={WorkspaceType.STUDENT} />
            ),
            children: [
              {
                index: true,
                element: <Navigate to="/student/record" replace />,
              },
              {
                path: "record",
                element: <StudentRecordPage />,
              },
            ],
          },
          {
            path: "/auditor",
            element: (
              <WorkspaceGuard requiredWorkspace={WorkspaceType.AUDITOR} />
            ),
            children: [
              {
                index: true,
                element: <Navigate to="/auditor/logs" replace />,
              },
              {
                path: "logs",
                element: <AuditorLogsPage />,
              },
            ],
          },
          {
            path: "/design-system",
            element: <DesignSystemShowcase />,
          },
        ],
      },
      {
        path: "*",
        element: (
          <React.Suspense fallback={<PageLoadingSkeleton />}>
            <NotFoundPage />
          </React.Suspense>
        ),
      },
    ],
  },
];

/**
 * Creates either a browser data router or memory data router (for testing/isolated contexts).
 */
export function createAppRouter(options?: {
  initialEntries?: string[];
  initialIndex?: number;
}) {
  if (options?.initialEntries) {
    return createMemoryRouter(createAppRoutes(), {
      initialEntries: options.initialEntries,
      initialIndex: options.initialIndex,
    });
  }
  return createBrowserRouter(createAppRoutes());
}

export interface AppProps {
  router?: ReturnType<typeof createAppRouter>;
}

export const App: React.FC<AppProps> = ({ router: customRouter }) => {
  const router = React.useMemo(
    () => customRouter ?? createAppRouter(),
    [customRouter],
  );

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
