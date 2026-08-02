import React from "react";
import {
  FileText, Mail, Mic, Lightbulb, BarChart2,
  Globe, BookOpen, Wand2, ClipboardList, ArrowRight,
} from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  prompt: string;
  icon: React.FC<{ className?: string }>;
  color: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: "qa1", label: "Summarize Page",     prompt: "Summarize the key information and insights from my current ERP module page.",             icon: FileText,     color: "text-indigo-400 bg-indigo-600/10" },
  { id: "qa2", label: "Explain Dashboard",  prompt: "Explain what the current dashboard is showing and what actions I should take.",           icon: BookOpen,     color: "text-sky-400 bg-sky-600/10"       },
  { id: "qa3", label: "Generate Report",    prompt: "Generate a concise executive summary report based on the current module data.",           icon: BarChart2,    color: "text-emerald-400 bg-emerald-600/10"},
  { id: "qa4", label: "Draft Announcement", prompt: "Draft a professional college announcement based on the current academic context.",        icon: Mic,          color: "text-purple-400 bg-purple-600/10" },
  { id: "qa5", label: "Draft Email",        prompt: "Draft a professional email relevant to my current task and module.",                     icon: Mail,         color: "text-amber-400 bg-amber-600/10"   },
  { id: "qa6", label: "Meeting Notes",      prompt: "Generate a structured meeting notes template for a department meeting.",                 icon: ClipboardList, color: "text-rose-400 bg-rose-600/10"    },
  { id: "qa7", label: "Recommend Action",   prompt: "Based on the current data and context, what are the top 3 actions I should take next?", icon: Lightbulb,    color: "text-yellow-400 bg-yellow-600/10" },
  { id: "qa8", label: "Translate",          prompt: "Translate the following content to the required language (placeholder — specify target language).", icon: Globe, color: "text-cyan-400 bg-cyan-600/10" },
  { id: "qa9", label: "Custom Prompt",      prompt: "",                                                                                      icon: Wand2,        color: "text-fuchsia-400 bg-fuchsia-600/10"},
];

interface AIQuickActionsProps {
  onAction: (prompt: string) => void;
}

export const AIQuickActions: React.FC<AIQuickActionsProps> = ({ onAction }) => {
  return (
    <div className="space-y-2">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">Quick Actions</div>
      <div className="grid grid-cols-3 gap-1.5">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => action.prompt && onAction(action.prompt)}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-indigo-500/40 text-center group transition-all"
              title={action.label}
            >
              <div className={`p-2 rounded-lg ${action.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400 group-hover:text-white leading-tight transition-colors">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
