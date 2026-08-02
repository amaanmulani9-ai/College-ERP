export type ElementType =
  | "table"
  | "kpi-card"
  | "line-chart"
  | "area-chart"
  | "bar-chart"
  | "pie-chart"
  | "donut-chart"
  | "gauge"
  | "progress-ring"
  | "heatmap"
  | "treemap"
  | "text-block"
  | "image"
  | "divider"
  | "section-header"
  | "filter-panel";

export type ModuleBinding =
  | "Students"
  | "Attendance"
  | "Fees"
  | "Payroll"
  | "HR"
  | "Library"
  | "Transport"
  | "Assets"
  | "Inventory"
  | "Placement"
  | "AI";

export interface FieldItem {
  id: string;
  name: string;
  category: string;
  type: "string" | "number" | "date" | "boolean";
  module: ModuleBinding;
  isFavorite?: boolean;
  isRecent?: boolean;
}

export interface ReportElement {
  id: string;
  type: ElementType;
  title: string;
  gridSpan: number; // 1 to 12 columns
  height?: number;
  dataBinding?: {
    module: ModuleBinding;
    fields: string[];
    aggregation?: "sum" | "avg" | "count" | "percentage" | "growth" | "variance";
    filterBy?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    groupBy?: string;
  };
  content?: string; // For text block or section header
  style?: {
    color?: string;
    fontSize?: string;
    align?: "left" | "center" | "right";
  };
}

export interface BuilderTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  module: ModuleBinding;
  elements: ReportElement[];
}

export type PreviewDevice = "desktop" | "tablet" | "mobile" | "print";

export interface BuilderState {
  id: string;
  title: string;
  description: string;
  module: ModuleBinding;
  theme: "dark" | "light" | "system";
  orientation: "portrait" | "landscape";
  paperSize: "A4" | "Letter" | "Legal" | "Executive";
  margins: "normal" | "compact" | "wide";
  elements: ReportElement[];
  activeElementId: string | null;
  history: ReportElement[][];
  historyIndex: number;
  lastSavedAt: string | null;
  isDraft: boolean;
}
