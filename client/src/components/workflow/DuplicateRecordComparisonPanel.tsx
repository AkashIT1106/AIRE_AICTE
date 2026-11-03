import React, { useState } from "react";
import {
  GitCompare,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { DuplicateConflictData, MOCK_DUPLICATE_COMPARISON } from "./mockData";

export interface DuplicateRecordComparisonPanelProps {
  conflictData?: DuplicateConflictData;
  existingRecord?: Record<string, unknown>;
  incomingRecord?: Record<string, unknown>;
  conflictType?: "DUPLICATE_APAAR" | "DUPLICATE_ROLL" | "DUAL_ENROLLMENT";
  conflictingFields?: string[];
  onResolve?: (
    action: "keep" | "overwrite" | "escalate",
    resolutionNote?: string,
  ) => void;
  className?: string;
}

export const DuplicateRecordComparisonPanel: React.FC<
  DuplicateRecordComparisonPanelProps
> = ({
  conflictData: externalData,
  existingRecord,
  incomingRecord,
  conflictType: externalConflictType,
  conflictingFields: externalConflictingFields,
  onResolve,
  className,
}) => {
  const [selectedResolution, setSelectedResolution] = useState<
    "keep" | "overwrite" | "escalate" | null
  >(null);

  // Reconcile props with mock default
  const conflictData: DuplicateConflictData = externalData || {
    conflictType:
      externalConflictType || MOCK_DUPLICATE_COMPARISON.conflictType,
    description: MOCK_DUPLICATE_COMPARISON.description,
    recordA: (existingRecord as any) || MOCK_DUPLICATE_COMPARISON.recordA,
    recordB: (incomingRecord as any) || MOCK_DUPLICATE_COMPARISON.recordB,
    conflictingFields:
      externalConflictingFields || MOCK_DUPLICATE_COMPARISON.conflictingFields,
  };

  const { conflictType, description, recordA, recordB, conflictingFields } =
    conflictData;

  const comparisonRows: Array<{
    field: string;
    label: string;
    valA: string;
    valB: string;
  }> = [
    {
      field: "studentName",
      label: "Candidate Name",
      valA: String(recordA.studentName || ""),
      valB: String(recordB.studentName || ""),
    },
    {
      field: "apaarId",
      label: "APAAR Identifier",
      valA: String(recordA.apaarId || ""),
      valB: String(recordB.apaarId || ""),
    },
    {
      field: "rollNumber",
      label: "Roll / Application ID",
      valA: String(recordA.rollNumber || ""),
      valB: String(recordB.rollNumber || ""),
    },
    {
      field: "institutionName",
      label: "Admitting Institution",
      valA: `${recordA.institutionName} (${recordA.institutionCode})`,
      valB: `${recordB.institutionName} (${recordB.institutionCode})`,
    },
    {
      field: "programme",
      label: "Programme / Course",
      valA: String(recordA.programme || ""),
      valB: String(recordB.programme || ""),
    },
    {
      field: "quota",
      label: "Admission Quota",
      valA: String(recordA.quota || ""),
      valB: String(recordB.quota || ""),
    },
    {
      field: "category",
      label: "Reservation Category",
      valA: String(recordA.category || ""),
      valB: String(recordB.category || ""),
    },
    {
      field: "dateOfAdmission",
      label: "Admission Date",
      valA: String(recordA.dateOfAdmission || ""),
      valB: String(recordB.dateOfAdmission || ""),
    },
  ];

  const handleAction = (action: "keep" | "overwrite" | "escalate") => {
    setSelectedResolution(action);
    onResolve?.(action);
  };

  return (
    <Card
      className={cn("w-full border-line-default shadow-sm", className)}
      data-testid="duplicate-record-comparison"
    >
      <CardHeader className="border-b border-line-subtle bg-surface-card pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="danger"
                className="font-mono text-[11px] font-bold"
              >
                CONFLICT: {conflictType}
              </Badge>
              <Badge variant="warning" className="text-[11px]">
                DUAL CLAIM DETECTED
              </Badge>
              {selectedResolution && (
                <Badge variant="info" className="text-[11px] font-semibold">
                  STATUS: {selectedResolution.toUpperCase()}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg font-bold text-txt-primary flex items-center gap-2">
              <GitCompare
                className="h-5 w-5 text-brand-primary"
                aria-hidden="true"
              />
              <span>Duplicate Admission Claim Comparison</span>
            </CardTitle>
            <CardDescription className="text-xs text-txt-secondary">
              Side-by-side reconciliation of conflicting student admission
              claims across institutions.
            </CardDescription>
          </div>
        </div>

        {description && (
          <div
            role="alert"
            className="mt-3 p-3 rounded-lg border border-state-warning-border bg-state-warning-bg text-xs text-state-warning-text flex items-start gap-2.5"
          >
            <AlertTriangle
              className="h-4 w-4 shrink-0 mt-0.5 text-state-warning-icon"
              aria-hidden="true"
            />
            <span className="leading-relaxed">{description}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div
          className="overflow-x-auto"
          tabIndex={0}
          aria-label="Duplicate candidate claim comparison table"
        >
          <Table>
            <TableHeader className="bg-surface-card-subdued">
              <TableRow>
                <TableHead className="w-1/4 font-semibold">Attribute</TableHead>
                <TableHead className="w-3/8 font-semibold text-brand-primary">
                  {recordA.label || "Claim 1 (Existing Validated Record)"}
                </TableHead>
                <TableHead className="w-3/8 font-semibold text-brand-teal">
                  {recordB.label || "Claim 2 (Incoming Batch Record)"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonRows.map((row) => {
                const isConflict =
                  conflictingFields.includes(row.field) ||
                  row.valA !== row.valB;

                return (
                  <TableRow
                    key={row.field}
                    className={cn(
                      "transition-colors",
                      isConflict &&
                        "bg-state-warning-bg/30 hover:bg-state-warning-bg/50",
                    )}
                  >
                    <TableCell className="font-medium text-xs text-txt-muted flex items-center gap-1.5">
                      {isConflict && (
                        <AlertTriangle
                          className="h-3 w-3 text-state-warning-icon shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      <span>{row.label}</span>
                    </TableCell>

                    <TableCell
                      className={cn(
                        "text-xs font-medium text-txt-primary",
                        isConflict &&
                          "font-bold text-state-warning-text bg-state-warning-bg/40",
                      )}
                    >
                      {row.valA}
                    </TableCell>

                    <TableCell
                      className={cn(
                        "text-xs font-medium text-txt-primary",
                        isConflict &&
                          "font-bold text-state-warning-text bg-state-warning-bg/40",
                      )}
                    >
                      {row.valB}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="border-t border-line-subtle bg-surface-card-subdued px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs text-txt-muted">
          Reconciliation actions are logged with actor identity in immutable
          statutory audit trail.
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAction("keep")}
            className="text-xs h-8 border-line-default hover:bg-surface-card"
          >
            <ShieldCheck
              className="h-3.5 w-3.5 mr-1 text-state-success-icon"
              aria-hidden="true"
            />
            <span>Keep Existing Claim</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAction("overwrite")}
            className="text-xs h-8 border-line-default hover:bg-surface-card"
          >
            <ArrowRight
              className="h-3.5 w-3.5 mr-1 text-brand-primary"
              aria-hidden="true"
            />
            <span>Overwrite with Incoming</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => handleAction("escalate")}
            className="text-xs h-8 bg-brand-primary hover:bg-brand-primary-hover text-txt-inverted font-semibold"
          >
            <Send className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
            <span>Escalate to AICTE</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

DuplicateRecordComparisonPanel.displayName = "DuplicateRecordComparisonPanel";

// Named alias export for compatibility
export { DuplicateRecordComparisonPanel as DuplicateRecordComparison };
