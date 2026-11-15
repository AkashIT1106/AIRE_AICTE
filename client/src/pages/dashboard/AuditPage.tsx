import { useState } from "react";
import { ShieldCheck, Lock, Download, Hash } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { MOCK_AUDIT_EVENTS, type MockAuditEvent } from "@/lib/mockData";

export function AuditPage() {
  const [events] = useState<MockAuditEvent[]>(MOCK_AUDIT_EVENTS);
  const [eventTypeFilter, setEventTypeFilter] = useState("ALL");

  const filteredEvents = events.filter((e) => {
    if (eventTypeFilter !== "ALL" && e.eventType !== eventTypeFilter) return false;
    return true;
  });

  const columns: Column<MockAuditEvent>[] = [
    {
      header: "Timestamp & Event",
      accessor: "timestamp",
      cell: (row) => (
        <div>
          <span className="font-mono text-xs text-neutral-600 block">{row.timestamp}</span>
          <span className="font-mono font-bold text-xs text-brand-primary">{row.eventType}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Actor & Authority Role",
      accessor: "actor",
      cell: (row) => (
        <div>
          <p className="font-semibold text-neutral-800 text-xs font-mono">{row.actor}</p>
          <span className="text-[10px] text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded font-medium">
            {row.actorRole}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Audit Summary Description",
      accessor: "summary",
      cell: (row) => (
        <div>
          <p className="text-xs text-neutral-800 font-medium">{row.summary}</p>
          <p className="text-[10px] font-mono text-neutral-600">Correlation ID: {row.correlationId}</p>
        </div>
      ),
    },
    {
      header: "Tamper-Evident Hash",
      accessor: "tamperProofHash",
      cell: (row) => (
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-teal-800 bg-teal-50/70 border border-teal-100 px-2 py-1 rounded">
          <Hash className="h-3 w-3 shrink-0" />
          <span title={row.tamperProofHash}>{row.tamperProofHash.slice(0, 20)}…</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Immutable Audit Trail & Governance (M15)"
        description="Append-only cryptographic security log recording all statutory transactions, policy activations, evidence submissions, and authorized decisions."
        badge={
          <span className="inline-flex items-center gap-1 rounded-full bg-state-success-bg px-2.5 py-1 text-xs font-semibold text-state-success border border-state-success-border">
            <Lock className="h-3 w-3" /> Append-Only WORM Enforced
          </span>
        }
        actions={
          <button
            onClick={() => alert("Cryptographically signed audit export generated.")}
            className="flex items-center gap-1.5 rounded-control border border-neutral-200 bg-neutral-0 px-3.5 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 shadow-sm"
          >
            <Download className="h-3.5 w-3.5" /> Export Audit Log
          </button>
        }
      />

      {/* Filter Ribbon */}
      <div className="flex items-center gap-3 rounded-card border border-neutral-150 bg-neutral-0 p-4 shadow-sm text-xs">
        <span className="font-semibold text-neutral-600 uppercase tracking-wider">
          Filter Event Type:
        </span>
        <select
          aria-label="Filter by Event Type"
          value={eventTypeFilter}
          onChange={(e) => setEventTypeFilter(e.target.value)}
          className="rounded-control border border-neutral-200 bg-neutral-0 px-3 py-1.5 text-xs font-medium outline-none cursor-pointer"
        >
          <option value="ALL">All Statutory Events</option>
          <option value="SUBMISSION_SEALED">SUBMISSION_SEALED</option>
          <option value="POLICY_ACTIVATED">POLICY_ACTIVATED</option>
          <option value="EXCEPTION_NOTICED">EXCEPTION_NOTICED</option>
          <option value="SHOW_CAUSE_ISSUED">SHOW_CAUSE_ISSUED</option>
          <option value="AEP_CREDENTIAL_ISSUED">AEP_CREDENTIAL_ISSUED</option>
        </select>
        <span className="text-neutral-600 ml-auto font-mono">
          {filteredEvents.length} Verified Ledger Events
        </span>
      </div>

      {/* Main Audit Table */}
      <div className="rounded-card border border-neutral-150 bg-neutral-0 p-5 shadow-sm">
        <DataTable
          columns={columns}
          data={filteredEvents}
          searchPlaceholder="Search by actor email, event type, or correlation ID…"
          searchFilter={(row, q) =>
            row.actor.toLowerCase().includes(q.toLowerCase()) ||
            row.eventType.toLowerCase().includes(q.toLowerCase()) ||
            row.correlationId.toLowerCase().includes(q.toLowerCase()) ||
            row.summary.toLowerCase().includes(q.toLowerCase())
          }
        />
      </div>

      {/* Integrity Assurance Box */}
      <div className="rounded-card border border-state-info-border bg-state-info-bg p-4 flex items-start gap-3 shadow-sm text-xs text-state-info">
        <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <p className="font-bold">Cryptographic Non-Repudiation Guarantee</p>
          <p>
            Audit entries in AIRE are write-once, read-many (WORM). Each entry is chained with SHA-256 digests
            referencing the previous ledger transaction. No platform administrator, superuser, or developer is capable
            of modifying, redacting, or retroactively re-sequencing audit history.
          </p>
        </div>
      </div>
    </div>
  );
}
