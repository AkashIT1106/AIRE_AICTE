import React from "react";
import { FolderX } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderX,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        "ux4g-d-flex ux4g-flex-column ux4g-ai-center ux4g-text-center flex flex-col items-center justify-center p-8 text-center rounded border border-dashed border-[var(--border-default)] bg-[var(--surface-card)] my-4",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-card-subdued)] text-[var(--text-muted)] mb-3">
        <Icon className="h-6 w-6 stroke-[1.5]" />
      </div>
      <h4 className="text-base font-semibold text-[var(--text-primary)]">
        {title}
      </h4>
      <p className="mt-1 text-sm text-[var(--text-secondary)] max-w-sm">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
