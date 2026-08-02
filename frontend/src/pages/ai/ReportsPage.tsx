import React, { useState } from "react";
import {
  PageContainer,
  PageHeader,
  Button,
} from "../../design-system";
import { FileSpreadsheet, Download, Printer } from "lucide-react";

export const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("usage");

  const reportsList = [
    { id: "usage", label: "AI Token & Usage Report", desc: "Detailed breakdown of token consumption, latency, and query volume by user role" },
    { id: "prompt_usage", label: "Prompt Popularity Report", desc: "Most frequently utilized prompt templates and usage distribution" },
    { id: "feedback_report", label: "User Feedback Report", desc: "Satisfaction ratings, accuracy scores, and feedback comment trends" },
    { id: "recommendation_report", label: "AI Recommendations Report", desc: "Predictive student risk warnings, attendance alerts, and placement matches" },
    { id: "knowledge_report", label: "Knowledge Base Coverage Report", desc: "Indexed RAG documents, search frequency, and article coverage" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="AI Analytics & Performance Reports Suite"
        subtitle="Generate, preview and export AI token usage, prompt template popularity, user feedback & recommendation reports"
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" leftIcon={<Printer className="w-4 h-4" />}>
              Print Report
            </Button>
            <Button variant="primary" leftIcon={<Download className="w-4 h-4" />}>
              Export CSV / PDF
            </Button>
          </div>
        }
      />

      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-800 my-4">
        {reportsList.map((r) => (
          <button
            key={r.id}
            onClick={() => setActiveTab(r.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeTab === r.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-slate-200"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
          {reportsList.find((r) => r.id === activeTab)?.label}
        </h3>
        <p className="text-xs text-slate-400">
          {reportsList.find((r) => r.id === activeTab)?.desc}
        </p>

        <div className="p-8 rounded-xl bg-slate-950 border border-slate-800/80 text-center space-y-3">
          <div className="text-xs text-slate-400">Report Preview Window</div>
          <div className="text-sm font-semibold text-slate-200">
            [Showing sample AI metrics dataset for report type: <span className="text-indigo-400 font-mono">{activeTab}</span>]
          </div>
          <p className="text-xs text-slate-500">Full institutional dataset available upon export.</p>
        </div>
      </div>
    </PageContainer>
  );
};
