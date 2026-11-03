import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton: React.FC = () => {
  return (
    <div
      className="space-y-6 animate-pulse"
      role="status"
      aria-label="Loading dashboard metrics and ledger"
    >
      {/* 1. Header Banner Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--border-default)]">
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-7 w-80" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-9 w-24 rounded" />
          <Skeleton className="h-9 w-36 rounded" />
        </div>
      </div>

      {/* 2. Notice Banner Skeleton */}
      <Skeleton className="h-16 w-full rounded-lg" />

      {/* 3. 4-Column KPI Grid with Exact Dimensions (h-[106px]) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] h-[106px] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>

      {/* 4. Table Card Skeleton with Exact Row Geometry */}
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] p-6 space-y-4">
        <div className="space-y-1.5 pb-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        <div className="rounded border border-[var(--border-default)] overflow-hidden">
          {/* Table Header */}
          <div className="h-9 bg-[var(--surface-card-subdued)] border-b border-[var(--border-default)] px-4 flex items-center justify-between">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-12" />
            <Skeleton className="h-3.5 w-12" />
            <Skeleton className="h-3.5 w-12" />
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 w-16" />
          </div>
          {/* Table Rows (Exact 36px height per design system) */}
          {[1, 2, 3].map((r) => (
            <div
              key={r}
              className="h-[36px] border-b border-[var(--border-subtle)] px-4 flex items-center justify-between"
            >
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
