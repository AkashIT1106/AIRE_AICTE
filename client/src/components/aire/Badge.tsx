import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "neutral" | "lavender";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  className = "",
}) => {
  const variantStyles = {
    primary: "bg-[#F2EFFF] text-[#4A2BC2] border border-[#DCD4FF]",
    lavender: "bg-[#F4F1FD] text-[#3D239F] border border-[#C0B3FF]",
    success: "bg-[#F2FCEF] text-[#006C35] border border-[#BEEFB8]",
    warning: "bg-[#FFF5EA] text-[#A46800] border border-[#FFD9AF]",
    neutral: "bg-[#F5F5F5] text-[#404040] border border-[#E5E5E5]",
  };

  return (
    <span
      className={`ux4g-tag inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full tracking-wide ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
