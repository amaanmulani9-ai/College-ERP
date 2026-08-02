import React, { useState } from "react";
import {
  ArrowLeft,
  Star,
  Pin,
  ExternalLink,
  Download,
  Printer,
  RefreshCw,
  Dock,
  CheckCircle2,
  TrendingUp,
  Users,
  DollarSign,
  FileSpreadsheet,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useReporting } from "./ReportingContext";
import { ReportFilters } from "./components/ReportFilters";

export const ReportViewer: React.FC = () => {
  const {
    selectedReport,
    setSelectedReport,
    toggleFavorite,
    togglePin,
    dockReport,
    openInWorkspaceTab,
    dateRange,
    setViewMode,
  } = useReporting();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<"table" | "chart" | "audit">("table");
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!selectedReport) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <FileSpreadsheet className="w-12 h-12 text-slate-600 mb-3" />
        <p className="text-sm">Select a report from the catalog to view details.</p>
      </div>
    );
  }

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // Mock table dataset generator based on selected report
  const mockTableRows = [
    { id: "1", col1: "DEP-CS-101", col2: "B.Tech Computer Science", col3: "Semester 4", col4: "450 Enrolled", status: "Active", metric: "92.4%" },
    { id: "2", col1: "DEP-ECE-204", col2: "Electronics & Communication", col3: "Semester 6", col4: "320 Enrolled", status: "Active", metric: "88.1%" },
    { id: "3", col1: "DEP-ME-302", col2: "Mechanical Engineering", col3: "Semester 2", col4: "280 Enrolled", status: "Pending", metric: "79.5%" },
    { id: "4", col1: "DEP-AI-405", col2: "Artificial Intelligence & ML", col3: "Semester 4", col4: "190 Enrolled", status: "Active", metric: "96.8%" },
    { id: "5", col1: "DEP-CIV-501", col2: "Civil Infrastructure", col3: "Semester 8", col4: "210 Enrolled", status: "Completed", metric: "91.0%" },
  ];

  return (
    <div
      className={`bg-slate-900/90 border border-slate-800 rounded-xl transition-all duration-300 shadow-2xl flex flex-col ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none p-6 bg-slate-950 overflow-y-auto" : "p-6"
      }`}
      aria-label={`Report Viewer: ${selectedReport.title}`}
    >
      {/* Top Navigation & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedReport(null);
              setViewMode("grid");
            }}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
            title="Back to Catalog"
            aria-label="Back to Catalog"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800/60">
                {selectedReport.code}
              </span>
              <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                {selectedReport.category}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-100 mt-1">
              {selectedReport.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Favorite & Pin */}
          <button
            onClick={() => toggleFavorite(selectedReport.id)}
            className={`p-2 rounded-lg border transition-colors ${
              selectedReport.isFavorite
                ? "bg-amber-950/60 border-amber-700 text-amber-400"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
            title={selectedReport.isFavorite ? "Starred Favorite" : "Add to Favorites"}
          >
            <Star className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={() => togglePin(selectedReport.id)}
            className={`p-2 rounded-lg border transition-colors ${
              selectedReport.isPinned
                ? "bg-indigo-950/60 border-indigo-700 text-indigo-400"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
            title={selectedReport.isPinned ? "Pinned" : "Pin Report"}
          >
            <Pin className="w-4 h-4" />
          </button>

          {/* Dock Button */}
          <button
            onClick={() =>
              dockReport(
                selectedReport.id,
                selectedReport.dockedPosition === "right" ? "none" : "right"
              )
            }
            className={`p-2 rounded-lg border transition-colors ${
              selectedReport.dockedPosition && selectedReport.dockedPosition !== "none"
                ? "bg-cyan-950/60 border-cyan-700 text-cyan-400"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
            title="Dock to Workspace Side Panel"
          >
            <Dock className="w-4 h-4" />
          </button>

          {/* Workspace Tab Button */}
          <button
            onClick={() => openInWorkspaceTab(selectedReport)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            title="Open as Workspace Tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Tab</span>
          </button>

          {/* Refresh */}
          <button
            onClick={handleRefreshData}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
            title="Refresh Report Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-indigo-400" : ""}`} />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Embedded Filter Controls */}
      <ReportFilters report={selectedReport} />

      {/* Metric KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Total Records Analyzed</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">1,460</div>
          <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +12.4% vs last period
          </span>
        </div>

        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Report Compliance Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">98.2%</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Verified & Audited</span>
        </div>

        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Financial Value</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">$284,500</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Period Aggregated Total</span>
        </div>

        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Execution Duration</span>
            <RefreshCw className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">142ms</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Real-time DB query</span>
        </div>
      </div>

      {/* Tabs View (Table Data / Visual Analytics / Audit Log) */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("table")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === "table"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            Data Table (5)
          </button>
          <button
            onClick={() => setActiveTab("chart")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === "chart"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            Visual Analytics
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === "audit"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            Audit Trail
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
          <button className="flex items-center gap-1 text-xs text-indigo-300 bg-indigo-950 hover:bg-indigo-900 px-3 py-1.5 rounded-lg border border-indigo-800">
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Tab Content Display */}
      {activeTab === "table" && (
        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 font-semibold uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Reference Code</th>
                <th className="p-3">Department / Program</th>
                <th className="p-3">Semester</th>
                <th className="p-3">Total Volume</th>
                <th className="p-3">Metric Score</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mockTableRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3 font-mono font-bold text-indigo-400">{row.col1}</td>
                  <td className="p-3 font-semibold text-slate-200">{row.col2}</td>
                  <td className="p-3 text-slate-400">{row.col3}</td>
                  <td className="p-3 text-slate-300">{row.col4}</td>
                  <td className="p-3 font-mono text-emerald-400 font-bold">{row.metric}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "chart" && (
        <div className="p-8 bg-slate-950 border border-slate-800 rounded-lg flex flex-col items-center justify-center text-center">
          <TrendingUp className="w-12 h-12 text-indigo-400 mb-3" />
          <h3 className="text-base font-semibold text-slate-200">Interactive Visual Analytics Engine</h3>
          <p className="text-xs text-slate-400 max-w-md mt-1 mb-4">
            Displaying real-time graphical breakdown for date range ({dateRange.startDate} to {dateRange.endDate}).
          </p>
          <div className="w-full h-40 bg-indigo-950/30 border border-indigo-800/40 rounded-lg flex items-end justify-around p-4 gap-2">
            <div className="w-12 bg-indigo-600 h-[60%] rounded-t"></div>
            <div className="w-12 bg-indigo-500 h-[85%] rounded-t"></div>
            <div className="w-12 bg-indigo-400 h-[40%] rounded-t"></div>
            <div className="w-12 bg-indigo-600 h-[95%] rounded-t"></div>
            <div className="w-12 bg-indigo-500 h-[75%] rounded-t"></div>
          </div>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
          <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">Execution Audit Trail</h4>
          <div className="text-xs font-mono space-y-2 text-slate-400">
            <div className="p-2 bg-slate-900 border border-slate-800 rounded flex justify-between">
              <span>[2026-08-02 11:15:02] Query compiled successfully (142ms)</span>
              <span className="text-emerald-400 font-bold">PASS</span>
            </div>
            <div className="p-2 bg-slate-900 border border-slate-800 rounded flex justify-between">
              <span>[2026-08-02 11:15:00] User RBAC permission verified for module: {selectedReport.module}</span>
              <span className="text-emerald-400 font-bold">AUTHORIZED</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
