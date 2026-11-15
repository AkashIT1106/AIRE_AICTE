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
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

export function Topbar() {
  const { user, institutionMemberships, activeInstitutionId, setActiveInstitution, signOut, platformRoles } =
    useAuthStore();
  const navigate = useNavigate();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [institutionMenuOpen, setInstitutionMenuOpen] = useState(false);
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
    <header className="flex h-[60px] flex-shrink-0 items-center justify-between border-b border-neutral-150 bg-neutral-0 px-6 font-sans">
      {/* Left: Institution switcher */}
      <div className="relative" ref={institutionMenuRef}>
        {institutionMemberships.length > 0 ? (
          <button
            onClick={() => setInstitutionMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-control border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-800 hover:bg-neutral-100 transition-colors"
          >
            <Building2 className="h-4 w-4 text-neutral-600" />
            <span className="max-w-[200px] truncate font-medium">
              {activeInstitution?.name ?? "Select Institution"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-neutral-600" />
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-600">
            <Building2 className="h-4 w-4" />
            <span>AICTE Platform</span>
          </div>
        )}

        {institutionMenuOpen && institutionMemberships.length > 0 && (
          <div className="absolute left-0 top-full z-50 mt-1 w-72 overflow-hidden rounded-card border border-neutral-150 bg-neutral-0 shadow-lg">
            <div className="border-b border-neutral-150 px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Switch Institution
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
                        ? "text-brand-primary font-medium"
                        : "text-neutral-800",
                    )}
                  >
                    <Building2 className="h-4 w-4 flex-shrink-0 text-neutral-600" />
                    <span className="truncate">{m.name}</span>
                    {m.institutionId === activeInstitutionId && (
                      <span className="ml-auto text-xs text-brand-primary">
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

      {/* Right: search, bell, user */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <button
          className="flex h-8 w-8 items-center justify-center rounded-control text-neutral-600 hover:bg-neutral-50 transition-colors"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Notifications */}
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-control text-neutral-600 hover:bg-neutral-50 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-control px-2 py-1 hover:bg-neutral-50 transition-colors"
          >
            {/* Avatar */}
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white">
              {userInitials}
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="max-w-[120px] truncate text-xs font-medium text-neutral-800 leading-none">
                {user?.name ?? "User"}
              </span>
              <span className="text-[10px] text-neutral-600 leading-tight">
                {displayRole.replace(/_/g, " ")}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-neutral-600" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-card border border-neutral-150 bg-neutral-0 shadow-lg">
              {/* Identity */}
              <div className="border-b border-neutral-150 px-3 py-3">
                <p className="text-sm font-semibold text-neutral-800">
                  {user?.name}
                </p>
                <p className="text-xs text-neutral-600 truncate">{user?.email}</p>
              </div>
              {/* Menu items */}
              <ul className="py-1">
                <li>
                  <button
                    onClick={() => {
                      navigate("/dashboard/settings");
                      setUserMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-50 transition-colors"
                  >
                    <User className="h-4 w-4 text-neutral-600" />
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/dashboard/settings");
                      setUserMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-50 transition-colors"
                  >
                    <Settings className="h-4 w-4 text-neutral-600" />
                    Settings
                  </button>
                </li>
                <li className="border-t border-neutral-150 mt-1">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-state-error hover:bg-state-error-bg transition-colors"
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
