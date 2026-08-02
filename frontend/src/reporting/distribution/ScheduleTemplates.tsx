import React from "react";
import { Zap, Play } from "lucide-react";

interface ScheduleTemplatesProps {
  onQuickSchedule: (title: string, freq: string) => void;
}

export const ScheduleTemplates: React.FC<ScheduleTemplatesProps> = ({
  onQuickSchedule,
}) => {
  const presets = [
    { title: "Weekly Attendance Defaulter Audit", freq: "Weekly (Mondays @ 8 AM)", module: "Attendance" },
    { title: "Monthly Tuition Fee Recovery Register", freq: "Monthly (1st @ 9 AM)", module: "Fees" },
    { title: "Quarterly Executive Leadership Summary", freq: "Quarterly (1st @ 10 AM)", module: "Executive" },
    { title: "Daily Bus Route Fuel Log Audit", freq: "Daily (@ 6 PM)", module: "Transport" },
  ];

  return (
    <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-3">
        <Zap className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-bold text-slate-100">
          Preset Schedule Automation Templates
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {presets.map((p, idx) => (
          <div
            key={idx}
            className="p-3 bg-slate-950/90 border border-slate-800 hover:border-indigo-500/60 rounded-xl flex items-center justify-between group transition-all"
          >
            <div>
              <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-900 font-bold uppercase">
                {p.module}
              </span>
              <h4 className="font-bold text-slate-200 mt-1">{p.title}</h4>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.freq}</p>
            </div>
            <button
              onClick={() => onQuickSchedule(p.title, p.freq)}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
              title="Schedule Now"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
