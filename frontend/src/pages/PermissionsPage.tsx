import React, { useEffect, useState } from "react";
import { Key, Search, Layers } from "lucide-react";
import { rbacService, PermissionItem } from "../services/rbacService";

export const PermissionsPage: React.FC = () => {
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    rbacService
      .getPermissions()
      .then((data) => setPermissions(data.results || data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = permissions.filter(
    (p) => p.code.toLowerCase().includes(search.toLowerCase()) || p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Key className="w-6 h-6 text-indigo-400" />
          Granular Permission Codes
        </h1>
        <p className="text-xs text-slate-400">System-wide authorization permission catalog.</p>
      </div>

      <div className="bg-slate-900 p-4 border border-slate-800 rounded-xl max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search permissions..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading catalog...</div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Permission Code</th>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Module</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">System</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((perm) => (
                <tr key={perm.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-mono text-indigo-400 font-semibold">{perm.code}</td>
                  <td className="p-3.5 font-medium text-slate-200">{perm.name}</td>
                  <td className="p-3.5 capitalize">{perm.module}</td>
                  <td className="p-3.5 capitalize">{perm.action}</td>
                  <td className="p-3.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${perm.is_system ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-indigo-500/10 text-indigo-400'}`}>
                      {perm.is_system ? "System" : "Custom"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
