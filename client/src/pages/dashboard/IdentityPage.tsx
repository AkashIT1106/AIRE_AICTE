import { useState } from "react";
import { ShieldAlert, CheckCircle, Search, RefreshCw, KeyRound, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { MOCK_ADMISSION_RECORDS, type MockAdmissionRecord } from "@/lib/mockData";

export function IdentityPage() {
  const [admissions] = useState<MockAdmissionRecord[]>(MOCK_ADMISSION_RECORDS);
  const [searchApaar, setSearchApaar] = useState("");
  const [verifyResult, setVerifyResult] = useState<string | null>(null);

  const handleSimulatedVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchApaar.trim()) return;
    setVerifyResult(`Querying sandbox APAAR gateway for reference [${searchApaar}]... Match confirmed with zero-knowledge token hash [tok_zk_${Math.random().toString(36).substring(7)}].`);
  };

  const columns: Column<MockAdmissionRecord>[] = [
    {
      header: "Masked APAAR Identifier",
      accessor: "maskedApaarId",
      cell: (row) => <span className="font-mono font-bold text-xs text-neutral-800">{row.maskedApaarId}</span>,
      sortable: true,
    },
    {
      header: "Pseudonymous Token",
      accessor: "studentToken",
      cell: (row) => <span className="font-mono text-xs text-brand-primary">{row.studentToken}</span>,
      sortable: true,
    },
    {
      header: "Candidate & Institution",
      accessor: "maskedName",
      cell: (row) => (
        <div>
          <p className="font-semibold text-neutral-800 text-xs">{row.maskedName}</p>
          <span className="text-[11px] text-neutral-600">{row.institutionName}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Verification Gateway Status",
      accessor: "apaarStatus",
      cell: (row) => (
        <StatusBadge
          variant={
            row.apaarStatus === "MATCH_CONFIRMED" || row.apaarStatus === "VERIFIED"
              ? "success"
              : row.apaarStatus === "NAME_MISMATCH"
              ? "error"
              : "pending"
          }
          label={row.apaarStatus.replace(/_/g, " ")}
        />
      ),
      sortable: true,
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (row) => (
        <button
          onClick={() => {
            alert(`Re-triggering zero-knowledge APAAR resolution for token: ${row.studentToken}`);
          }}
          className="flex items-center gap-1 text-xs font-semibold text-brand-primary hover:bg-brand-50 px-2 py-1 rounded-control transition-colors"
        >
          <RefreshCw className="h-3 w-3" /> Re-verify
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="APAAR Identity Verification Workbench (M07)"
        description="National 12-digit Automated Permanent Academic Account Registry gateway integration enforcing zero-knowledge token resolution and privacy protection under DPDP Act 2023."
      />

      {/* Statutory Demonstration Notice */}
      <div className="rounded-card border border-state-warning-border bg-state-warning-bg p-4 flex items-start gap-3 shadow-sm">
        <ShieldAlert className="h-5 w-5 text-state-warning shrink-0 mt-0.5" />
        <div className="text-xs text-state-warning leading-relaxed space-y-1">
          <p className="font-bold">Demonstration Environment Notice — Simulated Gateway Active</p>
          <p>
            The APAAR gateway adapter is currently configured in <strong>Sandbox / Mock Verification Mode</strong>.
            In strict compliance with UIDAI regulations and India's Digital Personal Data Protection (DPDP) Act 2023,
            no raw 12-digit Aadhaar credentials or live biometric pipelines are connected in this development environment.
            All student identity references are cryptographically pseudonymized into zero-knowledge operational tokens.
          </p>
        </div>
      </div>

      {/* Quick Lookup & Verification Simulator */}
      <div className="rounded-card border border-neutral-150 bg-neutral-0 p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-800">Direct APAAR Identity Resolution Probe</h3>
          <p className="text-xs text-neutral-600">
            Query the zero-knowledge adapter using a masked APAAR identifier or student registration reference
          </p>
        </div>

        <form onSubmit={handleSimulatedVerify} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600" />
            <input
              type="text"
              value={searchApaar}
              onChange={(e) => setSearchApaar(e.target.value)}
              placeholder="Enter Masked APAAR (e.g. XXXX-XXXX-4819) or Student Token…"
              className="w-full rounded-control border border-neutral-200 pl-9 pr-3 py-2 text-xs text-neutral-800 outline-none focus:border-brand-primary"
            />
          </div>
          <button
            type="submit"
            className="rounded-control bg-brand-primary px-4 py-2 text-xs font-semibold text-white hover:bg-brand-900 transition-colors shadow-sm"
          >
            Probe Gateway
          </button>
        </form>

        {verifyResult && (
          <div className="rounded-control bg-neutral-50 border border-neutral-200 p-3 text-xs font-mono text-neutral-800 flex items-center justify-between">
            <span>{verifyResult}</span>
            <button
              onClick={() => setVerifyResult(null)}
              className="text-neutral-600 hover:text-neutral-800 font-sans font-semibold text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Main Verification Queue */}
      <div className="rounded-card border border-neutral-150 bg-neutral-0 p-5 shadow-sm">
        <DataTable
          columns={columns}
          data={admissions}
          searchPlaceholder="Search verification queue by APAAR ID or candidate token…"
          searchFilter={(row, q) =>
            row.maskedApaarId.toLowerCase().includes(q.toLowerCase()) ||
            row.studentToken.toLowerCase().includes(q.toLowerCase()) ||
            row.maskedName.toLowerCase().includes(q.toLowerCase())
          }
        />
      </div>

      {/* Privacy Architecture Dossier */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-card border border-neutral-150 bg-neutral-0 p-4 space-y-2 shadow-sm">
          <KeyRound className="h-5 w-5 text-brand-primary" />
          <h4 className="text-xs font-bold text-neutral-800">Identity Vault Isolation</h4>
          <p className="text-[11px] text-neutral-600 leading-relaxed">
            Raw student identity records reside in an isolated, encrypted database enclave protected with envelope
            encryption keys (AES-256-GCM).
          </p>
        </div>

        <div className="rounded-card border border-neutral-150 bg-neutral-0 p-4 space-y-2 shadow-sm">
          <ShieldCheck className="h-5 w-5 text-teal-800" />
          <h4 className="text-xs font-bold text-neutral-800">Zero-Knowledge Operational Tokens</h4>
          <p className="text-[11px] text-neutral-600 leading-relaxed">
            Operational reconciliation tables and public dashboard queries only reference pseudonymous tokens
            (<code>tok_...</code>), preventing data breaches.
          </p>
        </div>

        <div className="rounded-card border border-neutral-150 bg-neutral-0 p-4 space-y-2 shadow-sm">
          <CheckCircle className="h-5 w-5 text-state-success" />
          <h4 className="text-xs font-bold text-neutral-800">Purpose Limitation &amp; Consent</h4>
          <p className="text-[11px] text-neutral-600 leading-relaxed">
            Identity verification is strictly purpose-bound to statutory admission seat entitlement validation, fulfilling
            Section 6 of the DPDP Act 2023.
          </p>
        </div>
      </div>
    </div>
  );
}
