/**
 * StatusBadge — reusable status pill component.
 * Variants map to design token colors.
 */

import { clsx } from "clsx";

export type StatusVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "pending"
  | "matched"
  | "mismatched"
  | "excess"
  | "duplicate";

interface StatusBadgeProps {
  variant: StatusVariant;
  label: string;
  className?: string;
}

const variantClasses: Record<StatusVariant, string> = {
  success:
    "bg-state-success-bg text-state-success border border-state-success-border",
  warning:
    "bg-state-warning-bg text-state-warning border border-state-warning-border",
  error:
    "bg-state-error-bg text-state-error border border-state-error-border",
  info:
    "bg-state-info-bg text-state-info border border-state-info-border",
  pending:
    "bg-state-pending-bg text-state-pending border border-state-pending-border",
  // Domain-specific: map to semantic tokens
  matched:
    "bg-state-success-bg text-state-success border border-state-success-border",
  mismatched:
    "bg-state-error-bg text-state-error border border-state-error-border",
  excess:
    "bg-state-warning-bg text-state-warning border border-state-warning-border",
  duplicate:
    "bg-state-warning-bg text-state-warning border border-state-warning-border",
};

export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium leading-none",
        variantClasses[variant],
        className,
      )}
    >
      {label}
    </span>
  );
}
