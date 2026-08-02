import React, { useState } from "react";
import { Send, Clock, Download, Share2, History, LayoutGrid, ExternalLink } from "lucide-react";
import { DistributionDashboard } from "./DistributionDashboard";
import { ReportScheduler } from "./ReportScheduler";
import { ReportExportCenter } from "./ReportExportCenter";
import { ReportSharingCenter } from "./ReportSharingCenter";
import { DeliveryHistory } from "./DeliveryHistory";
import { useTabs } from "../../workspace/TabContext";

export const ReportDistributionCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "scheduler" | "export" | "sharing" | "history"
  >("dashboard");

  // Workspace integration
  let openTabAction: ((tab: { title: string; route: string; iconName?: string }) => void) | null = null;
  try {
    const tabsCtx = useTabs();
    if (tabsCtx && tabsCtx.openTab) {
      openTabAction = tabsCtx.openTab;
    }
  } catch (_e) {
    openTabAction = null;
  }

  return (
    <div className="flex flex-col h-full min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 space-y-6">
      {/* Header & Sub-Navigation Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
              Enterprise Distribution Suite
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Send className="w-5 h-5 text-indigo-400" />
            <span>Report Scheduling & Multi-Channel Distribution Hub</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automate scheduled dispatches, convert 7 export formats, generate secure public/private share links, and inspect delivery logs.
          </p>
        </div>

        {openTabAction && (
          <button
            onClick={() =>
              openTabAction!({
                title: "Distribution Center",
                route: "/reporting/distribution",
                iconName: "Send",
              })
            }
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg border border-slate-700 text-xs transition-colors shrink-0"
          >
            <ExternalLink className="w-4 h-4 text-cyan-400" />
            <span>Open in Tab</span>
          </button>
        )}
      </div>

      {/* Distribution Main Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl font-semibold text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === "dashboard"
              ? "bg-indigo-600 text-white shadow-md font-bold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Distribution Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("scheduler")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === "scheduler"
              ? "bg-indigo-600 text-white shadow-md font-bold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Automated Scheduler</span>
        </button>

        <button
          onClick={() => setActiveTab("export")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === "export"
              ? "bg-indigo-600 text-white shadow-md font-bold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Universal Export Hub</span>
        </button>

        <button
          onClick={() => setActiveTab("sharing")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === "sharing"
              ? "bg-indigo-600 text-white shadow-md font-bold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Sharing & Security</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === "history"
              ? "bg-indigo-600 text-white shadow-md font-bold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Delivery Audit Logs</span>
        </button>
      </div>

      {/* Tab View Container */}
      <div className="flex-1">
        {activeTab === "dashboard" && <DistributionDashboard />}
        {activeTab === "scheduler" && <ReportScheduler />}
        {activeTab === "export" && <ReportExportCenter />}
        {activeTab === "sharing" && <ReportSharingCenter />}
        {activeTab === "history" && <DeliveryHistory />}
      </div>
    </div>
  );
};

export default ReportDistributionCenter;
