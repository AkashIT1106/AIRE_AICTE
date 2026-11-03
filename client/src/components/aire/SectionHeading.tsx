import React from "react";

export interface SectionHeadingProps {
  badge?: string;
  badgeVariant?: "primary" | "institutional" | "neutral" | "success";
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  badgeVariant = "institutional",
  title,
  subtitle,
  align = "center",
  className = "",
}) => {
  const isCenter = align === "center";

  return (
    <div
      className={`mb-10 sm:mb-12 ${
        isCenter ? "text-center mx-auto max-w-3xl" : "text-left max-w-2xl"
      } ${className}`}
    >
      {badge && (
        <div className="mb-3">
          {badgeVariant === "institutional" ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-1 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" aria-hidden="true" />
              {badge}
            </span>
          ) : badgeVariant === "neutral" ? (
            <span className="inline-flex items-center text-xs font-semibold tracking-wider uppercase text-[#475569] bg-[#F1F5F9] border border-[#CBD5E1] px-2.5 py-1 rounded">
              {badge}
            </span>
          ) : (
            <span className="inline-flex items-center text-xs font-semibold tracking-wide text-[#1E293B] bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1 rounded-full">
              {badge}
            </span>
          )}
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#0F172A] tracking-tight leading-tight mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg text-[#475569] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
