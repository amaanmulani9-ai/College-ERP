import React, { useState } from "react";
import {
  Search,
  Download,
  Filter,
  Columns,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  FileSpreadsheet,
  FileText,
  Printer,
} from "lucide-react";
import { Button } from "../Button";

// ─── TableSearch ───────────────────────────────────────────────────────────
export interface TableSearchProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const TableSearch: React.FC<TableSearchProps> = ({
  value,
  onChange,
  placeholder = "Search records...",
}) => (
  <div className="relative flex-1 min-w-[200px] max-w-xs">
    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-900/90 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
    />
    {value && (
      <button
        onClick={() => onChange("")}
        className="absolute right-2.5 top-2 text-slate-500 hover:text-white"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);

// ─── TablePagination ───────────────────────────────────────────────────────
export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}) => {
  const startRec = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRec = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-800/80 bg-slate-950 text-xs text-slate-400">
      {/* Records Count & Page Size */}
      <div className="flex items-center gap-4">
        <span>
          Showing <strong className="text-white font-mono">{startRec}</strong> to{" "}
          <strong className="text-white font-mono">{endRec}</strong> of{" "}
          <strong className="text-white font-mono">{totalRecords}</strong> entries
        </span>
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 rounded-lg text-white text-xs px-2 py-1 font-mono focus:outline-none"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page Navigation Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3 py-1 font-mono font-bold text-white bg-slate-900 border border-slate-800 rounded-lg">
          {currentPage} / {Math.max(1, totalPages)}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ─── TableExport (Placeholder UI) ──────────────────────────────────────────
export interface TableExportProps {
  onExportCSV?: () => void;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
  onPrint?: () => void;
}

export const TableExport: React.FC<TableExportProps> = ({
  onExportCSV = () => alert("Exporting to CSV..."),
  onExportExcel = () => alert("Exporting to Excel..."),
  onExportPDF = () => alert("Exporting to PDF..."),
  onPrint = () => window.print(),
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<Download className="w-3.5 h-3.5" />}
        onClick={() => setIsOpen(!isOpen)}
      >
        Export
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 p-1 space-y-0.5">
          <button
            onClick={() => {
              onExportCSV();
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-white rounded-lg flex items-center gap-2"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" /> Export CSV
          </button>
          <button
            onClick={() => {
              onExportExcel();
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-white rounded-lg flex items-center gap-2"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Export Excel
          </button>
          <button
            onClick={() => {
              onExportPDF();
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-white rounded-lg flex items-center gap-2"
          >
            <FileText className="w-3.5 h-3.5 text-red-400" /> Export PDF
          </button>
          <button
            onClick={() => {
              onPrint();
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-white rounded-lg flex items-center gap-2 border-t border-slate-900 pt-1"
          >
            <Printer className="w-3.5 h-3.5 text-sky-400" /> Print Table
          </button>
        </div>
      )}
    </div>
  );
};

// ─── TableColumnSelector ───────────────────────────────────────────────────
export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
}

export interface TableColumnSelectorProps {
  columns: ColumnConfig[];
  onToggle: (key: string) => void;
}

export const TableColumnSelector: React.FC<TableColumnSelectorProps> = ({
  columns,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<Columns className="w-3.5 h-3.5" />}
        onClick={() => setIsOpen(!isOpen)}
      >
        Columns
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 p-2 space-y-1 max-h-56 overflow-y-auto">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase px-2">
            Toggle Columns
          </span>
          {columns.map((col) => (
            <label
              key={col.key}
              className="flex items-center gap-2 px-2 py-1 text-xs text-slate-300 hover:text-white cursor-pointer select-none rounded hover:bg-slate-900"
            >
              <input
                type="checkbox"
                checked={col.visible}
                onChange={() => onToggle(col.key)}
                className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-0"
              />
              <span className="truncate">{col.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── BulkActionsBar ────────────────────────────────────────────────────────
export interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDeleteSelected?: () => void;
  onExportSelected?: () => void;
  children?: React.ReactNode;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onClearSelection,
  onDeleteSelected,
  onExportSelected,
  children,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="p-3 px-4 bg-indigo-950/90 border border-indigo-800 rounded-2xl flex items-center justify-between gap-4 text-xs shadow-lg animate-fade-in">
      <div className="flex items-center gap-2 text-indigo-200 font-semibold">
        <span className="px-2 py-0.5 bg-indigo-900 text-white rounded-md font-mono font-bold">
          {selectedCount}
        </span>
        <span>items selected</span>
      </div>

      <div className="flex items-center gap-2">
        {children}
        {onExportSelected && (
          <Button variant="ghost" size="xs" onClick={onExportSelected}>
            Export Selected
          </Button>
        )}
        {onDeleteSelected && (
          <Button variant="danger" size="xs" onClick={onDeleteSelected}>
            Delete Selected
          </Button>
        )}
        <button
          onClick={onClearSelection}
          className="text-slate-400 hover:text-white p-1"
          title="Clear Selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ─── TableToolbar ──────────────────────────────────────────────────────────
export interface TableToolbarProps {
  searchValue: string;
  onSearchChange: (val: string) => void;
  columns?: ColumnConfig[];
  onColumnToggle?: (key: string) => void;
  onRefresh?: () => void;
  onResetFilters?: () => void;
  children?: React.ReactNode;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  searchValue,
  onSearchChange,
  columns,
  onColumnToggle,
  onRefresh,
  onResetFilters,
  children,
}) => {
  return (
    <div className="p-4 border-b border-slate-800/80 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
      <TableSearch value={searchValue} onChange={onSearchChange} />

      <div className="flex items-center gap-2">
        {children}

        {onResetFilters && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={onResetFilters}
            title="Reset All Filters"
          >
            Reset
          </Button>
        )}

        {columns && onColumnToggle && (
          <TableColumnSelector columns={columns} onToggle={onColumnToggle} />
        )}

        <TableExport />

        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={onRefresh}
            aria-label="Refresh Table Data"
          />
        )}
      </div>
    </div>
  );
};

export const TableFilters = TableToolbar;
