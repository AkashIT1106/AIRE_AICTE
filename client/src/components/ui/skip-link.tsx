import * as React from "react";

export interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
}

export function SkipLink({
  href = "#main-content",
  children = "Skip to main content",
}: SkipLinkProps) {
  return (
    <a href={href} className="ux4g-skip-link skip-link">
      {children}
    </a>
  );
}
