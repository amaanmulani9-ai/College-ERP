import React, { useState } from "react";
import { BarChart3, LineChart, PieChart, Maximize2, X, Info } from "lucide-react";

export const MobileChartViewer: React.FC = () => {
  const [chartType, setChartType] = useState<"line" | "bar" | "pie">("bar");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>("Month 5: 90 Admissions");

  const DATA = [
    { label: "M1", val: 40 },
    { label: "M2", val: 65 },
    { label: "M3", val: 80 },
    { label: "M4", val: 55 },
    { label: "M5", val: 90 },
    { label: "M6", val: 100 },
  ];

  const renderChart = () => (
    <div className="space-y-3">
      {/* Chart Canvas Simulation */}
      <div className="h-44 bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-end justify-between gap-2 relative">
        {DATA.map((d, i) => (
          <div
            key={i}
            onClick={() => setTooltip(`${d.label}: ${d.val} Count`)}
            className="flex-1 flex flex-col items-center gap-1 h-full justify-end cursor-pointer group"
          >
            <div
              className={`w-full rounded-t-md transition-all ${
                chartType === "bar"
                  ? "bg-indigo-600 group-hover:bg-indigo-500"
                  : chartType === "line"
                  ? "bg-emerald-500 group-hover:bg-emerald-400"
                  : "bg-purple-600 group-hover:bg-purple-500"
              }`}
              style={{ height: `${d.val}%` }}
            />
            <span className="text-[8px] font-mono text-slate-500">{d.label}</span>
          </div>
        ))}
      </div>

      {/* Touch Tooltip Display */}
      {tooltip && (
        <div className="flex items-center gap-2 p-2 bg-indigo-950/80 border border-indigo-800/80 rounded-lg text-[10px] text-indigo-300 font-mono">
          <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>Selected Data Point: <strong>{tooltip}</strong></span>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      {/* Header & Chart Type Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-slate-100 text-xs">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <span>Interactive Visual Chart</span>
        </div>

        <div className="flex items-center gap-1">
          {[
            { type: "bar" as const,  icon: BarChart3 },
            { type: "line" as const, icon: LineChart },
            { type: "pie" as const,  icon: PieChart },
          ].map((t) => {
            const Icon = t.icon;
            const isAct = chartType === t.type;
            return (
              <button
                key={t.type}
                onClick={() => setChartType(t.type)}
                className={`p-1.5 rounded-lg border transition-all ${
                  isAct ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-950 text-slate-400 border-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}

          <button
            onClick={() => setIsFullscreen(true)}
            aria-label="Fullscreen chart"
            className="p-1.5 rounded-lg bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 ml-1"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {renderChart()}

      {/* Fullscreen Chart Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-950 p-6 flex flex-col justify-between font-sans animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-100">Fullscreen Responsive Chart Viewer</h2>
            <button onClick={() => setIsFullscreen(false)} className="p-2 text-slate-400 hover:text-slate-200">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 my-6">{renderChart()}</div>
          <p className="text-[10px] text-slate-500 font-mono text-center">Touch any data bar to view specific metrics.</p>
        </div>
      )}
    </div>
  );
};
