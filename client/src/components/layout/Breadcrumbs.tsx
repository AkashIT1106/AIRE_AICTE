import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Generate deterministic items based on route path
  const items: BreadcrumbItem[] = [];

  if (pathnames.length === 0) {
    items.push({ label: "Portal Home" });
  } else {
    // Root workspace
    const workspace = pathnames[0];
    if (workspace === "institution") {
      items.push({ label: "Institution", href: "/institution/dashboard" });
    } else if (workspace === "aicte") {
      items.push({ label: "AICTE Regulatory", href: "/aicte/overview" });
    } else if (workspace === "student") {
      items.push({ label: "Student Portal", href: "/student/record" });
    } else if (workspace === "auditor") {
      items.push({ label: "Auditor", href: "/auditor/logs" });
    } else if (workspace === "design-system") {
      items.push({ label: "Design System", href: "/design-system" });
    } else {
      items.push({
        label: workspace.charAt(0).toUpperCase() + workspace.slice(1),
      });
    }

    // Sub-segments
    if (pathnames.length > 1) {
      if (pathnames[1] === "dashboard") {
        items.push({ label: "Dashboard" });
      } else if (pathnames[1] === "submissions") {
        if (pathnames.length === 2) {
          items.push({ label: "Submissions" });
        } else {
          items.push({
            label: "Submissions",
            href: "/institution/submissions",
          });
          if (pathnames[2] === "new") {
            items.push({ label: "Upload Batch" });
          } else {
            const batchId = pathnames[2];
            const shortId =
              batchId.length > 12 ? `${batchId.slice(0, 8)}...` : batchId;
            items.push({ label: `Batch #${shortId}` });
          }
        }
      } else if (pathnames[1] === "overview") {
        items.push({ label: "Overview" });
      } else if (pathnames[1] === "scrutiny") {
        items.push({ label: "Scrutiny Hub" });
      } else if (pathnames[1] === "record") {
        items.push({ label: "Entitlement Record" });
      } else if (pathnames[1] === "logs") {
        items.push({ label: "Audit Logs" });
      } else {
        const seg = pathnames[1];
        items.push({ label: seg.charAt(0).toUpperCase() + seg.slice(1) });
      }
    }
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="h-9 px-4 md:px-8 border-b border-[var(--border-default)] bg-[var(--surface-card)] flex items-center text-xs text-[var(--text-muted)] select-none"
    >
      <ol className="flex items-center space-x-1.5 overflow-hidden">
        <li className="flex items-center">
          <Link
            to="/"
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-aire rounded p-0.5"
            aria-label="Home"
          >
            <Home className="h-3.5 w-3.5" />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const truncatedLabel =
            item.label.length > 24
              ? `${item.label.slice(0, 22)}...`
              : item.label;

          return (
            <React.Fragment key={index}>
              <li className="text-[var(--border-strong)] opacity-60">
                <ChevronRight className="h-3 w-3" />
              </li>
              <li className="flex items-center">
                {isLast || !item.href ? (
                  <span
                    className="font-semibold text-[var(--text-primary)] truncate max-w-[200px]"
                    title={item.label}
                    aria-current="page"
                  >
                    {truncatedLabel}
                  </span>
                ) : (
                  <Link
                    to={item.href}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:underline transition-colors truncate max-w-[160px] focus-aire rounded"
                    title={item.label}
                  >
                    {truncatedLabel}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
