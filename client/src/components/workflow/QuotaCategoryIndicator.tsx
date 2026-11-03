import React from "react";
import { PieChart, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { QuotaCapacityOverview, MOCK_QUOTA_ALLOCATIONS } from "./mockData";

export interface QuotaCategoryIndicatorProps {
  overview?: QuotaCapacityOverview;
  quota?: string;
  allocated?: number;
  sanctionedCapacity?: number;
  isSupernumerary?: boolean;
  status?: "compliant" | "warning" | "breach";
  className?: string;
}

export const QuotaCategoryIndicator: React.FC<QuotaCategoryIndicatorProps> = ({
  overview = MOCK_QUOTA_ALLOCATIONS,
  quota,
  allocated,
  sanctionedCapacity,
  isSupernumerary,
  status: singleStatus,
  className,
}) => {
  // If single quota mode is provided:
  if (quota && allocated !== undefined && sanctionedCapacity !== undefined) {
    const isOverAdmitted = allocated > sanctionedCapacity;
    const effectiveStatus =
      singleStatus ||
      (isOverAdmitted
        ? "breach"
        : allocated === sanctionedCapacity
          ? "warning"
          : "compliant");
    const percent =
      sanctionedCapacity > 0
        ? Math.round((allocated / sanctionedCapacity) * 100)
        : 100;

    return (
      <div
        className={cn(
          "rounded-lg border p-3.5 space-y-2 text-xs",
          effectiveStatus === "breach" &&
            "border-state-danger-border bg-state-danger-bg/40",
          effectiveStatus === "warning" &&
            "border-state-warning-border bg-state-warning-bg/40",
          effectiveStatus === "compliant" &&
            "border-line-subtle bg-surface-card",
          className,
        )}
        data-testid={`quota-indicator-${quota}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-txt-primary">{quota}</span>
            {isSupernumerary && (
              <Badge variant="outline" className="text-[10px] font-mono">
                SUPERNUMERARY
              </Badge>
            )}
          </div>
          <Badge
            variant={
              effectiveStatus === "breach"
                ? "danger"
                : effectiveStatus === "warning"
                  ? "warning"
                  : "success"
            }
            className="text-[10px] uppercase font-bold"
          >
            {effectiveStatus === "breach"
              ? "OVER-ADMISSION BREACH"
              : effectiveStatus}
          </Badge>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-txt-muted font-tabular">
            <span>
              Allocated:{" "}
              <strong className="text-txt-primary">{allocated}</strong> /{" "}
              {sanctionedCapacity} seats
            </span>
            <span>{percent}%</span>
          </div>
          <Progress
            value={Math.min(100, percent)}
            size="sm"
            aria-label={`Allocation progress for quota ${quota}`}
            className={cn(
              effectiveStatus === "breach" && "[&>div]:bg-state-danger-icon",
              effectiveStatus === "warning" && "[&>div]:bg-state-warning-icon",
            )}
          />
        </div>
      </div>
    );
  }

  // Full overview mode:
  const totalAllocated = overview.admittedCount;
  const totalApproved = overview.approvedIntake;
  const isOverAdmittedGlobal = totalAllocated > totalApproved;
  const globalPercent =
    totalApproved > 0
      ? Math.round((totalAllocated / totalApproved) * 1000) / 10
      : 0;

  return (
    <Card
      className={cn("w-full border-line-default shadow-sm", className)}
      data-testid="quota-category-indicator"
    >
      <CardHeader className="border-b border-line-subtle bg-surface-card pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-[11px]">
                APH 2026-27 COMPLIANCE
              </Badge>
              <Badge
                variant={isOverAdmittedGlobal ? "danger" : "success"}
                className="text-[11px] font-semibold"
              >
                {isOverAdmittedGlobal
                  ? "INTAKE BREACH DETECTED"
                  : "INTAKE COMPLIANT"}
              </Badge>
            </div>
            <CardTitle className="text-lg font-bold text-txt-primary flex items-center gap-2">
              <PieChart
                className="h-5 w-5 text-brand-primary"
                aria-hidden="true"
              />
              <span>Sanctioned Intake &amp; Quota Allocations</span>
            </CardTitle>
            <CardDescription className="text-xs text-txt-secondary">
              Statutory ceiling verification across reservation categories and
              supernumerary quotas.
            </CardDescription>
          </div>

          <div className="text-right">
            <span className="text-2xl font-bold font-tabular text-txt-primary tracking-tight">
              {totalAllocated} / {totalApproved}
            </span>
            <p className="text-xs text-txt-muted font-tabular">
              {totalApproved - totalAllocated} remaining vacant seats
            </p>
          </div>
        </div>

        {/* Global Capacity Progress */}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-xs text-txt-muted font-tabular">
            <span>Overall Branch Intake Utilization</span>
            <span>{globalPercent}%</span>
          </div>
          <Progress
            value={Math.min(100, globalPercent)}
            size="default"
            aria-label="Overall intake utilization progress"
            className={cn(
              isOverAdmittedGlobal && "[&>div]:bg-state-danger-icon",
            )}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        {overview.allocations.map((item, idx) => {
          const isItemBreach =
            item.allocated > item.sanctionedCapacity && !item.isSupernumerary;
          const isNearCapacity =
            item.sanctionedCapacity > 0 &&
            item.allocated >= item.sanctionedCapacity * 0.95;
          const itemPercent =
            item.sanctionedCapacity > 0
              ? Math.round((item.allocated / item.sanctionedCapacity) * 100)
              : 100;

          return (
            <div
              key={idx}
              className="p-3 rounded-lg border border-line-subtle bg-surface-card hover:bg-surface-card-subdued transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-txt-primary">
                    {item.quota}
                  </span>
                  {item.isSupernumerary && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-mono"
                    >
                      SUPERNUMERARY (+5%)
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-txt-secondary">
                    {item.allocated} / {item.sanctionedCapacity}
                  </span>
                  {isItemBreach ? (
                    <Badge variant="danger" className="text-[10px]">
                      BREACH
                    </Badge>
                  ) : isNearCapacity ? (
                    <Badge variant="warning" className="text-[10px]">
                      FULL
                    </Badge>
                  ) : (
                    <Badge variant="success" className="text-[10px]">
                      OK
                    </Badge>
                  )}
                </div>
              </div>

              <Progress
                value={Math.min(100, itemPercent)}
                size="sm"
                aria-label={`Allocation for ${item.quota}`}
                className={cn(
                  isItemBreach && "[&>div]:bg-state-danger-icon",
                  isNearCapacity &&
                    !isItemBreach &&
                    "[&>div]:bg-state-warning-icon",
                )}
              />
            </div>
          );
        })}
      </CardContent>

      <CardFooter className="border-t border-line-subtle bg-surface-card-subdued px-6 py-3 text-xs text-txt-muted flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-txt-muted" aria-hidden="true" />
          <span>
            Supernumerary seats (TFW/PMSSS/JK) are excluded from base sanctioned
            intake.
          </span>
        </span>
        <span className="font-semibold text-txt-primary">
          AICTE Ceiling: 100%
        </span>
      </CardFooter>
    </Card>
  );
};

QuotaCategoryIndicator.displayName = "QuotaCategoryIndicator";
