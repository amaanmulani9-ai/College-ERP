export type ReportCategory =
  | "Academic"
  | "Admissions"
  | "Attendance"
  | "Examinations"
  | "Results"
  | "Students"
  | "Faculty"
  | "HR"
  | "Payroll"
  | "Finance"
  | "Fees"
  | "Payments"
  | "Transport"
  | "Library"
  | "Hostel"
  | "Inventory"
  | "Procurement"
  | "Assets"
  | "Placement"
  | "Alumni"
  | "Visitor"
  | "AI"
  | "System";

export type CategoryFilterType = "All" | "Favorites" | "Recent" | "Saved" | ReportCategory;

export interface ReportParameter {
  id: string;
  name: string;
  label: string;
  type: "select" | "text" | "date-range" | "number" | "boolean";
  options?: { label: string; value: string }[];
  defaultValue?: any;
  required?: boolean;
}

export interface ReportItem {
  id: string;
  code: string;
  title: string;
  description: string;
  category: ReportCategory;
  module: string;
  iconName: string;
  isFavorite?: boolean;
  isPinned?: boolean;
  isRecent?: boolean;
  lastAccessedAt?: string;
  formatSupported: ("pdf" | "excel" | "csv" | "json" | "html")[];
  parameters?: ReportParameter[];
  dockedPosition?: "top" | "right" | "bottom" | "left" | "none";
}

export interface SavedReportFilter {
  id: string;
  reportId: string;
  reportTitle: string;
  name: string;
  createdAt: string;
  parameters: Record<string, any>;
  isDefault?: boolean;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export type ViewMode = "grid" | "table" | "viewer";
