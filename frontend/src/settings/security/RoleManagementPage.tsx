import React, { useState } from "react";
import { ShieldCheck, Plus, Copy } from "lucide-react";
import { SecurityRoleItem } from "./types";
import { MOCK_SECURITY_ROLES } from "./mockSecurityData";

export const RoleManagementPage: React.FC = () => {
  const [roles] = useState<SecurityRoleItem[]>(MOCK_SECURITY_ROLES);

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Role-Based Access Control (RBAC) Hierarchy</h2>
        </div>

        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs">
          <Plus className="w-4 h-4" />
          <span>Create Custom Role</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((r) => (
          <div key={r.id} className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2 font-mono">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border uppercase ${r.colorBadge}`}>
                {r.name}
              </span>
              <span className="text-[10px] font-bold text-slate-400">{r.type} Role</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">{r.description}</p>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-sans">
              <span>{r.assignedUsersCount} Active Users Assigned</span>
              <button className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-mono">
                <Copy className="w-3 h-3" />
                <span>Clone Role</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
