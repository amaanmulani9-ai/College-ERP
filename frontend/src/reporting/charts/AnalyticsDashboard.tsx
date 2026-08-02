import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  BookOpen,
  DollarSign,
  UserCheck,
  Book,
  Truck,
  Archive,
  Sparkles,
  Layers,
} from "lucide-react";
import { DashboardTemplateType, ChartPeriod } from "./types";
import { ChartToolbar } from "./ChartToolbar";
import { KPIGrid } from "./KPIGrid";
import { LineChart } from "./LineChart";
import { BarChart } from "./BarChart";
import { StackedBarChart } from "./StackedBarChart";
import { HorizontalBarChart } from "./HorizontalBarChart";
import { PieChart } from "./PieChart";
import { DonutChart } from "./DonutChart";
import { RadarChart } from "./RadarChart";
import { GaugeChart } from "./GaugeChart";
import { HeatMapChart } from "./HeatMapChart";
import { TreemapChart } from "./TreemapChart";
import { TopPerformers } from "./TopPerformers";
import { LowPerformers } from "./LowPerformers";

const DASHBOARD_TEMPLATES: { label: DashboardTemplateType; icon: React.FC<{ className?: string }> }[] = [
  { label: "Executive Overview", icon: Layers },
  { label: "Academic Analytics", icon: BookOpen },
  { label: "Finance Analytics", icon: DollarSign },
  { label: "HR Analytics", icon: UserCheck },
  { label: "Library Analytics", icon: Book },
  { label: "Transport Analytics", icon: Truck },
  { label: "Inventory Analytics", icon: Archive },
  { label: "AI Usage Analytics", icon: Sparkles },
];

export const AnalyticsDashboard: React.FC = () => {
  const [activeTemplate, setActiveTemplate] = useState<DashboardTemplateType>("Executive Overview");
  const [period, setPeriod] = useState<ChartPeriod>("month");
  const [comparePrevious, setComparePrevious] = useState(true);
  const [showTrends, setShowTrends] = useState(true);

  return (
    <div
      role="region"
      aria-label="Enterprise Visual Analytics Dashboard"
      className="space-y-6 bg-slate-950 text-slate-100 min-h-screen p-4 sm:p-6"
    >
      {/* Top Header & Template Selector Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-bold text-slate-100">
              Enterprise Visual Analytics Engine
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time interactive data visualizations, KPI cards, and predictive trends across all 30 ERP modules.
          </p>
        </div>

        {/* Dashboard Template Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 font-medium text-xs">
          {DASHBOARD_TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;
            const isActive = activeTemplate === tmpl.label;
            return (
              <button
                key={tmpl.label}
                onClick={() => setActiveTemplate(tmpl.label)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white font-semibold shadow-md"
                    : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-indigo-400"}`} />
                <span>{tmpl.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Toolbar */}
      <ChartToolbar
        period={period}
        onPeriodChange={setPeriod}
        comparePrevious={comparePrevious}
        onCompareToggle={() => setComparePrevious(!comparePrevious)}
        showTrends={showTrends}
        onTrendsToggle={() => setShowTrends(!showTrends)}
      />

      {/* KPI Summary Row */}
      <KPIGrid />

      {/* Dynamic Template Content */}
      {activeTemplate === "Executive Overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LineChart
              title="Institutional Revenue vs Operating Cost Trend"
              subtitle="Comparing 2026 current academic session against 2025 previous session"
            />
            <BarChart
              title="Departmental Student Enrollment & Credit Allocations"
              subtitle="Volume distribution across top departments"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PieChart
              title="Revenue Sources Breakdown"
              subtitle="Tuition, Hostel, Research, Grants"
            />
            <GaugeChart
              title="Annual Target Compliance"
              subtitle="Key performance target achievement index"
              value={89}
            />
            <RadarChart
              title="Institutional Quality Index"
              subtitle="Multidimensional benchmark evaluation"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopPerformers />
            <LowPerformers />
          </div>
        </div>
      )}

      {activeTemplate === "Academic Analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StackedBarChart
              title="Semester Student Distribution by Branch"
              subtitle="Enrollment volume per branch and semester"
            />
            <RadarChart
              title="Academic Quality & Student Satisfaction"
              subtitle="Teaching effectiveness and curriculum ratings"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HeatMapChart
              title="Lab & Lecture Attendance Heatmap"
              subtitle="Weekly hour-wise student attendance density (%)"
            />
            <TreemapChart
              title="Departmental Credit Load Share"
              subtitle="Proportional credit hour allocation"
            />
          </div>
        </div>
      )}

      {activeTemplate === "Finance Analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LineChart
              title="Monthly Fee Collection & Outstanding Balances"
              subtitle="Real-time financial cash flow summary"
            />
            <HorizontalBarChart
              title="Fee Collection by Department"
              subtitle="Total received vs pending dues"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DonutChart
              title="Fee Type Share"
              subtitle="Tuition, Mess, Transport, Examination"
              centerLabel="Collection"
              centerValue="$14.2M"
            />
            <GaugeChart
              title="Fee Collection Target Rate"
              subtitle="Percentage of target fee collected"
              value={94}
            />
          </div>
        </div>
      )}

      {activeTemplate === "HR Analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart
              title="Employee Leave Days & Absences"
              subtitle="Casual, Sick, Earned leave utilization by department"
            />
            <DonutChart
              title="Staff Designation Distribution"
              subtitle="Professors, Asst Professors, Lecturers, Admin"
            />
          </div>
        </div>
      )}

      {activeTemplate === "Library Analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LineChart
              title="Monthly Book Circulation & Overdue Returns"
              subtitle="Library usage and journal accesses"
            />
            <HorizontalBarChart
              title="Top Issued Book Categories"
              subtitle="Computer Science, Engineering, Management, Novels"
            />
          </div>
        </div>
      )}

      {activeTemplate === "Transport Analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart
              title="Bus Route Occupancy & Pass Utilization"
              subtitle="Daily passenger count per route"
            />
            <LineChart
              title="Fuel Consumption & Vehicle Mileage Tracking"
              subtitle="Monthly fuel log analytics"
            />
          </div>
        </div>
      )}

      {activeTemplate === "Inventory Analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TreemapChart
              title="Warehouse Item Stock Valuation"
              subtitle="Proportional stock value per category"
            />
            <HorizontalBarChart
              title="Fast-Moving Reorder Alert Thresholds"
              subtitle="Item stock levels vs safety limits"
            />
          </div>
        </div>
      )}

      {activeTemplate === "AI Usage Analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LineChart
              title="Monthly AI Copilot Query Volume"
              subtitle="Token usage and student query trends"
            />
            <DonutChart
              title="AI Prompt Categories Distribution"
              subtitle="Academic Assistance, Code Guidance, Admin Search"
              centerLabel="Queries"
              centerValue="38.4k"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
