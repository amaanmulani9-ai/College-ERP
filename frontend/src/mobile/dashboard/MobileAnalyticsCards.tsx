import React from "react";
import { TrendingUp, BarChart3, PieChart, LineChart } from "lucide-react";

export const MobileAnalyticsCards: React.FC = () => {
  const CARDS = [
    { title: "Admission Conversion", metric: "78.4%", trend: "+5.2%", icon: LineChart, color: "text-blue-400" },
    { title: "Fee Receipt Clearance",metric: "91.2%", trend: "+12.0%",icon: BarChart3, color: "text-emerald-400" },
    { title: "Hostel Occupancy",    metric: "88.6%", trend: "Stable", icon: PieChart,  color: "text-purple-400" },
  ];

  return (
    <div className="space-y-2 font-sans text-xs select-none">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">Analytics Summary Cards</span>
        <span className="text-[10px] font-mono text-indigo-400 font-bold">Real-time</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase">{card.title}</p>
                <p className={`text-xl font-bold font-mono ${card.color}`}>{card.metric}</p>
                <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-mono font-bold">
                  <TrendingUp className="w-3 h-3" />
                  <span>{card.trend} vs last cycle</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
