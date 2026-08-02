import React, { useState } from "react";
import { Library, ChevronRight, Search, Sparkles } from "lucide-react";

interface PromptTemplate {
  id: string;
  label: string;
  category: string;
  prompt: string;
  icon: string;
}

const PROMPT_TEMPLATES: PromptTemplate[] = [
  { id: "pt1",  label: "Attendance Summary",       category: "Academic",  icon: "📊", prompt: "Generate an attendance summary for this academic session, highlighting departments with attendance below 75%." },
  { id: "pt2",  label: "Exam Analysis",            category: "Academic",  icon: "📝", prompt: "Analyze the latest examination results and identify students at academic risk who may need counseling." },
  { id: "pt3",  label: "Student Performance",      category: "Academic",  icon: "🎓", prompt: "Provide a comprehensive student performance report for the current semester across all departments." },
  { id: "pt4",  label: "Fee Reminder Draft",       category: "Finance",   icon: "💰", prompt: "Draft a polite but firm fee payment reminder notice for students with outstanding dues this semester." },
  { id: "pt5",  label: "Notice Draft",             category: "Admin",     icon: "📢", prompt: "Draft a formal college notice about the upcoming semester examination schedule changes." },
  { id: "pt6",  label: "Email Draft",              category: "Admin",     icon: "✉️", prompt: "Draft a professional email to parents about academic calendar updates and upcoming events." },
  { id: "pt7",  label: "Timetable Summary",        category: "Academic",  icon: "🕐", prompt: "Summarize the current timetable conflicts and suggest optimized scheduling for the CS department." },
  { id: "pt8",  label: "Placement Recommendation", category: "Careers",   icon: "💼", prompt: "Recommend top placement-ready students based on academic records, skills, and placement eligibility criteria." },
  { id: "pt9",  label: "Leave Recommendation",     category: "HR",        icon: "📋", prompt: "Review the pending leave requests and recommend approval decisions based on department workload." },
  { id: "pt10", label: "Library Usage Report",     category: "Library",   icon: "📚", prompt: "Generate a library utilization report showing book issue/return trends and overdue statistics." },
  { id: "pt11", label: "Transport Route Analysis", category: "Transport", icon: "🚌", prompt: "Analyze transport route efficiency and identify optimization opportunities based on current ridership." },
  { id: "pt12", label: "HR Overview",              category: "HR",        icon: "👥", prompt: "Provide an HR overview summary including staff attendance, pending leaves, and recruitment status." },
];

const CATEGORIES = ["All", ...new Set(PROMPT_TEMPLATES.map((t) => t.category))];

interface AIPromptLauncherProps {
  onSelect: (prompt: string) => void;
}

export const AIPromptLauncher: React.FC<AIPromptLauncherProps> = ({ onSelect }) => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = PROMPT_TEMPLATES.filter((t) => {
    const matchCat = activeCategory === "All" || t.category === activeCategory;
    const matchQ   = !search || t.label.toLowerCase().includes(search.toLowerCase()) || t.prompt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="flex flex-col h-full space-y-2">
      <div className="flex items-center gap-2">
        <Library className="w-4 h-4 text-indigo-400 flex-shrink-0" />
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
              activeCategory === cat ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Templates */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {filtered.map((t) => (
          <button key={t.id} onClick={() => onSelect(t.prompt)}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-indigo-500/40 text-left group transition-all">
            <span className="text-lg flex-shrink-0 leading-none">{t.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">{t.label}</div>
              <div className="text-[10px] text-slate-500 truncate">{t.category}</div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="py-6 text-center text-xs text-slate-500">No matching templates.</div>
        )}
      </div>
    </div>
  );
};
