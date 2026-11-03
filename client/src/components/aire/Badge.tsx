import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "primary"
    | "brand"
    | "success"
    | "warning"
    | "error"
    | "danger"
    | "info"
    | "neutral"
    | "pending"
    | "teal"
    | "brass"
    | "lavender";
  size?: "sm" | "md";
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
}) => {
  // Semantic variant mapping adhering strictly to design.md §4.4 and UX4G 3.0 tag patterns
  const variantStyles: Record<string, string> = {
    primary:
      "ux4g-tag-tonal-brand bg-brand-50 text-brand-primary border border-brand-100",
    brand:
      "ux4g-tag-tonal-brand bg-brand-50 text-brand-primary border border-brand-100",
    success:
      "ux4g-tag-filled-success bg-state-success-bg text-state-success border border-state-success-border",
    warning:
      "ux4g-tag-filled-warning bg-state-warning-bg text-state-warning border border-state-warning-border",
    error:
      "ux4g-tag-outline-error bg-state-error-bg text-state-error border border-state-error-border",
    danger:
      "ux4g-tag-outline-error bg-state-error-bg text-state-error border border-state-error-border",
    info: "ux4g-tag-text-info bg-state-info-bg text-state-info border border-state-info-border",
    neutral:
      "ux4g-tag-tonal-neutral bg-state-pending-bg text-state-pending border border-state-pending-border",
    pending:
      "ux4g-tag-tonal-neutral bg-state-pending-bg text-state-pending border border-state-pending-border",
    teal: "bg-teal-50 text-teal-800 border border-[#B8E2DC]",
    brass: "bg-brass-50 text-brass-800 border border-[#F0DCBE]",
    lavender: "bg-brand-50 text-brand-primary border border-brand-100", // mapped to brand-50 per design.md §4.3
  };

  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full tracking-wide select-none ${sizeClasses} ${variantStyles[variant] || variantStyles.primary} ${className}`}
    >
      {icon && (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};

export const AireBadge = Badge;
