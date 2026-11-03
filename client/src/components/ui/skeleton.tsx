import React from "react";
import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded bg-[var(--surface-card-subdued)]",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
