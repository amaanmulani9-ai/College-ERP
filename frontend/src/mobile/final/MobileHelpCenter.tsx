import React, { useState } from "react";
import { HelpCircle, Search, Smartphone, WifiOff, Download, ChevronRight, BookOpen } from "lucide-react";

export const MobileHelpCenter: React.FC = () => {
  const [query, setQuery] = useState("");

  const FAQS = [
    { q: "How do I install the ERP as a PWA on iOS/Android?", a: "Tap 'Install App' banner in PWA Settings, or open browser menu and choose 'Add to Home Screen'." },
    { q: "Can I take attendance while completely offline?", a: "Yes! Offline attendance scans are saved in local storage queue and automatically synced when reconnected." },
    { q: "How do I switch active role view (Super Admin vs Teacher)?", a: "Tap the Role Switcher dropdown at the top of Mobile Dashboard to instantly toggle active role views." },
    { q: "What mobile gestures are supported?", a: "Swipe left/right to switch workspace tabs, pull down to refresh notifications, and tap-and-hold to pin favorite modules." },
  ];

  const filteredFaqs = FAQS.filter(f => !query || f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <HelpCircle className="w-4 h-4 text-indigo-400" />
        <h3 className="font-bold text-slate-100 text-xs">Mobile Help & Guidance Center</h3>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
        <input
          type="text"
          placeholder="Search mobile help, FAQs, & gestures…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* FAQs List */}
      <div className="space-y-2">
        {filteredFaqs.map((faq, idx) => (
          <div key={idx} className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1">
            <p className="font-bold text-indigo-300 text-[11px]">{faq.q}</p>
            <p className="text-[10px] text-slate-400 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
