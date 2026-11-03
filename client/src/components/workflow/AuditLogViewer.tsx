import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  FileText,
  Lock,
  Download,
  Copy,
  Check,
  FileCode,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AuditLogItem, MOCK_AUDIT_EVENTS } from "./mockData";
import { AuditLogFilter, AuditLogFilterState } from "./AuditLogFilter";

export interface AuditLogViewerProps {
  logs?: AuditLogItem[];
  filters?: AuditLogFilterState;
  onFilterChange?: (filters: AuditLogFilterState) => void;
  onInspectDiff?: (log: AuditLogItem) => void;
  onExport?: () => void;
  density?: "compact" | "standard";
  className?: string;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({
  logs = MOCK_AUDIT_EVENTS,
  filters: controlledFilters,
  onFilterChange,
  onInspectDiff,
  onExport,
  density = "standard",
  className,
}) => {
  const [internalFilters, setInternalFilters] = useState<AuditLogFilterState>(
    {},
  );
  const [selectedLogForDiff, setSelectedLogForDiff] =
    useState<AuditLogItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filters =
    controlledFilters !== undefined ? controlledFilters : internalFilters;

  const handleFilterUpdate = (newFilters: AuditLogFilterState) => {
    setInternalFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleResetFilters = () => {
    const empty: AuditLogFilterState = {};
    setInternalFilters(empty);
    onFilterChange?.(empty);
  };

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = (filters.searchQuery || "").toLowerCase();
      const matchSearch =
        !q ||
        log.correlationId.toLowerCase().includes(q) ||
        log.actorEmail.toLowerCase().includes(q) ||
        log.tenantCode.toLowerCase().includes(q) ||
        log.actionLabel.toLowerCase().includes(q);

      if (!matchSearch) return false;
      if (filters.action && log.action !== filters.action) return false;
      if (filters.actorRole && log.actorRole !== filters.actorRole)
        return false;

      return true;
    });
  }, [logs, filters]);

  const handleInspect = (log: AuditLogItem) => {
    setSelectedLogForDiff(log);
    onInspectDiff?.(log);
  };

  return (
    <Card
      className={cn(
        "w-full border-line-default shadow-sm space-y-4",
        className,
      )}
      data-testid="audit-log-viewer"
    >
      <CardHeader className="border-b border-line-subtle bg-surface-card pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="font-mono text-[11px] font-bold"
              >
                NON-REPUDIATION LEDGER
              </Badge>
              <Badge variant="info" className="text-[11px]">
                S-39 AUDIT EXPLORER
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold text-txt-primary flex items-center gap-2">
              <ShieldCheck
                className="h-5 w-5 text-brand-primary"
                aria-hidden="true"
              />
              <span>Immutable Statutory Audit Trail</span>
            </CardTitle>
            <CardDescription className="text-xs text-txt-secondary">
              Cryptographically verified record of all admission mutations,
              authentication events, and administrative actions.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onExport && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onExport}
                className="text-xs h-8 border-line-default gap-1.5"
              >
                <Download
                  className="h-3.5 w-3.5 text-brand-primary"
                  aria-hidden="true"
                />
                <span>Export Audit Log</span>
              </Button>
            )}
          </div>
        </div>

        {/* Filter component embed */}
        <div className="mt-4">
          <AuditLogFilter
            filters={filters}
            onFilterChange={handleFilterUpdate}
            onReset={handleResetFilters}
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div
          className="overflow-x-auto"
          tabIndex={0}
          aria-label="Statutory audit log table"
        >
          <Table density={density}>
            <TableHeader className="bg-surface-card-subdued">
              <TableRow>
                <TableHead className="w-40">Timestamp (IST)</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Actor Identity</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Correlation ID</TableHead>
                <TableHead className="text-right w-24">Diff</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-10 text-txt-muted"
                  >
                    <FileText
                      className="h-8 w-8 text-txt-muted mx-auto mb-2"
                      aria-hidden="true"
                    />
                    <p className="text-sm font-semibold text-txt-primary">
                      No Audit Events Matched
                    </p>
                    <p className="text-xs text-txt-secondary mt-0.5">
                      Try broadening your search query or reset filter
                      parameters.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => {
                  const isSuccess = log.status === "SUCCESS";
                  const isDenied = log.status === "DENIED";
                  const isCopied = copiedId === log.id;

                  return (
                    <TableRow
                      key={log.id}
                      className="hover:bg-surface-card-subdued/80"
                    >
                      <TableCell className="font-mono text-xs text-txt-muted whitespace-nowrap">
                        {log.timestamp}
                      </TableCell>

                      <TableCell>
                        <div className="space-y-0.5">
                          <span className="font-semibold text-xs text-txt-primary block">
                            {log.actionLabel}
                          </span>
                          <span className="font-mono text-[10px] text-txt-muted">
                            {log.action}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-0.5">
                          <span className="text-xs font-medium text-txt-primary block">
                            {log.actorEmail}
                          </span>
                          <span className="text-[10px] text-txt-secondary">
                            {log.actorRole}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-xs text-txt-secondary">
                        <span className="font-mono font-semibold text-txt-primary">
                          {log.tenantCode}
                        </span>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            isSuccess
                              ? "success"
                              : isDenied
                                ? "danger"
                                : "warning"
                          }
                          className="text-[10px] font-bold uppercase"
                        >
                          {log.status}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <button
                          type="button"
                          onClick={(e) =>
                            handleCopy(log.id, log.correlationId, e)
                          }
                          className="inline-flex items-center gap-1 rounded bg-surface-card-subdued px-2 py-0.5 text-[11px] font-mono text-txt-secondary border border-line-subtle hover:bg-surface-card transition-colors"
                          title="Click to copy correlation ID"
                          aria-label={`Copy correlation ID ${log.correlationId}`}
                        >
                          <span>{log.correlationId.slice(0, 14)}...</span>
                          {isCopied ? (
                            <Check
                              className="h-3 w-3 text-state-success-icon"
                              aria-hidden="true"
                            />
                          ) : (
                            <Copy
                              className="h-3 w-3 text-txt-muted"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleInspect(log)}
                          className="h-7 text-xs px-2 text-txt-muted hover:text-brand-primary hover:bg-surface-card gap-1"
                          aria-label={`Inspect diff for event ${log.id}`}
                        >
                          <FileCode
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                          <span>Diff</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="border-t border-line-subtle bg-surface-card-subdued px-6 py-3 flex items-center justify-between text-xs text-txt-muted">
        <span>
          Showing {filteredLogs.length} audit records. Guaranteed immutable by
          SHA-256 chain.
        </span>
        <span className="font-mono text-[11px]">
          Audit Engine: Section 10(1) Active
        </span>
      </CardFooter>

      {/* Inspect Diff Dialog */}
      <Dialog
        open={Boolean(selectedLogForDiff)}
        onOpenChange={(open) => !open && setSelectedLogForDiff(null)}
      >
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-txt-primary flex items-center gap-2">
              <Lock className="h-4 w-4 text-brand-primary" aria-hidden="true" />
              <span>Audit Mutation Diff &bull; {selectedLogForDiff?.id}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-txt-secondary">
              Immutable cryptographic event payload recorded at{" "}
              {selectedLogForDiff?.timestamp}.
            </DialogDescription>
          </DialogHeader>

          {selectedLogForDiff && (
            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-2 text-txt-secondary bg-surface-card-subdued p-3 rounded border border-line-subtle">
                <div>
                  <span className="text-[10px] font-bold uppercase text-txt-muted block">
                    Actor
                  </span>
                  <span className="font-semibold text-txt-primary">
                    {selectedLogForDiff.actorEmail}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-txt-muted block">
                    Correlation ID
                  </span>
                  <span className="font-mono text-txt-primary">
                    {selectedLogForDiff.correlationId}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-txt-muted block">
                    IP Address
                  </span>
                  <span className="font-mono text-txt-primary">
                    {selectedLogForDiff.ipAddress}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-txt-muted block">
                    Tenant
                  </span>
                  <span>
                    {selectedLogForDiff.tenantName} (
                    {selectedLogForDiff.tenantCode})
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-surface-card-subdued border border-line-subtle space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-txt-muted block">
                  SHA-256 Checksum Digest
                </span>
                <p className="font-mono text-[11px] text-txt-primary break-all select-all">
                  {selectedLogForDiff.sha256Digest}
                </p>
              </div>

              {selectedLogForDiff.details.diff && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-txt-primary block">
                    Before vs After Mutation State
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-2.5 rounded bg-state-danger-bg/40 border border-state-danger-border">
                      <span className="text-[11px] font-bold text-state-danger-text block mb-1">
                        Before Mutation:
                      </span>
                      <pre className="text-[11px] font-mono text-txt-primary overflow-x-auto">
                        {JSON.stringify(
                          selectedLogForDiff.details.diff.before || {},
                          null,
                          2,
                        )}
                      </pre>
                    </div>

                    <div className="p-2.5 rounded bg-state-success-bg/40 border border-state-success-border">
                      <span className="text-[11px] font-bold text-state-success-text block mb-1">
                        After Mutation:
                      </span>
                      <pre className="text-[11px] font-mono text-txt-primary overflow-x-auto">
                        {JSON.stringify(
                          selectedLogForDiff.details.diff.after || {},
                          null,
                          2,
                        )}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

AuditLogViewer.displayName = "AuditLogViewer";
