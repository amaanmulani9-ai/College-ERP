import React from "react";
import { ReportElement, PreviewDevice } from "./types";
import { LineChart } from "../charts/LineChart";
import { BarChart } from "../charts/BarChart";
import { PieChart } from "../charts/PieChart";
import { KPITrendCard } from "../charts/KPITrendCard";
import { MOCK_EXECUTIVE_KPIS } from "../charts/mockAnalyticsData";
import { Printer, Download, ArrowLeft } from "lucide-react";

interface BuilderPreviewProps {
  title: string;
  description: string;
  elements: ReportElement[];
  device: PreviewDevice;
  onExitPreview: () => void;
}

export const BuilderPreview: React.FC<BuilderPreviewProps> = ({
  title,
  description,
  elements,
  device,
  onExitPreview,
}) => {
  const getContainerWidth = () => {
    switch (device) {
      case "mobile":
        return "max-w-sm"; // 384px
      case "tablet":
        return "max-w-2xl"; // 672px
      case "print":
        return "max-w-4xl bg-white text-slate-900 border-slate-300";
      default:
        return "max-w-6xl";
    }
  };

  const isPrintMode = device === "print";

  return (
    <div
      role="region"
      aria-label="Live Report Preview"
      className="flex-1 bg-slate-950 p-4 sm:p-6 overflow-y-auto flex flex-col items-center min-h-screen"
    >
      {/* Top Floating Preview Bar */}
      <div className="w-full max-w-6xl flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl mb-6 shadow-xl text-xs">
        <button
          onClick={onExitPreview}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Preview Mode</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-slate-400">
          <span className="capitalize text-indigo-400 font-bold">{device} View Mode</span>
          <span>•</span>
          <span>{elements.length} components</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Preview Sheet Frame */}
      <div
        className={`w-full ${getContainerWidth()} p-8 rounded-2xl shadow-2xl transition-all duration-300 border ${
          isPrintMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-slate-900/90 border-slate-800 text-slate-100"
        }`}
      >
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              College ERP Report Output
            </span>
            <span className="text-xs font-mono text-slate-500">
              Generated: {new Date().toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mt-1">{title || "Untitled Custom Report"}</h1>
          {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
        </div>

        {/* Dynamic Element Grid */}
        <div className="grid grid-cols-12 gap-4">
          {elements.map((el) => (
            <div
              key={el.id}
              style={{ gridColumn: `span ${el.gridSpan} / span ${el.gridSpan}` }}
            >
              {el.type === "section-header" && (
                <div className="py-2 border-b border-slate-800 mb-2">
                  <h2 className="text-base font-bold text-slate-100">{el.title}</h2>
                  {el.content && <p className="text-xs text-slate-400 mt-0.5">{el.content}</p>}
                </div>
              )}

              {el.type === "kpi-card" && (
                <KPITrendCard metric={MOCK_EXECUTIVE_KPIS[0]} />
              )}

              {el.type === "line-chart" && (
                <LineChart title={el.title} height={240} />
              )}

              {el.type === "bar-chart" && (
                <BarChart title={el.title} height={240} />
              )}

              {el.type === "pie-chart" && (
                <PieChart title={el.title} height={240} />
              )}

              {el.type === "table" && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto">
                  <h4 className="text-xs font-bold text-slate-100 mb-2">{el.title}</h4>
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 font-mono text-[10px] text-slate-400 uppercase">
                      <tr>
                        <th className="p-2">Code</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Metric Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr>
                        <td className="p-2 font-mono text-indigo-400">REG-101</td>
                        <td className="p-2 font-semibold">Student Profile Master</td>
                        <td className="p-2">Academics</td>
                        <td className="p-2 font-mono text-emerald-400 font-bold">98.4%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {el.type === "text-block" && (
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{el.content}</p>
              )}

              {el.type === "divider" && <hr className="border-slate-800 my-2" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
