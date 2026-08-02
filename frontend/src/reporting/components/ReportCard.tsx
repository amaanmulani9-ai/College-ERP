import React, { useState } from "react";
import {
  Star,
  Pin,
  ExternalLink,
  Play,
  Dock,
  BookOpen,
  FileText,
  UserPlus,
  Calendar,
  Award,
  BarChart2,
  Users,
  Briefcase,
  UserCheck,
  DollarSign,
  PieChart,
  CreditCard,
  ShieldCheck,
  Truck,
  Book,
  Home,
  Archive,
  ShoppingBag,
  Cpu,
  TrendingUp,
  Globe,
  Eye,
  Sparkles,
  Server,
  FileSpreadsheet,
} from "lucide-react";
import { ReportItem } from "../types";
import { useReporting } from "../ReportingContext";

interface ReportCardProps {
  report: ReportItem;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  BookOpen,
  FileText,
  UserPlus,
  Calendar,
  Award,
  BarChart2,
  Users,
  Briefcase,
  UserCheck,
  DollarSign,
  PieChart,
  CreditCard,
  ShieldCheck,
  Truck,
  Book,
  Home,
  Archive,
  ShoppingBag,
  Cpu,
  TrendingUp,
  Globe,
  Eye,
  Sparkles,
  Server,
};

export const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const {
    setSelectedReport,
    setViewMode,
    toggleFavorite,
    togglePin,
    dockReport,
    openInWorkspaceTab,
    markReportAccessed,
  } = useReporting();

  const [showDockMenu, setShowDockMenu] = useState(false);

  const IconComponent = ICON_MAP[report.iconName] || FileSpreadsheet;

  const handleOpen = () => {
    markReportAccessed(report);
    setSelectedReport(report);
    setViewMode("viewer");
  };

  return (
    <div
      tabIndex={0}
      className="group relative flex flex-col justify-between p-5 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 rounded-xl transition-all duration-200 shadow-lg hover:shadow-indigo-900/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      aria-label={`Report: ${report.title}`}
    >
      <div>
        {/* Header Badges & Actions */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-950/80 border border-indigo-700/40 rounded-lg text-indigo-400 group-hover:text-indigo-300 group-hover:scale-105 transition-transform">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <span className="inline-block text-[11px] font-mono font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60 mb-1">
                {report.code}
              </span>
              <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                {report.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => toggleFavorite(report.id)}
              className={`p-1.5 rounded-md hover:bg-slate-800 transition-colors ${
                report.isFavorite
                  ? "text-amber-400 fill-amber-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
              title={report.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              aria-label={`Toggle favorite for ${report.title}`}
            >
              <Star className="w-4 h-4" />
            </button>

            <button
              onClick={() => togglePin(report.id)}
              className={`p-1.5 rounded-md hover:bg-slate-800 transition-colors ${
                report.isPinned
                  ? "text-indigo-400 fill-indigo-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
              title={report.isPinned ? "Unpin Report" : "Pin Report"}
              aria-label={`Toggle pin for ${report.title}`}
            >
              <Pin className="w-4 h-4" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowDockMenu((prev) => !prev)}
                className={`p-1.5 rounded-md hover:bg-slate-800 transition-colors ${
                  report.dockedPosition && report.dockedPosition !== "none"
                    ? "text-cyan-400"
                    : "text-slate-500 hover:text-slate-300"
                }`}
                title="Dock Report Window"
                aria-label={`Dock report ${report.title}`}
              >
                <Dock className="w-4 h-4" />
              </button>

              {showDockMenu && (
                <div className="absolute right-0 top-8 z-30 w-36 bg-slate-900 border border-slate-700 rounded-md shadow-xl py-1 text-xs">
                  <div className="px-3 py-1 font-semibold text-slate-400 border-b border-slate-800">
                    Dock Position
                  </div>
                  {(["right", "bottom", "left", "none"] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => {
                        dockReport(report.id, pos);
                        setShowDockMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-indigo-600/30 capitalize ${
                        report.dockedPosition === pos ? "text-indigo-300 font-bold" : "text-slate-300"
                      }`}
                    >
                      {pos === "none" ? "Undock" : `Dock ${pos}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {report.description}
        </p>
      </div>

      <div>
        {/* Category & Supported Formats Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-3 mb-3">
          <span className="text-[11px] font-medium text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-800/50">
            {report.category}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
            {report.formatSupported.map((fmt) => (
              <span key={fmt} className="uppercase bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                {fmt}
              </span>
            ))}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleOpen}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Run Report
          </button>
          <button
            onClick={() => openInWorkspaceTab(report)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Open in a new workspace tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            Tab View
          </button>
        </div>
      </div>
    </div>
  );
};
