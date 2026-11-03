import React from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { AlertOctagon, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

/**
 * Route-level error boundary.
 * Prevents stack trace / internal data leakage to end users while offering safe recovery actions.
 */
export const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError();

  let title = "Unexpected Application Error";
  let message =
    "An error occurred while rendering this view. Your session and data remain secure.";
  let statusText: string | undefined;

  if (isRouteErrorResponse(error)) {
    title = `${error.status} — ${error.statusText || "Navigation Error"}`;
    message =
      typeof error.data === "string"
        ? error.data
        : error.data?.message || "The requested resource could not be loaded.";
    statusText = `Status Code: ${error.status}`;
  } else if (error instanceof Error) {
    // Sanitize error message to avoid exposing raw system internals
    if (
      error.message.includes("Failed to fetch dynamically imported module") ||
      error.message.includes("Importing a module script failed")
    ) {
      title = "Module Update Detected";
      message =
        "A newer version of the platform has been deployed. Please reload the page to load the latest components.";
    }
  }

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div
      role="alert"
      className="ux4g-d-flex ux4g-ai-center ux4g-jc-center flex items-center justify-center min-h-[500px] p-6 bg-[var(--surface-canvas)]"
    >
      <Card className="ux4g-card max-w-md w-full shadow-sm border-[var(--state-danger-border)]">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--state-danger-bg)] text-[var(--state-danger-icon)] border border-[var(--state-danger-border)] mb-3">
            <AlertOctagon className="h-6 w-6 stroke-[2]" />
          </div>
          <CardTitle className="text-lg font-bold text-[var(--text-primary)]">
            {title}
          </CardTitle>
          {statusText && (
            <CardDescription className="text-xs font-mono text-[var(--text-muted)] mt-1">
              {statusText}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="text-center text-sm text-[var(--text-secondary)]">
          {message}
        </CardContent>
        <CardFooter className="flex justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReload}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reload Page</span>
          </Button>
          <Link to="/">
            <Button variant="default" size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              <span>Platform Home</span>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
