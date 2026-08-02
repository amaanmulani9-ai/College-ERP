import React from "react";
import { Award, CheckCircle } from "lucide-react";
import { ProgressRing } from "./ProgressRing";

interface PerformanceCardProps {
  title: string;
  category: string;
  scorePercent: number;
  statusText?: string;
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({
  title,
  category,
  scorePercent,
  statusText = "Target Met",
}) => {
  return (
    <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md flex items-center justify-between">
      <div>
        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800/60 inline-block mb-1">
          {category}
        </span>
        <h4 className="text-sm font-bold text-slate-100">{title}</h4>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mt-2">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{statusText}</span>
        </div>
      </div>

      <ProgressRing value={scorePercent} size={64} strokeWidth={6} color="#6366f1" />
    </div>
  );
};
