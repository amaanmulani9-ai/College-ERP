import React, { useState } from "react";
import { Home, Plus, Monitor } from "lucide-react";
import { ClassroomItem } from "./types";
import { MOCK_CLASSROOMS } from "./mockInstitutionData";

export const ClassroomManagementPage: React.FC = () => {
  const [rooms] = useState<ClassroomItem[]>(MOCK_CLASSROOMS);

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Classroom, Smart Lab & Hall Allocation</h2>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs">
          <Plus className="w-4 h-4" />
          <span>Add Room</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rooms.map((r) => (
          <div key={r.id} className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900">
                {r.roomNo}
              </span>
              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-900">
                {r.type}
              </span>
            </div>
            <h3 className="font-bold text-slate-100 text-sm font-sans">{r.building}</h3>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-400 text-[10px]">
              <span>Capacity: {r.capacity} Seats</span>
              <span>AV Equipment: {r.hasAVEquipment ? "Yes" : "No"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
