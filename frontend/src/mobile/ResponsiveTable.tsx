import React, { useState } from "react";
import { Search, SlidersHorizontal, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useResponsive } from "./ResponsiveContext";

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

export interface ResponsiveTableProps<T extends Record<string, any>> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  searchKey?: string;
}

export function ResponsiveTable<T extends Record<string, any>>({
  data,
  columns,
  title = "Data Records",
  searchKey = "name",
}: ResponsiveTableProps<T>) {
  const { device } = useResponsive();
  const [query, setQuery] = useState("");

  const filtered = data.filter((row) => {
    if (!query) return true;
    const val = row[searchKey];
    return val ? String(val).toLowerCase().includes(query.toLowerCase()) : true;
  });

  return (
    <div className="space-y-3 text-xs font-sans">
      {/* Table Header & Search */}
      <div className="flex items-center justify-between gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl">
        <h3 className="font-bold text-slate-100 text-xs truncate">{title}</h3>
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search records…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Card Mode (Phone Viewports) */}
      {device.isPhone ? (
        <div className="space-y-2">
          {filtered.map((row, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 active:bg-slate-800/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-100 text-[11px]">
                  {row[columns[0]?.key] ?? `Record #${idx + 1}`}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                {columns.slice(1).map((col) => (
                  <div key={col.key}>
                    <p className="text-slate-500 font-mono uppercase text-[9px]">{col.header}</p>
                    <div className="text-slate-300 font-medium mt-0.5 truncate">
                      {col.render ? col.render(row) : String(row[col.key] ?? "—")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-xl text-center text-slate-500">
              No matching records found.
            </div>
          )}
        </div>
      ) : (
        /* Standard Table Mode (Tablet & Desktop) */
        <div className="border border-slate-800 rounded-xl overflow-x-auto bg-slate-900">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono uppercase text-[9px]">
                {columns.map((col) => (
                  <th key={col.key} className="p-3 font-bold">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filtered.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="p-3 font-medium">
                      {col.render ? col.render(row) : String(row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
