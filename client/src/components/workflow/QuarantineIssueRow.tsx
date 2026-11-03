import React, { useState } from "react";
import {
  AlertTriangle,
  Wrench,
  Trash2,
  ChevronDown,
  ChevronUp,
  User,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuarantineRecord } from "@aire/api-contracts";

export interface QuarantineIssueRowProps {
  record: QuarantineRecord;
  onRemediate?: (record: QuarantineRecord) => void;
  onDiscard?: (record: QuarantineRecord) => void;
  isRemediating?: boolean;
  className?: string;
}

export const QuarantineIssueRow: React.FC<QuarantineIssueRowProps> = ({
  record,
  onRemediate,
  onDiscard,
  isRemediating = false,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const studentName = String(
    record.rawData?.studentName || "Unknown Candidate",
  );
  const rollNumber = String(record.rawData?.rollNumber || "N/A");
  const rawCategory = String(record.rawData?.category || "N/A");
  const rawDob = String(record.rawData?.dateOfBirth || "N/A");
  const rawApaar = String(record.rawData?.apaarId || "N/A");

  return (
    <div
      className={cn(
        "rounded-lg border border-state-warning-border/80 bg-surface-card p-4 transition-all shadow-2xs hover:shadow-xs",
        className,
      )}
      data-testid={`quarantine-issue-row-${record.rowId}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Row Identifier & Student Summary */}
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-state-warning-bg text-state-warning-text font-mono font-bold text-xs border border-state-warning-border">
            #{record.rowNumber}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-sm text-txt-primary flex items-center gap-1.5">
                <User
                  className="h-3.5 w-3.5 text-txt-muted"
                  aria-hidden="true"
                />
                <span>{studentName}</span>
              </span>
              <Badge
                variant="outline"
                className="font-mono text-[11px] font-medium"
              >
                Roll: {rollNumber}
              </Badge>
              {rawApaar !== "N/A" && (
                <Badge variant="masked" className="text-[11px]">
                  APAAR: {rawApaar}
                </Badge>
              )}
            </div>

            {/* Error tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {record.errors.map((err, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded bg-state-danger-bg text-state-danger-text px-2 py-0.5 text-[11px] font-medium border border-state-danger-border"
                >
                  <AlertTriangle
                    className="h-3 w-3 shrink-0"
                    aria-hidden="true"
                  />
                  <span>
                    Field &apos;{err.field}&apos;: {err.message}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs h-8 text-txt-muted hover:text-txt-primary gap-1"
            aria-expanded={isExpanded}
            aria-label={`Toggle raw data for row #${record.rowNumber}`}
          >
            <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{isExpanded ? "Hide Data" : "Inspect Raw"}</span>
            {isExpanded ? (
              <ChevronUp className="h-3 w-3" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-3 w-3" aria-hidden="true" />
            )}
          </Button>

          {onDiscard && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onDiscard(record)}
              className="text-xs h-8 border-line-default text-state-danger-text hover:bg-state-danger-bg"
              aria-label={`Discard row #${record.rowNumber}`}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
              <span>Discard</span>
            </Button>
          )}

          {onRemediate && (
            <Button
              type="button"
              size="sm"
              onClick={() => onRemediate(record)}
              loading={isRemediating}
              className="text-xs h-8 bg-brand-primary hover:bg-brand-primary-hover text-txt-inverted gap-1 font-semibold"
              aria-label={`Remediate row #${record.rowNumber}`}
            >
              <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Remediate</span>
            </Button>
          )}
        </div>
      </div>

      {/* Expandable Raw Data View */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-line-subtle text-xs space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-txt-secondary">
            <div>
              <span className="text-[10px] uppercase font-bold text-txt-muted block">
                Date of Birth
              </span>
              <span className="font-mono">{rawDob}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-txt-muted block">
                Category
              </span>
              <span className="font-mono text-state-danger-text font-bold">
                {rawCategory}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-txt-muted block">
                Quota
              </span>
              <span>{String(record.rawData?.quota || "N/A")}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-txt-muted block">
                Status
              </span>
              <Badge variant="warning" className="text-[10px]">
                QUARANTINED
              </Badge>
            </div>
          </div>

          <div className="bg-surface-card-subdued rounded p-2.5 border border-line-subtle">
            <span className="text-[10px] font-mono uppercase text-txt-muted font-bold block mb-1">
              Raw Payload Object
            </span>
            <pre className="text-[11px] font-mono text-txt-primary overflow-x-auto">
              {JSON.stringify(record.rawData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

QuarantineIssueRow.displayName = "QuarantineIssueRow";
