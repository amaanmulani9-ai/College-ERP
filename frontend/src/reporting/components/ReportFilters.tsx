import React, { useState } from "react";
import { Filter, Save, RotateCcw } from "lucide-react";
import { ReportItem } from "../types";
import { useReporting } from "../ReportingContext";
import { DateRangePicker } from "./DateRangePicker";

interface ReportFiltersProps {
  report: ReportItem;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({ report }) => {
  const {
    activeFilters,
    setActiveFilters,
    saveFilter,
    dateRange,
    setDateRange,
  } = useReporting();

  const [presetName, setPresetName] = useState("");
  const [isSavingPreset, setIsSavingPreset] = useState(false);

  const handleFilterChange = (paramId: string, value: any) => {
    setActiveFilters((prev) => ({
      ...prev,
      [paramId]: value,
    }));
  };

  const handleResetFilters = () => {
    setActiveFilters({});
  };

  const handleSavePresetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetName.trim()) return;

    saveFilter({
      reportId: report.id,
      reportTitle: report.title,
      name: presetName.trim(),
      parameters: activeFilters,
    });
    setPresetName("");
    setIsSavingPreset(false);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 mb-6 shadow-md">
      <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span>Report Execution Parameters & Filters</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={() => setIsSavingPreset((prev) => !prev)}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 px-2.5 py-1 bg-indigo-950/60 border border-indigo-800/60 rounded-md transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save Preset
          </button>
        </div>
      </div>

      {isSavingPreset && (
        <form
          onSubmit={handleSavePresetSubmit}
          className="flex items-center gap-2 mb-4 p-3 bg-indigo-950/40 border border-indigo-800/60 rounded-lg"
        >
          <input
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="Enter name for saved filter preset..."
            required
            className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsSavingPreset(false)}
            className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded hover:bg-slate-700"
          >
            Cancel
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Date Range Parameter */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Date Range Filter
          </label>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>

        {/* Dynamic Parameters based on Report definition */}
        {report.parameters &&
          report.parameters.map((param) => (
            <div key={param.id}>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {param.label}
              </label>

              {param.type === "select" && (
                <select
                  value={activeFilters[param.id] ?? param.defaultValue ?? "ALL"}
                  onChange={(e) => handleFilterChange(param.id, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500"
                >
                  {param.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {param.type === "number" && (
                <input
                  type="number"
                  value={activeFilters[param.id] ?? param.defaultValue ?? ""}
                  onChange={(e) => handleFilterChange(param.id, Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              )}

              {param.type === "text" && (
                <input
                  type="text"
                  value={activeFilters[param.id] ?? ""}
                  onChange={(e) => handleFilterChange(param.id, e.target.value)}
                  placeholder={`Filter by ${param.label.toLowerCase()}...`}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
