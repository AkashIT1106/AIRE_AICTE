import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root
> {
  indicatorClassName?: string;
  variant?: "default" | "success" | "warning" | "danger";
  size?: "sm" | "default" | "lg";
  indeterminate?: boolean;
}

const variantStyles = {
  default: "bg-brand-primary",
  success: "bg-state-success-text",
  warning: "bg-state-warning-text",
  danger: "bg-state-danger-text",
};

const sizeStyles = {
  sm: "h-1",
  default: "h-2",
  lg: "h-3",
};

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value,
      variant = "default",
      size = "default",
      indeterminate = false,
      indicatorClassName,
      ...props
    },
    ref,
  ) => {
    const isIndeterminate =
      indeterminate || value === undefined || value === null;

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "ux4g-progress relative w-full overflow-hidden rounded-full bg-surface-card-subdued border border-line-subtle",
          sizeStyles[size],
          className,
        )}
        value={isIndeterminate ? undefined : value}
        aria-busy={isIndeterminate ? "true" : undefined}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full transition-all duration-300 ease-in-out",
            variantStyles[variant],
            isIndeterminate ? "w-1/3 animate-pulse" : "w-full flex-1",
            indicatorClassName,
          )}
          style={
            isIndeterminate
              ? undefined
              : { transform: `translateX(-${100 - (value || 0)}%)` }
          }
        />
      </ProgressPrimitive.Root>
    );
  },
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
