import React, { useState } from "react";
import { Users, UserPlus, Search, ShieldAlert, Lock, RefreshCw } from "lucide-react";
import { UserAccountItem } from "./types";
import { MOCK_USER_ACCOUNTS } from "./mockSecurityData";

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserAccountItem[]>(MOCK_USER_ACCOUNTS);
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">User Account Provisioning & Identity Directory</h2>
        </div>

        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs">
          <UserPlus className="w-4 h-4" />
          <span>Invite New User</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter users by name, email, or assigned role..."
          className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-medium"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">User Name & Email</th>
              <th className="p-3">Department</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Last Login</th>
              <th className="p-3 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-850">
                <td className="p-3">
                  <div className="font-bold text-slate-100 font-sans">{u.name}</div>
                  <div className="text-[10px] text-slate-400">{u.email}</div>
                </td>
                <td className="p-3 font-sans text-slate-300">{u.department}</td>
                <td className="p-3 font-bold text-indigo-400 font-sans">{u.role}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      u.status === "Active"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        : "bg-rose-950 text-rose-300 border border-rose-800"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="p-3 text-slate-400">{u.lastLogin}</td>
                <td className="p-3 text-right font-sans">
                  <div className="flex items-center justify-end gap-1.5">
                    <button className="p-1 text-slate-400 hover:text-amber-400" title="Lock Account">
                      <Lock className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-indigo-400" title="Reset Password">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
