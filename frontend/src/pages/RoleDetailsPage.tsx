import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldCheck, Plus, Trash2, ArrowLeft } from "lucide-react";
import { rbacService, RoleItem, PermissionItem } from "../services/rbacService";

export const RoleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [role, setRole] = useState<RoleItem | null>(null);
  const [allPermissions, setAllPermissions] = useState<PermissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerm, setSelectedPerm] = useState("");

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const [rData, pData] = await Promise.all([
        rbacService.getRole(id!),
        rbacService.getPermissions(),
      ]);
      setRole(rData);
      setAllPermissions(pData.results || pData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedPerm || !id) return;
    try {
      await rbacService.assignPermissionToRole(id, selectedPerm);
      setSelectedPerm("");
      fetchData();
    } catch (err) {
      alert("Failed to assign permission.");
    }
  };

  const handleRemove = async (permId: string) => {
    if (!id) return;
    try {
      await rbacService.removePermissionFromRole(id, permId);
      fetchData();
    } catch (err) {
      alert("Failed to remove permission.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading role details...</div>;
  }

  if (!role) {
    return <div className="p-8 text-center text-xs text-slate-400">Role not found.</div>;
  }

  const assignedPermIds = new Set(role.permissions?.map((p) => p.id) || []);
  const availablePerms = allPermissions.filter((p) => !assignedPermIds.has(p.id));

  return (
    <div className="space-y-6">
      <Link to="/rbac/roles" className="inline-flex items-center text-xs text-indigo-400 hover:underline">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Roles
      </Link>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-100">{role.name}</h1>
          <span className="text-xs font-mono px-2.5 py-1 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-lg">
            Priority: {role.priority}
          </span>
        </div>
        <p className="text-xs text-slate-400">{role.description}</p>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <h2 className="text-sm font-bold text-slate-200">Assign New Permission</h2>
        <div className="flex items-center gap-3 max-w-md">
          <select
            value={selectedPerm}
            onChange={(e) => setSelectedPerm(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">-- Select Permission Code --</option>
            {availablePerms.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAssign}
            disabled={!selectedPerm}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-4 h-4" /> Assign
          </button>
        </div>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <h2 className="text-sm font-bold text-slate-200">Assigned Permissions ({role.permissions?.length || 0})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {role.permissions?.map((perm) => (
            <div key={perm.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-indigo-400 font-semibold">{perm.code}</p>
                <p className="text-[11px] text-slate-400">{perm.name}</p>
              </div>
              <button
                onClick={() => handleRemove(perm.id)}
                className="p-1.5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded transition-colors"
                title="Remove Permission"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
