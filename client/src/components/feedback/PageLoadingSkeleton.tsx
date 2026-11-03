import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const PageLoadingSkeleton: React.FC = () => {
  return (
    <div
      className="ux4g-animate-pulse space-y-6 animate-pulse p-2"
      role="status"
      aria-label="Loading page workspace"
    >
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>

      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
};
