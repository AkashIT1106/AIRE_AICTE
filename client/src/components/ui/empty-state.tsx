import React from "react";
import { FolderX } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  children,
  className,
}) => {
  const renderIcon = () => {
    if (!icon) {
      return <FolderX className="h-6 w-6 stroke-[1.5]" aria-hidden="true" />;
    }
    if (React.isValidElement(icon)) {
      return icon;
    }
    const IconComponent = icon as React.ComponentType<{ className?: string }>;
    return <IconComponent className="h-6 w-6 stroke-[1.5]" />;
  };

  return (
    <div
      role="region"
      aria-label={typeof title === "string" ? title : "Empty state"}
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded border border-dashed border-line-default bg-surface-card my-4",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-card-subdued text-txt-muted mb-3">
        {renderIcon()}
      </div>
      <h4 className="text-base font-semibold text-txt-primary">{title}</h4>
      {description && (
        <p className="mt-1 text-sm text-txt-secondary max-w-sm">
          {description}
        </p>
      )}
      {children}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
EmptyState.displayName = "EmptyState";
