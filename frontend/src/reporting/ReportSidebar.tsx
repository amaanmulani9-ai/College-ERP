import React from "react";
import {
  Layers,
  Star,
  Clock,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  BookOpen,
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
} from "lucide-react";
import { useReporting } from "./ReportingContext";
import { ReportCategory, CategoryFilterType } from "./types";

const CATEGORIES_LIST: ReportCategory[] = [
  "Academic",
  "Admissions",
  "Attendance",
  "Examinations",
  "Results",
  "Students",
  "Faculty",
  "HR",
  "Payroll",
  "Finance",
  "Fees",
  "Payments",
  "Transport",
  "Library",
  "Hostel",
  "Inventory",
  "Procurement",
  "Assets",
  "Placement",
  "Alumni",
  "Visitor",
  "AI",
  "System",
];

const CATEGORY_ICON_MAP: Record<ReportCategory, React.FC<{ className?: string }>> = {
  Academic: BookOpen,
  Admissions: UserPlus,
  Attendance: Calendar,
  Examinations: Award,
  Results: BarChart2,
  Students: Users,
  Faculty: Briefcase,
  HR: UserCheck,
  Payroll: DollarSign,
  Finance: PieChart,
  Fees: CreditCard,
  Payments: ShieldCheck,
  Transport: Truck,
  Library: Book,
  Hostel: Home,
  Inventory: Archive,
  Procurement: ShoppingBag,
  Assets: Cpu,
  Placement: TrendingUp,
  Alumni: Globe,
  Visitor: Eye,
  AI: Sparkles,
  System: Server,
};

export const ReportSidebar: React.FC = () => {
  const {
    reports,
    activeCategory,
    setActiveCategory,
    setSelectedReport,
    setViewMode,
    favoriteReports,
    recentReports,
    savedReports,
    sidebarCollapsed,
    setSidebarCollapsed,
  } = useReporting();

  const handleCategorySelect = (cat: CategoryFilterType) => {
    setActiveCategory(cat);
    setSelectedReport(null);
    setViewMode("grid");
  };

  const getCategoryCount = (cat: ReportCategory) => {
    return reports.filter((r) => r.category === cat).length;
  };

  return (
    <aside
      aria-label="Report Catalog Categories"
      className={`relative flex flex-col bg-slate-900/90 border-r border-slate-800 transition-all duration-300 z-20 ${
        sidebarCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2 text-slate-100 font-semibold text-sm">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Report Categories</span>
          </div>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 mx-auto"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Categories Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4 text-xs font-medium">
        {/* Special Views Group */}
        <div>
          {!sidebarCollapsed && (
            <div className="px-3 mb-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              Views
            </div>
          )}
          <div className="space-y-0.5">
            <button
              onClick={() => handleCategorySelect("All")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                activeCategory === "All"
                  ? "bg-indigo-600 text-white font-semibold shadow"
                  : "text-slate-300 hover:bg-slate-800/80"
              }`}
              title="All Reports"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>All Reports</span>}
              </div>
              {!sidebarCollapsed && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {reports.length}
                </span>
              )}
            </button>

            <button
              onClick={() => handleCategorySelect("Favorites")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                activeCategory === "Favorites"
                  ? "bg-amber-600 text-white font-semibold shadow"
                  : "text-slate-300 hover:bg-slate-800/80"
              }`}
              title="Favorite Reports"
            >
              <div className="flex items-center gap-2.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                {!sidebarCollapsed && <span>Favorites</span>}
              </div>
              {!sidebarCollapsed && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-300">
                  {favoriteReports.length}
                </span>
              )}
            </button>

            <button
              onClick={() => handleCategorySelect("Recent")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                activeCategory === "Recent"
                  ? "bg-indigo-600 text-white font-semibold shadow"
                  : "text-slate-300 hover:bg-slate-800/80"
              }`}
              title="Recent Reports"
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                {!sidebarCollapsed && <span>Recent Reports</span>}
              </div>
              {!sidebarCollapsed && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {recentReports.length}
                </span>
              )}
            </button>

            <button
              onClick={() => handleCategorySelect("Saved")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                activeCategory === "Saved"
                  ? "bg-cyan-600 text-white font-semibold shadow"
                  : "text-slate-300 hover:bg-slate-800/80"
              }`}
              title="Saved Presets"
            >
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4 text-cyan-300 shrink-0" />
                {!sidebarCollapsed && <span>Saved Presets</span>}
              </div>
              {!sidebarCollapsed && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300">
                  {savedReports.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 23 Modules & Categories Group */}
        <div>
          {!sidebarCollapsed && (
            <div className="px-3 mb-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              ERP Modules ({CATEGORIES_LIST.length})
            </div>
          )}
          <div className="space-y-0.5">
            {CATEGORIES_LIST.map((category) => {
              const IconComp = CATEGORY_ICON_MAP[category] || Layers;
              const count = getCategoryCount(category);
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-indigo-600/90 text-white font-semibold shadow"
                      : "text-slate-300 hover:bg-slate-800/80"
                  }`}
                  title={`${category} (${count})`}
                  aria-selected={isActive}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <IconComp className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-indigo-400"}`} />
                    {!sidebarCollapsed && <span className="truncate">{category}</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        isActive
                          ? "bg-indigo-800 text-white"
                          : "bg-slate-800/80 text-slate-400"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
