import React from "react";
import { Send, CheckCircle2, Download, Share2, Clock, BarChart2 } from "lucide-react";
import { BarChart } from "../charts/BarChart";
import { DonutChart } from "../charts/DonutChart";

export const DistributionDashboard: React.FC = () => {
  return (
    <div className="space-y-6 text-xs font-sans">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Active Scheduled Tasks</span>
          </span>
          <div className="text-2xl font-bold font-mono text-slate-100">14 Tasks</div>
          <p className="text-[10px] text-emerald-400 font-mono">+2 new this week</p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Delivery Success Rate</span>
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-400">98.4%</div>
          <p className="text-[10px] text-slate-400 font-mono">1 failure resolved</p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Total Monthly Exports</span>
          </span>
          <div className="text-2xl font-bold font-mono text-slate-100">1,248 Files</div>
          <p className="text-[10px] text-cyan-400 font-mono">14.2 GB data spooled</p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Shared Links</span>
          </span>
          <div className="text-2xl font-bold font-mono text-slate-100">32 Links</div>
          <p className="text-[10px] text-amber-400 font-[#fff]">226 link clicks</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart title="Monthly Report Distribution Volume by Channel" height={260} />
        <DonutChart title="Export Format Share (PDF, Excel, CSV, PNG)" height={260} />
      </div>
    </div>
  );
};
