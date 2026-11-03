import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export interface SwitchProps extends React.ComponentPropsWithoutRef<
  typeof SwitchPrimitives.Root
> {
  size?: "default" | "sm";
  error?: boolean;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, size = "default", error, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-brand-primary data-[state=unchecked]:bg-line-strong",
      "before:content-[''] before:absolute",
      size === "sm"
        ? "h-4 w-7 before:-inset-y-[14px] before:-inset-x-2"
        : "h-5 w-9 before:-inset-y-[12px] before:-inset-x-1",
      error && "border-state-danger-icon focus-visible:ring-state-danger-icon",
      className,
    )}
    aria-invalid={error ? "true" : props["aria-invalid"]}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block rounded-full bg-surface-card shadow-lg ring-0 transition-transform",
        size === "sm"
          ? "h-3 w-3 data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0"
          : "h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
