import React from "react";
import { Layers, Activity } from "lucide-react";
import { SupportedModule } from "./types";

interface ModuleSummaryCardProps {
  moduleName: SupportedModule;
  totalRecords: number | string;
  activeMetrics: string;
  healthScore: number;
}

export const ModuleSummaryCard: React.FC<ModuleSummaryCardProps> = ({
  moduleName,
  totalRecords,
  activeMetrics,
  healthScore,
}) => {
  return (
    <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-bold text-slate-100">{moduleName}</h4>
        </div>
        <p className="text-xs text-slate-400 font-mono">
          {totalRecords} Active Records ({activeMetrics})
        </p>
      </div>

      <div className="text-right font-mono">
        <span className="text-xs text-slate-400 block">Health Index</span>
        <span className="text-base font-bold text-indigo-400">{healthScore}%</span>
      </div>
    </div>
  );
};
