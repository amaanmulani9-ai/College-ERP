import React, { useState } from "react";
import {
  PageContainer,
  PageHeader,
  Button,
} from "../../design-system";
import { FileSpreadsheet, Download, Filter, Printer } from "lucide-react";

export const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("asset_register");

  const reportsList = [
    { id: "asset_register", label: "Asset Register", desc: "Master institutional fixed asset register with purchasing cost and valuation" },
    { id: "department_assets", label: "Department Assets", desc: "Breakdown of fixed assets allocated per academic and administrative department" },
    { id: "maintenance_cost", label: "Maintenance Cost Report", desc: "Cost analysis for preventive, corrective, and emergency maintenance services" },
    { id: "depreciation", label: "Depreciation Report", desc: "SLM and WDV annual financial depreciation ledger for accounting" },
    { id: "warranty", label: "Warranty Report", desc: "Active, expiring, and claimed warranty card summary" },
    { id: "audit", label: "Audit Verification Report", desc: "Physical inventory audit results and discrepancy reports" },
    { id: "disposal", label: "Disposal Report", desc: "Decommissioned assets disposed via auction, scrap, or donation" },
    { id: "utilization", label: "Asset Utilization Report", desc: "Custody and utilization rate across labs, classrooms, and offices" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Asset Management Reports Suite"
        subtitle="Institutional fixed asset, maintenance, depreciation, warranty & audit reports"
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
            [Showing 50 sample records for report type: <span className="text-indigo-400 font-mono">{activeTab}</span>]
          </div>
          <p className="text-xs text-slate-500">Full report dataset available upon export.</p>
        </div>
      </div>
    </PageContainer>
  );
};
