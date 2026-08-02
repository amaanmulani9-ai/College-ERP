import React, { useState } from "react";
import {
  PageContainer,
  PageHeader,
  Button,
} from "../../design-system";
import { FileSpreadsheet, Download, Printer } from "lucide-react";

export const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("alumni_report");

  const reportsList = [
    { id: "alumni_report", label: "Alumni Directory Report", desc: "Complete registered alumni list by batch, status, and department" },
    { id: "employment_report", label: "Employment Report", desc: "Corporate employment distribution by industry sectors and compensation tiers" },
    { id: "donation_report", label: "Donation Report", desc: "Fundraising campaign contributions, donor receipts, and completed amounts" },
    { id: "event_report", label: "Event Report", desc: "Global reunions, webinars, and chapter events attendance statistics" },
    { id: "mentorship_report", label: "Mentorship Report", desc: "Active mentor-mentee assignments and mentorship program progress" },
    { id: "chapter_report", label: "Chapter Report", desc: "City and country wise alumni chapter distribution and coordinator details" },
    { id: "job_referral_report", label: "Job Referral Report", desc: "Alumni job referrals and open position statistics" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Alumni System Reports & Analytics Suite"
        subtitle="Generate, preview and export institutional alumni, employment, donation, event & mentorship reports"
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
            [Showing sample analytics data for report type: <span className="text-indigo-400 font-mono">{activeTab}</span>]
          </div>
          <p className="text-xs text-slate-500">Full institutional alumni dataset available upon export.</p>
        </div>
      </div>
    </PageContainer>
  );
};
