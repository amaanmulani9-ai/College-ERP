import React, { useState } from "react";
import { Users, Plus } from "lucide-react";
import { SectionItem } from "./types";
import { MOCK_SECTIONS } from "./mockInstitutionData";

export const SectionManagementPage: React.FC = () => {
  const [sections] = useState<SectionItem[]>(MOCK_SECTIONS);

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Section Allocation & Class Teacher Management</h2>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs">
          <Plus className="w-4 h-4" />
          <span>Add Section</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((sec) => (
          <div key={sec.id} className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900">
                {sec.name}
              </span>
              <span className="text-[10px] font-bold text-cyan-400">Room: {sec.roomNo}</span>
            </div>
            <h3 className="font-bold text-slate-100 text-sm font-sans">{sec.program} (Semester {sec.semester})</h3>
            <p className="text-[11px] text-slate-400 font-sans">Class Advisor: {sec.classTeacher}</p>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-400 text-[10px]">
              <span>Capacity: {sec.capacity} Students</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
