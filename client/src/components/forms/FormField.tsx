/**
 * FormField — React Hook Form compatible field wrapper.
 * Renders label, input/children, and validation error message.
 */

import { clsx } from "clsx";
import type { FieldError } from "react-hook-form";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: FieldError | { message?: string };
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  error,
  required,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-neutral-800"
      >
        {label}
        {required && (
          <span className="ml-0.5 text-state-error" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-neutral-600">{hint}</p>
      )}
      {error?.message && (
        <p role="alert" className="text-xs text-state-error">
          {error.message}
        </p>
      )}
    </div>
  );
}
