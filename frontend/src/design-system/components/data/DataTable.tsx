import React, { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronRight, ChevronDown } from "lucide-react";
import { TableToolbar, TablePagination, ColumnConfig, BulkActionsBar } from "./TableControls";
import { TableSkeleton, NoResultsState, ErrorState, EmptyState } from "./States";

export interface ColumnDef<T> {
  key: string;
  header: string;
  accessor?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
  visible?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (row: T) => string | number;
  title?: string;
  subtitle?: string;

  // Sorting
  defaultSortKey?: string;
  defaultSortDir?: "asc" | "desc";

  // Selection
  selectable?: boolean;
  selectedKeys?: (string | number)[];
  onSelectionChange?: (keys: (string | number)[]) => void;

  // Expandable Detail
  renderDetail?: (row: T) => React.ReactNode;

  // States
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;

  // Pagination (Server or Client)
  isServerSide?: boolean;
  totalRecords?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;

  // Additional Actions
  toolbarActions?: React.ReactNode;
  bulkActions?: (selectedRows: T[]) => React.ReactNode;
  onRowClick?: (row: T) => void;
  density?: "comfortable" | "compact";
  className?: string;
}

export function DataTable<T>({
  data,
  columns: initialColumns,
  keyExtractor,
  title,
  subtitle,
  defaultSortKey,
  defaultSortDir = "asc",
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  renderDetail,
  isLoading = false,
  error,
  onRetry,
  isServerSide = false,
  totalRecords: externalTotalRecords,
  currentPage: externalPage = 1,
  pageSize: externalPageSize = 10,
  onPageChange: externalOnPageChange,
  onPageSizeChange: externalOnPageSizeChange,
  toolbarActions,
  bulkActions,
  onRowClick,
  density = "comfortable",
  className = "",
}: DataTableProps<T>) {
  // State
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSortDir);
  const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>([]);
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(10);

  const [colConfigs, setColConfigs] = useState<ColumnConfig[]>(() =>
    initialColumns.map((c) => ({
      key: c.key,
      label: c.header,
      visible: c.visible ?? true,
    }))
  );

  const activeColumns = useMemo(
    () =>
      initialColumns.filter((c) => {
        const cfg = colConfigs.find((cg) => cg.key === c.key);
        return cfg ? cfg.visible : true;
      }),
    [initialColumns, colConfigs]
  );

  // Client-Side Search
  const searchedData = useMemo(() => {
    if (isServerSide || !search) return data;
    const lower = search.toLowerCase();
    return data.filter((row) =>
      Object.values(row as Record<string, unknown>).some((val) =>
        String(val ?? "").toLowerCase().includes(lower)
      )
    );
  }, [data, search, isServerSide]);

  // Client-Side Sort
  const sortedData = useMemo(() => {
    if (isServerSide || !sortKey) return searchedData;
    return [...searchedData].sort((a, b) => {
      const valA = (a as Record<string, unknown>)[sortKey];
      const valB = (b as Record<string, unknown>)[sortKey];
      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      return sortDir === "asc" ? 1 : -1;
    });
  }, [searchedData, sortKey, sortDir, isServerSide]);

  // Pagination Values
  const currentPage = isServerSide ? externalPage : internalPage;
  const pageSize = isServerSide ? externalPageSize : internalPageSize;
  const totalRecords = isServerSide ? externalTotalRecords ?? data.length : sortedData.length;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const paginatedData = useMemo(() => {
    if (isServerSide) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, isServerSide]);

  // Handle Sort Toggle
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else {
        setSortKey(undefined);
        setSortDir("asc");
      }
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // Selection Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allKeys = paginatedData.map(keyExtractor);
      onSelectionChange?.(allKeys);
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (key: string | number) => {
    const exists = selectedKeys.includes(key);
    const updated = exists ? selectedKeys.filter((k) => k !== key) : [...selectedKeys, key];
    onSelectionChange?.(updated);
  };

  const toggleExpandRow = (key: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const selectedRows = useMemo(
    () => data.filter((r) => selectedKeys.includes(keyExtractor(r))),
    [data, selectedKeys, keyExtractor]
  );

  const allPaginatedSelected =
    paginatedData.length > 0 &&
    paginatedData.every((r) => selectedKeys.includes(keyExtractor(r)));

  return (
    <div className={`space-y-4 font-sans ${className}`}>
      {/* Header Title */}
      {(title || subtitle) && (
        <div>
          {title && <h3 className="text-lg font-extrabold text-white tracking-tight">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
      )}

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedKeys.length}
        onClearSelection={() => onSelectionChange?.([])}
      >
        {bulkActions?.(selectedRows)}
      </BulkActionsBar>

      {/* Main Container */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {/* Table Toolbar */}
        <TableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          columns={colConfigs}
          onColumnToggle={(key) =>
            setColConfigs((prev) =>
              prev.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c))
            )
          }
          onResetFilters={() => setSearch("")}
        >
          {toolbarActions}
        </TableToolbar>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            {/* Header */}
            <thead className="bg-slate-900/90 text-slate-400 font-mono border-b border-slate-800 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                {renderDetail && <th className="p-3.5 w-10" />}
                {selectable && (
                  <th className="p-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={allPaginatedSelected}
                      onChange={handleSelectAll}
                      className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-0"
                    />
                  </th>
                )}
                {activeColumns.map((col) => (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={`p-3.5 font-semibold text-${col.align || "left"} ${
                      col.sortable !== false ? "cursor-pointer select-none hover:text-white" : ""
                    }`}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable !== false && (
                        <span className="text-slate-500">
                          {sortKey === col.key ? (
                            sortDir === "asc" ? (
                              <ArrowUp className="w-3.5 h-3.5 text-indigo-400" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-indigo-400" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body / Loading / Error / Empty */}
            {isLoading ? (
              <TableSkeleton rows={pageSize} columns={activeColumns.length + (selectable ? 1 : 0)} />
            ) : error ? (
              <tbody>
                <tr>
                  <td colSpan={activeColumns.length + 2} className="p-6">
                    <ErrorState errorMessage={error} onRetry={onRetry} />
                  </td>
                </tr>
              </tbody>
            ) : paginatedData.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={activeColumns.length + 2} className="p-6">
                    {search ? (
                      <NoResultsState searchQuery={search} onResetFilters={() => setSearch("")} />
                    ) : (
                      <EmptyState />
                    )}
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {paginatedData.map((row) => {
                  const key = keyExtractor(row);
                  const isSelected = selectedKeys.includes(key);
                  const isExpanded = expandedKeys.includes(key);

                  return (
                    <React.Fragment key={key}>
                      <tr
                        onClick={() => onRowClick?.(row)}
                        className={`transition-colors ${
                          density === "compact" ? "py-2" : "py-3.5"
                        } ${
                          isSelected
                            ? "bg-indigo-950/40 border-l-2 border-l-indigo-500"
                            : "hover:bg-slate-900/50"
                        } ${onRowClick ? "cursor-pointer" : ""}`}
                      >
                        {renderDetail && (
                          <td className="p-3.5 w-10">
                            <button
                              type="button"
                              onClick={(e) => toggleExpandRow(key, e)}
                              className="text-slate-400 hover:text-white p-0.5 rounded"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-indigo-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        )}

                        {selectable && (
                          <td className="p-3.5 w-10" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectRow(key)}
                              className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-0"
                            />
                          </td>
                        )}

                        {activeColumns.map((col) => (
                          <td key={col.key} className={`p-3.5 text-${col.align || "left"}`}>
                            {col.accessor
                              ? col.accessor(row)
                              : String((row as Record<string, unknown>)[col.key] ?? "")}
                          </td>
                        ))}
                      </tr>

                      {/* Expanded Row Detail */}
                      {renderDetail && isExpanded && (
                        <tr className="bg-slate-900/90 border-b border-slate-800">
                          <td colSpan={activeColumns.length + 2} className="p-4 pl-12">
                            {renderDetail(row)}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>

        {/* Table Pagination */}
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          pageSize={pageSize}
          onPageChange={isServerSide ? externalOnPageChange! : setInternalPage}
          onPageSizeChange={isServerSide ? externalOnPageSizeChange : setInternalPageSize}
        />
      </div>
    </div>
  );
}

// ─── DataGrid (Card View Container) ────────────────────────────────────────
export interface DataGridProps<T> {
  data: T[];
  keyExtractor: (item: T) => string | number;
  renderCard: (item: T) => React.ReactNode;
  title?: string;
  columns?: 1 | 2 | 3 | 4;
}

export function DataGrid<T>({
  data,
  keyExtractor,
  renderCard,
  title,
  columns = 3,
}: DataGridProps<T>) {
  const gridCols =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
      ? "grid-cols-1 md:grid-cols-2"
      : columns === 3
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";

  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-extrabold text-white">{title}</h3>}
      <div className={`grid ${gridCols} gap-4`}>
        {data.map((item) => (
          <React.Fragment key={keyExtractor(item)}>{renderCard(item)}</React.Fragment>
        ))}
      </div>
    </div>
  );
}
