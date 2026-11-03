import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline-primary" | "secondary" | "text";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  asAnchor?: boolean;
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  asAnchor = false,
  href,
  ...props
}) => {
  const variantClassMap = {
    primary: "ux4g-btn-primary bg-[#1D4ED8] hover:bg-[#1E40AF] text-white shadow-xs",
    "outline-primary":
      "ux4g-btn-outline-primary border border-[#2563EB] text-[#2563EB] hover:bg-[#EFF6FF]",
    secondary: "ux4g-btn-outline-neutral border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC]",
    text: "ux4g-btn-text-primary text-[#2563EB] hover:bg-[#EFF6FF]",
  };

  const sizeClassMap = {
    sm: "px-3.5 py-1.5 text-xs min-h-[36px]",
    md: "px-4.5 py-2 text-sm min-h-[44px]",
    lg: "px-6 py-2.5 text-base min-h-[48px]",
  };

  const baseClasses =
    "ux4g-btn inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed";

  const combinedClasses = `${baseClasses} ${variantClassMap[variant]} ${sizeClassMap[size]} ${className}`;

  if (asAnchor && href) {
    return (
      <a href={href} className={combinedClasses} role="button">
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
