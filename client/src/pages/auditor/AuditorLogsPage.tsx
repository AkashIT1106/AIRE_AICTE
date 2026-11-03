import React, { useState } from "react";
import {
  ShieldCheck,
  FileText,
  Lock,
  Clock,
  Search,
  Download,
  Copy,
  Check,
  ChevronRight,
  KeyRound,
  X,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AuditLogEntry {
  id: string;
  correlationId: string;
  timestamp: string;
  action:
    | "INGEST_BATCH"
    | "REMEDIATE_RECORD"
    | "AUTH_LOGIN"
    | "SEAL_COHORT"
    | "ACCESS_DENIED";
  actionLabel: string;
  actorEmail: string;
  actorRole:
    "INSTITUTION_ADMIN" | "AICTE_VERIFIER" | "AUDITOR" | "UNAUTHENTICATED";
  tenantCode: string;
  tenantName: string;
  ipAddress: string;
  status: "SUCCESS" | "WARNING" | "DENIED";
  sha256Digest: string;
  details: {
    resource: string;
    payloadSummary: string;
    merkleProof?: string;
  };
}

const SAMPLE_LOGS: AuditLogEntry[] = [
  {
    id: "LOG-98214",
    correlationId: "corr_01HNY4P78A89BC1",
    timestamp: "2026-11-03 11:15:22 IST",
    action: "INGEST_BATCH",
    actionLabel: "Ingest Admission Batch",
    actorEmail: "admin@dit.ac.in",
    actorRole: "INSTITUTION_ADMIN",
    tenantCode: "INST-101",
    tenantName: "Delhi Institute of Technology",
    ipAddress: "14.139.45.12",
    status: "SUCCESS",
    sha256Digest:
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    details: {
      resource: "/api/v1/admissions/upload",
      payloadSummary:
        "Batch BATCH-2026-CSE-001 (60 records) uploaded with schema validation pass.",
      merkleProof: "0x4a7d...9c2e",
    },
  },
  {
    id: "LOG-98213",
    correlationId: "corr_01HNY3E12D45EF2",
    timestamp: "2026-11-03 11:08:44 IST",
    action: "REMEDIATE_RECORD",
    actionLabel: "Remediate Quarantined Record",
    actorEmail: "admin@dit.ac.in",
    actorRole: "INSTITUTION_ADMIN",
    tenantCode: "INST-101",
    tenantName: "Delhi Institute of Technology",
    ipAddress: "14.139.45.12",
    status: "SUCCESS",
    sha256Digest:
      "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
    details: {
      resource: "/api/v1/quarantine/remediate",
      payloadSummary:
        "Student Ananya Iyer (JEE: 260100452) category normalized from typo 'OBC-NCL-TYPO' to 'OBC-NCL'.",
      merkleProof: "0x1b8f...3d9a",
    },
  },
  {
    id: "LOG-98212",
    correlationId: "corr_01HNY2K90F67GH3",
    timestamp: "2026-11-03 10:45:10 IST",
    action: "AUTH_LOGIN",
    actionLabel: "MFA Authentication & Session Issue",
    actorEmail: "scrutiny@aicte.gov.in",
    actorRole: "AICTE_VERIFIER",
    tenantCode: "AICTE-HQ",
    tenantName: "AICTE Regulatory Directorate",
    ipAddress: "164.100.24.60",
    status: "SUCCESS",
    sha256Digest:
      "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
    details: {
      resource: "/api/v1/auth/login",
      payloadSummary:
        "Issued scoped JWT session (claims: verified regulatory officer, mandate: Section 10.1 oversight).",
    },
  },
  {
    id: "LOG-98211",
    correlationId: "corr_01HNY1X88J12KL4",
    timestamp: "2026-11-03 10:12:05 IST",
    action: "ACCESS_DENIED",
    actionLabel: "Cross-Tenant Access Intercepted",
    actorEmail: "operator@external-audit.org",
    actorRole: "UNAUTHENTICATED",
    tenantCode: "UNASSIGNED",
    tenantName: "Attempted Cross-Tenant Traversal",
    ipAddress: "103.21.124.99",
    status: "DENIED",
    sha256Digest:
      "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    details: {
      resource: "/api/v1/institution/INST-101/admissions",
      payloadSummary:
        "Blocked by forced Postgres RLS & TenantContextGuard: Missing institution membership claim.",
    },
  },
  {
    id: "LOG-98210",
    correlationId: "corr_01HNXZ454M34OP5",
    timestamp: "2026-11-03 09:30:19 IST",
    action: "SEAL_COHORT",
    actionLabel: "Generate Cryptographic Entitlement Proof",
    actorEmail: "admin@dit.ac.in",
    actorRole: "INSTITUTION_ADMIN",
    tenantCode: "INST-101",
    tenantName: "Delhi Institute of Technology",
    ipAddress: "14.139.45.12",
    status: "SUCCESS",
    sha256Digest:
      "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    details: {
      resource: "/api/v1/entitlements/seal",
      payloadSummary:
        "Sealed 2026 B.Tech cohort admission intake certificate with AICTE SHA-256 digital stamp.",
      merkleProof: "0x8e12...b45f",
    },
  },
];

export const AuditorLogsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState<string>("ALL");
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLogs = SAMPLE_LOGS.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.correlationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.payloadSummary
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesAction = filterAction === "ALL" || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border-default)]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[var(--brand-teal)] uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            <span>Regulatory Auditor Workbench &bull; Read-Only</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            Immutable Audit Trail Explorer
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            Tamper-evident verification of regulatory events, authentication
            lifecycles, and tenant isolation logs.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-9"
            onClick={() => {
              const dataStr =
                "data:text/json;charset=utf-8," +
                encodeURIComponent(JSON.stringify(SAMPLE_LOGS, null, 2));
              const downloadAnchor = document.createElement("a");
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute(
                "download",
                `aire-audit-ledger-${Date.now()}.json`,
              );
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export Ledger (JSON)
          </Button>
        </div>
      </div>

      {/* Statutory Banner */}
      <Alert variant="info" className="border-l-4 border-l-[var(--brand-teal)]">
        <Lock className="h-4 w-4 text-[var(--brand-teal)]" />
        <AlertTitle className="font-semibold text-sm">
          Append-Only Audit Standard (Section 19 / SoD Rule 3)
        </AlertTitle>
        <AlertDescription className="text-xs text-[var(--text-secondary)] mt-1">
          System administrators and operators cannot alter, truncate, or delete
          audit events. Auditors hold read-only access to cryptographic
          provenance and reconciliation history.
        </AlertDescription>
      </Alert>

      {/* Cryptographic Assurance & Architecture Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-[var(--surface-card)] border-[var(--border-default)] shadow-xs">
          <div className="text-xs font-medium text-[var(--text-muted)] flex items-center justify-between">
            <span>Audit Architecture</span>
            <FileText className="h-4 w-4 text-[var(--brand-primary)]" />
          </div>
          <div className="text-base font-bold text-[var(--text-primary)] mt-2">
            Append-Only Ledger
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Table:{" "}
            <code className="font-mono text-[11px] bg-[var(--surface-card-subdued)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">
              audit_events
            </code>
          </p>
        </Card>

        <Card className="p-4 bg-[var(--surface-card)] border-[var(--border-default)] shadow-xs">
          <div className="text-xs font-medium text-[var(--text-muted)] flex items-center justify-between">
            <span>Isolation Enforcement</span>
            <Lock className="h-4 w-4 text-[var(--state-success-icon)]" />
          </div>
          <div className="text-base font-bold text-[var(--state-success-text)] mt-2">
            Forced RLS Verified
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Tenant boundaries active & enforced
          </p>
        </Card>

        <Card className="p-4 bg-[var(--surface-card)] border-[var(--border-default)] shadow-xs">
          <div className="text-xs font-medium text-[var(--text-muted)] flex items-center justify-between">
            <span>Audit Clock</span>
            <Clock className="h-4 w-4 text-[var(--brand-teal)]" />
          </div>
          <div className="text-base font-bold font-mono tabular-nums text-[var(--text-primary)] mt-2">
            UTC+05:30 (IST)
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Synchronized Server Time (NTP)
          </p>
        </Card>

        <Card className="p-4 bg-[var(--surface-card)] border-[var(--border-default)] shadow-xs">
          <div className="text-xs font-medium text-[var(--text-muted)] flex items-center justify-between">
            <span>Cryptographic Anchor</span>
            <KeyRound className="h-4 w-4 text-[var(--brand-primary)]" />
          </div>
          <div className="text-xs font-mono font-bold text-[var(--text-primary)] mt-2 truncate">
            Root: 0x9f82...7a1b
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Merkle Height: #1,048,576
          </p>
        </Card>
      </div>

      {/* Explorer Controls */}
      <Card className="border-[var(--border-default)]">
        <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--surface-card-subdued)]/50">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
              <Input
                placeholder="Search correlation ID, actor, or event payload..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs bg-[var(--surface-card)]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-muted)] hidden md:inline">
                Event Filter:
              </span>
              <div className="flex flex-wrap gap-1">
                {(
                  [
                    "ALL",
                    "INGEST_BATCH",
                    "REMEDIATE_RECORD",
                    "AUTH_LOGIN",
                    "ACCESS_DENIED",
                  ] as const
                ).map((action) => (
                  <button
                    key={action}
                    onClick={() => setFilterAction(action)}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                      filterAction === action
                        ? "bg-[var(--brand-primary)] text-white shadow-xs"
                        : "bg-[var(--surface-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--surface-card-subdued)]"
                    }`}
                  >
                    {action === "ALL" ? "All" : action.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="ux4g-o-x-auto overflow-x-auto">
          <table className="ux4g-table w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-default)] bg-[var(--surface-card-subdued)] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Timestamp (IST)</th>
                <th className="py-3 px-4">Event Action</th>
                <th className="py-3 px-4">Actor / Role</th>
                <th className="py-3 px-4">Tenant Scope</th>
                <th className="py-3 px-4">Correlation ID</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-[var(--surface-card-subdued)]/60 transition-colors cursor-pointer group"
                  onClick={() => setSelectedLog(log)}
                >
                  <td className="py-3 px-4 font-mono text-[11px] text-[var(--text-secondary)] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-[var(--text-primary)]">
                      {log.actionLabel}
                    </div>
                    <div className="font-mono text-[10px] text-[var(--text-muted)] mt-0.5">
                      {log.details.resource}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-[var(--text-primary)] font-medium">
                      {log.actorEmail}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      {log.actorRole.replace("_", " ")}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-[var(--text-primary)]">
                      {log.tenantName}
                    </div>
                    <code className="text-[10px] font-mono text-[var(--text-muted)]">
                      {log.tenantCode}
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1.5">
                      <code className="font-mono text-[11px] text-[var(--brand-primary)] bg-[var(--surface-card-subdued)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">
                        {log.correlationId}
                      </code>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(log.correlationId, log.id);
                        }}
                        className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded"
                        title="Copy Correlation ID"
                      >
                        {copiedId === log.id ? (
                          <Check className="h-3 w-3 text-[var(--state-success-text)]" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {log.status === "SUCCESS" && (
                      <Badge variant="success" size="sm">
                        Committed
                      </Badge>
                    )}
                    {log.status === "DENIED" && (
                      <Badge variant="danger" size="sm">
                        Blocked
                      </Badge>
                    )}
                    {log.status === "WARNING" && (
                      <Badge variant="warning" size="sm">
                        Flagged
                      </Badge>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-[var(--brand-primary)] group-hover:bg-[var(--surface-card)]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLog(log);
                      }}
                    >
                      Inspect <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Audit Trail Integrity Standard Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Audit Trail Integrity Standard</CardTitle>
          <CardDescription>
            All critical operations record actor ID, tenant context, correlation
            ID, and status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded border border-[var(--border-default)] bg-[var(--surface-card-subdued)] p-4 text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
              <span className="font-semibold text-[var(--text-primary)]">
                Compliance Level:
              </span>
              <Badge variant="success" size="sm">
                Purpose-Bound Trail
              </Badge>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Every admission upload, schema validation failure, quarantine
              triage decision, and access denial is committed with an immutable
              correlation ID and tamper-evident metadata.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modal / Slide-over for Event Details */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[var(--surface-card)] rounded-lg border border-[var(--border-default)] shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)] bg-[var(--surface-card-subdued)]">
              <div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      selectedLog.status === "DENIED" ? "danger" : "success"
                    }
                    size="sm"
                  >
                    {selectedLog.status}
                  </Badge>
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    {selectedLog.id}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] mt-1">
                  {selectedLog.actionLabel}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Timestamp (IST)
                  </label>
                  <p className="font-mono text-xs text-[var(--text-primary)] mt-0.5">
                    {selectedLog.timestamp}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Origin IP Address
                  </label>
                  <p className="font-mono text-xs text-[var(--text-primary)] mt-0.5">
                    {selectedLog.ipAddress}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Actor Identity
                  </label>
                  <p className="font-medium text-xs text-[var(--text-primary)] mt-0.5">
                    {selectedLog.actorEmail} ({selectedLog.actorRole})
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Institutional Tenant Scope
                  </label>
                  <p className="font-medium text-xs text-[var(--text-primary)] mt-0.5">
                    {selectedLog.tenantName} ({selectedLog.tenantCode})
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <label className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Correlation ID
                </label>
                <div className="flex items-center justify-between mt-1 p-2 bg-[var(--surface-card-subdued)] rounded border border-[var(--border-subtle)] font-mono text-[11px]">
                  <span>{selectedLog.correlationId}</span>
                  <button
                    onClick={() =>
                      handleCopy(selectedLog.correlationId, "modal-corr")
                    }
                    className="flex items-center text-[var(--brand-primary)] hover:underline"
                  >
                    {copiedId === "modal-corr" ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Payload & Verification Trace
                </label>
                <div className="mt-1 p-3 bg-[var(--surface-card-subdued)] rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] leading-relaxed">
                  {selectedLog.details.payloadSummary}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Tamper-Evident SHA-256 Digest
                </label>
                <div className="mt-1 p-2.5 bg-neutral-900 text-neutral-100 rounded font-mono text-[11px] break-all border border-neutral-800">
                  {selectedLog.sha256Digest}
                </div>
              </div>

              {selectedLog.details.merkleProof && (
                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Merkle Tree Leaf Proof
                  </label>
                  <div className="mt-1 font-mono text-[11px] text-[var(--brand-teal)]">
                    {selectedLog.details.merkleProof} (Verified against Anchor
                    Block #1,048,576)
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end px-6 py-3 border-t border-[var(--border-default)] bg-[var(--surface-card-subdued)]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLog(null)}
              >
                Close Inspector
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
