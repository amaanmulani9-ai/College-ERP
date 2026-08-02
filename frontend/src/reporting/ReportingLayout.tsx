import React, { useState } from "react";
import { useReporting } from "./ReportingContext";
import { ReportSidebar } from "./ReportSidebar";
import { ReportBreadcrumbs } from "./ReportBreadcrumbs";
import { ReportToolbar } from "./ReportToolbar";
import { ReportViewer } from "./ReportViewer";
import { ReportGrid } from "./components/ReportGrid";
import { ReportTable } from "./components/ReportTable";
import { SavedReports } from "./components/SavedReports";
import { RecentReports } from "./components/RecentReports";
import { FavoriteReports } from "./components/FavoriteReports";
import { AnalyticsDashboard } from "./charts/AnalyticsDashboard";
import { ReportBuilder } from "./builder/ReportBuilder";
import { ExecutiveAnalyticsCenter } from "./executive/ExecutiveAnalyticsCenter";
import { ReportDistributionCenter } from "./distribution/ReportDistributionCenter";
import { X, Play, LayoutGrid, BarChart3, Wrench, ShieldCheck, Send } from "lucide-react";

export const ReportingLayoutContent: React.FC = () => {
  const {
    reports,
    activeCategory,
    selectedReport,
    viewMode,
    searchQuery,
    dockedReports,
    dockReport,
    setSelectedReport,
    setViewMode,
  } = useReporting();

  const [activeTabMode, setActiveTabMode] = useState<
    "catalog" | "analytics" | "builder" | "executive" | "distribution"
  >("catalog");

  // Filter reports based on activeCategory and searchQuery
  const filteredReports = reports.filter((report) => {
    const matchesCategory =
      activeCategory === "All" ||
      activeCategory === "Favorites" ||
      activeCategory === "Recent" ||
      activeCategory === "Saved" ||
      report.category === activeCategory;

    const matchesSearch =
      !searchQuery ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-full min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 font-sans">
      {/* Category Sidebar */}
      {activeTabMode === "catalog" && <ReportSidebar />}

      {/* Main Workspace Content Area */}
      <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 overflow-y-auto">
        {/* Mode Switcher Header Tabs */}
        <div className="flex items-center gap-2 mb-4 p-1 bg-slate-900 border border-slate-800 rounded-xl w-fit flex-wrap">
          <button
            onClick={() => setActiveTabMode("catalog")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTabMode === "catalog"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Report Catalog</span>
          </button>

          <button
            onClick={() => setActiveTabMode("analytics")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTabMode === "analytics"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Visual Analytics</span>
          </button>

          <button
            onClick={() => setActiveTabMode("builder")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTabMode === "builder"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span>No-Code Builder</span>
          </button>

          <button
            onClick={() => setActiveTabMode("executive")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTabMode === "executive"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Executive Center</span>
          </button>

          <button
            onClick={() => setActiveTabMode("distribution")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTabMode === "distribution"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Send className="w-3.5 h-3.5 text-violet-400" />
            <span>Distribution Hub</span>
          </button>
        </div>

        {activeTabMode === "distribution" ? (
          <ReportDistributionCenter />
        ) : activeTabMode === "executive" ? (
          <ExecutiveAnalyticsCenter />
        ) : activeTabMode === "builder" ? (
          <ReportBuilder />
        ) : activeTabMode === "analytics" ? (
          <AnalyticsDashboard />
        ) : (
          <>
            <ReportBreadcrumbs />
            <ReportToolbar />

            {/* Dynamic Main View */}
            <main className="flex-1">
              {selectedReport ? (
                <ReportViewer />
              ) : activeCategory === "Saved" ? (
                <SavedReports />
              ) : activeCategory === "Recent" ? (
                <RecentReports />
              ) : activeCategory === "Favorites" ? (
                <FavoriteReports />
              ) : viewMode === "table" ? (
                <ReportTable reports={filteredReports} />
              ) : (
                <ReportGrid reports={filteredReports} />
              )}
            </main>
          </>
        )}

        {/* Docked Reports Panel */}
        {dockedReports.length > 0 && activeTabMode === "catalog" && (
          <aside
            aria-label="Docked Reports Panel"
            className="mt-6 p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
                Docked Quick Reports ({dockedReports.length})
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {dockedReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs"
                >
                  <span className="font-mono text-indigo-400 font-bold">
                    {report.code}
                  </span>
                  <span className="text-slate-200 font-medium truncate max-w-[150px]">
                    {report.title}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedReport(report);
                      setViewMode("viewer");
                      setActiveTabMode("catalog");
                    }}
                    className="p-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded"
                    title="Open Report"
                  >
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                  <button
                    onClick={() => dockReport(report.id, "none")}
                    className="p-1 text-slate-500 hover:text-rose-400"
                    title="Undock"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export const ReportingLayout: React.FC = () => {
  return <ReportingLayoutContent />;
};
