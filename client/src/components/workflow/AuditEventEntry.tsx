import React, { useState } from "react";
import {
  Lock,
  Clock,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  User,
  Hash,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AuditLogItem } from "./mockData";

export interface AuditEventEntryProps {
  event: AuditLogItem;
  onViewProof?: (id: string) => void;
  className?: string;
}

export const AuditEventEntry: React.FC<AuditEventEntryProps> = ({
  event,
  onViewProof,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCorrelationId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(event.correlationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSuccess = event.status === "SUCCESS";
  const isDenied = event.status === "DENIED";

  return (
    <div
      className={cn(
        "rounded-lg border border-line-subtle bg-surface-card p-4 transition-all shadow-2xs hover:shadow-xs space-y-3",
        isDenied && "border-state-danger-border/70 bg-state-danger-bg/20",
        className,
      )}
      data-testid={`audit-event-${event.id}`}
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge
            variant={isSuccess ? "success" : isDenied ? "danger" : "warning"}
            className="font-mono text-[10px] font-bold"
          >
            {event.action}
          </Badge>

          <span className="font-bold text-txt-primary">
            {event.actionLabel}
          </span>

          <span className="text-txt-muted">&bull;</span>

          <span className="text-txt-secondary flex items-center gap-1">
            <User className="h-3 w-3 text-txt-muted" aria-hidden="true" />
            <span>{event.actorEmail}</span>
          </span>

          <Badge variant="outline" className="text-[10px] font-medium">
            {event.actorRole}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-xs text-txt-muted font-tabular">
          <Clock className="h-3 w-3" aria-hidden="true" />
          <time>{event.timestamp}</time>
        </div>
      </div>

      {/* Metadata Row: Tenant, IP, Correlation ID */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-line-subtle/50">
        <div className="flex flex-wrap items-center gap-3 text-txt-secondary">
          <span>
            Tenant:{" "}
            <strong className="text-txt-primary">{event.tenantCode}</strong> (
            {event.tenantName})
          </span>
          <span>&bull;</span>
          <span>
            IP: <span className="font-mono">{event.ipAddress}</span>
          </span>
        </div>

        {/* Correlation ID Pill */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopyCorrelationId}
            className="inline-flex items-center gap-1 rounded bg-surface-card-subdued px-2 py-0.5 text-[11px] font-mono text-txt-secondary border border-line-subtle hover:bg-surface-card transition-colors"
            title="Click to copy correlation ID"
            aria-label={`Copy correlation ID ${event.correlationId}`}
          >
            <Hash className="h-3 w-3 text-brand-primary" aria-hidden="true" />
            <span>{event.correlationId}</span>
            {copied ? (
              <Check
                className="h-3 w-3 text-state-success-icon"
                aria-hidden="true"
              />
            ) : (
              <Copy className="h-3 w-3 text-txt-muted" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Payload Summary Description */}
      <p className="text-xs text-txt-primary leading-relaxed bg-surface-card-subdued/50 p-2.5 rounded border border-line-subtle">
        {event.details.payloadSummary}
      </p>

      {/* Bottom Row: Cryptographic Digest & Expand Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-txt-muted truncate">
          <Lock
            className="h-3.5 w-3.5 text-brand-teal shrink-0"
            aria-hidden="true"
          />
          <span className="truncate max-w-sm select-all">
            SHA-256: {event.sha256Digest}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {event.details.merkleProof && onViewProof && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onViewProof(event.id)}
              className="text-xs h-7 border-line-default gap-1"
            >
              <ExternalLink
                className="h-3 w-3 text-brand-primary"
                aria-hidden="true"
              />
              <span>Merkle Proof</span>
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs h-7 text-txt-muted hover:text-txt-primary gap-1"
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? "Hide Diff" : "Inspect Diff"}</span>
            {isExpanded ? (
              <ChevronUp className="h-3 w-3" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-3 w-3" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {/* Expandable JSON Diff / Mutation Details */}
      {isExpanded && (
        <div className="mt-2 pt-3 border-t border-line-subtle space-y-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-surface-card-subdued rounded p-2.5 border border-line-subtle">
              <span className="text-[10px] font-mono font-bold uppercase text-txt-muted block mb-1">
                Resource Endpoint
              </span>
              <code className="text-[11px] font-mono text-txt-primary">
                {event.details.resource}
              </code>
            </div>

            {event.details.merkleProof && (
              <div className="bg-surface-card-subdued rounded p-2.5 border border-line-subtle">
                <span className="text-[10px] font-mono font-bold uppercase text-txt-muted block mb-1">
                  Merkle Root Proof
                </span>
                <code className="text-[11px] font-mono text-brand-primary truncate block select-all">
                  {event.details.merkleProof}
                </code>
              </div>
            )}
          </div>

          {event.details.diff && (
            <div className="bg-surface-card-subdued rounded p-3 border border-line-subtle space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-txt-muted block">
                Immutable State Mutation Diff
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2 rounded bg-state-danger-bg/50 border border-state-danger-border text-[11px] font-mono">
                  <span className="font-bold text-state-danger-text block mb-1">
                    Before:
                  </span>
                  <pre className="overflow-x-auto text-txt-primary">
                    {JSON.stringify(event.details.diff.before || {}, null, 2)}
                  </pre>
                </div>
                <div className="p-2 rounded bg-state-success-bg/50 border border-state-success-border text-[11px] font-mono">
                  <span className="font-bold text-state-success-text block mb-1">
                    After:
                  </span>
                  <pre className="overflow-x-auto text-txt-primary">
                    {JSON.stringify(event.details.diff.after || {}, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

AuditEventEntry.displayName = "AuditEventEntry";
