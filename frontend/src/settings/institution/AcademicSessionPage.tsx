import React, { useState } from "react";
import { Calendar, Play, Lock, Archive, Plus } from "lucide-react";
import { AcademicSession } from "./types";
import { MOCK_ACADEMIC_SESSIONS } from "./mockInstitutionData";

export const AcademicSessionPage: React.FC = () => {
  const [sessions, setSessions] = useState<AcademicSession[]>(MOCK_ACADEMIC_SESSIONS);

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Academic Sessions & Term Open/Close</h2>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs">
          <Plus className="w-4 h-4" />
          <span>Create New Session</span>
        </button>
      </div>

      <div className="space-y-3">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    s.status === "current"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {s.status}
                </span>
                <h3 className="font-bold text-slate-100 text-sm font-sans">{s.name}</h3>
              </div>
              <p className="text-[11px] text-slate-400">
                Duration: {s.startDate} to {s.endDate}
              </p>
            </div>

            <div className="flex items-center gap-2 font-sans font-semibold">
              {s.status === "current" ? (
                <button className="px-3 py-1.5 bg-rose-950 text-rose-300 border border-rose-800 rounded-lg hover:bg-rose-900 transition-colors">
                  Close Session
                </button>
              ) : (
                <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors">
                  Set Active
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
