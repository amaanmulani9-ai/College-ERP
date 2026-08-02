import React from "react";
import { MapPin, User, Building2, BookOpen, Navigation } from "lucide-react";
import type { AIContext } from "./useAIWorkspace";

interface AIContextPanelProps {
  context: AIContext;
}

export const AIContextPanel: React.FC<AIContextPanelProps> = ({ context }) => {
  const rows = [
    { icon: MapPin,    label: "Module",           value: context.module.charAt(0).toUpperCase() + context.module.slice(1) },
    { icon: Navigation,label: "Page",             value: context.page     },
    { icon: User,      label: "Role",             value: context.userRole },
    { icon: Building2, label: "Tenant",           value: context.tenant   },
    { icon: BookOpen,  label: "Academic Session", value: context.academicSession },
  ];

  return (
    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI Context</div>
        <span className="px-1.5 py-0.5 rounded bg-indigo-600/20 text-[10px] text-indigo-300 font-bold">Auto-detected</span>
      </div>
      <div className="space-y-1.5">
        {rows.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.label} className="flex items-center gap-2 text-[11px]">
              <Icon className="w-3 h-3 text-indigo-400 flex-shrink-0" />
              <span className="text-slate-500 w-28 flex-shrink-0">{r.label}</span>
              <span className="text-slate-300 truncate font-medium">{r.value}</span>
            </div>
          );
        })}
      </div>
      <div className="text-[10px] text-slate-600 border-t border-slate-800 pt-2">
        Context is passed as metadata to every AI prompt automatically.
      </div>
    </div>
  );
};
