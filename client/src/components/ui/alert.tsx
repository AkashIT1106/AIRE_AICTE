import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--surface-card)] text-[var(--text-primary)] border-[var(--border-default)] [&>svg]:text-[var(--text-primary)]",
        info: "bg-[var(--state-info-bg)] text-[var(--state-info-text)] border-[var(--state-info-border)] [&>svg]:text-[var(--state-info-icon)]",
        success:
          "bg-[var(--state-success-bg)] text-[var(--state-success-text)] border-[var(--state-success-border)] [&>svg]:text-[var(--state-success-icon)]",
        warning:
          "bg-[var(--state-warning-bg)] text-[var(--state-warning-text)] border-[var(--state-warning-border)] [&>svg]:text-[var(--state-warning-icon)]",
        destructive:
          "bg-[var(--state-danger-bg)] text-[var(--state-danger-text)] border-[var(--state-danger-border)] [&>svg]:text-[var(--state-danger-icon)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
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

export { Alert, AlertTitle, AlertDescription };
