import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> {
  error?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, error, checked, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    checked={checked}
    aria-invalid={error ? "true" : props["aria-invalid"]}
    className={cn(
      "ux4g-form-check ux4g-checkbox peer relative h-4 w-4 shrink-0 rounded-sm border border-line-strong bg-surface-card transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary data-[state=checked]:text-txt-inverted",
      "data-[state=indeterminate]:bg-brand-primary data-[state=indeterminate]:border-brand-primary data-[state=indeterminate]:text-txt-inverted",
      "before:content-[''] before:absolute before:-inset-[14px]", // 44px min touch target (16px + 2*14px = 44px)
      error && "border-state-danger-icon focus-visible:ring-state-danger-icon",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      {checked === "indeterminate" ? (
        <Minus className="h-3 w-3 stroke-[3]" />
      ) : (
        <Check className="h-3.5 w-3.5 stroke-[3]" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
