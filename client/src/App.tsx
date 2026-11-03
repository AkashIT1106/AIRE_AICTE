import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { WorkspaceType } from "@aire/authorization";
import { AuthProvider } from "@/context/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import { WorkspaceGuard } from "@/components/auth/WorkspaceGuard";

// Pages
import { RootGateway } from "@/pages/RootGateway";
import { LoginPage } from "@/pages/auth/LoginPage";
import { InstitutionDashboard } from "@/pages/institution/InstitutionDashboard";
import { SubmissionsHistoryPage } from "@/pages/institution/SubmissionsHistoryPage";
import { BatchUploadPage } from "@/pages/institution/BatchUploadPage";
import { QuarantineTriagePage } from "@/pages/institution/QuarantineTriagePage";
import { AicteOverviewPage } from "@/pages/aicte/AicteOverviewPage";
import { StudentRecordPage } from "@/pages/student/StudentRecordPage";
import { AuditorLogsPage } from "@/pages/auditor/AuditorLogsPage";
import { DesignSystemShowcase } from "@/pages/DesignSystemShowcase";
import { NotFoundPage } from "@/pages/error/NotFoundPage";

/**
 * Authenticated Layout: Renders the institutional application shell (header, sidebar, breadcrumbs, footer)
 * strictly for authenticated workspaces. Public routes such as /login are rendered outside this layout.
 */
const AuthenticatedShellLayout: React.FC = () => {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 1. Dedicated Standalone Authentication Route (Outside AppShell) */}
          <Route path="/login" element={<LoginPage />} />

          {/* 2. Root Gateway (Intelligent Dispatcher based on session state) */}
          <Route path="/" element={<RootGateway />} />

          {/* 3. Authenticated Workspaces (Wrapped in AppShell) */}
          <Route element={<AuthenticatedShellLayout />}>
            {/* Institution Workspace (RBAC + ABAC Protected) */}
            <Route
              path="/institution"
              element={
                <WorkspaceGuard requiredWorkspace={WorkspaceType.INSTITUTION} />
              }
            >
              <Route
                index
                element={<Navigate to="/institution/dashboard" replace />}
              />
              <Route path="dashboard" element={<InstitutionDashboard />} />
              <Route path="submissions" element={<SubmissionsHistoryPage />} />
              <Route path="submissions/new" element={<BatchUploadPage />} />
              <Route
                path="submissions/:batchId"
                element={<QuarantineTriagePage />}
              />
            </Route>

            {/* AICTE Regulatory Workspace (RBAC + ABAC Protected) */}
            <Route
              path="/aicte"
              element={
                <WorkspaceGuard requiredWorkspace={WorkspaceType.AICTE} />
              }
            >
              <Route
                index
                element={<Navigate to="/aicte/overview" replace />}
              />
              <Route path="overview" element={<AicteOverviewPage />} />
            </Route>

            {/* Student Verification Workspace */}
            <Route
              path="/student"
              element={
                <WorkspaceGuard requiredWorkspace={WorkspaceType.STUDENT} />
              }
            >
              <Route
                index
                element={<Navigate to="/student/record" replace />}
              />
              <Route path="record" element={<StudentRecordPage />} />
            </Route>

            {/* Auditor Workspace */}
            <Route
              path="/auditor"
              element={
                <WorkspaceGuard requiredWorkspace={WorkspaceType.AUDITOR} />
              }
            >
              <Route index element={<Navigate to="/auditor/logs" replace />} />
              <Route path="logs" element={<AuditorLogsPage />} />
            </Route>

            {/* Isolated Technical Reference */}
            <Route path="/design-system" element={<DesignSystemShowcase />} />
          </Route>

          {/* 4. Fallback 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
