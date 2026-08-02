import React, { useState } from "react";
import { Flag } from "lucide-react";
import { FeatureFlagItem } from "./types";
import { MOCK_FEATURE_FLAGS } from "./mockPlatformData";

export const FeatureFlagsPage: React.FC = () => {
  const [flags, setFlags] = useState<FeatureFlagItem[]>(MOCK_FEATURE_FLAGS);

  const toggleFlag = (id: string) => {
    setFlags(flags.map((f) => (f.id === id ? { ...f, isEnabled: !f.isEnabled } : f)));
  };

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <Flag className="w-5 h-5 text-indigo-400" />
        <h2 className="text-base font-bold text-slate-100">Experimental & Preview Feature Flag Management</h2>
      </div>

      <div className="space-y-3 font-mono">
        {flags.map((f) => (
          <div key={f.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                    f.environment === "Production"
                      ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                      : f.environment === "Beta"
                      ? "bg-amber-950 text-amber-300 border-amber-800"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  {f.environment}
                </span>
                <code className="text-indigo-400 text-[10px] font-mono">{f.key}</code>
              </div>
              <h3 className="font-bold text-slate-100 text-sm font-sans">{f.name}</h3>
            </div>
            <input
              type="checkbox"
              checked={f.isEnabled}
              onChange={() => toggleFlag(f.id)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
