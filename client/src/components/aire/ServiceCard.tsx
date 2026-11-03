import React from "react";
import { Badge } from "./Badge";

export interface ServiceCardProps {
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  title: string;
  badge?: string;
  badgeVariant?: "primary" | "success" | "warning" | "neutral" | "lavender";
  description: string;
  features: string[];
  actionLabel?: string;
  actionHref?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  iconBgColor = "bg-[#F2EFFF]",
  iconColor = "text-[#4A2BC2]",
  title,
  badge,
  badgeVariant = "primary",
  description,
  features,
  actionLabel = "Access Service",
  actionHref = "#",
}) => {
  return (
    <div className="ux4g-card bg-white border border-[#E5E7EB] hover:border-[#C0B3FF] hover:shadow-lg transition-all duration-200 rounded-xl p-6 sm:p-7 flex flex-col justify-between h-full group relative overflow-hidden">
      {/* Top Subtle Color Accent Line on Hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#4A2BC2] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />

      <div>
        <div className="flex items-center justify-between gap-2 mb-5">
          <div
            className={`w-12 h-12 rounded-xl ${iconBgColor} ${iconColor} flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105`}
          >
            {icon}
          </div>
          {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
        </div>

        <h3 className="text-xl font-bold text-[#111827] group-hover:text-[#4A2BC2] transition-colors mb-2.5 tracking-tight">
          {title}
        </h3>

        <p className="text-sm text-[#4B5563] leading-relaxed mb-5">
          {description}
        </p>

        <ul className="space-y-2.5 mb-6">
          {features.map((feature, idx) => (
            <li
              key={idx}
              className="text-xs sm:text-sm text-[#374151] flex items-start gap-2.5"
            >
              <div className="w-4 h-4 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-2.5 h-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="leading-snug">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-[#F3F4F6]">
        <a
          href={actionHref}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#4A2BC2] hover:text-[#301C7D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A2BC2]"
        >
          <span>{actionLabel}</span>
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};
