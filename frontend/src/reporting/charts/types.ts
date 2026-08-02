export type ChartPeriod = "week" | "month" | "quarter" | "year" | "custom";

export type ChartTheme = "dark" | "light" | "system";

export interface DataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  target?: number;
  category?: string;
  color?: string;
  [key: string]: any;
}

export interface SeriesData {
  id: string;
  name: string;
  color: string;
  data: DataPoint[];
}

export interface KPIMetric {
  id: string;
  title: string;
  value: number | string;
  previousValue?: number | string;
  target?: number | string;
  unit?: string;
  growthPercent?: number;
  isPositive?: boolean;
  status?: "excellent" | "good" | "warning" | "critical";
  achievementPercent?: number;
  variancePercent?: number;
  trendData?: number[];
}

export type SupportedModule =
  | "Admissions"
  | "Students"
  | "Attendance"
  | "Academics"
  | "Results"
  | "Fees"
  | "Payments"
  | "Payroll"
  | "HR"
  | "Library"
  | "Hostel"
  | "Transport"
  | "Inventory"
  | "Procurement"
  | "Assets"
  | "Placement"
  | "Alumni"
  | "Visitor"
  | "AI"
  | "System";

export type DashboardTemplateType =
  | "Executive Overview"
  | "Academic Analytics"
  | "Finance Analytics"
  | "HR Analytics"
  | "Library Analytics"
  | "Transport Analytics"
  | "Inventory Analytics"
  | "AI Usage Analytics";
