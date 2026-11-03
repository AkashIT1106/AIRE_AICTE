import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded border border-[var(--border-default)] bg-[var(--surface-card)] px-3 py-2 text-sm text-[var(--text-primary)] shadow-sm placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-card)] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--surface-card-subdued)]",
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
Textarea.displayName = "Textarea";

export { Textarea };
