import React, { useState } from "react";
import { Container } from "./Container";
import { Button } from "./Button";

export const AireNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "About AIRE", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Governance & Privacy", href: "#governance" },
    { label: "Help & FAQ", href: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#CBD5E1] transition-colors shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
      <Container className="flex items-center justify-between h-20">
        {/* Institutional Brand / Wordmark */}
        <a
          href="/"
          className="flex items-center gap-3.5 focus-visible:outline-2 focus-visible:outline-[#2563EB] rounded py-1"
          aria-label="AIRE Home"
        >
          {/* Institutional Mark */}
          <div className="w-11 h-11 rounded-lg bg-[#1E293B] text-white flex items-center justify-center font-bold text-xl shadow-xs border border-[#334155] shrink-0">
            <svg
              className="w-6 h-6 text-[#60A5FA]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight text-[#0F172A]">
                AIRE
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#2563EB] px-2 py-0.5 rounded border border-[#BFDBFE]">
                Platform
              </span>
            </div>
            <p className="text-xs text-[#475569] font-medium tracking-tight mt-0.5">
              Admission Reconciliation & Evidence
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden lg:flex items-center gap-1 xl:gap-2"
          aria-label="Primary Navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3.5 py-2 text-sm font-semibold text-[#334155] hover:text-[#2563EB] hover:bg-[#F8FAFC] rounded-md transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#2563EB]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA Action */}
        <div className="hidden lg:flex items-center gap-3">
          <Button
            asAnchor
            href="/login"
            variant="primary"
            size="md"
            className="font-bold text-sm px-5 shadow-xs"
          >
            <span>Institution Portal</span>
            <svg
              className="w-4 h-4 ml-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-lg text-[#334155] hover:text-[#0F172A] hover:bg-[#F1F5F9] focus-visible:outline-2 focus-visible:outline-[#2563EB]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#CBD5E1] bg-white px-4 pt-4 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 text-base font-semibold text-[#1E293B] hover:bg-[#F8FAFC] hover:text-[#2563EB] rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-[#E2E8F0]">
            <Button
              asAnchor
              href="/login"
              variant="primary"
              size="lg"
              className="w-full justify-center font-bold"
            >
              Access Institution Portal
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
