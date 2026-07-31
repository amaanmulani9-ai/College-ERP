import React, { useEffect, useState } from "react";
import { ShieldCheck, Plus, Search, Copy, Slash, CheckCircle, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { rbacService, RoleItem } from "../services/rbacService";

export const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const data = await rbacService.getRoles();
      setRoles(data.results || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClone = async (id: string, name: string) => {
    const newName = prompt(`Enter cloned role name for '${name}':`, `${name} (Copy)`);
    if (!newName) return;
    try {
      await rbacService.cloneRole(id, newName);
      fetchRoles();
    } catch (err) {
      alert("Failed to clone role.");
    }
  };

  const handleDisable = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to disable role '${name}'?`)) return;
    try {
      await rbacService.disableRole(id);
      fetchRoles();
    } catch (err) {
      alert("Failed to disable role.");
    }
  };

  const filteredRoles = roles.filter(
    (r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            Tenant Role Management
          </h1>
          <p className="text-xs text-slate-400">Configure roles and assign permission scope across the college.</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 bg-slate-900 p-4 border border-slate-800 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roles..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <Link
          to="/rbac/matrix"
          className="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-semibold transition-colors"
        >
          View Permission Matrix
        </Link>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading tenant roles...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoles.map((role) => (
            <div key={role.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{role.name}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${role.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                    {role.is_active ? "Active" : "Disabled"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">{role.description || "No description provided."}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span>{role.permissions_count || 0} Permissions</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleClone(role.id, role.name)}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition-colors"
                    title="Clone Role"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {role.is_active && !role.is_system && (
                    <button
                      onClick={() => handleDisable(role.id, role.name)}
                      className="p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded transition-colors"
                      title="Disable Role"
                    >
                      <Slash className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <Link
                    to={`/rbac/roles/${role.id}`}
                    className="text-xs font-semibold text-indigo-400 hover:underline"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
