import React, { useState } from "react";
import { HelpCircle, BookOpen, Video, MessageCircle, ChevronDown, ChevronUp, ExternalLink, Lightbulb, Search } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQ[] = [
  { id: "faq1",  category: "Workspace",  question: "How do I open the AI Assistant?",                    answer: "Press Ctrl+Shift+A or click the AI icon in the right sidebar. The AI dock will slide in from the right side of the workspace." },
  { id: "faq2",  category: "Workspace",  question: "How do I use the Command Palette?",                 answer: "Press Ctrl+K anywhere in the workspace to open the Command Palette. You can navigate to any module, run actions, or search across the ERP." },
  { id: "faq3",  category: "Workspace",  question: "How do I switch between workspace windows?",        answer: "Press Ctrl+Tab to open the Window Switcher, or use the Docking System at /workspace/docking to manage multiple open windows." },
  { id: "faq4",  category: "AI",         question: "Which AI provider is being used?",                  answer: "The system uses a placeholder provider by default. Administrators can plug in OpenAI, Gemini, Azure OpenAI, or Ollama via the AI Provider settings." },
  { id: "faq5",  category: "AI",         question: "Are my AI conversations saved?",                    answer: "Yes, all conversations are saved to browser localStorage. They persist across sessions until you clear your browser data or delete them manually." },
  { id: "faq6",  category: "Modules",    question: "How do I view my attendance report?",               answer: "Navigate to Academics → Attendance, or use the Command Palette and search for 'Attendance Summary'. You can also ask the AI: 'Generate an attendance summary'." },
  { id: "faq7",  category: "Modules",    question: "How do I process fee payments?",                    answer: "Go to Finance → Fee Management, select a student, and use the 'Record Payment' button. Receipts are generated automatically." },
  { id: "faq8",  category: "Settings",   question: "How do I change the workspace theme?",              answer: "Open Workspace Settings → Appearance. Choose between Dark, Light, or System theme. Accent color and density can also be customised." },
  { id: "faq9",  category: "Settings",   question: "How do I export my workspace preferences?",         answer: "Go to Workspace Settings → Export/Import. Click 'Export JSON' to download your preferences, pinned modules, and layouts." },
  { id: "faq10", category: "Workspace",  question: "What does the Productivity Hub do?",               answer: "The Productivity Hub is the right sidebar with Tasks, Notes, Calendar, Reminders, Bookmarks, and Notifications — all locally persisted." },
];

const CATEGORIES = ["All", ...new Set(FAQS.map((f) => f.category))];

const TIPS = [
  "Pin your most-used modules in the sidebar for faster access.",
  "Use the AI to draft notices and emails — just describe what you need.",
  "Double-click any workspace window title bar to maximize it.",
  "The Productivity Hub Notes auto-saves your changes every 600ms.",
  "Ctrl+K opens the Command Palette from anywhere in the ERP.",
  "Role-based workspace templates apply pre-configured module sets.",
];

export const WorkspaceHelpCenter: React.FC = () => {
  const [search,    setSearch]    = useState("");
  const [category,  setCategory]  = useState("All");
  const [expanded,  setExpanded]  = useState<string | null>(null);

  const filtered = FAQS.filter((f) => {
    const matchCat = category === "All" || f.category === category;
    const matchQ   = !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-indigo-400" />
        <span className="text-xs font-bold text-white">Help Center</span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search help…" aria-label="Search help articles"
          className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
              category === cat ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion */}
      <section aria-label="Frequently Asked Questions">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">FAQ</div>
        <div className="space-y-1.5">
          {filtered.map((f) => (
            <div key={f.id} className="rounded-xl border border-slate-800 overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === f.id ? null : f.id)}
                aria-expanded={expanded === f.id}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-3 text-left hover:bg-slate-900 transition-all"
              >
                <span className="text-xs font-semibold text-white">{f.question}</span>
                {expanded === f.id ? <ChevronUp className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}
              </button>
              {expanded === f.id && (
                <div className="px-3.5 pb-3 pt-1 border-t border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                  {f.answer}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div className="py-4 text-center text-xs text-slate-500">No results for "{search}"</div>}
        </div>
      </section>

      {/* Tips */}
      <section aria-label="Tips and tricks">
        <div className="flex items-center gap-1.5 mb-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tips & Tricks</span>
        </div>
        <div className="space-y-1.5">
          {TIPS.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <span className="text-amber-400 flex-shrink-0">💡</span>
              {tip}
            </div>
          ))}
        </div>
      </section>

      {/* Quick links */}
      <section aria-label="Documentation links">
        <div className="flex items-center gap-1.5 mb-2">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Documentation</span>
        </div>
        <div className="space-y-1">
          {[
            { label: "Workspace Guide",      href: "/docs/workspace-final.md"        },
            { label: "AI Assistant Guide",   href: "/docs/workspace-ai.md"           },
            { label: "Keyboard Shortcuts",   href: "/docs/workspace-shortcuts.md"    },
            { label: "Accessibility Guide",  href: "/docs/workspace-accessibility.md"},
          ].map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-900 text-xs text-indigo-400 hover:text-indigo-300 transition-all group">
              {label}
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </section>

      {/* Video placeholder */}
      <section>
        <div className="flex items-center gap-1.5 mb-2">
          <Video className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Video Tutorials</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 border-dashed text-center space-y-1">
          <div className="text-2xl">🎬</div>
          <div className="text-xs text-slate-400 font-semibold">Video content coming in v0.33.0</div>
          <div className="text-[10px] text-slate-600">Workspace walkthrough, AI assistant, and module guides</div>
        </div>
      </section>

      {/* Contact support */}
      <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-sm text-slate-300 hover:text-white transition-all">
        <MessageCircle className="w-4 h-4 text-indigo-400" />
        Contact Support (placeholder)
      </button>
    </div>
  );
};
