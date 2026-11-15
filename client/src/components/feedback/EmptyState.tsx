/**
 * EmptyState — shown when there is no data to display.
 */

import { Inbox } from "lucide-react";
import { clsx } from "clsx";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "No data",
  description = "There is nothing to display here yet.",
  action,
  className,
  icon,
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-3 py-16 text-center",
        className,
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <div className="max-w-xs">
        <p className="text-sm font-semibold text-neutral-800">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-neutral-600">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
