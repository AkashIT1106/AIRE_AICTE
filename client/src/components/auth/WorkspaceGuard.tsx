import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  WorkspaceType,
  Permission,
  isRoleAuthorizedForWorkspace,
  UserRole,
} from "@aire/authorization";
import { useAuth } from "@/context/AuthContext";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { AccessDeniedPage } from "@/pages/error/AccessDeniedPage";

interface WorkspaceGuardProps {
  requiredWorkspace: WorkspaceType;
  requiredPermission?: Permission;
}

export const WorkspaceGuard: React.FC<WorkspaceGuardProps> = ({
  requiredWorkspace,
  requiredPermission,
}) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, activeInstitution, platformRoles, can } =
    useAuth();

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Determine all current user roles (institution role + platform roles)
  const currentRoles: string[] = [...platformRoles];
  if (activeInstitution?.role) {
    currentRoles.push(activeInstitution.role);
  }

  // Check if any of user's active roles has access to this workspace
  const hasWorkspaceAccess = currentRoles.some((role) =>
    isRoleAuthorizedForWorkspace(role as UserRole, requiredWorkspace),
  );

  if (!hasWorkspaceAccess) {
    return (
      <AccessDeniedPage
        code="ACCESS_DENIED_WORKSPACE_MISMATCH"
        message={`Your account role (${currentRoles.join(", ") || "None"}) does not hold authorization to access the ${requiredWorkspace} workspace.`}
      />
    );
  }

  // If specific fine-grained permission required, evaluate via ABAC policy
  if (requiredPermission && !can(requiredPermission)) {
    return (
      <AccessDeniedPage
        code="ACCESS_DENIED_PERMISSION_REQUIRED"
        message={`This operation requires the '${requiredPermission}' regulatory entitlement.`}
      />
    );
  }

  return <Outlet />;
};
