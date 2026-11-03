import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "ux4g-alert relative w-full rounded border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default:
          "ux4g-alert-neutral bg-surface-card text-txt-primary border-line-default [&>svg]:text-txt-primary",
        info: "ux4g-alert-info bg-state-info-bg text-state-info-text border-state-info-border [&>svg]:text-state-info-icon",
        success:
          "ux4g-alert-success bg-state-success-bg text-state-success-text border-state-success-border [&>svg]:text-state-success-icon",
        warning:
          "ux4g-alert-warning bg-state-warning-bg text-state-warning-text border-state-warning-border [&>svg]:text-state-warning-icon",
        destructive:
          "ux4g-alert-error bg-state-danger-bg text-state-danger-text border-state-danger-border [&>svg]:text-state-danger-icon",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface AlertProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  onClose?: () => void;
  liveRegion?: "polite" | "assertive" | "off";
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    { className, variant = "default", onClose, liveRegion, children, ...props },
    ref,
  ) => {
    const determinedAriaLive =
      liveRegion ?? (variant === "destructive" ? "assertive" : "polite");

    return (
      <div
        ref={ref}
        role="alert"
        aria-live={determinedAriaLive}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {children}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded p-1 text-txt-muted hover:text-txt-primary hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  },
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
    {...props}
  >
    {children}
  </h5>
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed opacity-95", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants };
