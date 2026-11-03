import React from "react";
import { Clock, CheckCircle2, RotateCw, Hash, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { SubmissionBatchStatus } from "@aire/api-contracts";
import {
  SubmissionTimelineMilestone,
  MOCK_SUBMISSION_TIMELINE,
} from "./mockData";

export interface SubmissionStatusTimelineProps {
  currentStatus?: SubmissionBatchStatus;
  milestones?: SubmissionTimelineMilestone[];
  batchId?: string;
  className?: string;
}

export const SubmissionStatusTimeline: React.FC<
  SubmissionStatusTimelineProps
> = ({
  currentStatus = MOCK_SUBMISSION_TIMELINE.currentStatus,
  milestones = MOCK_SUBMISSION_TIMELINE.milestones,
  batchId = "BATCH-2026-CSE-001",
  className,
}) => {
  return (
    <Card
      className={cn("w-full border-line-default shadow-sm", className)}
      data-testid="submission-status-timeline"
    >
      <CardHeader className="border-b border-line-subtle bg-surface-card pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-[11px]">
                {batchId}
              </Badge>
              <Badge
                variant="warning"
                className="text-[11px] font-semibold uppercase"
              >
                STATUS: {currentStatus}
              </Badge>
            </div>
            <CardTitle className="text-lg font-bold text-txt-primary flex items-center gap-2">
              <Clock
                className="h-5 w-5 text-brand-primary"
                aria-hidden="true"
              />
              <span>Statutory Cohort Submission Lifecycle</span>
            </CardTitle>
            <CardDescription className="text-xs text-txt-secondary">
              Chronological progress through AICTE Section 10(1) regulatory
              admission milestones.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <ol
          className="relative space-y-6 pl-6 border-l-2 border-line-default ml-4"
          aria-label="Submission milestones"
        >
          {milestones.map((m, idx) => {
            const isCompleted = m.isCompleted;
            const isCurrent = m.isCurrent || m.status === currentStatus;
            const isPending = !isCompleted && !isCurrent;

            return (
              <li
                key={m.status || idx}
                className="relative group text-left"
                aria-current={isCurrent ? "step" : undefined}
              >
                {/* Node icon pill on vertical track */}
                <span
                  className={cn(
                    "absolute -left-[35px] top-0 flex h-7 w-7 items-center justify-center rounded-full bg-surface-card ring-4 ring-surface-card transition-colors",
                    isCompleted && "text-state-success-icon",
                    isCurrent && "text-brand-primary animate-pulse",
                    isPending && "text-txt-muted opacity-50",
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2
                      className="h-6 w-6 stroke-[2]"
                      aria-hidden="true"
                    />
                  ) : isCurrent ? (
                    <RotateCw
                      className="h-5 w-5 stroke-[2.5] animate-spin text-brand-primary"
                      aria-hidden="true"
                    />
                  ) : (
                    <Circle className="h-5 w-5 stroke-[2]" aria-hidden="true" />
                  )}
                </span>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <div className="flex items-center gap-2">
                      <h4
                        className={cn(
                          "text-sm font-bold",
                          isCurrent
                            ? "text-brand-primary"
                            : isCompleted
                              ? "text-txt-primary"
                              : "text-txt-muted",
                        )}
                      >
                        {m.title}
                      </h4>
                      <Badge
                        variant={
                          isCompleted
                            ? "success"
                            : isCurrent
                              ? "warning"
                              : "secondary"
                        }
                        className="text-[10px] uppercase font-bold"
                      >
                        {isCompleted
                          ? "COMPLETED"
                          : isCurrent
                            ? "IN PROGRESS"
                            : "UPCOMING"}
                      </Badge>
                    </div>

                    <time className="text-xs text-txt-muted font-tabular">
                      {m.timestamp}
                    </time>
                  </div>

                  <p className="text-xs text-txt-secondary leading-relaxed">
                    {m.note}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="inline-flex items-center rounded bg-surface-card-subdued px-2 py-0.5 text-[11px] font-medium text-txt-secondary border border-line-subtle">
                      Actor: {m.actorName} ({m.actorRole})
                    </span>

                    {m.digest && (
                      <span className="inline-flex items-center gap-1 rounded bg-surface-card-subdued px-2 py-0.5 text-[11px] font-mono text-txt-secondary border border-line-subtle">
                        <Hash
                          className="h-3 w-3 text-brand-primary"
                          aria-hidden="true"
                        />
                        <span className="truncate max-w-[140px] select-all">
                          {m.digest}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
};

SubmissionStatusTimeline.displayName = "SubmissionStatusTimeline";
