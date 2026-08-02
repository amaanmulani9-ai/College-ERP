import React, { useState } from "react";
import { Building2, Plus, CheckCircle, MapPin } from "lucide-react";
import { CampusItem } from "./types";
import { MOCK_CAMPUSES } from "./mockInstitutionData";

export const CampusManagementPage: React.FC = () => {
  const [campuses, setCampuses] = useState<CampusItem[]>(MOCK_CAMPUSES);

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Multi-Campus & Facility Management</h2>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs">
          <Plus className="w-4 h-4" />
          <span>Add New Campus</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {campuses.map((c) => (
          <div key={c.id} className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900">
                {c.code}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900 uppercase">
                {c.status}
              </span>
            </div>
            <h3 className="font-bold text-slate-100 text-sm font-sans">{c.name}</h3>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 font-sans">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{c.city}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-400 text-[10px]">
              <span>Buildings: {c.buildingsCount}</span>
              <span>Capacity: {c.capacity.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
