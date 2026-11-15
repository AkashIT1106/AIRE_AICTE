import { useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

export function ReportsPage() {
  const [reportType, setReportType] = useState("NATIONAL");
  const [session, setSession] = useState("2026-2027");

  const stateData = [
    { state: "Maharashtra", approved: 385000, admitted: 379200, compliance: 98.4 },
    { state: "Tamil Nadu", approved: 420000, admitted: 426800, compliance: 93.1 },
    { state: "Karnataka", approved: 295000, admitted: 292100, compliance: 99.0 },
    { state: "Uttar Pradesh", approved: 340000, admitted: 331200, compliance: 97.4 },
    { state: "Gujarat", approved: 185000, admitted: 183400, compliance: 99.1 },
    { state: "Telangana", approved: 210000, admitted: 208500, compliance: 99.2 },
  ];

  const trendData = [
    { month: "May", submissions: 120, matched: 118 },
    { month: "Jun", submissions: 480, matched: 472 },
    { month: "Jul", submissions: 1850, matched: 1810 },
    { month: "Aug", submissions: 4200, matched: 4110 },
    { month: "Sep", submissions: 2762, matched: 2710 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Regulatory Analytics (M13)"
        description="Comprehensive national statistical summaries, state-wise compliance reports, and reconciliation audit dossiers."
        actions={
          <button
            onClick={() => alert(`Generating National Regulatory Dossier for ${session}. Download will begin.`)}
            className="flex items-center gap-1.5 rounded-control bg-brand-primary px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-900 shadow-sm"
          >
            <Download className="h-3.5 w-3.5" /> Export Comprehensive PDF Report
          </button>
        }
      />

      {/* Control Strip */}
      <div className="flex flex-wrap items-center gap-4 rounded-card border border-neutral-150 bg-neutral-0 p-4 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-neutral-600 uppercase tracking-wider">Report Domain:</span>
          <select
            aria-label="Select report domain"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="rounded-control border border-neutral-200 bg-neutral-0 px-2.5 py-1 text-xs font-medium outline-none cursor-pointer"
          >
            <option value="NATIONAL">National Summary Dossier</option>
            <option value="STATE">State-wise Compliance Audit</option>
            <option value="PROGRAMME">Discipline &amp; Branch Distribution</option>
            <option value="EXCEPTIONS">Non-Compliance &amp; Exception Summary</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-neutral-600 uppercase tracking-wider">Academic Session:</span>
          <select
            aria-label="Select academic session"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            className="rounded-control border border-neutral-200 bg-neutral-0 px-2.5 py-1 text-xs font-medium outline-none cursor-pointer"
          >
            <option value="2026-2027">AY 2026-2027 (Active)</option>
            <option value="2025-2026">AY 2025-2026</option>
          </select>
        </div>
      </div>

      {/* Primary Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State Bar Chart */}
        <div className="rounded-card border border-neutral-150 bg-neutral-0 p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-neutral-800">State-wise Sanctioned vs Admitted Comparison</h3>
            <p className="text-xs text-neutral-600">Highest-volume state technical directorates</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7ECEE" />
                <XAxis dataKey="state" tick={{ fontSize: 11, fill: "#536474" }} />
                <YAxis tick={{ fontSize: 11, fill: "#536474" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "6px",
                    border: "1px solid #D8E0E3",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="approved" name="Sanctioned Intake" fill="#24536F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="admitted" name="Reported Admissions" fill="#075E58" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Temporal Submission Trend Chart */}
        <div className="rounded-card border border-neutral-150 bg-neutral-0 p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-neutral-800">Submission &amp; Reconciliation Velocity</h3>
            <p className="text-xs text-neutral-600">Monthly batch ingestion curve vs confirmed matches</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7ECEE" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#536474" }} />
                <YAxis tick={{ fontSize: 11, fill: "#536474" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "6px",
                    border: "1px solid #D8E0E3",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Line type="monotone" dataKey="submissions" name="Ingested Batches" stroke="#24536F" strokeWidth={2} />
                <Line type="monotone" dataKey="matched" name="Fully Reconciled" stroke="#176B45" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Exportable Preset Reports Table */}
      <div className="rounded-card border border-neutral-150 bg-neutral-0 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-neutral-800">Standard Statutory Report Downloads</h3>
        <div className="divide-y divide-neutral-150 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-neutral-800">1. National Quota Compliance Audit Dossier (AY 2026-27)</p>
              <p className="text-neutral-600 text-[11px]">Includes all sanctioned EOA allotments, category allocations, and verified matches.</p>
            </div>
            <button
              onClick={() => alert("Downloading CSV...")}
              className="flex items-center gap-1 font-semibold text-brand-primary hover:underline"
            >
              <FileSpreadsheet className="h-4 w-4" /> Download CSV
            </button>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-neutral-800">2. Institutional Discrepancy &amp; Excess Admissions Register</p>
              <p className="text-neutral-600 text-[11px]">Comprehensive ledger of all cases exceeding approved intake caps across India.</p>
            </div>
            <button
              onClick={() => alert("Downloading CSV...")}
              className="flex items-center gap-1 font-semibold text-brand-primary hover:underline"
            >
              <FileSpreadsheet className="h-4 w-4" /> Download CSV
            </button>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-neutral-800">3. APAAR Identity Verification Coverage Report</p>
              <p className="text-neutral-600 text-[11px]">Institution-wise percentage of students successfully validated via the national 12-digit gateway.</p>
            </div>
            <button
              onClick={() => alert("Downloading CSV...")}
              className="flex items-center gap-1 font-semibold text-brand-primary hover:underline"
            >
              <FileSpreadsheet className="h-4 w-4" /> Download CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
