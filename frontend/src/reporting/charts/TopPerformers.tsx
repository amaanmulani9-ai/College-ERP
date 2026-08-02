import React from "react";
import { Trophy, Award } from "lucide-react";
import { MOCK_PERFORMERS } from "./mockAnalyticsData";

export const TopPerformers: React.FC = () => {
  const topList = MOCK_PERFORMERS.filter((p) => p.isTop);

  return (
    <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-3">
        <Trophy className="w-4 h-4 text-amber-400" />
        <h4 className="text-sm font-bold text-slate-100">Top Performing Departments</h4>
      </div>

      <div className="space-y-2.5">
        {topList.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center font-bold text-amber-400 bg-amber-950/80 rounded-full border border-amber-800 text-[10px]">
                #{item.rank}
              </span>
              <div>
                <span className="font-semibold text-slate-200 block">{item.name}</span>
                <span className="text-[10px] text-slate-400">{item.subtitle}</span>
              </div>
            </div>

            <span className="font-mono font-bold text-emerald-400">{item.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
