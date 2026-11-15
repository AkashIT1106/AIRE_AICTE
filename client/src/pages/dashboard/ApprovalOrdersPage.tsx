import { useState } from "react";
import { Download, Eye, X, Calculator, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { MOCK_APPROVAL_ORDERS, type MockApprovalOrder } from "@/lib/mockData";

export function ApprovalOrdersPage() {
  const [orders] = useState<MockApprovalOrder[]>(MOCK_APPROVAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<MockApprovalOrder | null>(null);
  const [academicYearFilter, setAcademicYearFilter] = useState("ALL");

  const filteredOrders = orders.filter((order) => {
    if (academicYearFilter !== "ALL" && order.academicYear !== academicYearFilter) return false;
    return true;
  });

  const columns: Column<MockApprovalOrder>[] = [
    {
      header: "EOA Reference Number",
      accessor: "orderNumber",
      cell: (row) => (
        <div>
          <span className="font-mono font-bold text-xs text-brand-primary">{row.orderNumber}</span>
          <p className="text-[11px] text-neutral-600">Issued: {row.issuedDate}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Institution Name & Code",
      accessor: "institutionName",
      cell: (row) => (
        <div>
          <p className="font-semibold text-neutral-800 text-sm">{row.institutionName}</p>
          <p className="text-xs text-neutral-600 font-mono">ID: {row.institutionCode}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Approved Programme",
      accessor: "programmeName",
      cell: (row) => (
        <div>
          <p className="font-medium text-neutral-800 text-xs">{row.programmeName}</p>
          <span className="text-[11px] text-neutral-600">{row.degreeLevel}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Sanctioned Intake",
      accessor: "approvedIntake",
      cell: (row) => (
        <span className="font-mono font-bold text-sm text-neutral-800">
          {row.approvedIntake} <span className="text-[10px] font-normal text-neutral-600">seats</span>
        </span>
      ),
      sortable: true,
    },
    {
      header: "Quota Distribution",
      accessor: "id",
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-[11px] font-mono">
          <span className="rounded bg-neutral-100 px-1.5 py-0.5" title="Open Merit">
            OP: {row.openQuota}
          </span>
          <span className="rounded bg-neutral-100 px-1.5 py-0.5" title="OBC-NCL">
            OBC: {row.obcQuota}
          </span>
          <span className="rounded bg-neutral-100 px-1.5 py-0.5" title="SC">
            SC: {row.scQuota}
          </span>
          <span className="rounded bg-neutral-100 px-1.5 py-0.5" title="ST">
            ST: {row.stQuota}
          </span>
          <span className="rounded bg-teal-50 text-teal-800 font-bold px-1.5 py-0.5" title="EWS Supernumerary">
            EWS: +{row.ewsQuota}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <StatusBadge
          variant={row.status === "ACTIVE" ? "success" : "warning"}
          label={row.status}
        />
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (row) => (
        <button
          onClick={() => setSelectedOrder(row)}
          className="flex items-center gap-1 text-xs font-semibold text-brand-primary hover:bg-brand-50 px-2 py-1 rounded-control transition-colors"
        >
          <Eye className="h-3.5 w-3.5" /> Quota Breakdown
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Approval Orders & Seat Entitlements (M03)"
        description="Official AICTE Letters of Approval (LOA) and Extensions of Approval (EOA) establishing authoritative institutional capacity ceilings."
        actions={
          <button
            onClick={() => alert("Approval Registry report export initiated.")}
            className="flex items-center gap-1.5 rounded-control border border-neutral-200 bg-neutral-0 px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 shadow-sm"
          >
            <Download className="h-3.5 w-3.5" /> Export EOA Register
          </button>
        }
      />

      {/* Filter Ribbon */}
      <div className="flex items-center gap-3 rounded-card border border-neutral-150 bg-neutral-0 p-4 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
          Academic Year:
        </span>
        <select
          aria-label="Filter by Academic Year"
          value={academicYearFilter}
          onChange={(e) => setAcademicYearFilter(e.target.value)}
          className="rounded-control border border-neutral-200 bg-neutral-0 px-3 py-1.5 text-xs text-neutral-800 font-medium outline-none cursor-pointer"
        >
          <option value="ALL">All Academic Sessions</option>
          <option value="2026-2027">AY 2026-2027 (Current)</option>
          <option value="2025-2026">AY 2025-2026</option>
        </select>
        <span className="text-xs text-neutral-600 ml-auto font-mono">
          Showing {filteredOrders.length} EOA records
        </span>
      </div>

      {/* Main Table */}
      <div className="rounded-card border border-neutral-150 bg-neutral-0 p-5 shadow-sm">
        <DataTable
          columns={columns}
          data={filteredOrders}
          searchPlaceholder="Search by EOA reference, institution name, or programme…"
          searchFilter={(row, q) =>
            row.orderNumber.toLowerCase().includes(q.toLowerCase()) ||
            row.institutionName.toLowerCase().includes(q.toLowerCase()) ||
            row.programmeName.toLowerCase().includes(q.toLowerCase()) ||
            row.institutionCode.toLowerCase().includes(q.toLowerCase())
          }
        />
      </div>

      {/* Quota Arithmetic Breakdown Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-card border border-neutral-150 bg-neutral-0 shadow-2xl overflow-hidden font-sans">
            <div className="flex items-center justify-between border-b border-neutral-150 bg-brand-deep px-6 py-4 text-white">
              <div>
                <p className="text-xs font-mono uppercase text-brand-100 opacity-75">
                  Statutory Seat Entitlement Spec
                </p>
                <h3 className="text-base font-bold text-white">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-control p-1 text-brand-100 hover:bg-white/10 transition-colors"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="border-b border-neutral-150 pb-3">
                <p className="text-sm font-bold text-neutral-800">{selectedOrder.institutionName}</p>
                <p className="text-xs text-neutral-600">{selectedOrder.programmeName} • {selectedOrder.degreeLevel}</p>
              </div>

              {/* Arithmetic Grid */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="h-4 w-4 text-brand-primary" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                    Statutory Reservation Quota Arithmetic (APH Rules)
                  </h4>
                </div>

                <div className="divide-y divide-neutral-150 rounded-card border border-neutral-150 text-xs">
                  <div className="flex justify-between p-3 bg-neutral-50 font-bold">
                    <span>Base Approved Intake</span>
                    <span className="font-mono">{selectedOrder.approvedIntake} Seats</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span>Open / General Merit (50% approx)</span>
                    <span className="font-mono font-medium">{selectedOrder.openQuota} Seats</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span>Other Backward Classes - NCL (27%)</span>
                    <span className="font-mono font-medium">{selectedOrder.obcQuota} Seats</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span>Scheduled Castes (15%)</span>
                    <span className="font-mono font-medium">{selectedOrder.scQuota} Seats</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span>Scheduled Tribes (7.5%)</span>
                    <span className="font-mono font-medium">{selectedOrder.stQuota} Seats</span>
                  </div>
                  <div className="flex justify-between p-3 bg-teal-50/50 text-teal-800 font-semibold">
                    <span>Economically Weaker Sections - Supernumerary (10% over and above)</span>
                    <span className="font-mono">+{selectedOrder.ewsQuota} Seats</span>
                  </div>
                  <div className="flex justify-between p-3 bg-teal-50/50 text-teal-800 font-semibold">
                    <span>Tuition Fee Waiver / Supernumerary</span>
                    <span className="font-mono">+{selectedOrder.supernumerary} Seats</span>
                  </div>
                  <div className="flex justify-between p-3 bg-brand-50 text-brand-primary font-bold">
                    <span>Maximum Allowable Cohort Ceiling</span>
                    <span className="font-mono">
                      {selectedOrder.approvedIntake + selectedOrder.ewsQuota + selectedOrder.supernumerary} Seats
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-control border border-state-info-border bg-state-info-bg p-3 flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-state-info shrink-0 mt-0.5" />
                <p className="text-xs text-state-info leading-relaxed">
                  <strong>Deterministic Invariant:</strong> Any admission in excess of this ceiling triggers an immediate
                  statutory flag in the reconciliation engine. No discretionary waiver is applied without formal AICTE council review.
                </p>
              </div>
            </div>

            <div className="border-t border-neutral-150 bg-neutral-50 px-6 py-3 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-control bg-neutral-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-neutral-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
