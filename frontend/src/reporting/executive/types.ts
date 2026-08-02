export type ExecutiveRole =
  | "Super Admin"
  | "Principal"
  | "Vice Principal"
  | "Registrar"
  | "HOD"
  | "Finance Officer"
  | "HR Manager"
  | "Library Admin"
  | "Transport Manager"
  | "Hostel Warden"
  | "Placement Officer";

export type CrossModuleDomain =
  | "Student Lifecycle"
  | "Financial Health"
  | "Campus Operations"
  | "Human Resources";

export interface ExecutiveAlertItem {
  id: string;
  title: string;
  category: string;
  severity: "critical" | "warning" | "info";
  count: number;
  module: string;
  timestamp: string;
  drillDownRoute: string;
  reportId?: string;
}

export interface ExecutiveGoalItem {
  id: string;
  title: string;
  category: string;
  targetValue: number | string;
  actualValue: number | string;
  unit: string;
  completionPercent: number;
  monthlyProgress: number;
  annualProgress: number;
  department: string;
}

export interface ScorecardItem {
  id: string;
  metricName: string;
  actual: number | string;
  target: number | string;
  variance: number;
  status: "excellent" | "good" | "warning" | "critical";
  department?: string;
}

export interface RiskMatrixItem {
  id: string;
  title: string;
  impact: "low" | "medium" | "high" | "critical";
  probability: "low" | "medium" | "high";
  category: string;
  riskScore: number;
}
