import React from "react";
import { History, Download } from "lucide-react";
import { MOCK_SECURITY_AUDIT } from "./mockSecurityData";

export const SecurityAuditPage: React.FC = () => {
  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Immutable Security Audit Logs & Access History</h2>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition-colors text-xs">
          <Download className="w-4 h-4" />
          <span>Export Audit Log</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Actor / User</th>
              <th className="p-3">Security Action</th>
              <th className="p-3">Target Resource</th>
              <th className="p-3">IP Address</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono">
            {MOCK_SECURITY_AUDIT.map((log) => (
              <tr key={log.id} className="hover:bg-slate-850">
                <td className="p-3 text-slate-400">{log.timestamp}</td>
                <td className="p-3 font-sans font-bold text-slate-100">{log.actor}</td>
                <td className="p-3 font-bold text-indigo-400">{log.action}</td>
                <td className="p-3 text-slate-300 font-sans">{log.target}</td>
                <td className="p-3 text-slate-400">{log.ipAddress}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      log.status === "Success"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        : "bg-rose-950 text-rose-300 border border-rose-800"
                    }`}
                  >
                    {log.status}
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
