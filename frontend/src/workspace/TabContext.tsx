import React, { createContext, useContext, useState, useEffect } from "react";

export interface WorkspaceTabItem {
  id: string;
  title: string;
  route: string;
  iconName?: string;
  isPinned?: boolean;
  isUnsaved?: boolean;
  content?: React.ReactNode;
}

interface TabContextType {
  tabs: WorkspaceTabItem[];
  activeTabId: string;
  setActiveTabId: (id: string) => void;
  openTab: (tab: Omit<WorkspaceTabItem, "id">) => void;
  closeTab: (id: string) => void;
  closeOtherTabs: (id: string) => void;
  closeAllTabs: () => void;
  pinTab: (id: string) => void;
  duplicateTab: (id: string) => void;
  restoreLastClosedTab: () => void;
  markTabUnsaved: (id: string, unsaved: boolean) => void;
  closedHistory: WorkspaceTabItem[];
}

const TabContext = createContext<TabContextType | undefined>(undefined);

const TABS_STORAGE_KEY = "college_erp_workspace_tabs";

const defaultInitialTabs: WorkspaceTabItem[] = [
  { id: "home-tab", title: "Workspace Home", route: "/workspace", iconName: "Home", isPinned: true },
  { id: "students-tab", title: "Student Directory", route: "/students", iconName: "Users" },
];

export const TabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<WorkspaceTabItem[]>(defaultInitialTabs);
  const [activeTabId, setActiveTabId] = useState<string>("home-tab");
  const [closedHistory, setClosedHistory] = useState<WorkspaceTabItem[]>([]);

  // Load tabs from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(TABS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.tabs) && parsed.tabs.length > 0) {
          setTabs(parsed.tabs);
          setActiveTabId(parsed.activeTabId || parsed.tabs[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load workspace tabs", e);
    }
  }, []);

  // Save tabs to LocalStorage
  useEffect(() => {
    try {
      // Save tab metadata (exclude React nodes)
      const tabMeta = tabs.map(({ content, ...rest }) => rest);
      localStorage.setItem(TABS_STORAGE_KEY, JSON.stringify({ tabs: tabMeta, activeTabId }));
    } catch (e) {
      console.error("Failed to save workspace tabs", e);
    }
  }, [tabs, activeTabId]);

  const openTab = (newTab: Omit<WorkspaceTabItem, "id">) => {
    // Check if tab with route already exists
    const existing = tabs.find((t) => t.route === newTab.route);
    if (existing) {
      setActiveTabId(existing.id);
    } else {
      const id = `tab-${Date.now()}`;
      const created: WorkspaceTabItem = { ...newTab, id };
      setTabs((prev) => [...prev, created]);
      setActiveTabId(id);
    }
  };

  const closeTab = (id: string) => {
    const tabToClose = tabs.find((t) => t.id === id);
    if (tabToClose?.isPinned) return; // Prevent closing pinned tabs

    if (tabToClose) {
      setClosedHistory((prev) => [tabToClose, ...prev.slice(0, 9)]);
    }

    const filtered = tabs.filter((t) => t.id !== id);
    setTabs(filtered);

    if (activeTabId === id && filtered.length > 0) {
      setActiveTabId(filtered[filtered.length - 1].id);
    }
  };

  const closeOtherTabs = (id: string) => {
    setTabs((prev) => prev.filter((t) => t.id === id || t.isPinned));
    setActiveTabId(id);
  };

  const closeAllTabs = () => {
    const pinned = tabs.filter((t) => t.isPinned);
    setTabs(pinned);
    if (pinned.length > 0) setActiveTabId(pinned[0].id);
  };

  const pinTab = (id: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isPinned: !t.isPinned } : t))
    );
  };

  const duplicateTab = (id: string) => {
    const target = tabs.find((t) => t.id === id);
    if (target) {
      const dupId = `tab-dup-${Date.now()}`;
      const dupTab: WorkspaceTabItem = {
        ...target,
        id: dupId,
        title: `${target.title} (Copy)`,
        isPinned: false,
      };
      setTabs((prev) => [...prev, dupTab]);
      setActiveTabId(dupId);
    }
  };

  const restoreLastClosedTab = () => {
    if (closedHistory.length === 0) return;
    const [last, ...rest] = closedHistory;
    setClosedHistory(rest);
    setTabs((prev) => [...prev, last]);
    setActiveTabId(last.id);
  };

  const markTabUnsaved = (id: string, unsaved: boolean) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isUnsaved: unsaved } : t))
    );
  };

  return (
    <TabContext.Provider
      value={{
        tabs,
        activeTabId,
        setActiveTabId,
        openTab,
        closeTab,
        closeOtherTabs,
        closeAllTabs,
        pinTab,
        duplicateTab,
        restoreLastClosedTab,
        markTabUnsaved,
        closedHistory,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};

export const useTabs = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("useTabs must be used within a TabProvider");
  }
  return context;
};
