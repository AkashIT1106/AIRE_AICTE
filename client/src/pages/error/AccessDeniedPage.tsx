import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

interface AccessDeniedPageProps {
  code?: string;
  message?: string;
  correlationId?: string;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({
  code = "ACCESS_DENIED_SCOPE_MISMATCH",
  message = "Your account does not hold authorization to access this institution or regulatory workflow.",
  correlationId,
}) => {
  const navigate = useNavigate();
  const { activeInstitution, platformRoles } = useAuth();

  const fallbackPath =
    platformRoles.length > 0
      ? "/aicte/overview"
      : activeInstitution
        ? "/institution/dashboard"
        : "/";

  return (
    <div className="ux4g-d-flex ux4g-ai-center ux4g-jc-center flex items-center justify-center min-h-[500px] p-4">
      <Card className="max-w-md w-full border-[var(--state-danger-border)] shadow-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--state-danger-bg)] text-[var(--state-danger-icon)] mb-2">
            <ShieldAlert className="h-6 w-6 stroke-[2]" />
          </div>
          <CardTitle className="text-lg font-bold text-[var(--text-primary)]">
            Access Restricted (HTTP 403)
          </CardTitle>
          <CardDescription className="text-xs font-mono text-[var(--state-danger-text)] uppercase tracking-wide">
            {code}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-center">
          <p className="text-sm text-[var(--text-secondary)]">{message}</p>
          <div className="p-3 rounded bg-[var(--surface-card-subdued)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] space-y-1">
            <div className="flex justify-between">
              <span>Security Policy:</span>
              <span className="font-semibold text-[var(--text-primary)]">
                Default Deny / Forced RLS
              </span>
            </div>
            {correlationId && (
              <div className="flex justify-between font-mono text-[11px]">
                <span>Correlation ID:</span>
                <span>{correlationId}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="w-1/2 gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Go Back</span>
          </Button>
          <Link to={fallbackPath} className="w-1/2">
            <Button variant="default" size="sm" className="w-full gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              <span>Workspace</span>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
