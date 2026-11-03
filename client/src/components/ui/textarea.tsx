import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  valid?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

const resizeClasses = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize",
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error,
      valid,
      readOnly,
      disabled,
      resize = "vertical",
      ...props
    },
    ref,
  ) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded border border-line-default bg-surface-card px-3 py-2 text-sm text-txt-primary shadow-sm placeholder:text-txt-muted transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-card-subdued",
          readOnly &&
            "cursor-default bg-surface-card-subdued text-txt-secondary",
          error &&
            "border-state-danger-icon focus-visible:ring-state-danger-icon",
          valid &&
            !error &&
            "border-state-success-icon focus-visible:ring-state-success-icon",
          resizeClasses[resize],
          className,
        )}
        ref={ref}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={error ? "true" : props["aria-invalid"]}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
