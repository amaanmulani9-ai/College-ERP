import React, { useEffect, useState } from "react";
import { Users, Shield, Plus, Trash2 } from "lucide-react";
import { rbacService, RoleItem } from "../services/rbacService";

export const AssignRolesPage: React.FC = () => {
  const [roleMatrix, setRoleMatrix] = useState<{ roles: RoleItem[]; matrix: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatrix();
  }, []);

  const fetchMatrix = async () => {
    try {
      const data = await rbacService.getRoleMatrix();
      setRoleMatrix(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (userId: string, roleId: string, currentAssigned: boolean) => {
    try {
      if (currentAssigned) {
        await rbacService.removeRoleFromUser(userId, roleId);
      } else {
        await rbacService.assignRoleToUser(userId, roleId);
      }
      fetchMatrix();
    } catch (err) {
      alert("Failed to update user role assignment.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading Role Assignments...</div>;
  }

  if (!roleMatrix) {
    return <div className="p-8 text-center text-xs text-slate-400">Failed to load user roles.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-400" />
          User Multi-Role Assignments
        </h1>
        <p className="text-xs text-slate-400">Assign or remove multiple roles for user accounts.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto shadow-lg">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-semibold text-slate-400">
            <tr>
              <th className="p-3.5 sticky left-0 bg-slate-950 min-w-[200px]">User Account</th>
              {roleMatrix.roles.map((role) => (
                <th key={role.id} className="p-3.5 text-center min-w-[120px]">
                  {role.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {roleMatrix.matrix.map((userRow) => (
              <tr key={userRow.user_id} className="hover:bg-slate-800/40">
                <td className="p-3.5 sticky left-0 bg-slate-900 border-r border-slate-800">
                  <p className="font-semibold text-slate-200">{userRow.full_name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{userRow.email}</p>
                </td>
                {roleMatrix.roles.map((role) => {
                  const isAssigned = userRow.roles[role.id];
                  return (
                    <td key={role.id} className="p-3.5 text-center">
                      <button
                        onClick={() => handleToggle(userRow.user_id, role.id, isAssigned)}
                        className={`w-6 h-6 rounded flex items-center justify-center mx-auto transition-colors ${
                          isAssigned
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-slate-300"
                        }`}
                      >
                        {isAssigned ? "✓" : "+"}
                      </button>
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
