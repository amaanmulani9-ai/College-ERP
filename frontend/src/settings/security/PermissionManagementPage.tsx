import React from "react";
import { Key, Plus } from "lucide-react";
import { MOCK_PERMISSIONS } from "./mockSecurityData";

export const PermissionManagementPage: React.FC = () => {
  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Granular Permission Definition Library</h2>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs">
          <Plus className="w-4 h-4" />
          <span>Define Permission</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">Permission Code</th>
              <th className="p-3">ERP Module</th>
              <th className="p-3">Action Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono">
            {MOCK_PERMISSIONS.map((p) => (
              <tr key={p.id} className="hover:bg-slate-850">
                <td className="p-3 font-bold text-indigo-400">{p.code}</td>
                <td className="p-3 font-sans font-bold text-slate-100">{p.module}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase">
                    {p.action}
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
