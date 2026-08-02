import React, { useState } from "react";
import { Zap } from "lucide-react";
import { AutomationRuleItem } from "./types";
import { MOCK_AUTOMATION_RULES } from "./mockPlatformData";

export const AutomationRulesPage: React.FC = () => {
  const [rules, setRules] = useState<AutomationRuleItem[]>(MOCK_AUTOMATION_RULES);

  const toggleRule = (id: string) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, isEnabled: !r.isEnabled } : r)));
  };

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Automated Workflow Rules & Scheduled Triggers</h2>
        </div>
        <button className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition-colors">
          + New Rule
        </button>
      </div>

      <div className="space-y-3 font-mono">
        {rules.map((rule) => (
          <div key={rule.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-100 text-sm font-sans">{rule.name}</h3>
              <div className="flex items-center gap-2 text-[11px] font-sans">
                <span className="text-slate-400">When:</span>
                <span className="text-amber-400 font-bold">{rule.trigger}</span>
                <span className="text-slate-500">→</span>
                <span className="text-emerald-400 font-bold">{rule.action}</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={rule.isEnabled}
              onChange={() => toggleRule(rule.id)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Rule Builder Placeholder */}
      <div className="p-4 bg-slate-950/60 border border-dashed border-slate-700 rounded-xl text-center text-slate-500">
        <Zap className="w-8 h-8 mx-auto mb-2 text-slate-700" />
        <p className="text-sm font-bold text-slate-400">Visual Rule Builder</p>
        <p className="text-[11px] text-slate-500 mt-1">Drag-and-drop automation flow designer — coming in v0.35.0</p>
      </div>
    </div>
  );
};
