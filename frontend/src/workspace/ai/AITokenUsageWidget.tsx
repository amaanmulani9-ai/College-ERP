import React from "react";
import { Zap, Clock, Hash, Cpu } from "lucide-react";
import type { AIUsageStats } from "./useAIWorkspace";

interface AITokenUsageWidgetProps {
  usage: AIUsageStats;
}

export const AITokenUsageWidget: React.FC<AITokenUsageWidgetProps> = ({ usage }) => {
  const stats = [
    { label: "Prompts Today",       value: usage.todayPrompts.toString(),           icon: Hash,  color: "text-indigo-400" },
    { label: "Est. Tokens",         value: usage.estimatedTokens.toLocaleString(),  icon: Zap,   color: "text-amber-400"  },
    { label: "Avg Response",        value: usage.avgResponseMs > 0 ? `${usage.avgResponseMs}ms` : "—", icon: Clock, color: "text-emerald-400" },
    { label: "Model",               value: usage.model,                             icon: Cpu,   color: "text-purple-400" },
  ];

  return (
    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI Usage — Today</div>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="p-2 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1 mb-1">
                <Icon className={`w-3 h-3 ${s.color}`} />
                <span className="text-[10px] text-slate-500">{s.label}</span>
              </div>
              <div className="text-xs font-bold text-white truncate">{s.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
