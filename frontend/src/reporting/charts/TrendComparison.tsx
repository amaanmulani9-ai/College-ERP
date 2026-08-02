import React from "react";
import { ArrowUpRight, ArrowDownRight, Layers } from "lucide-react";

interface TrendComparisonProps {
  title: string;
  currentValue: string | number;
  previousValue: string | number;
  unit?: string;
  changePercent: number;
}

export const TrendComparison: React.FC<TrendComparisonProps> = ({
  title,
  currentValue,
  previousValue,
  unit = "",
  changePercent,
}) => {
  const isPositive = changePercent >= 0;

  return (
    <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md flex items-center justify-between">
      <div>
        <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider block mb-1">
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold font-mono text-slate-100">
            {currentValue} {unit}
          </span>
          <span className="text-xs text-slate-500 font-mono">
            vs {previousValue} {unit}
          </span>
        </div>
      </div>

      <div
        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${
          isPositive
            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
            : "bg-rose-950 text-rose-300 border border-rose-800"
        }`}
      >
        {isPositive ? (
          <ArrowUpRight className="w-4 h-4" />
        ) : (
          <ArrowDownRight className="w-4 h-4" />
        )}
        <span>{isPositive ? `+${changePercent}%` : `${changePercent}%`}</span>
      </div>
    </div>
  );
};
