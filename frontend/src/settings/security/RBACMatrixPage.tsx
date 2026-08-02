import React, { useState } from "react";
import { Grid, Save, CheckCircle2 } from "lucide-react";
import { MOCK_SECURITY_ROLES } from "./mockSecurityData";

export const RBACMatrixPage: React.FC = () => {
  const actions = ["Read", "Create", "Edit", "Delete", "Approve", "Export", "Analytics", "AI Copilot"];
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({
    "Super Admin": { Read: true, Create: true, Edit: true, Delete: true, Approve: true, Export: true, Analytics: true, "AI Copilot": true },
    "Principal / Registrar": { Read: true, Create: true, Edit: true, Delete: false, Approve: true, Export: true, Analytics: true, "AI Copilot": true },
    "Head of Department (HOD)": { Read: true, Create: true, Edit: true, Delete: false, Approve: true, Export: true, Analytics: true, "AI Copilot": false },
    "Faculty / Professor": { Read: true, Create: true, Edit: true, Delete: false, Approve: false, Export: false, Analytics: false, "AI Copilot": false },
    Student: { Read: true, Create: false, Edit: false, Delete: false, Approve: false, Export: false, Analytics: false, "AI Copilot": false },
  });
  const [saved, setSaved] = useState(false);

  const toggleCheck = (role: string, act: string) => {
    setMatrix((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [act]: !prev[role]?.[act],
      },
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Grid className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Global RBAC Permission Matrix Visualization</h2>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Matrix Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Permissions</span>
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
        <table className="w-full text-center text-xs text-slate-300">
          <thead className="bg-slate-900 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3 text-left">Role Name</th>
              {actions.map((act) => (
                <th key={act} className="p-3">
                  {act}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono">
            {MOCK_SECURITY_ROLES.map((r) => (
              <tr key={r.id} className="hover:bg-slate-850">
                <td className="p-3 text-left font-sans font-bold text-slate-100">{r.name}</td>
                {actions.map((act) => {
                  const checked = matrix[r.name]?.[act] ?? false;
                  return (
                    <td key={act} className="p-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCheck(r.name, act)}
                        className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
