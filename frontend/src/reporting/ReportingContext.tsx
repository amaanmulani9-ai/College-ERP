import { createContext, useContext } from "react";
import {
  ReportItem,
  CategoryFilterType,
  SavedReportFilter,
  DateRange,
  ViewMode,
} from "./types";

export interface ReportingContextType {
  reports: ReportItem[];
  activeCategory: CategoryFilterType;
  setActiveCategory: (category: CategoryFilterType) => void;
  selectedReport: ReportItem | null;
  setSelectedReport: (report: ReportItem | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleFavorite: (reportId: string) => void;
  togglePin: (reportId: string) => void;
  dockReport: (reportId: string, position: "top" | "right" | "bottom" | "left" | "none") => void;
  savedReports: SavedReportFilter[];
  saveFilter: (filter: Omit<SavedReportFilter, "id" | "createdAt">) => void;
  deleteSavedFilter: (id: string) => void;
  applySavedFilter: (filter: SavedReportFilter) => void;
  activeFilters: Record<string, any>;
  setActiveFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openInWorkspaceTab: (report: ReportItem) => void;
  dockedReports: ReportItem[];
  recentReports: ReportItem[];
  favoriteReports: ReportItem[];
  pinnedReports: ReportItem[];
  markReportAccessed: (report: ReportItem) => void;
}

export const ReportingContext = createContext<ReportingContextType | undefined>(undefined);

export const useReporting = (): ReportingContextType => {
  const context = useContext(ReportingContext);
  if (!context) {
    throw new Error("useReporting must be used within a ReportingProvider");
  }
  return context;
};
