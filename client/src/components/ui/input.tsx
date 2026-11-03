import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  valid?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      error,
      valid,
      readOnly,
      disabled,
      value,
      defaultValue,
      startAdornment,
      endAdornment,
      ...props
    },
    ref,
  ) => {
    const isFilled = Boolean(
      (value !== undefined && value !== "") ||
      (defaultValue !== undefined && defaultValue !== ""),
    );

    const inputElement = (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded border border-line-default bg-surface-card px-3 py-1 text-sm text-txt-primary shadow-sm transition-colors",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-txt-muted",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-card-subdued",
          readOnly &&
            "cursor-default bg-surface-card-subdued text-txt-secondary",
          error &&
            "border-state-danger-icon focus-visible:ring-state-danger-icon",
          valid &&
            !error &&
            "border-state-success-icon focus-visible:ring-state-success-icon",
          startAdornment && "pl-9",
          (endAdornment || valid) && "pr-9",
          className,
        )}
        ref={ref}
        disabled={disabled}
        readOnly={readOnly}
        value={value}
        defaultValue={defaultValue}
        aria-invalid={error ? "true" : props["aria-invalid"]}
        data-filled={isFilled ? "true" : undefined}
        {...props}
      />
    );

    if (startAdornment || endAdornment || valid) {
      return (
        <div className="relative flex items-center w-full">
          {startAdornment && (
            <div className="pointer-events-none absolute left-3 flex items-center justify-center text-txt-muted">
              {startAdornment}
            </div>
          )}
          {inputElement}
          {endAdornment ? (
            <div className="absolute right-3 flex items-center justify-center text-txt-muted">
              {endAdornment}
            </div>
          ) : valid && !error ? (
            <div className="pointer-events-none absolute right-3 flex items-center justify-center text-state-success-icon">
              <Check className="h-4 w-4" aria-hidden="true" />
            </div>
          ) : null}
        </div>
      );
    }

    return inputElement;
  },
);
Input.displayName = "Input";

export { Input };
