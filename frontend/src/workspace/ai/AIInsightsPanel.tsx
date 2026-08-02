import React from "react";
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";

interface InsightMetric {
  id: string;
  label: string;
  value: string;
  change: number; // positive = up, negative = down, 0 = flat
  unit: string;
  category: string;
}

const INSIGHTS: InsightMetric[] = [
  { id: "i1", label: "Attendance Rate",        value: "87.4%",  change:  5.3,  unit: "% vs last month",   category: "Academic"  },
  { id: "i2", label: "Fee Collection",         value: "₹12.4L", change: -8.2,  unit: "% vs target",       category: "Finance"   },
  { id: "i3", label: "Placements This Year",   value: "73",     change: 22.0,  unit: "% vs last year",    category: "Careers"   },
  { id: "i4", label: "Library Circulation",    value: "142",    change:  0,    unit: "books issued",      category: "Library"   },
  { id: "i5", label: "Hostel Occupancy",        value: "94.2%",  change:  1.8,  unit: "% change",          category: "Hostel"    },
  { id: "i6", label: "Transport Utilization",  value: "78.5%",  change: -3.1,  unit: "% vs last week",    category: "Transport" },
  { id: "i7", label: "HR Pending Actions",     value: "8",      change:  0,    unit: "leave/recruit tasks",category: "HR"       },
  { id: "i8", label: "Asset Utilization",      value: "91.3%",  change:  2.4,  unit: "% allocated",       category: "Assets"   },
];

export const AIInsightsPanel: React.FC = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-indigo-400" />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI-Powered Insights</span>
        <span className="ml-auto px-1.5 py-0.5 rounded bg-indigo-600/20 text-[10px] text-indigo-300">Placeholder Data</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {INSIGHTS.map((ins) => {
          const isUp   = ins.change > 0;
          const isDown = ins.change < 0;
          const Icon   = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
          return (
            <div key={ins.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 leading-tight">{ins.label}</div>
              <div className="text-sm font-bold text-white">{ins.value}</div>
              <div className={`flex items-center gap-1 text-[10px] font-semibold ${isUp ? "text-emerald-400" : isDown ? "text-rose-400" : "text-slate-400"}`}>
                <Icon className="w-3 h-3" />
                {ins.change !== 0 ? `${ins.change > 0 ? "+" : ""}${ins.change}%` : "Stable"}
                <span className="text-slate-600 font-normal truncate">{ins.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-slate-600 text-center">
        Live data from TASK-030 AI endpoints — plug in real providers to enable ML-powered analytics.
      </p>
    </div>
  );
};
