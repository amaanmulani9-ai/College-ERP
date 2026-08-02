import React from "react";
import { WifiOff, HardDrive, Users, DollarSign, Activity, ChevronRight } from "lucide-react";

export const OfflineDashboard: React.FC = () => {
  return (
    <div className="space-y-4 font-sans text-xs select-none">
      {/* Offline Alert Bar */}
      <div className="p-3.5 bg-gradient-to-r from-rose-950 to-purple-950 border border-rose-800 rounded-2xl flex items-center gap-3">
        <WifiOff className="w-5 h-5 text-rose-400 shrink-0" />
        <div>
          <h3 className="font-bold text-slate-100 text-xs">Offline Dashboard Mode</h3>
          <p className="text-[10px] text-rose-200/80">
            Displaying cached metrics from last connection (Aug 2, 2026 10:00 AM).
          </p>
        </div>
      </div>

      {/* Cached Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { title: "Cached Admissions", val: "12,450", sub: "Synced 10m ago", icon: Users, color: "text-blue-400" },
          { title: "Cached Fee Collections", val: "₹2.48 Cr", sub: "Synced 10m ago", icon: DollarSign, color: "text-emerald-400" },
          { title: "Cached System Health", val: "99.98%", sub: "Local Cache", icon: Activity, color: "text-cyan-400" },
          { title: "Storage Allocation", val: "42.8 MB", sub: "Cached Asset Pack", icon: HardDrive, color: "text-purple-400" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-500 uppercase">{item.title}</span>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <p className={`text-xl font-bold font-mono ${item.color}`}>{item.val}</p>
              <p className="text-[9px] text-slate-500 font-mono">{item.sub}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
