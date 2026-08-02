import React, { useState } from "react";
import { Calendar, Plus } from "lucide-react";
import { AcademicCalendarEvent } from "./types";
import { MOCK_CALENDAR_EVENTS } from "./mockInstitutionData";

export const CalendarConfigurationPage: React.FC = () => {
  const [events] = useState<AcademicCalendarEvent[]>(MOCK_CALENDAR_EVENTS);

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Academic Calendar Event Schedule</h2>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs">
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      <div className="space-y-3">
        {events.map((e) => (
          <div key={e.id} className="flex items-center justify-between p-4 bg-slate-950/90 border border-slate-800 rounded-xl font-mono">
            <div>
              <span className="text-[9px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900 uppercase">
                {e.category}
              </span>
              <h3 className="font-bold text-slate-100 text-sm font-sans mt-1">{e.title}</h3>
            </div>
            <div className="text-[11px] text-slate-400">
              {e.startDate} to {e.endDate}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
