import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { VisualFoundationPreview } from "./pages/VisualFoundationPreview";
import { LoginPage } from "./pages/LoginPage";
import { AppShell } from "./components/layout/AppShell";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { OverviewPage } from "./pages/dashboard/OverviewPage";
import { InstitutionsPage } from "./pages/dashboard/InstitutionsPage";
import { ApprovalOrdersPage } from "./pages/dashboard/ApprovalOrdersPage";
import { PoliciesPage } from "./pages/dashboard/PoliciesPage";
import { SubmissionsPage } from "./pages/dashboard/SubmissionsPage";
import { AdmissionsPage } from "./pages/dashboard/AdmissionsPage";
import { IdentityPage } from "./pages/dashboard/IdentityPage";
import { AEPPage } from "./pages/dashboard/AEPPage";
import { ReconciliationPage } from "./pages/dashboard/ReconciliationPage";
import { ExceptionsPage } from "./pages/dashboard/ExceptionsPage";
import { ReportsPage } from "./pages/dashboard/ReportsPage";
import { AuditPage } from "./pages/dashboard/AuditPage";
import { SettingsPage } from "./pages/dashboard/SettingsPage";
import { AdminPage } from "./pages/dashboard/AdminPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/preview" element={<VisualFoundationPreview />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Authenticated Regulatory Portal Shell */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="institutions" element={<InstitutionsPage />} />
          <Route path="approval-orders" element={<ApprovalOrdersPage />} />
          <Route path="policies" element={<PoliciesPage />} />
          <Route path="submissions" element={<SubmissionsPage />} />
          <Route path="admissions" element={<AdmissionsPage />} />
          <Route path="identity" element={<IdentityPage />} />
          <Route path="aep" element={<AEPPage />} />
          <Route path="reconciliation" element={<ReconciliationPage />} />
          <Route path="exceptions" element={<ExceptionsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="audit" element={<AuditPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>

        {/* Wildcard Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
