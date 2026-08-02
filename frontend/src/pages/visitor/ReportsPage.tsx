import React, { useState } from "react";
import {
  PageContainer,
  PageHeader,
  Button,
} from "../../design-system";
import { FileSpreadsheet, Download, Printer } from "lucide-react";

export const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("daily_visitor");

  const reportsList = [
    { id: "daily_visitor", label: "Daily Visitor Log Report", desc: "Detailed daily campus check-in and check-out timestamps with host details" },
    { id: "department_visitor", label: "Department Visit Report", desc: "Department-wise visitor volume and meeting purpose breakdown" },
    { id: "gate_activity", label: "Gate Activity Report", desc: "Gate entrance/exit traffic comparison across all campus gates" },
    { id: "delivery_report", label: "Courier Delivery Report", desc: "Inward parcel deliveries, courier companies, and recipient statuses" },
    { id: "contractor_report", label: "Contractor Workforce Report", desc: "Facility maintenance contractor passes and authorized campus zone access" },
    { id: "security_report", label: "Security Officer Roster Report", desc: "Security guard shifts, gate assignments, and audit logs" },
    { id: "blacklist_report", label: "Security Blacklist Report", desc: "Blocked visitor directory, reasons, and security blockade records" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Visitor & Security Reports & Gate Analytics Suite"
        subtitle="Generate, preview and export daily visitor, gate activity, delivery, contractor & security reports"
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
            [Showing sample security log data for report type: <span className="text-indigo-400 font-mono">{activeTab}</span>]
          </div>
          <p className="text-xs text-slate-500">Full campus security dataset available upon export.</p>
        </div>
      </div>
    </PageContainer>
  );
};
