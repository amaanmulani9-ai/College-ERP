import React from "react";
import { AlertCircle, Database, SearchX, RefreshCw } from "lucide-react";
import { Button } from "../Button";

// ─── Cell & Row Skeletons ──────────────────────────────────────────────────
export const CellSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`h-4 bg-slate-800/80 rounded animate-pulse w-full ${className}`} />
);

export interface RowSkeletonProps {
  columns?: number;
  className?: string;
}

export const RowSkeleton: React.FC<RowSkeletonProps> = ({ columns = 5, className = "" }) => (
  <tr className={`border-b border-slate-800/60 ${className}`}>
    {Array.from({ length: columns }).map((_, idx) => (
      <td key={idx} className="p-3.5">
        <CellSkeleton className={idx === 0 ? "w-3/4" : "w-1/2"} />
      </td>
    ))}
  </tr>
);

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 5 }) => (
  <tbody className="divide-y divide-slate-800/60">
    {Array.from({ length: rows }).map((_, idx) => (
      <RowSkeleton key={idx} columns={columns} />
    ))}
  </tbody>
);

// ─── EmptyState ────────────────────────────────────────────────────────────
export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Data Available",
  description = "There are no records to display at this time.",
  icon = <Database className="w-10 h-10 text-indigo-400" />,
  actionLabel,
  onAction,
  className = "",
}) => {
  return (
    <div
      className={`p-12 text-center flex flex-col items-center justify-center space-y-3 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl ${className}`}
    >
      <div className="p-4 rounded-2xl bg-indigo-950/80 border border-indigo-800/80 shadow-inner">
        {icon}
      </div>
      <h4 className="text-base font-bold text-white">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

// ─── NoResultsState ────────────────────────────────────────────────────────
export interface NoResultsStateProps {
  searchQuery?: string;
  onResetFilters?: () => void;
}

export const NoResultsState: React.FC<NoResultsStateProps> = ({
  searchQuery,
  onResetFilters,
}) => {
  return (
    <EmptyState
      icon={<SearchX className="w-10 h-10 text-slate-400" />}
      title="No Matching Results"
      description={
        searchQuery
          ? `No records match "${searchQuery}". Try broadening your search or resetting filters.`
          : "No records match the current filter criteria."
      }
      actionLabel={onResetFilters ? "Reset Filters" : undefined}
      onAction={onResetFilters}
    />
  );
};

// ─── ErrorState ────────────────────────────────────────────────────────────
export interface ErrorStateProps {
  title?: string;
  errorMessage?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Failed to Load Data",
  errorMessage = "An unexpected network or server error occurred while retrieving records.",
  onRetry,
}) => {
  return (
    <EmptyState
      icon={<AlertCircle className="w-10 h-10 text-red-400" />}
      title={title}
      description={errorMessage}
      actionLabel={onRetry ? "Retry Request" : undefined}
      onAction={onRetry}
    />
  );
};
