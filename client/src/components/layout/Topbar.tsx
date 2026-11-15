/**
 * Topbar — AIRE top navigation bar.
 * Height: 60px. White background with bottom border.
 * Includes institution switcher, search, notifications, and user menu.
 */

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Building2,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";

export function Topbar() {
  const { user, institutionMemberships, activeInstitutionId, setActiveInstitution, signOut, platformRoles } =
    useAuthStore();
  const { sidebarCollapsed, toggleSidebar, toggleMobileSidebar } = useUIStore();
  const navigate = useNavigate();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [institutionMenuOpen, setInstitutionMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const institutionMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (institutionMenuRef.current && !institutionMenuRef.current.contains(e.target as Node)) {
        setInstitutionMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activeInstitution = institutionMemberships.find(
    (m) => m.institutionId === activeInstitutionId,
  );

  const displayRole = platformRoles[0] ?? "Member";
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  return (
    <header className="flex h-[60px] flex-shrink-0 items-center justify-between border-b border-neutral-150 bg-neutral-0 px-4 md:px-6 font-sans">
      {/* Left: Sidebar Toggle + Institution switcher */}
      <div className="flex items-center gap-3">
        {/* Mobile Toggle Button */}
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-control border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition-colors lg:hidden"
          aria-label="Open navigation menu"
          title="Toggle Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop Collapse/Expand Toggle Button */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden lg:flex h-8 w-8 items-center justify-center rounded-control text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
          title={sidebarCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>

        {/* Divider */}
        <div className="hidden lg:block h-4 w-px bg-neutral-200" />

        {/* Institution switcher */}
        <div className="relative" ref={institutionMenuRef}>
          {institutionMemberships.length > 0 ? (
            <button
              onClick={() => setInstitutionMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-control border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs md:text-sm text-neutral-800 hover:bg-neutral-100 transition-colors"
            >
              <Building2 className="h-4 w-4 text-neutral-600 flex-shrink-0" />
              <span className="max-w-[140px] md:max-w-[220px] truncate font-medium">
                {activeInstitution?.name ?? "Select Institution"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-neutral-600 flex-shrink-0" />
            </button>
          ) : (
            <div className="flex items-center gap-2 px-2 py-1 text-xs md:text-sm text-neutral-600 font-medium">
              <Building2 className="h-4 w-4" />
              <span>National Regulatory Authority</span>
            </div>
          )}

          {institutionMenuOpen && institutionMemberships.length > 0 && (
            <div className="absolute left-0 top-full z-50 mt-1 w-72 overflow-hidden rounded-card border border-neutral-150 bg-neutral-0 shadow-lg animate-fade-in">
              <div className="border-b border-neutral-150 px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
                  Switch Active Institution Context
                </p>
              </div>
              <ul className="py-1">
                {institutionMemberships.map((m) => (
                  <li key={m.institutionId}>
                    <button
                      onClick={() => {
                        setActiveInstitution(m.institutionId);
                        setInstitutionMenuOpen(false);
                      }}
                      className={clsx(
                        "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-neutral-50",
                        m.institutionId === activeInstitutionId
                          ? "text-brand-primary font-semibold bg-brand-50/50"
                          : "text-neutral-800",
                      )}
                    >
                      <Building2 className="h-4 w-4 flex-shrink-0 text-neutral-600" />
                      <span className="truncate">{m.name}</span>
                      {m.institutionId === activeInstitutionId && (
                        <span className="ml-auto text-[10px] uppercase font-bold text-brand-primary bg-brand-100/70 px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Right: Search, Notifications, User */}
      <div className="flex items-center gap-2.5">
        {/* Quick Search Bar */}
        <div className={clsx(
          "hidden md:flex items-center gap-2 rounded-control border bg-neutral-50 px-2.5 py-1 transition-all duration-200",
          searchFocused ? "border-brand-primary bg-neutral-0 ring-1 ring-brand-primary w-64 shadow-sm" : "border-neutral-200 w-44",
        )}>
          <Search className="h-3.5 w-3.5 text-neutral-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search records, codes…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full bg-transparent text-xs text-neutral-800 outline-none placeholder:text-neutral-500"
          />
        </div>

        {/* Notifications */}
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-control text-neutral-600 hover:bg-neutral-100 transition-colors"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-state-error animate-pulse" />
        </button>

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-control p-1 hover:bg-neutral-100 transition-colors"
          >
            {/* Avatar with pulse ring */}
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white shadow-sm ring-2 ring-brand-50">
              {userInitials}
            </div>
            <div className="hidden lg:flex flex-col items-start text-left">
              <span className="max-w-[130px] truncate text-xs font-semibold text-neutral-800 leading-none">
                {user?.name ?? "Authorized User"}
              </span>
              <span className="text-[10px] text-neutral-500 font-medium leading-tight mt-0.5">
                {displayRole.replace(/_/g, " ")}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-neutral-600 hidden sm:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-1.5 w-60 overflow-hidden rounded-card border border-neutral-150 bg-neutral-0 shadow-xl animate-fade-in">
              {/* Identity */}
              <div className="border-b border-neutral-150 bg-neutral-50/50 px-3.5 py-3">
                <p className="text-xs font-bold text-neutral-800">
                  {user?.name ?? "Regulatory Officer"}
                </p>
                <p className="text-[11px] text-neutral-600 truncate">{user?.email ?? "user@aicte-india.org"}</p>
                <span className="inline-block mt-1 font-mono text-[10px] font-bold text-brand-primary bg-brand-50 px-1.5 py-0.5 rounded border border-brand-100">
                  {displayRole}
                </span>
              </div>
              {/* Menu items */}
              <ul className="py-1 text-xs">
                <li>
                  <button
                    onClick={() => {
                      navigate("/dashboard/settings");
                      setUserMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2 text-neutral-800 hover:bg-neutral-50 transition-colors"
                  >
                    <User className="h-4 w-4 text-neutral-600" />
                    Regulatory Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/dashboard/settings");
                      setUserMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2 text-neutral-800 hover:bg-neutral-50 transition-colors"
                  >
                    <Settings className="h-4 w-4 text-neutral-600" />
                    Platform Settings
                  </button>
                </li>
                <li className="border-t border-neutral-150 mt-1">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2 font-medium text-state-error hover:bg-state-error-bg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
