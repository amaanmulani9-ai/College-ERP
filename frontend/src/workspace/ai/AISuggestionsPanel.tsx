import React from "react";
import { Lightbulb, TrendingUp, FileBarChart, ChevronRight } from "lucide-react";

interface Suggestion {
  id: string;
  type: "prompt" | "report" | "action";
  label: string;
  reason: string;
  prompt: string;
}

const SUGGESTIONS: Suggestion[] = [
  { id: "sg1", type: "action",  label: "Follow up on overdue fees",        reason: "23 students have overdue fees > 30 days",      prompt: "List students with overdue fees older than 30 days and draft a follow-up communication plan." },
  { id: "sg2", type: "report",  label: "Monthly attendance digest",        reason: "End-of-month approaching",                     prompt: "Generate a monthly attendance digest for all departments for the current month." },
  { id: "sg3", type: "prompt",  label: "Placement eligibility check",      reason: "Campus drives scheduled next week",            prompt: "Identify students eligible for upcoming campus placement drives based on CGPA, backlogs, and attendance." },
  { id: "sg4", type: "action",  label: "Review pending leave requests",    reason: "5 requests pending > 48 hours",                prompt: "Review the 5 oldest pending leave requests and suggest approval or rejection based on workload." },
  { id: "sg5", type: "report",  label: "Library overdue report",           reason: "12 books overdue this week",                  prompt: "Generate a library overdue report with student names, book titles, and fine calculations." },
  { id: "sg6", type: "prompt",  label: "AI knowledge base summary",       reason: "Recently updated knowledge base",              prompt: "Summarize the latest additions to the AI knowledge base and their relevance to current operations." },
];

const TYPE_COLORS = {
  prompt: "text-indigo-300 bg-indigo-600/10 border-indigo-600/30",
  report: "text-emerald-300 bg-emerald-600/10 border-emerald-600/30",
  action: "text-amber-300 bg-amber-600/10 border-amber-600/30",
};

const TYPE_ICONS = {
  prompt: Lightbulb,
  report: FileBarChart,
  action: TrendingUp,
};

interface AISuggestionsPanelProps {
  onSelect: (prompt: string) => void;
}

export const AISuggestionsPanel: React.FC<AISuggestionsPanelProps> = ({ onSelect }) => {
  return (
    <div className="space-y-2">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center gap-1.5">
        <Lightbulb className="w-3 h-3 text-amber-400" /> AI Suggestions
      </div>
      <div className="space-y-1.5">
        {SUGGESTIONS.map((s) => {
          const Icon = TYPE_ICONS[s.type];
          return (
            <button key={s.id} onClick={() => onSelect(s.prompt)}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-indigo-500/40 text-left group transition-all">
              <div className={`p-1.5 rounded-lg border flex-shrink-0 ${TYPE_COLORS[s.type]}`}>
                <Icon className="w-3 h-3" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">{s.label}</div>
                <div className="text-[10px] text-slate-500 truncate">{s.reason}</div>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
