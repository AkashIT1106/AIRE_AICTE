import React from "react";
import { ShieldCheck, Server, Database, CheckCircle2 } from "lucide-react";

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Regulatory Header */}
      <header className="bg-slate-900 text-white px-6 py-4 shadow-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-8 h-8 text-sky-400" />
            <div>
              <h1 className="text-lg font-bold tracking-tight">AIRE</h1>
              <p className="text-xs text-slate-400">
                AICTE Admission Reconciliation & Evidence Platform
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">
              Phase 1 — Engineering Foundation
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        <section className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Foundation Status
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Engineering environment baseline established per PROJECT_PLAN.md
            specifications.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-md border border-slate-200 bg-slate-50 flex items-start space-x-3">
              <Server className="w-5 h-5 text-indigo-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  API Monolith
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Express + TypeScript + Structured Pino Logging
                </p>
                <div className="mt-2 flex items-center space-x-1.5 text-xs text-emerald-700 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Configured</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-md border border-slate-200 bg-slate-50 flex items-start space-x-3">
              <Database className="w-5 h-5 text-sky-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Data Architecture
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  PostgreSQL + Prisma 7 ORM Baseline
                </p>
                <div className="mt-2 flex items-center space-x-1.5 text-xs text-emerald-700 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Configured</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-md border border-slate-200 bg-slate-50 flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-teal-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Security & Isolation
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  RLS Framework & Strict Standard Error Envelopes
                </p>
                <div className="mt-2 flex items-center space-x-1.5 text-xs text-emerald-700 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Configured</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workspace Directory Baseline */}
        <section className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Role-Appropriate Workspaces (Section 10.1)
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Domain business logic and admission workflows will be implemented in
            subsequent phases.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "AICTE Workspace",
              "Institution Workspace",
              "Student Workspace",
              "Auditor Workspace",
            ].map((workspace) => (
              <div
                key={workspace}
                className="p-3 border border-dashed border-slate-300 rounded text-center"
              >
                <span className="text-xs font-medium text-slate-700">
                  {workspace}
                </span>
                <span className="block text-[11px] text-slate-400 mt-1">
                  Awaiting Phase 2+
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
        AICTE Admission Reconciliation & Evidence Platform &bull; Phase 1
        Baseline
      </footer>
    </div>
  );
};

export default App;
