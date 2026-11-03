import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  ShieldCheck,
  Building2,
  GraduationCap,
  ChevronDown,
  Menu,
  X,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Layers,
  UploadCloud,
  FileText,
  User as UserIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

interface AppShellProps {
  children?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    memberships,
    activeInstitution,
    platformRoles,
    setActiveInstitutionId,
    logout,
  } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Live IST (UTC+05:30) server clock
  const [istTime, setIstTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istString = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setIstTime(`${istString} IST (UTC+05:30)`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Determine current active workspace from route
  const currentPath = location.pathname;
  const isAicte = currentPath.startsWith("/aicte");
  const isStudent = currentPath.startsWith("/student");
  const isAuditor = currentPath.startsWith("/auditor");

  // Build purposeful workspace navigation (No demo showcase items!)
  const navigationItems = React.useMemo(() => {
    if (isAicte) {
      return [
        {
          name: "National Compliance",
          href: "/aicte/overview",
          icon: ShieldCheck,
        },
      ];
    }
    if (isStudent) {
      return [
        {
          name: "Entitlement Record",
          href: "/student/record",
          icon: GraduationCap,
        },
      ];
    }
    if (isAuditor) {
      return [
        {
          name: "Audit Trail",
          href: "/auditor/logs",
          icon: FileText,
        },
      ];
    }
    // Default: Institution Workspace
    return [
      {
        name: "Dashboard Overview",
        href: "/institution/dashboard",
        icon: Building2,
      },
      {
        name: "Submissions Ledger",
        href: "/institution/submissions",
        icon: Layers,
      },
      {
        name: "Upload New Batch",
        href: "/institution/submissions/new",
        icon: UploadCloud,
      },
    ];
  }, [isAicte, isStudent, isAuditor]);

  const handleSignOut = async () => {
    await logout();
    navigate("/login");
  };

  const userDisplayName = user?.name || "Authenticated User";
  const userRoleDisplay = activeInstitution?.role
    ? activeInstitution.role.replace(/_/g, " ")
    : platformRoles.length > 0
      ? platformRoles[0].replace(/_/g, " ")
      : "Authorized Identity";

  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] text-[var(--text-primary)] flex flex-col font-sans">
      {/* 1. Global Institutional Header (Fixed 64px) */}
      <header className="bg-[var(--surface-header)] text-[var(--text-inverted)] h-16 px-4 md:px-6 shadow-sm border-b border-[var(--border-strong)]/30 flex items-center justify-between sticky top-0 z-40 select-none">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            className="md:hidden text-[var(--text-inverted)]/80 hover:text-[var(--text-inverted)] p-1.5 focus-aire rounded"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <Link
            to="/"
            className="flex items-center space-x-3 focus-aire rounded group"
          >
            <div className="flex items-center justify-center h-9 w-9 rounded bg-[var(--brand-teal)]/20 border border-[var(--brand-teal)]/40 text-[var(--brand-teal)]">
              <ShieldCheck className="h-6 w-6 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-[var(--text-inverted)]">
                  AIRE
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-[var(--brand-primary)] text-[var(--text-inverted)] border border-white/20">
                  Reconciliation Portal
                </span>
              </div>
              <p className="hidden sm:block text-xs text-[var(--text-inverted)]/70 leading-none mt-0.5">
                Admission Reconciliation & Evidence Platform
              </p>
            </div>
          </Link>
        </div>

        {/* Header Right: Active Scope Switcher & User Profile */}
        <div className="flex items-center space-x-3">
          {/* Statutory Cycle / Sandbox indicator */}
          <div className="hidden lg:flex items-center space-x-2 text-xs bg-white/10 px-3 py-1 rounded-full border border-white/20 text-[var(--text-inverted)]">
            <span className="h-2 w-2 rounded-full bg-[var(--state-success-icon)]" />
            <span className="font-medium">Cycle 2026-27 Active</span>
          </div>

          {/* Tenant / Institution Switcher */}
          {memberships.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--text-inverted)] hover:bg-white/10 border border-white/20 h-8 px-2.5 text-xs font-medium max-w-[220px]"
                >
                  <Building2 className="mr-1.5 h-3.5 w-3.5 text-[var(--brand-teal)] shrink-0" />
                  <span className="truncate">
                    {activeInstitution
                      ? `${activeInstitution.code}`
                      : "Select Tenant"}
                  </span>
                  <ChevronDown className="ml-1.5 h-3.5 w-3.5 text-white/70 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                  Authorized Institutions
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {memberships.map((m) => {
                  const isSelected = activeInstitution?.id === m.institutionId;
                  return (
                    <DropdownMenuItem
                      key={m.institutionId}
                      onClick={() => setActiveInstitutionId(m.institutionId)}
                      className={cn(
                        "text-xs flex items-center justify-between cursor-pointer",
                        isSelected && "bg-[var(--brand-subtle)] font-semibold",
                      )}
                    >
                      <div className="truncate mr-2">
                        <div className="text-[var(--text-primary)] truncate">
                          {m.institution.name}
                        </div>
                        <div className="text-[10px] font-mono text-[var(--text-muted)]">
                          {m.institution.code} &bull; {m.role}
                        </div>
                      </div>
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-[var(--state-success-icon)] shrink-0" />
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* User Profile & Sign Out Dropdown */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--text-inverted)] hover:bg-white/10 border border-white/20 h-8 px-2.5 text-xs font-medium gap-1.5"
                >
                  <div className="h-5 w-5 rounded-full bg-[var(--brand-primary)] border border-white/30 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                    {userDisplayName.charAt(0)}
                  </div>
                  <span className="hidden md:inline truncate max-w-[120px]">
                    {userDisplayName}
                  </span>
                  <ChevronDown className="h-3 w-3 text-white/70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="text-xs font-semibold text-[var(--text-primary)]">
                    {userDisplayName}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] truncate">
                    {user?.email}
                  </div>
                  <Badge
                    variant="outline"
                    size="sm"
                    className="mt-1 text-[10px]"
                  >
                    {userRoleDisplay}
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-xs text-[var(--state-danger-text)] focus:text-[var(--state-danger-text)] cursor-pointer"
                >
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-[var(--text-inverted)] hover:bg-white/10 border border-white/20 h-8 px-3 text-xs"
              >
                <UserIcon className="mr-1.5 h-3.5 w-3.5" />
                <span>Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* 2. Structured Breadcrumb Trail Bar (Fixed 36px) */}
      <Breadcrumbs />

      {/* 3. Main Shell Body */}
      <div className="flex-1 flex w-full relative">
        {/* Mobile Drawer Backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar Navigation (Adaptive Desktop w-64/w-16, Mobile off-canvas drawer) */}
        <aside
          className={cn(
            "fixed inset-y-16 left-0 z-40 bg-[var(--surface-sidebar)] border-r border-[var(--border-default)] flex flex-col transition-all duration-200 ease-in-out md:static md:inset-auto md:min-h-[calc(100vh-4rem-2.25rem-2.25rem)] select-none",
            sidebarCollapsed ? "md:w-16" : "md:w-64",
            mobileMenuOpen
              ? "translate-x-0 w-64 shadow-xl"
              : "-translate-x-full md:translate-x-0",
          )}
        >
          {/* Workspace Identifier Header */}
          <div
            className={cn(
              "h-12 border-b border-[var(--border-subtle)] flex items-center px-4 justify-between",
              sidebarCollapsed && "md:justify-center md:px-0",
            )}
          >
            {!sidebarCollapsed && (
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider truncate">
                {isAicte
                  ? "AICTE Scrutiny"
                  : isStudent
                    ? "Student Portal"
                    : isAuditor
                      ? "Auditor Hub"
                      : "Institution Workspace"}
              </span>
            )}
            <Badge
              variant="outline"
              size="sm"
              className="text-[10px] hidden sm:inline-flex"
            >
              Active
            </Badge>
          </div>

          {/* Navigation Links */}
          <nav
            className="flex-1 p-2 space-y-1 overflow-y-auto"
            aria-label="Sidebar Navigation"
          >
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  title={sidebarCollapsed ? item.name : undefined}
                  className={cn(
                    "flex items-center px-3 py-2 text-xs font-medium rounded transition-colors group focus-aire",
                    sidebarCollapsed
                      ? "md:justify-center md:px-2"
                      : "justify-start",
                    isActive
                      ? "bg-[var(--brand-subtle)] text-[var(--brand-primary)] border-l-2 border-[var(--brand-primary)] font-semibold shadow-xs"
                      : "text-[var(--text-secondary)] hover:bg-[var(--surface-card-subdued)] hover:text-[var(--text-primary)]",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      !sidebarCollapsed && "mr-3",
                      isActive
                        ? "text-[var(--brand-primary)]"
                        : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]",
                    )}
                  />
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Sidebar Collapse Toggle */}
          <div className="hidden md:flex border-t border-[var(--border-subtle)] p-2">
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center p-2 rounded text-xs text-[var(--text-muted)] hover:bg-[var(--surface-card-subdued)] hover:text-[var(--text-primary)] focus-aire"
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <div className="flex items-center gap-2">
                  <PanelLeftClose className="h-4 w-4" />
                  <span className="text-[11px]">Collapse View</span>
                </div>
              )}
            </button>
          </div>
        </aside>

        {/* 4. Main Content Canvas */}
        <main
          id="content"
          className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full"
        >
          {children || <Outlet />}
        </main>
      </div>

      {/* 5. Institutional Footer Status Bar (Fixed 36px) */}
      <footer className="h-9 border-t border-[var(--border-default)] bg-[var(--surface-card)] px-4 md:px-6 flex items-center justify-between text-xs text-[var(--text-muted)] select-none">
        <span className="truncate text-[11px]">
          AIRE &bull; Admission Reconciliation & Evidence Platform
        </span>
        <span className="font-mono tabular-nums text-[11px] shrink-0 hidden sm:inline">
          {istTime}
        </span>
      </footer>
    </div>
  );
};
