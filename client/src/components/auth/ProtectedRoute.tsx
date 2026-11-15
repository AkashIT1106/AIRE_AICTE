import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { LoadingState } from "@/components/feedback/LoadingState";
import { UserRole } from "@aire/authorization";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, isLoading, platformRoles, user, initialize } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && !user) {
      initialize();
    }
  }, [isAuthenticated, user, initialize]);

  if (isLoading && !isAuthenticated && !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-50">
        <LoadingState message="Verifying regulatory session..." />
      </div>
    );
  }

  // If not authenticated, allow demo viewing in development or redirect to login
  const isDemo = import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === "true";
  if (!isAuthenticated && !user && !isDemo) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.some((role) => platformRoles.includes(role)) &&
    !isDemo
  ) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-state-error">Access Restricted</h2>
        <p className="mt-2 text-sm text-neutral-600 max-w-md">
          Your current platform credentials do not grant authorization for this regulatory module.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
