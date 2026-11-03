import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const labelVariants = cva(
  "ux4g-label ux4g-fs-14 ux4g-fw-medium text-sm font-medium leading-none text-txt-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none",
  {
    variants: {
      error: {
        true: "ux4g-text-error text-state-danger-text",
      },
    },
  },
);

export interface LabelProps
  extends
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
  optional?: boolean;
  error?: boolean;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, required, optional, error, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ error }), className)}
    {...props}
  >
    {children}
    {required && (
      <span className="text-state-danger-icon ml-1" aria-hidden="true">
        *
      </span>
    )}
    {optional && !required && (
      <span
        className="text-txt-muted text-xs font-normal ml-1"
        aria-hidden="true"
      >
        (optional)
      </span>
    )}
  </LabelPrimitive.Root>
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
