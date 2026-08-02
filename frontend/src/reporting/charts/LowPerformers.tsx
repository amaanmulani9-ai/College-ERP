import React from "react";
import { AlertTriangle } from "lucide-react";
import { MOCK_PERFORMERS } from "./mockAnalyticsData";

export const LowPerformers: React.FC = () => {
  const lowList = MOCK_PERFORMERS.filter((p) => !p.isTop);

  return (
    <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-3">
        <AlertTriangle className="w-4 h-4 text-rose-400" />
        <h4 className="text-sm font-bold text-slate-100">Attention Required / Low Performers</h4>
      </div>

      <div className="space-y-2.5">
        {lowList.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs"
          >
            <div>
              <span className="font-semibold text-slate-200 block">{item.name}</span>
              <span className="text-[10px] text-rose-400">{item.subtitle}</span>
            </div>

            <span className="font-mono font-bold text-rose-400">{item.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
