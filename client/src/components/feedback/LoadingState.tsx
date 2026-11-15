/**
 * LoadingState — shown while data is being fetched.
 */

import { clsx } from "clsx";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading…",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-3 py-16 text-center",
        className,
      )}
    >
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-4 border-neutral-150" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-brand-primary" />
      </div>
      <p className="text-sm text-neutral-600">{message}</p>
    </div>
  );
}
