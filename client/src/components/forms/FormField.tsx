import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  id?: string;
  label?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  required = false,
  helperText,
  error,
  className,
  children,
}) => {
  return (
    <div className={cn("ux4g-form-group flex flex-col space-y-1.5", className)}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      {children}
      {error ? (
        <p
          id={id ? `${id}-error` : undefined}
          role="alert"
          className="text-xs text-[var(--state-danger-text)] font-medium mt-1 flex items-center gap-1"
        >
          {error}
        </p>
      ) : helperText ? (
        <p
          id={id ? `${id}-desc` : undefined}
          className="text-xs text-[var(--text-muted)] mt-1"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
