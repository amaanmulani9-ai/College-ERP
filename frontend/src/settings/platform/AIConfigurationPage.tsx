import React, { useState } from "react";
import { Sparkles, Save, CheckCircle2 } from "lucide-react";
import { MOCK_AI_CONFIG } from "./mockPlatformData";

export const AIConfigurationPage: React.FC = () => {
  const [ai, setAi] = useState(MOCK_AI_CONFIG);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">AI Copilot, LLM Model Routing & Token Quotas</h2>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save AI Settings</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">AI Provider Engine</label>
          <select
            value={ai.provider}
            onChange={(e) => setAi({ ...ai, provider: e.target.value as any })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs font-mono font-bold"
          >
            <option value="Anthropic Claude">Anthropic Claude (Claude 3.5 Sonnet)</option>
            <option value="OpenAI GPT-4">OpenAI GPT-4o</option>
            <option value="Custom Azure LLM">Azure OpenAI Service</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Monthly Token Quota</label>
          <input
            type="number"
            value={ai.monthlyTokenQuota}
            onChange={(e) => setAi({ ...ai, monthlyTokenQuota: Number(e.target.value) })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs font-mono font-bold"
          />
        </div>
      </div>
    </div>
  );
};
