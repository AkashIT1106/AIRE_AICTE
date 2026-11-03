import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "outline-primary"
    | "secondary"
    | "outline-neutral"
    | "tonal-primary"
    | "text-primary"
    | "text"
    | "danger";
  size?: "xs" | "sm" | "s" | "md" | "m" | "lg" | "l" | "xl";
  children: React.ReactNode;
  asAnchor?: boolean;
  href?: string;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  asAnchor = false,
  href,
  disabled,
  loading = false,
  icon,
  ...props
}) => {
  // Normalize sizes to official UX4G 3.0 button size classes: ux4g-btn-xs, ux4g-btn-s, ux4g-btn-m, ux4g-btn-l, ux4g-btn-xl
  const normalizedSize = (() => {
    switch (size) {
      case "xs":
        return "ux4g-btn-xs min-h-[32px] text-xs px-2.5 py-1";
      case "sm":
      case "s":
        return "ux4g-btn-s min-h-[36px] text-xs px-3.5 py-1.5";
      case "lg":
      case "l":
        return "ux4g-btn-l min-h-[48px] text-base px-6 py-2.5";
      case "xl":
        return "ux4g-btn-xl min-h-[52px] text-lg px-7 py-3";
      case "md":
      case "m":
      default:
        // Default button size: satisfies WCAG 2.2 AA / GIGW 3.0 44px target
        return "ux4g-btn-m min-h-[44px] text-sm px-4.5 py-2";
    }
  })();

  // Official UX4G 3.0 button variants
  const variantClassMap: Record<string, string> = {
    primary:
      "ux4g-btn-primary bg-brand-primary text-neutral-0 hover:bg-brand-900 border border-transparent shadow-xs",
    "outline-primary":
      "ux4g-btn-outline-primary border border-brand-primary text-brand-primary bg-neutral-0 hover:bg-brand-50",
    secondary:
      "ux4g-btn-outline-neutral border border-neutral-200 text-neutral-800 bg-neutral-0 hover:bg-neutral-100",
    "outline-neutral":
      "ux4g-btn-outline-neutral border border-neutral-200 text-neutral-800 bg-neutral-0 hover:bg-neutral-100",
    "tonal-primary":
      "ux4g-btn-tonal-primary bg-brand-50 text-brand-primary hover:bg-brand-100 border border-transparent",
    "text-primary":
      "ux4g-btn-text-primary text-brand-primary hover:bg-brand-50 border-0 bg-transparent",
    text:
      "ux4g-btn-text-primary text-brand-primary hover:bg-brand-50 border-0 bg-transparent",
    danger:
      "ux4g-btn-danger bg-state-error text-neutral-0 hover:opacity-90 border border-transparent",
  };

  const selectedVariantClass = variantClassMap[variant] || variantClassMap.primary;

  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-medium rounded-control transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const combinedClasses = `${baseClasses} ${selectedVariantClass} ${normalizedSize} ${className}`.trim();

  if (asAnchor && href) {
    return (
      <a
        href={href}
        className={combinedClasses}
        role="button"
        aria-disabled={disabled}
      >
        {loading && <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" aria-hidden="true" />}
        {icon && <span aria-hidden="true">{icon}</span>}
        {children}
      </a>
    );
  }

  return (
    <button
      className={combinedClasses}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" aria-hidden="true" />}
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
};

export const AireButton = Button;
