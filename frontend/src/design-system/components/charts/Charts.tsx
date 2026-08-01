import React from "react";
import { BarChart3, TrendingUp, Download } from "lucide-react";
import { Spinner } from "../feedback/ProgressLoaders";

export interface ChartBaseProps {
  title?: string;
  subtitle?: string;
  height?: number | string;
  isLoading?: boolean;
  error?: string;
  onExport?: () => void;
  className?: string;
}

// ─── Chart Card Container ──────────────────────────────────────────────────
export const ChartContainer: React.FC<ChartBaseProps & { children: React.ReactNode }> = ({
  title,
  subtitle,
  height = 240,
  isLoading = false,
  error,
  onExport,
  className = "",
  children,
}) => {
  return (
    <div
      className={`p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 ${className}`}
    >
      {(title || subtitle || onExport) && (
        <div className="flex items-center justify-between gap-4">
          <div>
            {title && <h4 className="text-sm font-extrabold text-white tracking-tight">{title}</h4>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {onExport && (
            <button
              onClick={onExport}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-colors"
              title="Export Chart Data"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      <div
        style={{ height: typeof height === "number" ? `${height}px` : height }}
        className="w-full flex items-center justify-center relative overflow-hidden"
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <Spinner size="md" />
            <span className="text-[11px] font-mono text-slate-500">Rendering chart...</span>
          </div>
        ) : error ? (
          <p className="text-xs text-red-400 font-semibold">{error}</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

// ─── Reusable Chart Components ─────────────────────────────────────────────
export const LineChart: React.FC<ChartBaseProps> = (props) => (
  <ChartContainer {...props}>
    <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl p-4 bg-slate-900/40">
      <TrendingUp className="w-8 h-8 text-indigo-400 mb-2" />
      <span className="text-xs font-bold text-slate-300">Line Chart Component</span>
      <span className="text-[10px] text-slate-500 font-mono mt-1">Backend Ready</span>
    </div>
  </ChartContainer>
);

export const AreaChart: React.FC<ChartBaseProps> = (props) => (
  <ChartContainer {...props}>
    <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl p-4 bg-slate-900/40">
      <TrendingUp className="w-8 h-8 text-purple-400 mb-2" />
      <span className="text-xs font-bold text-slate-300">Area Chart Component</span>
      <span className="text-[10px] text-slate-500 font-mono mt-1">Backend Ready</span>
    </div>
  </ChartContainer>
);

export const BarChart: React.FC<ChartBaseProps> = (props) => (
  <ChartContainer {...props}>
    <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl p-4 bg-slate-900/40">
      <BarChart3 className="w-8 h-8 text-emerald-400 mb-2" />
      <span className="text-xs font-bold text-slate-300">Bar Chart Component</span>
      <span className="text-[10px] text-slate-500 font-mono mt-1">Backend Ready</span>
    </div>
  </ChartContainer>
);

export const HorizontalBarChart: React.FC<ChartBaseProps> = (props) => (
  <ChartContainer {...props}>
    <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl p-4 bg-slate-900/40">
      <BarChart3 className="w-8 h-8 text-amber-400 mb-2 transform rotate-90" />
      <span className="text-xs font-bold text-slate-300">Horizontal Bar Chart</span>
      <span className="text-[10px] text-slate-500 font-mono mt-1">Backend Ready</span>
    </div>
  </ChartContainer>
);

export const PieChart: React.FC<ChartBaseProps> = (props) => (
  <ChartContainer {...props}>
    <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl p-4 bg-slate-900/40">
      <div className="w-10 h-10 rounded-full border-4 border-sky-400 border-t-indigo-500 mb-2" />
      <span className="text-xs font-bold text-slate-300">Pie Chart Component</span>
      <span className="text-[10px] text-slate-500 font-mono mt-1">Backend Ready</span>
    </div>
  </ChartContainer>
);

export const DonutChart: React.FC<ChartBaseProps> = (props) => (
  <ChartContainer {...props}>
    <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl p-4 bg-slate-900/40">
      <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-purple-500 mb-2 flex items-center justify-center">
        <div className="w-4 h-4 bg-slate-950 rounded-full" />
      </div>
      <span className="text-xs font-bold text-slate-300">Donut Chart Component</span>
      <span className="text-[10px] text-slate-500 font-mono mt-1">Backend Ready</span>
    </div>
  </ChartContainer>
);

export const RadarChart = LineChart;
export const ScatterChart = LineChart;
export const HeatmapPlaceholder = BarChart;
export const GaugeChart = PieChart;

export const Sparkline: React.FC<{ data?: number[]; isPositive?: boolean }> = ({
  isPositive = true,
}) => (
  <div className="inline-flex items-center gap-1">
    <TrendingUp
      className={`w-4 h-4 ${isPositive ? "text-emerald-400" : "text-red-400"}`}
    />
  </div>
);

export const MiniTrendChart = Sparkline;
