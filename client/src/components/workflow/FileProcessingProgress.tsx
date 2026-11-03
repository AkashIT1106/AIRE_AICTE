import React from "react";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCw,
  XCircle,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ProcessingStageItem, MOCK_PROCESSING_STAGES } from "./mockData";

export interface FileProcessingProgressProps {
  stages?: ProcessingStageItem[];
  progressPercent?: number;
  status?: "idle" | "processing" | "completed" | "error";
  rowsProcessed?: number;
  totalRows?: number;
  fileName?: string;
  errorMessage?: string;
  onCancel?: () => void;
  onRetry?: () => void;
  onViewResults?: () => void;
  className?: string;
}

export const FileProcessingProgress: React.FC<FileProcessingProgressProps> = ({
  stages = MOCK_PROCESSING_STAGES,
  progressPercent = 65,
  status = "processing",
  rowsProcessed = 39,
  totalRows = 60,
  fileName = "admissions_batch_round2.csv",
  errorMessage,
  onCancel,
  onRetry,
  onViewResults,
  className,
}) => {
  const isRunning = status === "processing";
  const isFailed = status === "error";
  const isFinished = status === "completed";

  return (
    <Card
      className={cn("w-full border-line-default shadow-sm", className)}
      data-testid="file-processing-progress"
      role="region"
      aria-label="Batch ingestion progress"
    >
      <CardHeader className="border-b border-line-subtle bg-surface-card pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  isFinished ? "success" : isFailed ? "danger" : "warning"
                }
                className="text-[11px] font-semibold uppercase"
              >
                {status.toUpperCase()}
              </Badge>
              <span className="text-xs text-txt-muted font-mono">
                {fileName}
              </span>
            </div>
            <CardTitle className="text-lg font-bold text-txt-primary flex items-center gap-2">
              {isRunning && (
                <RotateCw
                  className="h-4 w-4 text-brand-primary animate-spin"
                  aria-hidden="true"
                />
              )}
              {isFinished && (
                <CheckCircle2
                  className="h-4 w-4 text-state-success-icon"
                  aria-hidden="true"
                />
              )}
              {isFailed && (
                <AlertCircle
                  className="h-4 w-4 text-state-danger-icon"
                  aria-hidden="true"
                />
              )}
              <span>
                {isFinished
                  ? "Ingestion Pipeline Completed"
                  : isFailed
                    ? "Ingestion Pipeline Halted"
                    : "Processing Admission Batch"}
              </span>
            </CardTitle>
            <CardDescription className="text-xs text-txt-secondary">
              Evaluating candidate records against statutory quota rules and
              APAAR schemas.
            </CardDescription>
          </div>

          <div className="text-right">
            <span className="text-2xl font-bold font-tabular text-txt-primary tracking-tight">
              {progressPercent}%
            </span>
            <p className="text-xs text-txt-muted font-tabular">
              {rowsProcessed} of {totalRows} records analyzed
            </p>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-3">
          <Progress
            value={progressPercent}
            size="default"
            aria-label="Overall batch processing progress"
            className={cn(
              isFailed && "[&>div]:bg-state-danger-icon",
              isFinished && "[&>div]:bg-state-success-icon",
            )}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-4">
        {isFailed && errorMessage && (
          <div
            role="alert"
            className="rounded-lg border border-state-danger-border bg-state-danger-bg p-3.5 flex items-start gap-3 text-xs text-state-danger-text"
          >
            <ShieldAlert
              className="h-4 w-4 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <span className="font-semibold">Pipeline Execution Halted:</span>
              <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Stages Stepper / Timeline List */}
        <div className="space-y-3">
          {stages.map((stage, idx) => {
            const isCompleted = stage.status === "completed";
            const isStageRunning = stage.status === "running";
            const isStageFailed = stage.status === "failed";
            const isPending = stage.status === "pending";

            return (
              <div
                key={stage.id || idx}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-all text-xs",
                  isStageRunning &&
                    "border-brand-primary/40 bg-brand-subtle/50 ring-1 ring-brand-primary/20",
                  isCompleted && "border-line-subtle bg-surface-card",
                  isPending &&
                    "border-line-subtle bg-surface-card-subdued opacity-70",
                  isStageFailed &&
                    "border-state-danger-border bg-state-danger-bg",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      isCompleted &&
                        "bg-state-success-bg text-state-success-text border border-state-success-border",
                      isStageRunning &&
                        "bg-brand-primary text-txt-inverted animate-pulse",
                      isPending &&
                        "bg-surface-card text-txt-muted border border-line-default",
                      isStageFailed &&
                        "bg-state-danger-bg text-state-danger-text border border-state-danger-icon",
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2
                        className="h-4 w-4 text-state-success-icon"
                        aria-hidden="true"
                      />
                    ) : isStageRunning ? (
                      <RotateCw
                        className="h-3.5 w-3.5 animate-spin"
                        aria-hidden="true"
                      />
                    ) : isStageFailed ? (
                      <AlertCircle
                        className="h-3.5 w-3.5 text-state-danger-icon"
                        aria-hidden="true"
                      />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>

                  <div>
                    <span className="font-semibold text-txt-primary">
                      {stage.label}
                    </span>
                    <p className="text-[11px] text-txt-secondary mt-0.5">
                      {stage.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {stage.progress !== undefined && isStageRunning && (
                    <span className="font-mono font-medium text-[11px] text-brand-primary">
                      {stage.progress}%
                    </span>
                  )}
                  <Badge
                    variant={
                      isCompleted
                        ? "success"
                        : isStageRunning
                          ? "warning"
                          : isStageFailed
                            ? "danger"
                            : "secondary"
                    }
                    className="text-[10px] uppercase font-semibold"
                  >
                    {stage.status}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="border-t border-line-subtle bg-surface-card-subdued px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-txt-muted">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Statutory batch lock is enabled during validation.</span>
        </div>

        <div className="flex items-center gap-2">
          {isRunning && onCancel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="text-xs h-8 border-line-default hover:bg-state-danger-bg hover:text-state-danger-text"
            >
              <XCircle className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
              <span>Cancel</span>
            </Button>
          )}

          {isFailed && onRetry && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="text-xs h-8 border-line-default hover:bg-surface-card"
            >
              <RotateCw
                className="h-3.5 w-3.5 mr-1 text-brand-primary"
                aria-hidden="true"
              />
              <span>Retry Validation</span>
            </Button>
          )}

          {isFinished && onViewResults && (
            <Button
              type="button"
              size="sm"
              onClick={onViewResults}
              className="text-xs h-8 bg-brand-primary hover:bg-brand-primary-hover text-txt-inverted gap-1 font-semibold"
            >
              <span>View Results &amp; Triage</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

FileProcessingProgress.displayName = "FileProcessingProgress";
