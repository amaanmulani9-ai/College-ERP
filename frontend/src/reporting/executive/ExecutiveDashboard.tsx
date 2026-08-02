import React from "react";
import { ExecutiveRole, CrossModuleDomain, ExecutiveAlertItem } from "./types";
import { ExecutiveHeader } from "./ExecutiveHeader";
import { ExecutiveToolbar } from "./ExecutiveToolbar";
import { ExecutiveInsights } from "./ExecutiveInsights";
import { ExecutiveKPIs } from "./ExecutiveKPIs";
import { ExecutiveAlerts } from "./ExecutiveAlerts";
import { ExecutiveGoals } from "./ExecutiveGoals";
import { ExecutiveScorecards } from "./ExecutiveScorecards";
import { ExecutiveRiskMatrix } from "./ExecutiveRiskMatrix";
import { ExecutiveForecasts } from "./ExecutiveForecasts";
import { ExecutiveBenchmarks } from "./ExecutiveBenchmarks";
import { ExecutiveTimeline } from "./ExecutiveTimeline";
import { ExecutiveLeaderboard } from "./ExecutiveLeaderboard";
import { LineChart } from "../charts/LineChart";
import { BarChart } from "../charts/BarChart";
import { PieChart } from "../charts/PieChart";

interface ExecutiveDashboardProps {
  activeRole: ExecutiveRole;
  onRoleChange: (role: ExecutiveRole) => void;
  activeDomain: CrossModuleDomain | null;
  onSelectDomain: (domain: CrossModuleDomain | null) => void;
  onDrillDown: (route: string) => void;
  onOpenInWorkspace?: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  activeRole,
  onRoleChange,
  activeDomain,
  onSelectDomain,
  onDrillDown,
  onOpenInWorkspace,
}) => {
  const handleAlertDrillDown = (alert: ExecutiveAlertItem) => {
    onDrillDown(alert.drillDownRoute);
  };

  return (
    <div
      role="region"
      aria-label="Executive Leadership Dashboard"
      className="space-y-6 bg-slate-950 text-slate-100 p-4 sm:p-6"
    >
      {/* Leadership Header */}
      <ExecutiveHeader
        activeRole={activeRole}
        activeDomain={activeDomain}
        onSelectDomain={onSelectDomain}
      />

      {/* Control Toolbar */}
      <ExecutiveToolbar
        activeRole={activeRole}
        onRoleChange={onRoleChange}
        onRefresh={() => {}}
        onOpenInWorkspace={onOpenInWorkspace}
      />

      {/* Copilot Executive Insights */}
      <ExecutiveInsights
        onRunReport={() => onDrillDown("/reports?id=rep-acad-01")}
      />

      {/* Dynamic Main Dashboard Content */}
      {activeDomain === "Student Lifecycle" ? (
        <div className="space-y-6">
          <div className="p-4 bg-indigo-950/40 border border-indigo-800 rounded-xl text-xs">
            <h3 className="font-bold text-indigo-300 text-sm mb-1">
              Cross-Module Flow: Student Lifecycle Analytics
            </h3>
            <p className="text-slate-400">
              Integrated pipeline tracing student progression: **Admissions Lead → Enrollment → Attendance → Examinations → Placement → Alumni Engagement**.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LineChart title="Admissions to Graduation Pipeline Conversion" height={260} />
            <BarChart title="Placement Salary Packages by Branch" height={260} />
          </div>
          <ExecutiveGoals />
        </div>
      ) : activeDomain === "Financial Health" ? (
        <div className="space-y-6">
          <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-xl text-xs">
            <h3 className="font-bold text-emerald-300 text-sm mb-1">
              Cross-Module Flow: Institutional Financial Health
            </h3>
            <p className="text-slate-400">
              End-to-end financial oversight: **Tuition Fees → Staff Payroll → Procurement POs → Fixed Asset Depreciation**.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LineChart title="Tuition Recovery vs Payroll Expenditure" height={260} />
            <PieChart title="Operating Expense Category Split" height={260} />
          </div>
          <ExecutiveScorecards />
        </div>
      ) : activeDomain === "Campus Operations" ? (
        <div className="space-y-6">
          <div className="p-4 bg-cyan-950/40 border border-cyan-800 rounded-xl text-xs">
            <h3 className="font-bold text-cyan-300 text-sm mb-1">
              Cross-Module Flow: Campus Infrastructure Operations
            </h3>
            <p className="text-slate-400">
              Facility management synchronization: **Transport Buses → Hostel Beds → Library Circulation → Visitor Gate Security**.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart title="Hostel Occupancy & Mess Collections" height={260} />
            <LineChart title="Daily Transport Route Passengers & Fuel Log" height={260} />
          </div>
          <ExecutiveAlerts onDrillDown={handleAlertDrillDown} />
        </div>
      ) : (
        /* Default Role View */
        <div className="space-y-6">
          {/* Executive Role KPIs */}
          <ExecutiveKPIs />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ExecutiveAlerts onDrillDown={handleAlertDrillDown} />
            </div>
            <div>
              <ExecutiveTimeline />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExecutiveForecasts />
            <ExecutiveBenchmarks />
          </div>

          <ExecutiveScorecards />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExecutiveRiskMatrix />
            <ExecutiveLeaderboard />
          </div>

          <ExecutiveGoals />
        </div>
      )}
    </div>
  );
};
