import { useState } from "react";
import { ShieldCheck, Eye, History } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { MOCK_POLICY_PACKS, type MockPolicyPack } from "@/lib/mockData";

export function PoliciesPage() {
  const [policies] = useState<MockPolicyPack[]>(MOCK_POLICY_PACKS);
  const [selectedPolicy, setSelectedPolicy] = useState<MockPolicyPack | null>(null);
  const [showReplayModal, setShowReplayModal] = useState(false);

  const columns: Column<MockPolicyPack>[] = [
    {
      header: "Policy Identifier",
      accessor: "identifier",
      cell: (row) => (
        <div>
          <span className="font-mono font-bold text-xs text-brand-primary">{row.identifier}</span>
          <p className="text-[11px] text-neutral-600 font-mono">v{row.version}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Regulatory Handbook Title",
      accessor: "name",
      cell: (row) => (
        <div>
          <p className="font-semibold text-neutral-800 text-sm">{row.name}</p>
          <p className="text-xs text-neutral-600">Academic Year: {row.academicYear}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Effective Date",
      accessor: "effectiveFrom",
      cell: (row) => <span className="font-mono text-xs">{row.effectiveFrom}</span>,
      sortable: true,
    },
    {
      header: "Deterministic Rules",
      accessor: "ruleCount",
      cell: (row) => (
        <span className="inline-flex items-center gap-1 font-mono font-semibold text-xs text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded">
          {row.ruleCount} Rules
        </span>
      ),
      sortable: true,
    },
    {
      header: "Integrity Digest",
      accessor: "digest",
      cell: (row) => (
        <span className="font-mono text-[11px] text-neutral-600 bg-neutral-50 px-1.5 py-0.5 rounded border border-neutral-150" title={row.digest}>
          {row.digest.slice(0, 18)}…
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <StatusBadge
          variant={row.status === "ACTIVE" ? "success" : "pending"}
          label={row.status}
        />
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedPolicy(row)}
            className="flex items-center gap-1 text-xs font-semibold text-brand-primary hover:bg-brand-50 px-2 py-1 rounded-control transition-colors"
          >
            <Eye className="h-3.5 w-3.5" /> Spec
          </button>
          <button
            onClick={() => setShowReplayModal(true)}
            className="flex items-center gap-1 text-xs font-semibold text-teal-800 hover:bg-teal-50 px-2 py-1 rounded-control transition-colors"
          >
            <History className="h-3.5 w-3.5" /> Replay
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Regulatory Policy Registry (M04)"
        description="Versioned regulatory rules derived from the AICTE Approval Process Handbook (APH), enabling deterministic rule execution and historical policy replay."
        actions={
          <button
            onClick={() => setShowReplayModal(true)}
            className="flex items-center gap-1.5 rounded-control bg-brand-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-900 shadow-sm"
          >
            <History className="h-3.5 w-3.5" /> Run Regulatory Replay
          </button>
        }
      />

      {/* Policy Table */}
      <div className="rounded-card border border-neutral-150 bg-neutral-0 p-5 shadow-sm">
        <DataTable
          columns={columns}
          data={policies}
          searchPlaceholder="Search policies by name, identifier, or session…"
          searchFilter={(row, q) =>
            row.name.toLowerCase().includes(q.toLowerCase()) ||
            row.identifier.toLowerCase().includes(q.toLowerCase()) ||
            row.academicYear.toLowerCase().includes(q.toLowerCase())
          }
        />
      </div>

      {/* Regulatory Replay Explanation Banner */}
      <div className="rounded-card border border-neutral-150 bg-neutral-0 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-brand-primary" />
          <h3 className="text-base font-bold text-neutral-800">What is Deterministic Regulatory Replay?</h3>
        </div>
        <p className="text-xs text-neutral-600 leading-relaxed max-w-3xl">
          Unlike probabilistic decision systems, AIRE ensures that admission entitlement rules are version-locked.
          When AICTE revises guidelines mid-cycle (such as changes to EWS reservation fractions or lateral entry thresholds),
          regulators can run the <strong>Regulatory Replay Engine</strong> to simulate the legal impact on existing cohorts without
          altering historical evidence or overwriting signed determinations.
        </p>
      </div>

      {/* Policy Spec Modal */}
      {selectedPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-card border border-neutral-150 bg-neutral-0 shadow-2xl overflow-hidden font-sans">
            <div className="border-b border-neutral-150 bg-brand-deep px-6 py-4 text-white">
              <h3 className="text-base font-bold">{selectedPolicy.name}</h3>
              <p className="text-xs font-mono text-brand-100">{selectedPolicy.identifier} • Version {selectedPolicy.version}</p>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="rounded-control bg-neutral-50 p-3 border border-neutral-150">
                <p className="font-semibold text-neutral-800 mb-1">Cryptographic Digest</p>
                <p className="font-mono text-neutral-600 break-all">{selectedPolicy.digest}</p>
              </div>
              <div>
                <p className="font-semibold text-neutral-800 mb-2">Key Automated Invariants Enforced:</p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-600">
                  <li>Rule 4.1: Intake ceiling violation cap check</li>
                  <li>Rule 4.3: Reservation quota allocation compliance (OBC, SC, ST)</li>
                  <li>Rule 5.2: 10% EWS Supernumerary quota ceiling arithmetic</li>
                  <li>Rule 8.1: Valid 12-digit APAAR identity verification requirement</li>
                  <li>Rule 11.4: Prohibition of duplicate admission across accredited colleges</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-neutral-150 bg-neutral-50 px-6 py-3 flex justify-end">
              <button
                onClick={() => setSelectedPolicy(null)}
                className="rounded-control bg-neutral-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-neutral-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Regulatory Replay Trigger Modal */}
      {showReplayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-card border border-neutral-150 bg-neutral-0 shadow-2xl p-6 space-y-4 font-sans">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-brand-primary" />
              <h3 className="text-base font-bold text-neutral-800">Execute Policy Replay Engine</h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Select target cohort and historical policy version to evaluate admission entitlement determinism without mutating historical records.
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-neutral-800 block mb-1">Target Cohort Session</label>
                <select className="w-full rounded-control border border-neutral-200 p-2 bg-neutral-0 outline-none">
                  <option>AY 2026-2027 (Active Admissions)</option>
                  <option>AY 2025-2026 (Audited Cohort)</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-neutral-800 block mb-1">Policy Rule Pack</label>
                <select className="w-full rounded-control border border-neutral-200 p-2 bg-neutral-0 outline-none">
                  <option>APH-2026-27-REV1 (v1.2.0 - Active)</option>
                  <option>APH-2025-26-FINAL (v2.1.0 - Baseline)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setShowReplayModal(false)}
                className="px-3 py-1.5 rounded-control text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Regulatory Replay job submitted to background BullMQ queue. Results will stream to Audit Trail.");
                  setShowReplayModal(false);
                }}
                className="px-3 py-1.5 rounded-control text-xs font-semibold text-white bg-brand-primary hover:bg-brand-900"
              >
                Launch Replay Simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
