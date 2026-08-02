import React, { useState } from "react";
import { HelpCircle, Search, Video, FileText, ExternalLink } from "lucide-react";

export const ReportingHelpCenter: React.FC = () => {
  const [search, setSearch] = useState("");

  const faqs = [
    {
      q: "How do I build a custom multi-module report?",
      a: "Open the No-Code Report Builder tab, select your module data source from the Field Explorer, drag desired elements (Tables, Charts, KPI cards) onto the 12-column grid canvas, and click Save Draft.",
    },
    {
      q: "Can I schedule automated weekly emails of fee defaulters?",
      a: "Yes! Navigate to the Distribution Hub -> Automated Scheduler -> New Scheduled Task. Choose 'Weekly Attendance Defaulter Audit' or your custom report, select PDF/Excel format, add recipient roles, and set execution time.",
    },
    {
      q: "Where do I find Executive Dashboards for Principal or CFO?",
      a: "Click Executive Center in the top navigation tab mode. Use the left sidebar to switch between 11 leadership perspectives or 4 Cross-Module flows.",
    },
  ];

  return (
    <div className="space-y-4 text-xs font-sans">
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-1">
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          <span>Reporting Platform Help & Documentation Center</span>
        </h2>
        <p className="text-slate-400">
          Search platform guides, video tutorials, chart math definitions, and developer docs.
        </p>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search help articles (e.g. Builder formulas, Scheduled emails)..."
          className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 font-medium"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
            <h4 className="font-bold text-indigo-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 shrink-0 text-indigo-400" />
              <span>{faq.q}</span>
            </h4>
            <p className="text-slate-300 text-[11px] leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
