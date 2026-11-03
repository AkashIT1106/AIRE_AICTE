import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message: string;
  correlationId?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Failed to load data",
  message,
  correlationId,
  onRetry,
  className,
}) => {
  return (
    <div
      role="alert"
      className={cn(
        "ux4g-alert ux4g-alert-error ux4g-d-flex ux4g-flex-column ux4g-ai-center flex flex-col items-center justify-center p-8 text-center rounded border border-[var(--state-danger-border)] bg-[var(--state-danger-bg)] my-4",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-card)] border border-[var(--state-danger-border)] text-[var(--state-danger-icon)] mb-3 shadow-sm">
        <AlertTriangle className="h-6 w-6 stroke-[1.5]" />
      </div>
      <h4 className="text-base font-semibold text-[var(--state-danger-text)]">
        {title}
      </h4>
      <p className="mt-1 text-sm text-[var(--state-danger-text)] max-w-md opacity-90">
        {message}
      </p>
      {correlationId && (
        <p className="mt-2 text-xs font-mono text-[var(--text-muted)] bg-[var(--surface-card)] px-2 py-0.5 rounded border border-[var(--state-danger-border)]">
          Ref ID: {correlationId}
        </p>
      )}
      {onRetry && (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="border-[var(--state-danger-border)] bg-[var(--surface-card)] hover:bg-[var(--state-danger-bg)] text-[var(--state-danger-text)]"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Retry Request
          </Button>
        </div>
      )}
    </div>
  );
};
