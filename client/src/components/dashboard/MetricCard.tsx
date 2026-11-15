/**
 * MetricCard — dashboard stat card with optional trend indicator.
 */

import { clsx } from "clsx";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";

export type MetricVariant = "default" | "success" | "warning" | "critical" | "info";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  variant?: MetricVariant;
  trend?: {
    direction: "up" | "down" | "flat";
    percent: number;
    label?: string;
  };
  className?: string;
}

const variantStyles: Record<
  MetricVariant,
  { container: string; icon: string; value: string }
> = {
  default: {
    container: "border-neutral-150 bg-neutral-0",
    icon: "bg-brand-50 text-brand-primary",
    value: "text-neutral-800",
  },
  success: {
    container: "border-state-success-border bg-state-success-bg",
    icon: "bg-state-success-bg text-state-success",
    value: "text-state-success",
  },
  warning: {
    container: "border-state-warning-border bg-state-warning-bg",
    icon: "bg-state-warning-bg text-state-warning",
    value: "text-state-warning",
  },
  critical: {
    container: "border-state-error-border bg-state-error-bg",
    icon: "bg-state-error-bg text-state-error",
    value: "text-state-error",
  },
  info: {
    container: "border-state-info-border bg-state-info-bg",
    icon: "bg-state-info-bg text-state-info",
    value: "text-state-info",
  },
};

const trendColors = {
  up: "text-state-success",
  down: "text-state-error",
  flat: "text-neutral-600",
};

export function MetricCard({
  label,
  value,
  icon: Icon,
  variant = "default",
  trend,
  className,
}: MetricCardProps) {
  const styles = variantStyles[variant];

  const TrendIcon =
    trend?.direction === "up"
      ? TrendingUp
      : trend?.direction === "down"
        ? TrendingDown
        : Minus;

  return (
    <div
      className={clsx(
        "rounded-card border p-5 font-sans",
        styles.container,
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-neutral-600">
            {label}
          </span>
          <span className={clsx("text-2xl font-bold leading-tight", styles.value)}>
            {value}
          </span>
          {trend && (
            <span
              className={clsx(
                "mt-1 inline-flex items-center gap-1 text-xs font-medium",
                trendColors[trend.direction],
              )}
            >
              <TrendIcon className="h-3.5 w-3.5" />
              {trend.percent}%{trend.label ? ` ${trend.label}` : ""}
            </span>
          )}
        </div>
        <div
          className={clsx(
            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-control",
            styles.icon,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
