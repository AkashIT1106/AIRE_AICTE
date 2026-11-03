import React from "react";
import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-busy="true"
      aria-hidden="true"
      className={cn(
        "ux4g-skeleton ux4g-animate-pulse rounded bg-surface-card-subdued animate-pulse motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
