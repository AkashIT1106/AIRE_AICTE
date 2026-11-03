import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { UserRole } from "@aire/authorization";

export const RootGateway: React.FC = () => {
  const { isAuthenticated, isLoading, platformRoles, activeInstitution } =
    useAuth();

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    platformRoles.includes(UserRole.AICTE_ADMIN) ||
    platformRoles.includes(UserRole.AICTE_REVIEWER)
  ) {
    return <Navigate to="/aicte/overview" replace />;
  }

  if (platformRoles.includes(UserRole.AUDITOR)) {
    return <Navigate to="/auditor/logs" replace />;
  }

  if (activeInstitution) {
    return <Navigate to="/institution/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};
