import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Sparkline } from "./Sparkline";

export interface MiniTrendProps {
  label: string;
  value: string | number;
  growthPercent: number;
  isPositive?: boolean;
  sparklineData?: number[];
}

export const MiniTrend: React.FC<MiniTrendProps> = ({
  label,
  value,
  growthPercent,
  isPositive = true,
  sparklineData,
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-900/90 border border-slate-800 rounded-xl shadow-sm">
      <div>
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
          {label}
        </span>
        <span className="text-sm font-bold text-slate-100 font-mono">{value}</span>
      </div>

      <div className="flex items-center gap-2">
        <Sparkline data={sparklineData} width={60} height={20} isPositive={isPositive} />
        <span
          className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${
            isPositive
              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
              : "bg-rose-950 text-rose-400 border border-rose-800"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3 mr-0.5" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-0.5" />
          )}
          {Math.abs(growthPercent)}%
        </span>
      </div>
    </div>
  );
};
