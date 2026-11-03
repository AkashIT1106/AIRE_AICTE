import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  id?: string;
  label?: string;
  required?: boolean;
  optional?: boolean;
  helperText?: string;
  error?: string;
  successMessage?: string;
  className?: string;
  children: React.ReactNode;
}

const FormFieldContext = React.createContext<{
  id?: string;
  error?: string;
  hasError: boolean;
}>({
  hasError: false,
});

export const useFormField = () => React.useContext(FormFieldContext);

export const FormField: React.FC<FormFieldProps> = ({
  id: idProp,
  label,
  required = false,
  optional = false,
  helperText,
  error,
  successMessage,
  className,
  children,
}) => {
  const generatedId = React.useId();
  const id = idProp || generatedId;
  const hasError = Boolean(error);
  const errorId = `${id}-error`;
  const helperId = `${id}-desc`;

  // Determine aria-describedby
  const describedBy = [
    hasError ? errorId : undefined,
    helperText ? helperId : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  // Enhance single child if it's a valid React element
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement<Record<string, unknown>>(child)) {
      const childProps: Record<string, unknown> = {
        id: child.props.id || id,
        "aria-invalid": hasError ? "true" : child.props["aria-invalid"],
      };

      if (describedBy) {
        childProps["aria-describedby"] = child.props["aria-describedby"]
          ? `${child.props["aria-describedby"]} ${describedBy}`
          : describedBy;
      }

      if (hasError && child.props.error === undefined) {
        childProps.error = true;
      }

      return React.cloneElement(child, childProps);
    }
    return child;
  });

  return (
    <FormFieldContext.Provider value={{ id, error, hasError }}>
      <div className={cn("flex flex-col space-y-1.5", className)}>
        {label && (
          <Label
            htmlFor={id}
            required={required}
            optional={optional}
            error={hasError}
          >
            {label}
          </Label>
        )}

        {enhancedChildren}

        {hasError ? (
          <p
            id={errorId}
            role="alert"
            className="text-xs text-state-danger-text font-medium mt-1 flex items-center gap-1"
          >
            {error}
          </p>
        ) : successMessage ? (
          <p className="text-xs text-state-success-text font-medium mt-1">
            {successMessage}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-txt-muted mt-1">
            {helperText}
          </p>
        ) : null}
      </div>
    </FormFieldContext.Provider>
  );
};
FormField.displayName = "FormField";
