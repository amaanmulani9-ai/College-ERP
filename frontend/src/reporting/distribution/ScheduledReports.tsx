import React from "react";
import { Play, Pause, Trash2, Clock, Send } from "lucide-react";
import { ScheduleItem } from "./types";

interface ScheduledReportsProps {
  schedules: ScheduleItem[];
  onToggleStatus: (id: string) => void;
  onDeleteSchedule: (id: string) => void;
  onRunNow: (sch: ScheduleItem) => void;
}

export const ScheduledReports: React.FC<ScheduledReportsProps> = ({
  schedules,
  onToggleStatus,
  onDeleteSchedule,
  onRunNow,
}) => {
  return (
    <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Active Automated Report Tasks ({schedules.length})
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">Report Title</th>
              <th className="p-3">Frequency</th>
              <th className="p-3">Format</th>
              <th className="p-3">Channels</th>
              <th className="p-3">Next Scheduled Run</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono">
            {schedules.map((sch) => (
              <tr key={sch.id} className="hover:bg-slate-850">
                <td className="p-3 font-sans font-bold text-slate-200">{sch.reportTitle}</td>
                <td className="p-3 capitalize text-indigo-400">{sch.frequency}</td>
                <td className="p-3 uppercase text-amber-400">{sch.format}</td>
                <td className="p-3 text-slate-400">
                  {sch.channels.map((c) => c.replace("-", " ")).join(", ")}
                </td>
                <td className="p-3 text-slate-300">{sch.nextRunTime}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      sch.status === "active"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {sch.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onRunNow(sch)}
                      className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-sans font-semibold text-[11px] flex items-center gap-1"
                      title="Run Immediately"
                    >
                      <Send className="w-3 h-3" />
                      <span>Run</span>
                    </button>
                    <button
                      onClick={() => onToggleStatus(sch.id)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                      title={sch.status === "active" ? "Pause Schedule" : "Resume Schedule"}
                    >
                      {sch.status === "active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => onDeleteSchedule(sch.id)}
                      className="p-1.5 text-rose-400 hover:bg-rose-950 rounded"
                      title="Delete Schedule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
