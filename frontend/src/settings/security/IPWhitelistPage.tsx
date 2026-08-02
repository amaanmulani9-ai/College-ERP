import React, { useState } from "react";
import { ShieldAlert, Plus } from "lucide-react";
import { IPWhitelistItem } from "./types";
import { MOCK_IP_WHITELIST } from "./mockSecurityData";

export const IPWhitelistPage: React.FC = () => {
  const [ips] = useState<IPWhitelistItem[]>(MOCK_IP_WHITELIST);

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">IP Whitelist Rules & Firewall Range Filters</h2>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs">
          <Plus className="w-4 h-4" />
          <span>Add IP Rule</span>
        </button>
      </div>

      <div className="space-y-3 font-mono">
        {ips.map((ip) => (
          <div key={ip.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                  ip.type === "Allowed"
                    ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                    : "bg-rose-950 text-rose-300 border-rose-800"
                }`}
              >
                {ip.type}
              </span>
              <h3 className="font-bold text-slate-100 text-sm font-mono mt-1">{ip.ipAddress}</h3>
              <p className="text-[11px] text-slate-400 font-sans">{ip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
