import * as React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export type MetricTrend = "up" | "down" | "neutral";
export type MetricStatus =
  "default" | "success" | "warning" | "danger" | "info";

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  subtext?: string;
  delta?: string;
  trend?: MetricTrend;
  status?: MetricStatus;
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  delta,
  trend,
  status = "default",
  icon,
  loading = false,
  className,
  ...props
}) => {
  if (loading) {
    return (
      <div
        className={cn(
          "rounded border border-line-default bg-surface-card p-5 shadow-sm space-y-3",
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-3 w-40" />
      </div>
    );
  }

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    const IconComponent = icon as React.ComponentType<{ className?: string }>;
    return <IconComponent className="h-5 w-5 stroke-[1.75]" />;
  };

  const trendIcon = () => {
    if (!trend) return null;
    if (trend === "up")
      return <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />;
    if (trend === "down")
      return <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />;
    return <Minus className="h-3.5 w-3.5" aria-hidden="true" />;
  };

  return (
    <div
      className={cn(
        "ux4g-card rounded border border-line-default bg-surface-card p-5 shadow-sm transition-all",
        status === "success" && "border-state-success-border",
        status === "warning" && "border-state-warning-border",
        status === "danger" && "border-state-danger-border",
        status === "info" && "border-state-info-border",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-txt-muted">
          {title}
        </span>
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded bg-surface-card-subdued text-txt-secondary">
            {renderIcon()}
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-txt-primary font-tabular">
          {value}
        </span>

        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium font-tabular px-1.5 py-0.5 rounded",
              trend === "up" && "text-state-success-text bg-state-success-bg",
              trend === "down" && "text-state-danger-text bg-state-danger-bg",
              trend === "neutral" &&
                "text-txt-secondary bg-surface-card-subdued",
            )}
          >
            {trendIcon()}
            <span>{delta}</span>
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1 text-xs text-txt-secondary leading-normal">
          {subtext}
        </p>
      )}
    </div>
  );
};
MetricCard.displayName = "MetricCard";
