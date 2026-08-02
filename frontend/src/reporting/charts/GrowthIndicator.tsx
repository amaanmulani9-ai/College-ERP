import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface GrowthIndicatorProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}

export const GrowthIndicator: React.FC<GrowthIndicatorProps> = ({
  label,
  value,
  prefix = "",
  suffix = "%",
}) => {
  const isPositive = value >= 0;

  return (
    <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
      <div
        className={`p-1.5 rounded ${
          isPositive ? "bg-emerald-950 text-emerald-400" : "bg-rose-950 text-rose-400"
        }`}
      >
        {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
      </div>
      <div>
        <span className="text-slate-400 text-[10px] block">{label}</span>
        <span className={`font-bold ${isPositive ? "text-emerald-300" : "text-rose-300"}`}>
          {isPositive ? "+" : ""}
          {prefix}
          {value}
          {suffix}
        </span>
      </div>
    </div>
  );
};
