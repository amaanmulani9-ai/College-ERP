import React from "react";
import { Calendar as CalendarIcon, Clock, CheckCircle } from "lucide-react";
import { ScheduleItem } from "./types";

interface ScheduleCalendarProps {
  schedules: ScheduleItem[];
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ schedules }) => {
  return (
    <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-3">
        <CalendarIcon className="w-4 h-4 text-indigo-400" />
        <h3 className="text-sm font-bold text-slate-100">
          Automated Report Execution Agenda Calendar
        </h3>
      </div>

      <div className="space-y-2">
        {schedules.map((sch) => (
          <div
            key={sch.id}
            className="flex items-center justify-between p-3 bg-slate-950/90 border border-slate-800 rounded-xl font-mono"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-950 text-indigo-300 rounded-lg border border-indigo-900 text-center">
                <Clock className="w-4 h-4 mx-auto" />
              </div>
              <div>
                <h4 className="font-bold text-slate-200 font-sans">{sch.reportTitle}</h4>
                <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                  <span className="capitalize text-indigo-400">{sch.frequency}</span>
                  <span>•</span>
                  <span className="uppercase">{sch.format}</span>
                  <span>•</span>
                  <span>Recipients: {sch.recipients.join(", ")}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900 block">
                Next: {sch.nextRunTime}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
