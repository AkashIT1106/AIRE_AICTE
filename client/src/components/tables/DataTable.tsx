/**
 * DataTable — generic enterprise data table with pagination, sorting, and search.
 */

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { clsx } from "clsx";
import { LoadingState } from "@/components/feedback/LoadingState";
import { EmptyState } from "@/components/feedback/EmptyState";

export interface Column<T> {
  header: string;
  accessor: keyof T | string;
  cell?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  searchPlaceholder?: string;
  /** Filter function applied to searchQuery against each row */
  searchFilter?: (row: T, query: string) => boolean;
  className?: string;
}

type SortDir = "asc" | "desc" | null;

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

function getNestedValue(obj: object, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function DataTable<T extends object>({
  columns,
  data,
  isLoading = false,
  emptyTitle = "No records found",
  emptyDescription = "There are no records to display.",
  searchPlaceholder = "Search…",
  searchFilter,
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<10 | 20 | 50>(10);

  // Filter
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return data;
    if (searchFilter) return data.filter((row) => searchFilter(row, searchQuery));
    // Default: match any string value across columns
    const q = searchQuery.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const val = getNestedValue(row, String(col.accessor));
        return String(val ?? "").toLowerCase().includes(q);
      }),
    );
  }, [data, searchQuery, searchFilter, columns]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortCol || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = getNestedValue(a, sortCol);
      const bv = getNestedValue(b, sortCol);
      const aStr = String(av ?? "");
      const bStr = String(bv ?? "");
      const cmp = aStr.localeCompare(bStr, undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortCol, sortDir]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  function handleSort(col: Column<T>) {
    if (!col.sortable) return;
    const key = String(col.accessor);
    if (sortCol === key) {
      setSortDir(sortDir === "asc" ? "desc" : sortDir === "desc" ? null : "asc");
      if (sortDir === "desc") setSortCol(null);
    } else {
      setSortCol(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
    setPage(1);
  }

  function handlePageSize(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = Number(e.target.value) as 10 | 20 | 50;
    setPageSize(val);
    setPage(1);
  }

  return (
    <div className={clsx("flex flex-col gap-3 font-sans", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-600" />
          <input
            type="search"
            value={searchQuery}
            onChange={handleSearch}
            placeholder={searchPlaceholder}
            className="w-full rounded-control border border-neutral-200 bg-neutral-0 py-1.5 pl-8 pr-3 text-sm text-neutral-800 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-0"
          />
        </div>
        <span className="ml-auto text-xs text-neutral-600">
          {sorted.length} record{sorted.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-card border border-neutral-150 bg-neutral-0">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-150 bg-neutral-50">
              {columns.map((col) => {
                const key = String(col.accessor);
                const isSorted = sortCol === key;
                return (
                  <th
                    key={key}
                    scope="col"
                    onClick={() => handleSort(col)}
                    className={clsx(
                      "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-600",
                      col.sortable && "cursor-pointer select-none hover:text-neutral-800",
                      col.className,
                    )}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {col.sortable && (
                        <span className="text-neutral-300">
                          {isSorted && sortDir === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5 text-brand-primary" />
                          ) : isSorted && sortDir === "desc" ? (
                            <ChevronDown className="h-3.5 w-3.5 text-brand-primary" />
                          ) : (
                            <ChevronsUpDown className="h-3.5 w-3.5" />
                          )}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-150">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length}>
                  <LoadingState className="py-10" />
                </td>
              </tr>
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    className="py-10"
                  />
                </td>
              </tr>
            ) : (
              pageData.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-neutral-25 transition-colors"
                >
                  {columns.map((col) => {
                    const key = String(col.accessor);
                    const rawValue = getNestedValue(row, key);
                    return (
                      <td
                        key={key}
                        className={clsx(
                          "px-4 py-3 text-sm text-neutral-800",
                          col.className,
                        )}
                      >
                        {col.cell ? col.cell(row, rowIdx) : String(rawValue ?? "—")}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-4 text-sm text-neutral-600">
        <div className="flex items-center gap-2">
          <label htmlFor="page-size" className="text-xs">
            Rows per page:
          </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={handlePageSize}
            className="rounded-control border border-neutral-200 bg-neutral-0 px-2 py-1 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            {PAGE_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex h-7 w-7 items-center justify-center rounded-control border border-neutral-200 bg-neutral-0 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex h-7 w-7 items-center justify-center rounded-control border border-neutral-200 bg-neutral-0 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
