import React, { useState } from "react";
import { UserCheck, Plus } from "lucide-react";
import { DepartmentItem } from "./types";
import { MOCK_DEPARTMENTS } from "./mockInstitutionData";

export const DepartmentManagementPage: React.FC = () => {
  const [departments] = useState<DepartmentItem[]>(MOCK_DEPARTMENTS);

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Department Management & HOD Assignment</h2>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs">
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Department Name</th>
              <th className="p-3">Head of Dept (HOD)</th>
              <th className="p-3">Faculty Count</th>
              <th className="p-3">Student Enrolled</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono">
            {departments.map((d) => (
              <tr key={d.id} className="hover:bg-slate-850">
                <td className="p-3 font-bold text-indigo-400">{d.code}</td>
                <td className="p-3 font-sans font-bold text-slate-100">{d.name}</td>
                <td className="p-3 text-slate-300 font-sans">{d.hodName}</td>
                <td className="p-3 text-slate-400">{d.facultyCount} Professors</td>
                <td className="p-3 text-slate-300">{d.studentCount.toLocaleString()}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold uppercase">
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
