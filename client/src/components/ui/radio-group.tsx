import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RadioGroupItemProps extends React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Item
> {
  error?: boolean;
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    className={cn("grid gap-2", className)}
    {...props}
    ref={ref}
  />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, error, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    aria-invalid={error ? "true" : props["aria-invalid"]}
    className={cn(
      "peer relative aspect-square size-4 rounded-full border border-line-strong bg-surface-card text-brand-primary transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "before:content-[''] before:absolute before:-inset-[14px]", // 44px min touch target (16px + 2*14px = 44px)
      error &&
        "border-state-danger-icon text-state-danger-icon focus-visible:ring-state-danger-icon",
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <Circle
        className="size-2.5 fill-current text-current"
        aria-hidden="true"
      />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
