import React, { useState } from "react";
import { Clock, Save, CheckCircle2 } from "lucide-react";

export const WorkingDaysPage: React.FC = () => {
  const [schedule, setSchedule] = useState({
    monday: "Full Day (8:30 AM - 4:30 PM)",
    tuesday: "Full Day (8:30 AM - 4:30 PM)",
    wednesday: "Full Day (8:30 AM - 4:30 PM)",
    thursday: "Full Day (8:30 AM - 4:30 PM)",
    friday: "Full Day (8:30 AM - 4:30 PM)",
    saturday: "Half Day (8:30 AM - 1:00 PM)",
    sunday: "Off / Holiday",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Weekly Working Days & Timetable Schedule</h2>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Schedule Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Schedule</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-3 font-mono">
        {Object.entries(schedule).map(([day, val]) => (
          <div key={day} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="font-bold text-slate-100 capitalize font-sans text-sm">{day}</span>
            <span className="text-indigo-400 font-bold text-xs">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
