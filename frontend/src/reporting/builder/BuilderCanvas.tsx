import React from "react";
import { ReportElement } from "./types";
import { LineChart } from "../charts/LineChart";
import { AreaChart } from "../charts/AreaChart";
import { BarChart } from "../charts/BarChart";
import { PieChart } from "../charts/PieChart";
import { DonutChart } from "../charts/DonutChart";
import { GaugeChart } from "../charts/GaugeChart";
import { ProgressRing } from "../charts/ProgressRing";
import { HeatMapChart } from "../charts/HeatMapChart";
import { TreemapChart } from "../charts/TreemapChart";
import { KPITrendCard } from "../charts/KPITrendCard";
import { MOCK_EXECUTIVE_KPIS } from "../charts/mockAnalyticsData";
import { LayoutGrid, Plus, Move, Trash2, Copy } from "lucide-react";

interface BuilderCanvasProps {
  elements: ReportElement[];
  activeElementId: string | null;
  onSelectElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
}

export const BuilderCanvas: React.FC<BuilderCanvasProps> = ({
  elements,
  activeElementId,
  onSelectElement,
  onDeleteElement,
  onDuplicateElement,
}) => {
  if (!elements || elements.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-950 border-2 border-dashed border-slate-800 rounded-2xl m-4">
        <LayoutGrid className="w-12 h-12 text-slate-600 mb-3" />
        <h3 className="text-base font-bold text-slate-300">Report Builder Canvas Empty</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">
          Select a pre-built template from the sidebar or click fields/elements in the palette to start composing your report layout.
        </p>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Interactive Builder Grid Canvas"
      className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-950"
    >
      {/* 12-Column Responsive Snap-Grid Container */}
      <div className="grid grid-cols-12 gap-4">
        {elements.map((el) => {
          const isActive = el.id === activeElementId;
          const spanClass = `col-span-${Math.min(12, Math.max(1, el.gridSpan))}`;

          return (
            <div
              key={el.id}
              onClick={() => onSelectElement(el.id)}
              style={{ gridColumn: `span ${el.gridSpan} / span ${el.gridSpan}` }}
              className={`group relative rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? "ring-2 ring-indigo-500 shadow-xl shadow-indigo-950/50 scale-[1.005] z-10"
                  : "hover:ring-1 hover:ring-slate-700"
              }`}
            >
              {/* Active Selection Overlay Action Bar */}
              {isActive && (
                <div className="absolute -top-3 right-3 z-30 flex items-center gap-1 bg-indigo-600 text-white px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shadow-lg">
                  <span className="flex items-center gap-1">
                    <Move className="w-3 h-3" />
                    {el.gridSpan}/12 Cols
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateElement(el.id);
                    }}
                    className="p-1 hover:bg-indigo-700 rounded"
                    title="Duplicate"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteElement(el.id);
                    }}
                    className="p-1 hover:bg-rose-700 rounded text-rose-200"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Render Component Content based on Element Type */}
              {el.type === "section-header" && (
                <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl">
                  <h2 className="text-lg font-bold text-slate-100">{el.title}</h2>
                  {el.content && <p className="text-xs text-slate-400 mt-1">{el.content}</p>}
                </div>
              )}

              {el.type === "kpi-card" && (
                <KPITrendCard metric={MOCK_EXECUTIVE_KPIS[0]} />
              )}

              {el.type === "line-chart" && (
                <LineChart title={el.title} height={260} />
              )}

              {el.type === "area-chart" && (
                <AreaChart title={el.title} height={260} />
              )}

              {el.type === "bar-chart" && (
                <BarChart title={el.title} height={260} />
              )}

              {el.type === "pie-chart" && (
                <PieChart title={el.title} height={260} />
              )}

              {el.type === "donut-chart" && (
                <DonutChart title={el.title} height={260} />
              )}

              {el.type === "gauge" && (
                <GaugeChart title={el.title} height={240} value={88} />
              )}

              {el.type === "progress-ring" && (
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-slate-200 mb-3">{el.title}</span>
                  <ProgressRing value={92} size={90} strokeWidth={8} color="#6366f1" label="Achieved" />
                </div>
              )}

              {el.type === "heatmap" && (
                <HeatMapChart title={el.title} height={260} />
              )}

              {el.type === "treemap" && (
                <TreemapChart title={el.title} height={260} />
              )}

              {el.type === "table" && (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <h4 className="text-xs font-bold text-slate-100">{el.title}</h4>
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded">
                      Table Component
                    </span>
                  </div>
                  <table className="w-full text-left text-xs text-slate-300 font-sans">
                    <thead className="bg-slate-950 text-[10px] font-mono uppercase text-slate-400">
                      <tr>
                        <th className="p-2">Code</th>
                        <th className="p-2">Name / Description</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Value Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr className="hover:bg-slate-850">
                        <td className="p-2 font-mono text-indigo-400 font-bold">REG-101</td>
                        <td className="p-2 font-semibold">Student Profile Master</td>
                        <td className="p-2 text-slate-400">Academics</td>
                        <td className="p-2 font-mono text-emerald-400">98.4%</td>
                      </tr>
                      <tr className="hover:bg-slate-850">
                        <td className="p-2 font-mono text-indigo-400 font-bold">REG-102</td>
                        <td className="p-2 font-semibold">Tuition Collection Summary</td>
                        <td className="p-2 text-slate-400">Finance</td>
                        <td className="p-2 font-mono text-emerald-400">92.1%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {el.type === "filter-panel" && (
                <div className="p-4 bg-indigo-950/40 border border-indigo-800/60 rounded-xl text-xs">
                  <div className="font-bold text-indigo-300 mb-2">{el.title}</div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="date"
                      className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px]"
                    />
                    <select className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px]">
                      <option>All Departments</option>
                    </select>
                    <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded py-1">
                      Apply Filter
                    </button>
                  </div>
                </div>
              )}

              {el.type === "text-block" && (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {el.content || "Click properties inspector to customize text content paragraph."}
                  </p>
                </div>
              )}

              {el.type === "divider" && (
                <div className="py-2">
                  <hr className="border-slate-800 border-t-2" />
                </div>
              )}

              {el.type === "image" && (
                <div className="p-8 bg-slate-900 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-500 text-xs">
                  Image / Logo Placeholder
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
