import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded border border-[var(--border-default)] bg-[var(--surface-card)] px-3 py-1 text-sm text-[var(--text-primary)] shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-card)] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--surface-card-subdued)]",
          error &&
            "border-[var(--state-danger-icon)] focus-visible:ring-[var(--state-danger-icon)]",
          className,
        )}
        ref={ref}
        aria-invalid={error ? "true" : props["aria-invalid"]}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
