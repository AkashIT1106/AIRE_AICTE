/**
 * Sidebar — AIRE navigation sidebar.
 * Background: brand-deep (deep navy).
 * Collapsible to icon-only mode.
 */

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
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";
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
  const { sidebarCollapsed, mobileSidebarOpen, toggleSidebar, setMobileSidebarOpen } = useUIStore();
  const { platformRoles } = useAuthStore();

  function canSeeItem(item: NavItem): boolean {
    if (!item.requiredRoles || item.requiredRoles.length === 0) return true;
    return item.requiredRoles.some((r) => platformRoles.includes(r));
  }

  const renderNavList = (isMobile = false) => (
    <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
      {NAV_GROUPS.map((group) => {
        const visibleItems = group.items.filter(canSeeItem);
        if (visibleItems.length === 0) return null;

        return (
          <div key={group.label} className="mb-2">
            {(!sidebarCollapsed || isMobile) && (
              <p className="mb-1.5 px-4 text-[10px] font-bold uppercase tracking-wider text-brand-100/60">
                {group.label}
              </p>
            )}
            {visibleItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                onClick={() => {
                  if (isMobile) setMobileSidebarOpen(false);
                }}
                className={({ isActive }) =>
                  clsx(
                    "group relative mx-2 mb-1 flex items-center gap-3 rounded-control px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-brand-primary text-white shadow-sm"
                      : "text-brand-100/80 hover:bg-brand-900/70 hover:text-white",
                    sidebarCollapsed && !isMobile && "justify-center px-2",
                  )
                }
                title={sidebarCollapsed && !isMobile ? item.label : undefined}
              >
                <item.icon className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                {(!sidebarCollapsed || isMobile) && (
                  <span className="truncate">{item.label}</span>
                )}
              </NavLink>
            ))}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* Mobile Drawer Backdrop & Slide-over Sidebar                  */}
      {/* ------------------------------------------------------------- */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-brand-deep/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-brand-deep font-sans shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Mobile Navigation"
      >
        {/* Mobile Header with Close Button */}
        <div className="flex h-[60px] flex-shrink-0 items-center justify-between border-b border-brand-900 px-4">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-control bg-brand-primary text-xs font-bold text-white shadow-sm">
              A
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold leading-none text-white">AIRE</p>
              <p className="truncate text-[10px] text-brand-100/80">AICTE Regulatory Platform</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-control text-brand-100 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Close navigation sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Nav Links */}
        {renderNavList(true)}

        {/* Mobile Footer */}
        <div className="border-t border-brand-900 p-3 text-center">
          <p className="text-[10px] text-brand-100/60 font-mono">AIRE System v0.1.0 • AICTE Portal</p>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* Desktop Persistent Collapsible Sidebar                        */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={clsx(
          "hidden h-screen flex-col bg-brand-deep font-sans transition-all duration-300 ease-in-out lg:flex border-r border-brand-900/60 select-none",
          sidebarCollapsed ? "w-20" : "w-64",
        )}
        aria-label="Desktop Navigation"
      >
        {/* Desktop Header */}
        <div className="flex h-[60px] flex-shrink-0 items-center justify-between border-b border-brand-900 px-3.5">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-control bg-brand-primary text-xs font-bold text-white shadow-sm">
              A
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 overflow-hidden animate-fade-in">
                <p className="truncate text-sm font-bold leading-none text-white">AIRE</p>
                <p className="truncate text-[10px] text-brand-100/80 leading-tight">
                  AICTE Admission Reconciliation
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={toggleSidebar}
            className="flex h-7 w-7 items-center justify-center rounded-control text-brand-100/70 hover:bg-brand-900 hover:text-white transition-colors"
            title={sidebarCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Desktop Nav Links */}
        {renderNavList(false)}

        {/* Desktop Footer with Expand/Collapse toggle */}
        <div className="flex-shrink-0 border-t border-brand-900 p-2.5">
          <button
            type="button"
            onClick={toggleSidebar}
            className={clsx(
              "flex w-full items-center gap-2 rounded-control px-3 py-2 text-xs font-medium text-brand-100/70 hover:bg-brand-900 hover:text-white transition-all",
              sidebarCollapsed && "justify-center px-0",
            )}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse Navigation</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
