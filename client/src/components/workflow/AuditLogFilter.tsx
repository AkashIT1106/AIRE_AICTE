import React from "react";
import { Search, RotateCcw, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface AuditLogFilterState {
  dateFrom?: string;
  dateTo?: string;
  action?: string;
  actorRole?: string;
  searchQuery?: string;
}

export interface AuditLogFilterProps {
  filters: AuditLogFilterState;
  onFilterChange: (filters: AuditLogFilterState) => void;
  onReset: () => void;
  className?: string;
}

export const AuditLogFilter: React.FC<AuditLogFilterProps> = ({
  filters,
  onFilterChange,
  onReset,
  className,
}) => {
  const handleQueryChange = (val: string) => {
    onFilterChange({ ...filters, searchQuery: val });
  };

  const handleActionChange = (val: string) => {
    onFilterChange({ ...filters, action: val === "ALL" ? undefined : val });
  };

  const handleRoleChange = (val: string) => {
    onFilterChange({ ...filters, actorRole: val === "ALL" ? undefined : val });
  };

  const handleDateFromChange = (val: string) => {
    onFilterChange({ ...filters, dateFrom: val || undefined });
  };

  const handleDateToChange = (val: string) => {
    onFilterChange({ ...filters, dateTo: val || undefined });
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-line-subtle bg-surface-card p-4 space-y-4 shadow-2xs",
        className,
      )}
      data-testid="audit-log-filter"
    >
      <div className="flex items-center justify-between border-b border-line-subtle pb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-txt-primary">
          <Filter className="h-4 w-4 text-brand-primary" aria-hidden="true" />
          <span>Statutory Audit Query Filters</span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-xs h-7 text-txt-muted hover:text-txt-primary gap-1"
        >
          <RotateCcw className="h-3 w-3" aria-hidden="true" />
          <span>Reset Filters</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Search query input */}
        <div className="lg:col-span-2 space-y-1">
          <Label
            htmlFor="audit-query"
            className="text-xs font-semibold text-txt-primary"
          >
            Correlation ID / Actor / Tenant
          </Label>
          <div className="relative">
            <Search
              className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-txt-muted"
              aria-hidden="true"
            />
            <Input
              id="audit-query"
              type="text"
              placeholder="e.g. corr_01HNY or dit.ac.in"
              value={filters.searchQuery || ""}
              onChange={(e) => handleQueryChange(e.target.value)}
              className="pl-8 h-8 text-xs border-line-default font-mono"
            />
          </div>
        </div>

        {/* Action filter */}
        <div className="space-y-1">
          <Label
            htmlFor="audit-action-select"
            className="text-xs font-semibold text-txt-primary"
          >
            Audit Action
          </Label>
          <Select
            value={filters.action || "ALL"}
            onValueChange={handleActionChange}
          >
            <SelectTrigger
              id="audit-action-select"
              className="h-8 text-xs border-line-default"
            >
              <SelectValue placeholder="All Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">
                All Actions
              </SelectItem>
              <SelectItem value="INGEST_BATCH" className="text-xs">
                Ingest Batch
              </SelectItem>
              <SelectItem value="REMEDIATE_RECORD" className="text-xs">
                Remediate Record
              </SelectItem>
              <SelectItem value="AUTH_LOGIN" className="text-xs">
                MFA Login
              </SelectItem>
              <SelectItem value="SEAL_COHORT" className="text-xs">
                Seal Cohort
              </SelectItem>
              <SelectItem value="ACCESS_DENIED" className="text-xs">
                Access Denied
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Role filter */}
        <div className="space-y-1">
          <Label
            htmlFor="audit-role-select"
            className="text-xs font-semibold text-txt-primary"
          >
            Actor Role
          </Label>
          <Select
            value={filters.actorRole || "ALL"}
            onValueChange={handleRoleChange}
          >
            <SelectTrigger
              id="audit-role-select"
              className="h-8 text-xs border-line-default"
            >
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">
                All Roles
              </SelectItem>
              <SelectItem value="INSTITUTION_ADMIN" className="text-xs">
                Institution Admin
              </SelectItem>
              <SelectItem value="AICTE_VERIFIER" className="text-xs">
                AICTE Verifier
              </SelectItem>
              <SelectItem value="AUDITOR" className="text-xs">
                Auditor
              </SelectItem>
              <SelectItem value="UNAUTHENTICATED" className="text-xs">
                Unauthenticated
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date From */}
        <div className="space-y-1">
          <Label
            htmlFor="audit-date-from"
            className="text-xs font-semibold text-txt-primary"
          >
            Date From
          </Label>
          <Input
            id="audit-date-from"
            type="date"
            value={filters.dateFrom || ""}
            onChange={(e) => handleDateFromChange(e.target.value)}
            className="h-8 text-xs border-line-default"
          />
        </div>

        {/* Date To */}
        <div className="space-y-1">
          <Label
            htmlFor="audit-date-to"
            className="text-xs font-semibold text-txt-primary"
          >
            Date To
          </Label>
          <Input
            id="audit-date-to"
            type="date"
            value={filters.dateTo || ""}
            onChange={(e) => handleDateToChange(e.target.value)}
            className="h-8 text-xs border-line-default"
          />
        </div>
      </div>
    </div>
  );
};

AuditLogFilter.displayName = "AuditLogFilter";
