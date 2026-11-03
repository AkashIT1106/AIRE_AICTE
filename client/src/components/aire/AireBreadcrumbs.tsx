import React from "react";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const AireBreadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = "",
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`ux4g-breadcrumb ux4g-breadcrumb-divider flex items-center gap-1.5 text-xs text-neutral-600 ${className}`}
    >
      <ol className="flex items-center gap-1.5 list-none p-0 m-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.current;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-semibold text-neutral-800 select-none"
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <a
                  href={item.href}
                  className="hover:text-brand-primary transition-colors underline-offset-2 hover:underline"
                >
                  {item.label}
                </a>
              ) : (
                <span>{item.label}</span>
              )}

              {!isLast && (
                <ChevronRight
                  className="w-3.5 h-3.5 text-neutral-300 shrink-0"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export const Breadcrumbs = AireBreadcrumbs;
