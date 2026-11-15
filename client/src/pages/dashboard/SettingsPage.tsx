import { User, Shield, KeyRound, LogOut } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuthStore } from "@/stores/auth.store";

export function SettingsPage() {
  const { user, platformRoles, institutionMemberships, activeInstitutionId, signOut } = useAuthStore();

  const activeInstitution = institutionMemberships.find((m) => m.institutionId === activeInstitutionId);

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Settings & Regulatory Profile"
        description="User identity, delegated statutory authority, and institutional session context."
      />

      {/* User Information Card */}
      <div className="rounded-card border border-neutral-150 bg-neutral-0 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-neutral-150 pb-3">
          <User className="h-5 w-5 text-brand-primary" />
          <h3 className="text-sm font-bold text-neutral-800">Regulatory User Profile</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-neutral-600 block mb-1 font-semibold">Full Legal Name</label>
            <input
              type="text"
              readOnly
              value={user?.name ?? "Authorized Regulatory Officer"}
              className="w-full rounded-control border border-neutral-200 bg-neutral-50 p-2 font-medium text-neutral-800 outline-none"
            />
          </div>

          <div>
            <label className="text-neutral-600 block mb-1 font-semibold">Official Email Address</label>
            <input
              type="text"
              readOnly
              value={user?.email ?? "officer@aicte-india.org"}
              className="w-full rounded-control border border-neutral-200 bg-neutral-50 p-2 font-medium text-neutral-800 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Authority & Role Matrix */}
      <div className="rounded-card border border-neutral-150 bg-neutral-0 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-neutral-150 pb-3">
          <Shield className="h-5 w-5 text-teal-800" />
          <h3 className="text-sm font-bold text-neutral-800">Statutory Role &amp; Permission Entitlements</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-control border border-neutral-150 bg-neutral-50">
            <div>
              <p className="font-bold text-neutral-800">Assigned Platform Role</p>
              <p className="text-neutral-600 text-[11px]">Enforces backend Role-Based Access Controls (RBAC)</p>
            </div>
            <span className="font-mono font-bold text-brand-primary bg-brand-50 px-2.5 py-1 rounded-control border border-brand-100">
              {platformRoles.length > 0 ? platformRoles.join(", ") : "AICTE_REVIEWER"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-control border border-neutral-150 bg-neutral-50">
            <div>
              <p className="font-bold text-neutral-800">Active Tenant Scope</p>
              <p className="text-neutral-600 text-[11px]">PostgreSQL Forced Row-Level Security (RLS) Context</p>
            </div>
            <span className="font-semibold text-neutral-800">
              {activeInstitution ? activeInstitution.name : "National Multi-Tenant Regulator Authority"}
            </span>
          </div>
        </div>
      </div>

      {/* Security Credentials Section */}
      <div className="rounded-card border border-neutral-150 bg-neutral-0 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-neutral-150 pb-3">
          <KeyRound className="h-5 w-5 text-brand-primary" />
          <h3 className="text-sm font-bold text-neutral-800">Authentication &amp; Session Management</h3>
        </div>

        <div className="text-xs space-y-3">
          <p className="text-neutral-600">
            Sessions are managed using cryptographically secured <code>HttpOnly</code> cookies powered by Better Auth.
          </p>

          <button
            onClick={() => {
              signOut();
              window.location.href = "/login";
            }}
            className="flex items-center gap-1.5 rounded-control bg-state-error text-white px-4 py-2 font-semibold hover:bg-state-error/90 transition-colors shadow-sm"
          >
            <LogOut className="h-4 w-4" /> Revoke Current Session &amp; Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
