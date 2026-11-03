import React, { useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  sizeVariant?: "sm" | "md" | "lg";
  state?: "default" | "error" | "success" | "warning";
  required?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const AireInput: React.FC<InputProps> = ({
  label,
  helperText,
  errorMessage,
  sizeVariant = "md",
  state = "default",
  required = false,
  startIcon,
  endIcon,
  className = "",
  id: customId,
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const inputId = customId || generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const effectiveState = errorMessage ? "error" : state;

  const sizeClassMap = {
    sm: "ux4g-input-sm py-1.5 px-3 text-xs min-h-[36px]",
    md: "ux4g-input-md py-2 px-3.5 text-sm min-h-[44px]",
    lg: "ux4g-input-lg py-2.5 px-4 text-base min-h-[48px]",
  };

  const stateClassMap = {
    default:
      "ux4g-input-default border-neutral-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary",
    error:
      "ux4g-input-error border-state-error text-neutral-800 focus:border-state-error focus:ring-1 focus:ring-state-error",
    success:
      "ux4g-input-success border-state-success focus:border-state-success focus:ring-1 focus:ring-state-success",
    warning:
      "ux4g-input-warning border-state-warning focus:border-state-warning focus:ring-1 focus:ring-state-warning",
  };

  return (
    <div
      className={`ux4g-input-container flex flex-col gap-1.5 w-full ${className}`}
    >
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-neutral-800 flex items-center gap-1 select-none"
        >
          {label}
          {required && (
            <span className="text-state-error" title="Required field">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        {startIcon && (
          <div className="absolute left-3.5 text-neutral-600 pointer-events-none flex items-center justify-center">
            {startIcon}
          </div>
        )}

        <input
          id={inputId}
          disabled={disabled}
          required={required}
          aria-invalid={effectiveState === "error"}
          aria-describedby={
            errorMessage ? errorId : helperText ? helperId : undefined
          }
          className={`w-full bg-neutral-0 border rounded-control text-neutral-800 transition-colors duration-150 outline-none disabled:bg-neutral-100 disabled:text-neutral-600 disabled:cursor-not-allowed ${
            startIcon ? "pl-10" : ""
          } ${endIcon ? "pr-10" : ""} ${sizeClassMap[sizeVariant]} ${
            stateClassMap[effectiveState]
          }`}
          {...props}
        />

        {endIcon && (
          <div className="absolute right-3.5 text-neutral-600 pointer-events-none flex items-center justify-center">
            {endIcon}
          </div>
        )}
      </div>

      {errorMessage ? (
        <span
          id={errorId}
          role="alert"
          className="text-xs font-medium text-state-error"
        >
          {errorMessage}
        </span>
      ) : helperText ? (
        <span
          id={helperId}
          className="ux4g-input-helper text-xs text-neutral-600"
        >
          {helperText}
        </span>
      ) : null}
    </div>
  );
};

export const Input = AireInput;
