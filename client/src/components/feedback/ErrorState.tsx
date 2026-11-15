/**
 * ErrorState — shown when a request fails.
 */

import { AlertTriangle } from "lucide-react";
import { clsx } from "clsx";

interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-3 py-16 text-center",
        className,
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-state-error-bg text-state-error">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <div className="max-w-xs">
        <p className="text-sm font-semibold text-neutral-800">{title}</p>
        {message && (
          <p className="mt-1 text-sm text-state-error">{message}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
