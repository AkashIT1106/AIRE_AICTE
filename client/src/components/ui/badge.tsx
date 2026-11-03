import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)]",
        secondary:
          "bg-[var(--surface-card-subdued)] text-[var(--text-secondary)] border border-[var(--border-default)]",
        outline:
          "border border-[var(--border-strong)] text-[var(--text-primary)]",
        success:
          "bg-[var(--state-success-bg)] text-[var(--state-success-text)] border border-[var(--state-success-border)]",
        warning:
          "bg-[var(--state-warning-bg)] text-[var(--state-warning-text)] border border-[var(--state-warning-border)]",
        danger:
          "bg-[var(--state-danger-bg)] text-[var(--state-danger-text)] border border-[var(--state-danger-border)]",
        info: "bg-[var(--state-info-bg)] text-[var(--state-info-text)] border border-[var(--state-info-border)]",
        masked:
          "bg-[var(--masked-data-bg)] text-[var(--masked-data-text)] border border-[var(--masked-data-border)] font-mono tracking-wider",
      },
      size: {
        default: "text-xs px-2 py-0.5",
        sm: "text-[11px] px-1.5 py-0.2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
