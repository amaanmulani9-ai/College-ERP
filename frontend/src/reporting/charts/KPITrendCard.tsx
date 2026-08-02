import React from "react";
import { TrendingUp, TrendingDown, Target, Award } from "lucide-react";
import { KPIMetric } from "./types";
import { Sparkline } from "./Sparkline";

export interface KPITrendCardProps {
  metric: KPIMetric;
}

export const KPITrendCard: React.FC<KPITrendCardProps> = ({ metric }) => {
  const isPos = metric.isPositive ?? (metric.growthPercent || 0) >= 0;

  return (
    <div className="p-4 bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-xl shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-slate-400 line-clamp-1">
          {metric.title}
        </span>
        <span
          className={`flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            isPos
              ? "bg-emerald-950/80 text-emerald-300 border-emerald-800/80"
              : "bg-rose-950/80 text-rose-300 border-rose-800/80"
          }`}
        >
          {isPos ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1" />
          )}
          {metric.growthPercent}%
        </span>
      </div>

      <div className="flex items-baseline justify-between mb-3">
        <span className="text-2xl font-bold font-mono text-slate-100">
          {metric.value}
        </span>
        {metric.unit && (
          <span className="text-xs font-mono text-slate-500 font-medium">
            {metric.unit}
          </span>
        )}
      </div>

      {metric.trendData && (
        <div className="mb-3 pt-1 border-t border-slate-800/80">
          <Sparkline
            data={metric.trendData}
            width={240}
            height={28}
            isPositive={isPos}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono border-t border-slate-800/80 pt-2 text-slate-400">
        {metric.target && (
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-indigo-400" />
            <span>Target: {metric.target}</span>
          </div>
        )}
        {metric.achievementPercent !== undefined && (
          <div className="flex items-center gap-1 justify-end">
            <Award className="w-3 h-3 text-amber-400" />
            <span>Achieved: {metric.achievementPercent}%</span>
          </div>
        )}
      </div>
    </div>
  );
};
