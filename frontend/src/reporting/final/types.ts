export interface ReportingPreferencesData {
  defaultView: "catalog" | "analytics" | "builder" | "executive" | "distribution";
  defaultDashboard: string;
  rememberFilters: boolean;
  rememberDateRanges: boolean;
  rememberChartTypes: boolean;
  autoOpenRecent: boolean;
  animationLevel: "full" | "reduced" | "none";
  density: "compact" | "comfortable" | "spacious";
  chartPalette: "indigo" | "emerald" | "amber" | "rose" | "cyberpunk";
  fontScaling: "normal" | "large" | "extra-large";
  highContrast: boolean;
  timezone: string;
  language: string;
}

export interface PerformanceMetrics {
  renderTimeMs: number;
  chartRenderCount: number;
  lastLoadTimeMs: number;
  memoryUsageMb: number;
  apiLatencyMs: number;
}

export interface TourStep {
  id: string;
  title: string;
  description: string;
  targetComponent: string;
  icon: string;
}

export interface ReleaseNoteItem {
  version: string;
  date: string;
  title: string;
  highlights: string[];
  type: "major" | "feature" | "patch";
}

export interface ShortcutItem {
  keyCombo: string;
  description: string;
  category: "Navigation" | "Builder" | "Analytics" | "Workspace" | "Export" | "General";
}
