import React, { useState } from "react";
import { Key, Plus, RefreshCw } from "lucide-react";
import { APIKeyItem } from "./types";
import { MOCK_API_KEYS } from "./mockSecurityData";

export const APIKeysPage: React.FC = () => {
  const [keys] = useState<APIKeyItem[]>(MOCK_API_KEYS);

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">API Key Tokens & Secret Management</h2>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs">
          <Plus className="w-4 h-4" />
          <span>Generate API Key</span>
        </button>
      </div>

      <div className="space-y-3 font-mono">
        {keys.map((k) => (
          <div key={k.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div>
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900 uppercase">
                {k.type} Token
              </span>
              <h3 className="font-bold text-slate-100 text-sm font-sans mt-1">{k.name}</h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">Prefix: {k.prefix}</p>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-sans">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Rotate Secret</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
