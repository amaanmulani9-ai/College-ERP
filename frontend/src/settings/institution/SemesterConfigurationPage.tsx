import React, { useState } from "react";
import { Clock, Plus } from "lucide-react";
import { SemesterConfig } from "./types";
import { MOCK_SEMESTER_CONFIGS } from "./mockInstitutionData";

export const SemesterConfigurationPage: React.FC = () => {
  const [semesters] = useState<SemesterConfig[]>(MOCK_SEMESTER_CONFIGS);

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Semester Registration & Examination Windows</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {semesters.map((s) => (
          <div key={s.id} className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900">
                {s.type} Semester {s.number}
              </span>
            </div>
            <div className="text-slate-300 text-[11px] space-y-1 pt-1 font-sans">
              <div>Registration Window: <span className="font-mono text-indigo-300 font-bold">{s.registrationWindow}</span></div>
              <div>Examination Period: <span className="font-mono text-amber-300 font-bold">{s.examWindow}</span></div>
              <div>Result Declaration: <span className="font-mono text-emerald-300 font-bold">{s.resultWindow}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
