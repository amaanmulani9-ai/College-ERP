import React, { createContext, useContext, useState, ReactNode } from "react";

export type MobileTab = "dashboard" | "workspace" | "reports" | "notifications" | "profile" | string;

export interface MobileContextType {
  activeTab: MobileTab;
  setActiveTab: (tab: MobileTab) => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  isAICopilotOpen: boolean;
  openAICopilot: () => void;
  closeAICopilot: () => void;
  isQuickCreateOpen: boolean;
  openQuickCreate: () => void;
  closeQuickCreate: () => void;
  customTabs: { id: MobileTab; label: string; iconName: string }[];
  addCustomTab: (tab: { id: MobileTab; label: string; iconName: string }) => void;
  removeCustomTab: (tabId: MobileTab) => void;
}

export const MobileContext = createContext<MobileContextType | undefined>(undefined);

export const MobileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<MobileTab>("dashboard");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [customTabs, setCustomTabs] = useState<{ id: MobileTab; label: string; iconName: string }[]>([]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const openAICopilot = () => setIsAICopilotOpen(true);
  const closeAICopilot = () => setIsAICopilotOpen(false);

  const openQuickCreate = () => setIsQuickCreateOpen(true);
  const closeQuickCreate = () => setIsQuickCreateOpen(false);

  const addCustomTab = (tab: { id: MobileTab; label: string; iconName: string }) => {
    setCustomTabs((prev) => [...prev.filter((t) => t.id !== tab.id), tab]);
  };

  const removeCustomTab = (tabId: MobileTab) => {
    setCustomTabs((prev) => prev.filter((t) => t.id !== tabId));
  };

  return (
    <MobileContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        isSearchOpen,
        openSearch,
        closeSearch,
        isAICopilotOpen,
        openAICopilot,
        closeAICopilot,
        isQuickCreateOpen,
        openQuickCreate,
        closeQuickCreate,
        customTabs,
        addCustomTab,
        removeCustomTab,
      }}
    >
      {children}
    </MobileContext.Provider>
  );
};
