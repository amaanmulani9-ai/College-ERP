import React, { useState } from "react";
import { Plug, Plus } from "lucide-react";
import { IntegrationAppItem } from "./types";
import { MOCK_INTEGRATIONS } from "./mockPlatformData";

export const IntegrationCenterPage: React.FC = () => {
  const [integrations] = useState<IntegrationAppItem[]>(MOCK_INTEGRATIONS);

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Plug className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Third-Party App & Cloud Service Integrations</h2>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs">
          <Plus className="w-4 h-4" />
          <span>Connect App</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((app) => (
          <div key={app.id} className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900 uppercase">
                {app.category}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                  app.status === "Connected"
                    ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                    : "bg-amber-950 text-amber-300 border-amber-800"
                }`}
              >
                {app.status}
              </span>
            </div>
            <h3 className="font-bold text-slate-100 text-sm font-sans">{app.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};
