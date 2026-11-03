import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
}

export function ButtonGroup({
  label,
  className,
  children,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "ux4g-btn-group inline-flex flex-wrap items-center gap-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
