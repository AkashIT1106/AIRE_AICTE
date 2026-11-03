import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "solid" | "outline" | "glass";
  children: React.ReactNode;
  className?: string;
}

export const AireCard: React.FC<CardProps> = ({
  variant = "solid",
  children,
  className = "",
  ...props
}) => {
  const variantStyles = {
    solid: "bg-neutral-0 border border-neutral-200 shadow-xs",
    outline: "bg-transparent border border-neutral-200",
    glass: "aire-glass-panel", // Controlled glass layer per design.md §7
  };

  return (
    <div
      className={`ux4g-card ux4g-card-vertical rounded-card overflow-hidden transition-all duration-150 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const AireCardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`ux4g-card-header px-5 py-4 border-b border-neutral-150 flex items-center justify-between gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const AireCardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <h3
      className={`ux4g-card-title text-base font-semibold text-neutral-800 m-0 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

export const AireCardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`ux4g-card-body p-5 text-sm text-neutral-600 leading-relaxed ${className}`} {...props}>
      {children}
    </div>
  );
};

export const AireCardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`ux4g-card-footer px-5 py-3.5 bg-neutral-50 border-t border-neutral-150 flex items-center justify-between gap-3 text-xs ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const Card = AireCard;
export const CardHeader = AireCardHeader;
export const CardTitle = AireCardTitle;
export const CardBody = AireCardBody;
export const CardFooter = AireCardFooter;
