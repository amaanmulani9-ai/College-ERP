import React, { useState } from "react";
import { Mail, Plus } from "lucide-react";
import { EmailTemplateItem } from "./types";
import { MOCK_EMAIL_TEMPLATES } from "./mockPlatformData";

export const EmailTemplatesPage: React.FC = () => {
  const [templates] = useState<EmailTemplateItem[]>(MOCK_EMAIL_TEMPLATES);

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Transactional Email Template Library</h2>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs">
          <Plus className="w-4 h-4" />
          <span>New Template</span>
        </button>
      </div>

      <div className="space-y-3 font-mono">
        {templates.map((tpl) => (
          <div key={tpl.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div>
              <span className="text-[9px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900 uppercase">
                {tpl.category}
              </span>
              <h3 className="font-bold text-slate-100 text-sm font-sans mt-1">{tpl.subject}</h3>
              <p className="text-[11px] text-slate-400 font-sans">Trigger: {tpl.triggerEvent}</p>
            </div>
            <span className="text-[10px] text-slate-500">{tpl.lastUpdated}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
