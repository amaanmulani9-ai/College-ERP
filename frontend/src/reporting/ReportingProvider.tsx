import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ReportingContext } from "./ReportingContext";
import {
  ReportItem,
  CategoryFilterType,
  SavedReportFilter,
  DateRange,
  ViewMode,
} from "./types";
import { MOCK_REPORTS } from "./mockData";
import { useTabs } from "../workspace/TabContext";

const STORAGE_KEY = "college_erp_reporting_framework_v1";

interface StorageState {
  favorites: string[];
  pinned: string[];
  recent: { id: string; accessedAt: string }[];
  docked: { id: string; position: "top" | "right" | "bottom" | "left" | "none" }[];
  savedFilters: SavedReportFilter[];
}

export const ReportingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<ReportItem[]>(MOCK_REPORTS);
  const [activeCategory, setActiveCategory] = useState<CategoryFilterType>("All");
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [savedReports, setSavedReports] = useState<SavedReportFilter[]>([
    {
      id: "sav-01",
      reportId: "rep-att-01",
      reportTitle: "Monthly Student Defaulter Summary",
      name: "Below 75% Attendance (Q3)",
      createdAt: "2026-08-01T12:00:00Z",
      parameters: { minAttendance: 75, department: "CS" },
      isDefault: true,
    },
    {
      id: "sav-02",
      reportId: "rep-fee-01",
      reportTitle: "Outstanding Dues & Defaulter Ledger",
      name: "Engineering Outstanding Fees",
      createdAt: "2026-08-02T09:30:00Z",
      parameters: { department: "CS" },
    },
  ]);

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  // Try workspace TabContext integration if available
  let openTabAction: ((tab: { title: string; route: string; iconName?: string }) => void) | null = null;
  try {
    const tabsCtx = useTabs();
    if (tabsCtx && tabsCtx.openTab) {
      openTabAction = tabsCtx.openTab;
    }
  } catch (_e) {
    // If rendered outside TabProvider, fallback gracefully
    openTabAction = null;
  }

  // Load state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: StorageState = JSON.parse(stored);
        const favSet = new Set(parsed.favorites || []);
        const pinSet = new Set(parsed.pinned || []);
        const recentMap = new Map(
          (parsed.recent || []).map((r) => [r.id, r.accessedAt])
        );
        const dockMap = new Map(
          (parsed.docked || []).map((d) => [d.id, d.position])
        );

        setReports((prev) =>
          prev.map((item) => ({
            ...item,
            isFavorite: favSet.has(item.id),
            isPinned: pinSet.has(item.id),
            isRecent: recentMap.has(item.id),
            lastAccessedAt: recentMap.get(item.id) || item.lastAccessedAt,
            dockedPosition: dockMap.get(item.id) || item.dockedPosition || "none",
          }))
        );

        if (parsed.savedFilters && parsed.savedFilters.length > 0) {
          setSavedReports(parsed.savedFilters);
        }
      }
    } catch (e) {
      console.error("Failed to load reporting state from LocalStorage", e);
    }
  }, []);

  // Sync state to localStorage
  const saveStateToStorage = useCallback(
    (updatedReports: ReportItem[], updatedSaved: SavedReportFilter[]) => {
      try {
        const stateToSave: StorageState = {
          favorites: updatedReports.filter((r) => r.isFavorite).map((r) => r.id),
          pinned: updatedReports.filter((r) => r.isPinned).map((r) => r.id),
          recent: updatedReports
            .filter((r) => r.isRecent)
            .map((r) => ({ id: r.id, accessedAt: r.lastAccessedAt || "" })),
          docked: updatedReports
            .filter((r) => r.dockedPosition && r.dockedPosition !== "none")
            .map((r) => ({ id: r.id, position: r.dockedPosition! })),
          savedFilters: updatedSaved,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (e) {
        console.error("Failed to save reporting state to LocalStorage", e);
      }
    },
    []
  );

  const toggleFavorite = useCallback(
    (reportId: string) => {
      setReports((prev) => {
        const next = prev.map((r) =>
          r.id === reportId ? { ...r, isFavorite: !r.isFavorite } : r
        );
        saveStateToStorage(next, savedReports);
        return next;
      });
    },
    [saveStateToStorage, savedReports]
  );

  const togglePin = useCallback(
    (reportId: string) => {
      setReports((prev) => {
        const next = prev.map((r) =>
          r.id === reportId ? { ...r, isPinned: !r.isPinned } : r
        );
        saveStateToStorage(next, savedReports);
        return next;
      });
    },
    [saveStateToStorage, savedReports]
  );

  const dockReport = useCallback(
    (reportId: string, position: "top" | "right" | "bottom" | "left" | "none") => {
      setReports((prev) => {
        const next = prev.map((r) =>
          r.id === reportId ? { ...r, dockedPosition: position } : r
        );
        saveStateToStorage(next, savedReports);
        return next;
      });
    },
    [saveStateToStorage, savedReports]
  );

  const markReportAccessed = useCallback(
    (report: ReportItem) => {
      const now = new Date().toISOString();
      setReports((prev) => {
        const next = prev.map((r) =>
          r.id === report.id
            ? { ...r, isRecent: true, lastAccessedAt: now }
            : r
        );
        saveStateToStorage(next, savedReports);
        return next;
      });
    },
    [saveStateToStorage, savedReports]
  );

  const saveFilter = useCallback(
    (filterData: Omit<SavedReportFilter, "id" | "createdAt">) => {
      const newFilter: SavedReportFilter = {
        ...filterData,
        id: `sav-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setSavedReports((prev) => {
        const next = [...prev, newFilter];
        saveStateToStorage(reports, next);
        return next;
      });
    },
    [reports, saveStateToStorage]
  );

  const deleteSavedFilter = useCallback(
    (id: string) => {
      setSavedReports((prev) => {
        const next = prev.filter((s) => s.id !== id);
        saveStateToStorage(reports, next);
        return next;
      });
    },
    [reports, saveStateToStorage]
  );

  const applySavedFilter = useCallback(
    (filter: SavedReportFilter) => {
      const targetReport = reports.find((r) => r.id === filter.reportId);
      if (targetReport) {
        setSelectedReport(targetReport);
        setActiveFilters(filter.parameters);
        setViewMode("viewer");
        markReportAccessed(targetReport);
      }
    },
    [reports, markReportAccessed]
  );

  const openInWorkspaceTab = useCallback(
    (report: ReportItem) => {
      markReportAccessed(report);
      if (openTabAction) {
        openTabAction({
          title: `Report: ${report.title}`,
          route: `/reports?id=${report.id}`,
          iconName: report.iconName || "BarChart2",
        });
      } else {
        setSelectedReport(report);
        setViewMode("viewer");
      }
    },
    [openTabAction, markReportAccessed]
  );

  const favoriteReports = useMemo(
    () => reports.filter((r) => r.isFavorite),
    [reports]
  );
  const pinnedReports = useMemo(
    () => reports.filter((r) => r.isPinned),
    [reports]
  );
  const recentReports = useMemo(
    () =>
      reports
        .filter((r) => r.isRecent)
        .sort((a, b) => (b.lastAccessedAt || "").localeCompare(a.lastAccessedAt || "")),
    [reports]
  );
  const dockedReports = useMemo(
    () => reports.filter((r) => r.dockedPosition && r.dockedPosition !== "none"),
    [reports]
  );

  return (
    <ReportingContext.Provider
      value={{
        reports,
        activeCategory,
        setActiveCategory,
        selectedReport,
        setSelectedReport,
        searchQuery,
        setSearchQuery,
        viewMode,
        setViewMode,
        toggleFavorite,
        togglePin,
        dockReport,
        savedReports,
        saveFilter,
        deleteSavedFilter,
        applySavedFilter,
        activeFilters,
        setActiveFilters,
        dateRange,
        setDateRange,
        sidebarCollapsed,
        setSidebarCollapsed,
        openInWorkspaceTab,
        dockedReports,
        recentReports,
        favoriteReports,
        pinnedReports,
        markReportAccessed,
      }}
    >
      {children}
    </ReportingContext.Provider>
  );
};
