import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "ux4g-btn inline-flex items-center justify-center whitespace-nowrap rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "ux4g-btn-primary bg-brand-primary text-txt-inverted hover:bg-brand-hover active:bg-brand-active shadow-sm",
        secondary:
          "ux4g-btn-secondary bg-surface-card-subdued text-txt-primary hover:bg-line-default border border-line-default shadow-sm",
        outline:
          "ux4g-btn-outline-primary border border-line-default bg-surface-card text-txt-primary hover:bg-surface-card-subdued shadow-sm",
        destructive:
          "ux4g-btn-danger bg-state-danger-icon text-txt-inverted hover:bg-state-danger-text shadow-sm",
        ghost:
          "ux4g-btn-text-primary text-txt-secondary hover:bg-surface-card-subdued hover:text-txt-primary",
        link: "ux4g-btn-link text-txt-link underline-offset-4 hover:underline p-0 h-auto font-normal focus-visible:ring-offset-0",
      },
      size: {
        default: "ux4g-btn-m h-9 px-4 py-2 text-sm",
        sm: "ux4g-btn-s h-8 px-3 text-xs",
        lg: "ux4g-btn-l h-10 px-6 text-sm",
        icon: "ux4g-btn-m h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      onClick,
      children,
      ...props
    },
    ref,
  ) => {
    const isEffectivelyDisabled = disabled || loading;

    // Anti-double-submission click handler wrapper
    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isEffectivelyDisabled) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        onClick?.(e);
      },
      [isEffectivelyDisabled, onClick],
    );

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          aria-busy={loading ? "true" : undefined}
          aria-disabled={isEffectivelyDisabled ? "true" : undefined}
          onClick={handleClick}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isEffectivelyDisabled}
        aria-busy={loading ? "true" : undefined}
        onClick={handleClick}
        {...props}
      >
        {loading && (
          <Loader2
            className="ux4g-mr-xs ux4g-animate-spin mr-2 h-4 w-4 animate-spin shrink-0"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
