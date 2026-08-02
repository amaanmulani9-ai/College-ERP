import React, { useState } from "react";
import { BarChart3, LineChart, PieChart, Filter } from "lucide-react";

export interface ChartPlaceholderProps {
  title: string;
  subtitle?: string;
}

export const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({
  title,
  subtitle = "Real-time institutional metrics & analytics trends",
}) => {
  const [activeRange, setActiveRange] = useState("30D");

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" /> {title}
          </h3>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {["7D", "30D", "90D", "1Y"].map((r) => (
            <button
              key={r}
              onClick={() => setActiveRange(r)}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                activeRange === r ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Chart Bars Graphic */}
      <div className="h-48 flex items-end justify-between gap-2 pt-4 px-2">
        {[40, 65, 80, 55, 90, 70, 85, 95, 60, 75, 100, 85].map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <div
              className="w-full bg-gradient-to-t from-indigo-900 via-indigo-600 to-purple-500 rounded-t-lg transition-all duration-300 group-hover:brightness-125"
              style={{ height: `${height}%` }}
            />
            <span className="text-[10px] text-slate-500 font-mono">
              M{i + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
