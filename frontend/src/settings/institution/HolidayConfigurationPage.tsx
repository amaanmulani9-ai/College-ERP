import React, { useState } from "react";
import { Sun, Plus } from "lucide-react";
import { HolidayItem } from "./types";
import { MOCK_HOLIDAYS } from "./mockInstitutionData";

export const HolidayConfigurationPage: React.FC = () => {
  const [holidays] = useState<HolidayItem[]>(MOCK_HOLIDAYS);

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Holiday Calendar & Emergency Closures</h2>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs">
          <Plus className="w-4 h-4" />
          <span>Declare Holiday</span>
        </button>
      </div>

      <div className="space-y-3">
        {holidays.map((h) => (
          <div key={h.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono">
            <div>
              <span className="text-[9px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-900 uppercase">
                {h.type} Holiday
              </span>
              <h3 className="font-bold text-slate-100 text-sm font-sans mt-1">{h.title}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-indigo-300 block">{h.date}</span>
              <span className="text-[10px] text-slate-500">{h.isRecurring ? "Annual Recurrence" : "One-Time Date"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
