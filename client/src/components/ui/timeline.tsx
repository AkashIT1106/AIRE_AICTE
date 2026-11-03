import * as React from "react";
import { CheckCircle2, AlertCircle, Clock, Circle, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineNodeStatus =
  "completed" | "in-progress" | "failed" | "pending";

export interface TimelineEventItem {
  id: string;
  title: string;
  timestamp?: string;
  description?: string;
  status?: TimelineNodeStatus;
  actor?: string;
  digest?: string;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  items: TimelineEventItem[];
}

export const Timeline: React.FC<TimelineProps> = ({
  items,
  className,
  ...props
}) => {
  return (
    <ol
      className={cn(
        "ux4g-timeline relative space-y-6 pl-6 border-l-2 border-line-default ml-3",
        className,
      )}
      {...props}
    >
      {items.map((item, index) => {
        const status = item.status ?? "completed";

        return (
          <li key={item.id || index} className="relative group">
            {/* Node Icon on vertical connecting bar */}
            <span
              className={cn(
                "absolute -left-[35px] top-0 flex h-7 w-7 items-center justify-center rounded-full bg-surface-card ring-4 ring-surface-card transition-colors",
                status === "completed" && "text-state-success-icon",
                status === "in-progress" && "text-brand-primary animate-pulse",
                status === "failed" && "text-state-danger-icon",
                status === "pending" && "text-txt-muted opacity-60",
              )}
            >
              {status === "completed" && (
                <CheckCircle2
                  className="h-6 w-6 stroke-[2]"
                  aria-hidden="true"
                />
              )}
              {status === "in-progress" && (
                <Clock className="h-6 w-6 stroke-[2]" aria-hidden="true" />
              )}
              {status === "failed" && (
                <AlertCircle
                  className="h-6 w-6 stroke-[2]"
                  aria-hidden="true"
                />
              )}
              {status === "pending" && (
                <Circle className="h-5 w-5 stroke-[2]" aria-hidden="true" />
              )}
            </span>

            {/* Event content card */}
            <div className="flex flex-col gap-1 text-left">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <h5 className="text-sm font-semibold text-txt-primary">
                  {item.title}
                </h5>
                {item.timestamp && (
                  <time className="text-xs text-txt-muted font-tabular">
                    {item.timestamp}
                  </time>
                )}
              </div>

              {item.description && (
                <p className="text-xs text-txt-secondary leading-relaxed">
                  {item.description}
                </p>
              )}

              {(item.actor || item.digest) && (
                <div className="mt-1 flex flex-wrap items-center gap-2 pt-1 text-xs">
                  {item.actor && (
                    <span className="inline-flex items-center rounded bg-surface-card-subdued px-2 py-0.5 text-[11px] font-medium text-txt-secondary border border-line-subtle">
                      Actor: {item.actor}
                    </span>
                  )}
                  {item.digest && (
                    <span className="inline-flex items-center gap-1 rounded bg-surface-card-subdued px-2 py-0.5 text-[11px] font-mono text-txt-secondary border border-line-subtle">
                      <Hash
                        className="h-3 w-3 text-brand-primary"
                        aria-hidden="true"
                      />
                      <span className="select-all">
                        {item.digest.length > 16
                          ? `${item.digest.slice(0, 10)}...${item.digest.slice(-6)}`
                          : item.digest}
                      </span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
};
Timeline.displayName = "Timeline";
