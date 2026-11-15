/**
 * Sidebar — AIRE navigation sidebar.
 * Background: brand-deep (deep navy).
 * Collapsible to icon-only mode.
 */

import { useState } from "react";
import { NavLink } from "react-router-dom";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Building2,
  FileCheck2,
  Upload,
  Fingerprint,
  ShieldCheck,
  GitMerge,
  AlertTriangle,
  BookOpen,
  BarChart3,
  ClipboardList,
  Settings,
  ShieldAlert,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { UserRole } from "@aire/authorization";

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
  requiredRoles?: UserRole[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        to: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Institutions & Registry",
    items: [
      {
        label: "Institutions",
        to: "/dashboard/institutions",
        icon: Building2,
      },
      {
        label: "Approval Orders",
        to: "/dashboard/approval-orders",
        icon: FileCheck2,
      },
      {
        label: "Policies",
        to: "/dashboard/policies",
        icon: BookOpen,
      },
    ],
  },
  {
    label: "Submissions & Ingestion",
    items: [
      {
        label: "Submissions",
        to: "/dashboard/submissions",
        icon: Upload,
      },
      {
        label: "Admissions",
        to: "/dashboard/admissions",
        icon: ClipboardList,
      },
    ],
  },
  {
    label: "Identity & Ledger",
    items: [
      {
        label: "Identity",
        to: "/dashboard/identity",
        icon: Fingerprint,
      },
      {
        label: "AEP Credentials",
        to: "/dashboard/aep",
        icon: Award,
      },
    ],
  },
  {
    label: "Reconciliation & Exceptions",
    items: [
      {
        label: "Reconciliation",
        to: "/dashboard/reconciliation",
        icon: GitMerge,
      },
      {
        label: "Exceptions",
        to: "/dashboard/exceptions",
        icon: AlertTriangle,
      },
    ],
  },
  {
    label: "Governance",
    items: [
      {
        label: "Reports",
        to: "/dashboard/reports",
        icon: BarChart3,
      },
      {
        label: "Audit Trail",
        to: "/dashboard/audit",
        icon: ShieldCheck,
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        label: "Settings",
        to: "/dashboard/settings",
        icon: Settings,
      },
      {
        label: "Admin",
        to: "/dashboard/admin",
        icon: ShieldAlert,
        requiredRoles: [UserRole.SUPER_ADMIN, UserRole.AICTE_ADMIN],
      },
    ],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { platformRoles } = useAuthStore();

  function canSeeItem(item: NavItem): boolean {
    if (!item.requiredRoles || item.requiredRoles.length === 0) return true;
    return item.requiredRoles.some((r) => platformRoles.includes(r));
  }

  return (
    <aside
      className={clsx(
        "flex h-screen flex-col bg-brand-deep font-sans transition-all duration-200",
        collapsed ? "w-16" : "w-60",
      )}
    >
      {/* Logo */}
      <div className="flex h-[60px] flex-shrink-0 items-center px-4 border-b border-brand-900">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-control bg-brand-primary text-white text-xs font-bold">
            A
          </div>
          {!collapsed && (
            <div className="min-w-0 overflow-hidden">
              <p className="truncate text-sm font-bold leading-none text-white">
                AIRE
              </p>
              <p className="truncate text-[10px] leading-tight text-brand-100 opacity-80">
                AICTE Admission Reconciliation
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter(canSeeItem);
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label} className="mb-1">
              {!collapsed && (
                <p className="mb-1 px-4 text-[10px] font-semibold uppercase tracking-widest text-brand-100 opacity-50">
                  {group.label}
                </p>
              )}
              {visibleItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/dashboard"}
                  className={({ isActive }) =>
                    clsx(
                      "mx-2 mb-0.5 flex items-center gap-3 rounded-control px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-brand-primary text-white"
                        : "text-brand-100 hover:bg-brand-900 hover:text-white",
                      collapsed && "justify-center px-2",
                    )
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="flex-shrink-0 border-t border-brand-900 p-2">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={clsx(
            "flex w-full items-center gap-2 rounded-control px-3 py-2 text-xs text-brand-100 opacity-70 hover:opacity-100 hover:bg-brand-900 transition-all",
            collapsed && "justify-center",
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
