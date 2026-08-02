import React, { useState } from "react";
import { Boxes } from "lucide-react";
import { ERPModuleFlag } from "./types";
import { MOCK_ERP_MODULE_FLAGS } from "./mockPlatformData";

export const ModuleConfigurationPage: React.FC = () => {
  const [modules, setModules] = useState<ERPModuleFlag[]>(MOCK_ERP_MODULE_FLAGS);

  const toggleModule = (id: string) => {
    setModules(
      modules.map((m) => (m.id === id ? { ...m, isEnabled: !m.isEnabled } : m))
    );
  };

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Boxes className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">30 ERP Core Module Toggles & Licensing Visibility</h2>
        </div>
      </div>

      <div className="space-y-3 font-mono">
        {modules.map((m) => (
          <div key={m.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900">
                  {m.code}
                </span>
                {m.isBeta && (
                  <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-900 uppercase">
                    Beta
                  </span>
                )}
                <h3 className="font-bold text-slate-100 text-sm font-sans">{m.name}</h3>
              </div>
            </div>

            <input
              type="checkbox"
              checked={m.isEnabled}
              onChange={() => toggleModule(m.id)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
