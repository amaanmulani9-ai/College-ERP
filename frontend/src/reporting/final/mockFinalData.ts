import {
  ReportingPreferencesData,
  ReleaseNoteItem,
  ShortcutItem,
  TourStep,
} from "./types";

export const DEFAULT_PREFERENCES: ReportingPreferencesData = {
  defaultView: "catalog",
  defaultDashboard: "Executive Overview",
  rememberFilters: true,
  rememberDateRanges: true,
  rememberChartTypes: true,
  autoOpenRecent: false,
  animationLevel: "full",
  density: "comfortable",
  chartPalette: "indigo",
  fontScaling: "normal",
  highContrast: false,
  timezone: "UTC+05:30 (IST)",
  language: "English (US)",
};

export const MOCK_SHORTCUTS: ShortcutItem[] = [
  { keyCombo: "Ctrl + K", description: "Global Search Reports & Dashboards", category: "Navigation" },
  { keyCombo: "Ctrl + Shift + R", description: "Open Report Catalog View", category: "Navigation" },
  { keyCombo: "Ctrl + Shift + A", description: "Open Visual Analytics Hub", category: "Navigation" },
  { keyCombo: "Ctrl + Shift + B", description: "Open No-Code Report Builder", category: "Navigation" },
  { keyCombo: "Ctrl + Shift + E", description: "Open Executive Analytics Center", category: "Navigation" },
  { keyCombo: "Ctrl + Shift + D", description: "Open Distribution Hub", category: "Navigation" },
  { keyCombo: "Ctrl + Z", description: "Undo Last Builder Action", category: "Builder" },
  { keyCombo: "Ctrl + Y", description: "Redo Last Builder Action", category: "Builder" },
  { keyCombo: "Ctrl + S", description: "Save Builder Draft", category: "Builder" },
  { keyCombo: "Delete", description: "Remove Selected Builder Element", category: "Builder" },
  { keyCombo: "Ctrl + P", description: "Print / Export Report to PDF", category: "Export" },
  { keyCombo: "Ctrl + T", description: "Open Report in Workspace Tab", category: "Workspace" },
];

export const MOCK_RELEASE_NOTES: ReleaseNoteItem[] = [
  {
    version: "v0.33.0",
    date: "August 2026",
    title: "Enterprise Reporting & Analytics Platform Release",
    highlights: [
      "Added 30-Module Report Catalog with instant search, filters & docking panel",
      "Created 17 Visual Analytics Chart primitives with 8 pre-built Executive Dashboards",
      "Implemented Drag-and-Drop No-Code Report Builder with 16 element types & live preview",
      "Introduced Role-Based Executive Analytics Center for 11 leadership positions",
      "Built Multi-Channel Report Distribution Center with 7 export formats & automated scheduler",
    ],
    type: "major",
  },
  {
    version: "v0.32.0",
    date: "July 2026",
    title: "Performance & Workspace Docking Improvements",
    highlights: [
      "Optimized SVG chart render cycles with sub-5ms latency",
      "Added Workspace Tab Context integration across all modules",
    ],
    type: "feature",
  },
];

export const TOUR_STEPS: TourStep[] = [
  {
    id: "step-1",
    title: "1. Report Catalog",
    description: "Browse 30 ERP module report categories with grid/table views, favorites, and quick docking.",
    targetComponent: "ReportCatalog",
    icon: "LayoutGrid",
  },
  {
    id: "step-2",
    title: "2. Visual Analytics Hub",
    description: "Interactive SVG/Canvas charts including Spline Lines, Radar Polygons, Gauges & Treemaps.",
    targetComponent: "VisualAnalytics",
    icon: "BarChart3",
  },
  {
    id: "step-3",
    title: "3. No-Code Report Builder",
    description: "Drag-and-drop report layout builder with 12-column grid, field explorers, and live preview.",
    targetComponent: "ReportBuilder",
    icon: "Wrench",
  },
  {
    id: "step-4",
    title: "4. Executive Analytics Center",
    description: "Role-based dashboards for 11 leadership positions with AI Copilot strategic recommendations.",
    targetComponent: "ExecutiveCenter",
    icon: "ShieldCheck",
  },
  {
    id: "step-5",
    title: "5. Distribution & Export Hub",
    description: "Automate daily/weekly schedules, export to 7 formats (PDF, Excel, CSV, PNG), and share links.",
    targetComponent: "DistributionHub",
    icon: "Send",
  },
];
