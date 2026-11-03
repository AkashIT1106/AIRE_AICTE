import * as React from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, FolderX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  density?: "compact" | "standard";
  containerClassName?: string;
}

const TableContext = React.createContext<{ density: "compact" | "standard" }>({
  density: "compact",
});

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, density = "compact", ...props }, ref) => (
    <div
      className={cn(
        "ux4g-o-x-auto relative w-full overflow-x-auto rounded border border-line-default bg-surface-card",
        containerClassName,
      )}
      tabIndex={0}
      aria-label="Scrollable table container"
    >
      <TableContext.Provider value={{ density }}>
        <table
          ref={ref}
          className={cn(
            "ux4g-table w-full caption-bottom text-sm border-collapse",
            density === "compact" ? "table-compact" : "table-standard",
            className,
          )}
          {...props}
        />
      </TableContext.Provider>
    </div>
  ),
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "border-b border-line-default bg-surface-card-subdued text-txt-secondary",
      className,
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      "divide-y divide-line-default bg-surface-card text-txt-primary",
      className,
    )}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-line-default bg-surface-card-subdued font-medium text-txt-primary",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected, ...props }, ref) => (
    <tr
      ref={ref}
      aria-selected={selected ? "true" : undefined}
      className={cn(
        "transition-colors hover:bg-surface-card-subdued",
        selected && "bg-brand-subtle hover:bg-brand-subtle",
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | false;
  onSort?: () => void;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, sortable, sortDirection, onSort, ...props }, ref) => {
    const { density } = React.useContext(TableContext);

    return (
      <th
        ref={ref}
        scope="col"
        aria-sort={
          sortDirection === "asc"
            ? "ascending"
            : sortDirection === "desc"
              ? "descending"
              : undefined
        }
        className={cn(
          "text-left font-semibold text-txt-secondary align-middle px-3 text-xs tracking-wider uppercase",
          density === "compact" ? "h-9 py-1" : "h-11 py-2",
          className,
        )}
        {...props}
      >
        {sortable ? (
          <button
            type="button"
            onClick={onSort}
            className="group inline-flex items-center gap-1.5 font-semibold text-txt-secondary hover:text-txt-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded py-0.5 px-1 -ml-1 transition-colors"
          >
            <span>{children}</span>
            {sortDirection === "asc" ? (
              <ChevronUp
                className="h-3.5 w-3.5 text-brand-primary"
                aria-hidden="true"
              />
            ) : sortDirection === "desc" ? (
              <ChevronDown
                className="h-3.5 w-3.5 text-brand-primary"
                aria-hidden="true"
              />
            ) : (
              <ChevronsUpDown
                className="h-3.5 w-3.5 text-txt-muted opacity-60 group-hover:opacity-100"
                aria-hidden="true"
              />
            )}
            <span className="sr-only">
              {sortDirection === "asc"
                ? "sorted ascending, click to sort descending"
                : sortDirection === "desc"
                  ? "sorted descending, click to clear sort"
                  : "click to sort"}
            </span>
          </button>
        ) : (
          children
        )}
      </th>
    );
  },
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { density } = React.useContext(TableContext);

  return (
    <td
      ref={ref}
      className={cn(
        "px-3 align-middle text-txt-primary",
        density === "compact"
          ? "h-9 py-1 text-[13px] leading-[18px]"
          : "h-11 py-2 text-sm leading-5",
        className,
      )}
      {...props}
    />
  );
});
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      "mt-3 text-xs text-txt-muted italic text-left px-3 pb-2",
      className,
    )}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export interface TableEmptyProps extends React.HTMLAttributes<HTMLTableRowElement> {
  colSpan: number;
  message?: React.ReactNode;
  icon?: React.ReactNode;
}

const TableEmpty: React.FC<TableEmptyProps> = ({
  colSpan,
  message = "No records found.",
  icon,
  className,
  ...props
}) => (
  <tr className={cn("hover:bg-transparent", className)} {...props}>
    <td colSpan={colSpan} className="py-10 text-center text-sm text-txt-muted">
      <div className="flex flex-col items-center justify-center space-y-2">
        {icon ? (
          icon
        ) : (
          <FolderX
            className="h-8 w-8 text-txt-muted/60 stroke-[1.5]"
            aria-hidden="true"
          />
        )}
        <p className="max-w-sm">{message}</p>
      </div>
    </td>
  </tr>
);
TableEmpty.displayName = "TableEmpty";

export interface TableSkeletonProps extends React.HTMLAttributes<HTMLTableRowElement> {
  rows?: number;
  columns?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className,
  ...props
}) => (
  <>
    {Array.from({ length: rows }).map((_, rIdx) => (
      <tr
        key={rIdx}
        className={cn("hover:bg-transparent", className)}
        {...props}
      >
        {Array.from({ length: columns }).map((_, cIdx) => (
          <td key={cIdx} className="px-3 py-2">
            <Skeleton className="h-4 w-full" />
          </td>
        ))}
      </tr>
    ))}
  </>
);
TableSkeleton.displayName = "TableSkeleton";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableEmpty,
  TableSkeleton,
};
