import React from "react";
import { Settings, Trash2, Layout, Database, Sliders, Calculator } from "lucide-react";
import { ReportElement, ModuleBinding } from "./types";

interface BuilderPropertiesProps {
  element: ReportElement | null;
  onUpdateElement: (updated: ReportElement) => void;
  onDeleteElement: (id: string) => void;
}

export const BuilderProperties: React.FC<BuilderPropertiesProps> = ({
  element,
  onUpdateElement,
  onDeleteElement,
}) => {
  if (!element) {
    return (
      <div className="w-64 bg-slate-900/90 border-l border-slate-800 p-4 text-xs font-sans flex flex-col items-center justify-center text-center text-slate-500">
        <Settings className="w-8 h-8 mb-2 opacity-50 text-indigo-400" />
        <h4 className="font-semibold text-slate-400 mb-1">No Element Selected</h4>
        <p className="text-[11px] leading-relaxed">
          Click any canvas element or chart component to inspect & edit its layout width, data binding, filters, and formula properties.
        </p>
      </div>
    );
  }

  const handleTitleChange = (newTitle: string) => {
    onUpdateElement({ ...element, title: newTitle });
  };

  const handleSpanChange = (span: number) => {
    onUpdateElement({ ...element, gridSpan: Math.max(1, Math.min(12, span)) });
  };

  const handleContentChange = (val: string) => {
    onUpdateElement({ ...element, content: val });
  };

  const handleAggregationChange = (agg: any) => {
    onUpdateElement({
      ...element,
      dataBinding: {
        ...element.dataBinding,
        module: element.dataBinding?.module || "Students",
        fields: element.dataBinding?.fields || [],
        aggregation: agg,
      },
    });
  };

  const handleSortChange = (order: "asc" | "desc") => {
    onUpdateElement({
      ...element,
      dataBinding: {
        ...element.dataBinding,
        module: element.dataBinding?.module || "Students",
        fields: element.dataBinding?.fields || [],
        sortOrder: order,
      },
    });
  };

  const handleGroupChange = (group: string) => {
    onUpdateElement({
      ...element,
      dataBinding: {
        ...element.dataBinding,
        module: element.dataBinding?.module || "Students",
        fields: element.dataBinding?.fields || [],
        groupBy: group,
      },
    });
  };

  return (
    <aside
      aria-label="Element Properties Inspector"
      className="w-72 bg-slate-900/90 border-l border-slate-800 p-4 text-xs font-sans space-y-4 overflow-y-auto"
    >
      {/* Header & Delete */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-slate-100 uppercase tracking-wider text-[11px] font-mono">
            Element Inspector
          </h3>
        </div>
        <button
          onClick={() => onDeleteElement(element.id)}
          className="p-1.5 text-rose-400 hover:bg-rose-950/60 rounded-md transition-colors"
          title="Delete Element"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Basic Properties */}
      <div className="space-y-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
            Element Component Title
          </label>
          <input
            type="text"
            value={element.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 font-medium"
          />
        </div>

        {/* Text Content (if section header or text block) */}
        {(element.type === "section-header" || element.type === "text-block") && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Text Content Body
            </label>
            <textarea
              rows={3}
              value={element.content || ""}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 font-sans"
            />
          </div>
        )}

        {/* Grid Layout Span */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1">
            <span className="flex items-center gap-1">
              <Layout className="w-3.5 h-3.5 text-cyan-400" />
              <span>Grid Column Span</span>
            </span>
            <span className="font-mono text-indigo-400">{element.gridSpan} / 12 Cols</span>
          </div>
          <input
            type="range"
            min={1}
            max={12}
            value={element.gridSpan}
            onChange={(e) => handleSpanChange(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Data Binding & Aggregation (for charts & tables) */}
      {element.type !== "divider" && element.type !== "section-header" && (
        <div className="pt-3 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-1.5 text-indigo-400 font-semibold text-[11px] font-mono">
            <Database className="w-3.5 h-3.5" />
            <span>Data Binding & Aggregation</span>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Calculated Aggregation Formula
            </label>
            <select
              value={element.dataBinding?.aggregation || "sum"}
              onChange={(e) => handleAggregationChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
            >
              <option value="sum">Sum (Total)</option>
              <option value="avg">Average (Mean)</option>
              <option value="count">Count (Frequency)</option>
              <option value="percentage">Percentage (%)</option>
              <option value="growth">Growth Rate (% YoY)</option>
              <option value="variance">Variance Index</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Sort Order
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSortChange("asc")}
                className={`py-1 rounded text-center border font-mono ${
                  element.dataBinding?.sortOrder === "asc"
                    ? "bg-indigo-600 text-white border-indigo-500"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                Ascending (A-Z)
              </button>
              <button
                onClick={() => handleSortChange("desc")}
                className={`py-1 rounded text-center border font-mono ${
                  element.dataBinding?.sortOrder === "desc"
                    ? "bg-indigo-600 text-white border-indigo-500"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                Descending (Z-A)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Grouping Axis
            </label>
            <select
              value={element.dataBinding?.groupBy || "Department"}
              onChange={(e) => handleGroupChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Department">Department</option>
              <option value="Course">Course / Program</option>
              <option value="Faculty">Faculty Advisor</option>
              <option value="Batch">Batch Year</option>
              <option value="Semester">Semester</option>
            </select>
          </div>
        </div>
      )}
    </aside>
  );
};
