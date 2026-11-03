import React from "react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  label?: string;
  variant?: "spinner" | "skeleton-table" | "skeleton-card";
  rows?: number;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = "Loading data...",
  variant = "spinner",
  rows = 4,
  className,
}) => {
  if (variant === "skeleton-table") {
    return (
      <div
        className={cn("w-full space-y-2 p-4", className)}
        role="status"
        aria-label={label}
      >
        <Skeleton className="h-9 w-full" />
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full opacity-70" />
        ))}
      </div>
    );
  }

  if (variant === "skeleton-card") {
    return (
      <div
        className={cn(
          "w-full space-y-4 p-6 rounded border border-[var(--border-default)] bg-[var(--surface-card)]",
          className,
        )}
        role="status"
        aria-label={label}
      >
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-2/3 opacity-70" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-full opacity-60" />
          <Skeleton className="h-4 w-4/5 opacity-60" />
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center",
        className,
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-primary)] mb-3" />
      <p className="text-sm font-medium text-[var(--text-secondary)]">
        {label}
      </p>
    </div>
  );
};
