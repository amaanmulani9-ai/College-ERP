import React, { useEffect, useState } from "react";
import { Table, Check, X } from "lucide-react";
import { rbacService, PermissionItem } from "../services/rbacService";

export const PermissionMatrixPage: React.FC = () => {
  const [matrixData, setMatrixData] = useState<{ permissions: PermissionItem[]; matrix: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    rbacService
      .getPermissionMatrix()
      .then((data) => setMatrixData(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading Permission Matrix...</div>;
  }

  if (!matrixData) {
    return <div className="p-8 text-center text-xs text-slate-400">Failed to load matrix data.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Table className="w-6 h-6 text-indigo-400" />
          Role ↔ Permission Matrix
        </h1>
        <p className="text-xs text-slate-400">Visual mapping of active roles and granted permissions.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto shadow-lg">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-semibold text-slate-400">
            <tr>
              <th className="p-3.5 sticky left-0 bg-slate-950 min-w-[160px]">Role / Permission</th>
              {matrixData.permissions.map((perm) => (
                <th key={perm.id} className="p-3.5 text-center font-mono text-[10px] text-indigo-400 min-w-[100px]" title={perm.name}>
                  {perm.code}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {matrixData.matrix.map((row) => (
              <tr key={row.role_id} className="hover:bg-slate-800/40">
                <td className="p-3.5 font-bold text-slate-200 sticky left-0 bg-slate-900 border-r border-slate-800">
                  {row.role_name}
                </td>
                {matrixData.permissions.map((perm) => {
                  const hasPerm = row.permissions[perm.code];
                  return (
                    <td key={perm.id} className="p-3.5 text-center">
                      {hasPerm ? (
                        <div className="inline-flex p-1 bg-emerald-500/10 text-emerald-400 rounded">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="inline-flex p-1 text-slate-600">
                          <X className="w-3.5 h-3.5" />
                        </div>
                      )}
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
