import React from "react";
import { Calendar, TrendingUp, RefreshCw, Layers } from "lucide-react";
import { ChartPeriod } from "./types";

interface ChartToolbarProps {
  period: ChartPeriod;
  onPeriodChange: (p: ChartPeriod) => void;
  comparePrevious: boolean;
  onCompareToggle: () => void;
  showTrends?: boolean;
  onTrendsToggle?: () => void;
  onRefresh?: () => void;
}

export const ChartToolbar: React.FC<ChartToolbarProps> = ({
  period,
  onPeriodChange,
  comparePrevious,
  onCompareToggle,
  showTrends,
  onTrendsToggle,
  onRefresh,
}) => {
  const periods: { label: string; value: ChartPeriod }[] = [
    { label: "1W", value: "week" },
    { label: "1M", value: "month" },
    { label: "1Q", value: "quarter" },
    { label: "1Y", value: "year" },
    { label: "Custom", value: "custom" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl mb-4 text-xs">
      {/* Period Selection */}
      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
        <Calendar className="w-3.5 h-3.5 text-indigo-400 ml-1.5 mr-0.5" />
        {periods.map((item) => (
          <button
            key={item.value}
            onClick={() => onPeriodChange(item.value)}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              period === item.value
                ? "bg-indigo-600 text-white shadow-sm font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-2">
        <button
          onClick={onCompareToggle}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            comparePrevious
              ? "bg-cyan-950/80 border-cyan-700 text-cyan-300"
              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Compare Prev Period</span>
        </button>

        {onTrendsToggle && (
          <button
            onClick={onTrendsToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              showTrends
                ? "bg-emerald-950/80 border-emerald-700 text-emerald-300"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Show Growth %</span>
          </button>
        )}

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
            title="Refresh analytics data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
