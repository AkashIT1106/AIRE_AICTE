import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  LogIn,
  LayoutDashboard,
  Menu,
  X,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export const PublicHeader: React.FC = () => {
  const { isAuthenticated, platformRoles, activeInstitution } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontScale, setFontScale] = useState<"normal" | "large" | "larger">(
    "normal",
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedLang, setSelectedLang] = useState<"en" | "hi">("en");

  // Font scaling handler (UX4G standard A- / A / A+)
  const handleFontScale = (scale: "normal" | "large" | "larger") => {
    setFontScale(scale);
    const root = document.documentElement;
    if (scale === "normal") {
      root.style.fontSize = "16px";
    } else if (scale === "large") {
      root.style.fontSize = "17.5px";
    } else {
      root.style.fontSize = "19px";
    }
  };

  // Dark mode toggle (UX4G / OS accessibility)
  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const getDashboardPath = () => {
    if (
      platformRoles.includes("AICTE_ADMIN" as any) ||
      platformRoles.includes("AICTE_REVIEWER" as any)
    ) {
      return "/aicte/overview";
    }
    if (platformRoles.includes("AUDITOR" as any)) {
      return "/auditor/logs";
    }
    if (activeInstitution) {
      return "/institution/dashboard";
    }
    return "/institution/dashboard";
  };

  return (
    <header className="w-full bg-[var(--surface-card)] border-b border-[var(--border-default)] sticky top-0 z-50">
      {/* 1. UX4G Statutory Identity & Accessibility Bar */}
      <div className="bg-[#0B1520] text-white/90 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-white/10 select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Official Government of India & AICTE bilingual markers */}
          <div className="flex items-center space-x-2.5 text-[11px] tracking-wide">
            {/* National Emblem SVG */}
            <svg
              className="w-4 h-4 text-amber-400 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2L14.4 7.2L20 8L16 12L17 17.6L12 15L7 17.6L8 12L4 8L9.6 7.2L12 2Z" />
            </svg>
            <div className="flex items-center space-x-1.5 font-medium">
              <span className="font-semibold text-white">भारत सरकार</span>
              <span className="text-white/40">/</span>
              <span>Government of India</span>
            </div>
            <span className="text-white/30 hidden md:inline">|</span>
            <div className="hidden md:flex items-center space-x-1.5 text-white/80">
              <span>अखिल भारतीय तकनीकी शिक्षा परिषद</span>
              <span className="text-white/40">/</span>
              <span>AICTE</span>
            </div>
          </div>

          {/* Accessibility controls: Skip link, font size, theme, language */}
          <div className="flex items-center space-x-3 text-[11px]">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:static focus:px-2 focus:py-0.5 focus:bg-white focus:text-[#0B1520] rounded text-xs font-semibold"
            >
              Skip to main content
            </a>

            {/* Font Resizing Controls */}
            <div
              className="flex items-center bg-white/10 rounded px-1.5 py-0.5 space-x-1 font-mono"
              role="group"
              aria-label="Text sizing"
            >
              <button
                type="button"
                onClick={() => handleFontScale("normal")}
                aria-pressed={fontScale === "normal"}
                className={cn(
                  "px-1 py-0.5 rounded transition-colors text-[10px]",
                  fontScale === "normal"
                    ? "bg-white text-black font-bold"
                    : "text-white/70 hover:text-white",
                )}
                title="Normal text size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => handleFontScale("large")}
                aria-pressed={fontScale === "large"}
                className={cn(
                  "px-1 py-0.5 rounded transition-colors text-[11px]",
                  fontScale === "large"
                    ? "bg-white text-black font-bold"
                    : "text-white/70 hover:text-white",
                )}
                title="Large text size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => handleFontScale("larger")}
                aria-pressed={fontScale === "larger"}
                className={cn(
                  "px-1 py-0.5 rounded transition-colors text-[12px]",
                  fontScale === "larger"
                    ? "bg-white text-black font-bold"
                    : "text-white/70 hover:text-white",
                )}
                title="Largest text size"
              >
                A+
              </button>
            </div>

            <span className="text-white/20">|</span>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-1 rounded text-white/70 hover:text-white transition-colors flex items-center gap-1"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              {isDarkMode ? (
                <Sun className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <Moon className="w-3.5 h-3.5" />
              )}
            </button>

            <span className="text-white/20">|</span>

            {/* Language Selection */}
            <div className="flex items-center space-x-1 text-white/80">
              <Globe className="w-3 h-3 text-white/60" />
              <button
                type="button"
                onClick={() =>
                  setSelectedLang(selectedLang === "en" ? "hi" : "en")
                }
                className="hover:text-white transition-colors font-medium"
              >
                {selectedLang === "en" ? "English" : "हिन्दी"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Institutional Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
        {/* Left: Brand mark and official platform identity */}
        <div className="flex items-center space-x-3.5">
          <Link
            to="/"
            className="flex items-center space-x-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)] rounded p-1"
          >
            {/* AIRE Geometric Logo Mark */}
            <div className="w-10 h-10 rounded-lg bg-[#183B56] flex items-center justify-center text-white shadow-sm ring-1 ring-black/10 group-hover:bg-[#245B75] transition-colors">
              <svg
                className="w-6 h-6 text-[#14B8A6]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 20 9-16 9 16" />
                <path d="M6.5 14h11" />
              </svg>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-sans">
                  AIRE
                </span>
                <span className="hidden sm:inline-block h-4 w-px bg-[var(--border-default)]" />
                <span className="hidden sm:inline-block text-xs font-semibold text-[var(--text-secondary)] tracking-normal">
                  AICTE Institutional Records & Verification Engine
                </span>
              </div>
              <span className="sm:hidden text-[11px] font-medium text-[var(--text-secondary)]">
                AICTE Verification Engine
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <nav
          className="hidden md:flex items-center space-x-7 text-sm font-medium text-[var(--text-secondary)]"
          aria-label="Main Navigation"
        >
          <a
            href="#home"
            className="text-[var(--brand-primary)] font-semibold border-b-2 border-[var(--brand-primary)] pb-0.5"
          >
            Home
          </a>
          <a
            href="#about"
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            About AIRE
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            How It Works
          </a>
          <a
            href="#why-aire"
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            Why AIRE
          </a>
          <a
            href="#support"
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            Help & Support
          </a>
        </nav>

        {/* Right: Primary Call to Action */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <Link to={getDashboardPath()}>
              <Button
                className="bg-[#245B75] hover:bg-[#1C4666] text-white text-sm font-medium px-4 py-2 rounded shadow-sm inline-flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Workspace</span>
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button
                className="bg-[#245B75] hover:bg-[#1C4666] text-white text-sm font-medium px-4 py-2 rounded shadow-sm inline-flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign in to AIRE</span>
              </Button>
            </Link>
          )}

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card-subdued)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--surface-card)] border-b border-[var(--border-default)] px-4 pt-2 pb-4 space-y-2">
          <a
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded font-medium text-[var(--brand-primary)] bg-[var(--surface-card-subdued)]"
          >
            Home
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-card-subdued)]"
          >
            About AIRE
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-card-subdued)]"
          >
            How It Works
          </a>
          <a
            href="#why-aire"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-card-subdued)]"
          >
            Why AIRE
          </a>
          <a
            href="#support"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-card-subdued)]"
          >
            Help & Support
          </a>
        </div>
      )}
    </header>
  );
};
