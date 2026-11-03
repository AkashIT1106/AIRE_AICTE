import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-active)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-[var(--surface-card)]",
        secondary:
          "bg-[var(--surface-card-subdued)] text-[var(--text-primary)] hover:bg-[var(--border-default)] border border-[var(--border-default)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-[var(--surface-card)]",
        outline:
          "border border-[var(--border-default)] bg-[var(--surface-card)] text-[var(--text-primary)] hover:bg-[var(--surface-card-subdued)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-[var(--surface-card)]",
        destructive:
          "bg-[var(--state-danger-icon)] text-white hover:bg-[var(--state-danger-text)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-[var(--surface-card)]",
        ghost:
          "text-[var(--text-secondary)] hover:bg-[var(--surface-card-subdued)] hover:text-[var(--text-primary)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-[var(--surface-card)]",
        link: "text-[var(--text-link)] underline-offset-4 hover:underline p-0 h-auto font-normal focus-visible:ring-[var(--focus-ring)]",
      },
      size: {
        default: "h-9 px-4 py-2 text-sm",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-6 text-sm",
        icon: "h-9 w-9 p-0",
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
      children,
      ...props
    },
    ref,
  ) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
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
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
