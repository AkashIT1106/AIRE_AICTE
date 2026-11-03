import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium transition-colors select-none",
  {
    variants: {
      variant: {
        default: "bg-brand-primary text-txt-inverted hover:bg-brand-hover",
        secondary:
          "bg-surface-card-subdued text-txt-secondary border border-line-default",
        outline: "border border-line-strong text-txt-primary",
        success:
          "bg-state-success-bg text-state-success-text border border-state-success-border",
        warning:
          "bg-state-warning-bg text-state-warning-text border border-state-warning-border",
        danger:
          "bg-state-danger-bg text-state-danger-text border border-state-danger-border",
        info: "bg-state-info-bg text-state-info-text border border-state-info-border",
        masked:
          "bg-masked-bg text-masked-text border border-masked-border font-mono tracking-wider",
      },
      size: {
        default: "text-xs px-2 py-0.5",
        sm: "text-[11px] px-1.5 py-0.2",
        lg: "text-sm px-2.5 py-1",
      },
      interactive: {
        true: "cursor-pointer hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1",
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
    VariantProps<typeof badgeVariants> {
  onDismiss?: () => void;
  dismissible?: boolean;
}

function Badge({
  className,
  variant,
  size,
  interactive,
  onDismiss,
  dismissible,
  children,
  onClick,
  onKeyDown,
  ...props
}: BadgeProps) {
  const isInteractive = Boolean(interactive || onClick);
  const showDismiss = Boolean(onDismiss || dismissible);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (
      !e.defaultPrevented &&
      isInteractive &&
      (e.key === "Enter" || e.key === " ") &&
      e.target === e.currentTarget
    ) {
      e.preventDefault();
      onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <div
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        badgeVariants({ variant, size, interactive: isInteractive }),
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {showDismiss && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss?.();
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
          className="ml-1 -mr-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-black/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus-ring"
          aria-label="Remove badge"
        >
          <X className="h-3 w-3 stroke-[2.5]" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export { Badge, badgeVariants };
