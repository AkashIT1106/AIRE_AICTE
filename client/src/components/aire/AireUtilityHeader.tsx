import React, { useState, useEffect } from "react";
import { Container } from "./Container";

export const AireUtilityHeader: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(0);
  const [lang, setLang] = useState<"en" | "hi">("en");

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleFontSize = (level: number) => {
    setFontSizeLevel(level);
    const root = document.documentElement;
    if (level === -1) {
      root.style.fontSize = "15px";
    } else if (level === 1) {
      root.style.fontSize = "17px";
    } else {
      root.style.fontSize = "16px";
    }
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Top Institutional & Accessibility Strip */}
      <div className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 text-xs py-1.5 transition-colors">
        <Container className="flex flex-wrap items-center justify-between gap-3">
          {/* Institutional Identification */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 font-semibold text-neutral-800">
              {/* Subtle Tricolor Accent Indicator */}
              <div className="flex flex-col w-2 h-3.5 rounded-sm overflow-hidden shrink-0" aria-hidden="true">
                <span className="h-1/3 bg-[#FF9933] w-full" />
                <span className="h-1/3 bg-white w-full border-y border-gray-200" />
                <span className="h-1/3 bg-[#138808] w-full" />
              </div>
              <span>भारत सरकार</span>
              <span className="text-neutral-300 font-normal">|</span>
              <span>Government of India</span>
            </div>

            <span className="hidden md:inline text-neutral-300">•</span>

            <span className="hidden md:inline text-neutral-600 font-medium">
              Technical Education Regulatory Platform
            </span>
          </div>

          {/* Accessibility Controls, Language, and Preview Shortcut */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Visual Foundation Preview Link */}
            <a
              href="/preview"
              className="text-brand-primary hover:text-brand-900 font-medium transition-colors"
            >
              Design System Preview
            </a>

            <span className="text-neutral-300">|</span>

            {/* Screen Reader Access link */}
            <a
              href="#main-content"
              className="hidden lg:inline text-neutral-600 hover:text-brand-primary transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary"
            >
              Screen Reader Access
            </a>

            <span className="hidden lg:inline text-neutral-300">|</span>

            {/* Font Size Adjustments */}
            <div
              className="flex items-center gap-1 bg-neutral-0 border border-neutral-200 rounded px-1.5 py-0.5"
              aria-label="Font size controls"
            >
              <span className="hidden sm:inline text-[11px] text-neutral-600 mr-1">
                Size:
              </span>
              <button
                type="button"
                onClick={() => handleFontSize(-1)}
                className={`px-1.5 py-0.5 rounded text-xs font-semibold hover:bg-neutral-100 transition-colors ${
                  fontSizeLevel === -1
                    ? "bg-brand-50 text-brand-primary font-bold"
                    : "text-neutral-600"
                }`}
                title="Decrease font size"
                aria-label="Decrease text size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => handleFontSize(0)}
                className={`px-1.5 py-0.5 rounded text-xs font-semibold hover:bg-neutral-100 transition-colors ${
                  fontSizeLevel === 0
                    ? "bg-brand-50 text-brand-primary font-bold"
                    : "text-neutral-600"
                }`}
                title="Default font size"
                aria-label="Default text size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => handleFontSize(1)}
                className={`px-1.5 py-0.5 rounded text-xs font-semibold hover:bg-neutral-100 transition-colors ${
                  fontSizeLevel === 1
                    ? "bg-brand-50 text-brand-primary font-bold"
                    : "text-neutral-600"
                }`}
                title="Increase font size"
                aria-label="Increase text size"
              >
                A+
              </button>
            </div>

            <span className="text-neutral-300">|</span>

            {/* High Contrast / Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 text-xs text-neutral-800 hover:text-neutral-900 px-1.5 py-0.5 rounded hover:bg-neutral-200 transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary"
              aria-label={`Switch to ${theme === "light" ? "High Contrast" : "Standard"} mode`}
            >
              <svg
                className="w-3.5 h-3.5 text-brand-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="hidden sm:inline font-medium">
                {theme === "light" ? "High Contrast" : "Standard"}
              </span>
            </button>

            <span className="text-neutral-300">|</span>

            {/* Language Selection */}
            <div className="flex items-center gap-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  lang === "en"
                    ? "bg-brand-primary text-neutral-0"
                    : "text-neutral-600 hover:text-neutral-800"
                }`}
                aria-label="English language"
              >
                English
              </button>
              <span className="text-neutral-300">/</span>
              <button
                type="button"
                onClick={() => setLang("hi")}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  lang === "hi"
                    ? "bg-brand-primary text-neutral-0"
                    : "text-neutral-600 hover:text-neutral-800"
                }`}
                aria-label="Hindi language"
              >
                हिन्दी
              </button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};
