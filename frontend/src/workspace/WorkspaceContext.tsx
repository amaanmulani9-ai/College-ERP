import React, { createContext, useContext, useState, useEffect } from "react";

export type SidebarMode = "expanded" | "collapsed" | "mini" | "floating";
export type ThemeMode = "dark" | "light" | "system";

export interface WorkspaceModuleShortcut {
  id: string;
  name: string;
  route: string;
  iconName: string;
  category: string;
}

interface WorkspaceContextType {
  sidebarMode: SidebarMode;
  setSidebarMode: (mode: SidebarMode) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  pinnedModules: WorkspaceModuleShortcut[];
  recentModules: WorkspaceModuleShortcut[];
  favoriteModules: WorkspaceModuleShortcut[];
  togglePinModule: (module: WorkspaceModuleShortcut) => void;
  toggleFavoriteModule: (module: WorkspaceModuleShortcut) => void;
  addRecentModule: (module: WorkspaceModuleShortcut) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isQuickLauncherOpen: boolean;
  setIsQuickLauncherOpen: (open: boolean) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const STORAGE_KEY = "college_erp_workspace_state";

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("expanded");
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [pinnedModules, setPinnedModules] = useState<WorkspaceModuleShortcut[]>([
    { id: "1", name: "Student Directory", route: "/students", iconName: "Users", category: "Directory" },
    { id: "2", name: "Examinations", route: "/examinations", iconName: "BookOpen", category: "Academics" },
    { id: "3", name: "AI Assistant", route: "/ai", iconName: "Sparkles", category: "AI & Innovation" },
    { id: "4", name: "Visitor Security", route: "/visitor", iconName: "Shield", category: "Facilities" },
  ]);
  const [recentModules, setRecentModules] = useState<WorkspaceModuleShortcut[]>([
    { id: "5", name: "Grades & Results", route: "/results", iconName: "BarChart2", category: "Academics" },
    { id: "6", name: "Fee Management", route: "/fees", iconName: "DollarSign", category: "Finance" },
  ]);
  const [favoriteModules, setFavoriteModules] = useState<WorkspaceModuleShortcut[]>([
    { id: "1", name: "Student Directory", route: "/students", iconName: "Users", category: "Directory" },
    { id: "3", name: "AI Assistant", route: "/ai", iconName: "Sparkles", category: "AI & Innovation" },
  ]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickLauncherOpen, setIsQuickLauncherOpen] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sidebarMode) setSidebarMode(parsed.sidebarMode);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.pinnedModules) setPinnedModules(parsed.pinnedModules);
        if (parsed.favoriteModules) setFavoriteModules(parsed.favoriteModules);
      }
    } catch (e) {
      console.error("Failed to load workspace state", e);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ sidebarMode, theme, pinnedModules, favoriteModules })
      );
    } catch (e) {
      console.error("Failed to save workspace state", e);
    }
  }, [sidebarMode, theme, pinnedModules, favoriteModules]);

  // Global Keyboard Shortcuts (Ctrl+K for Search, Ctrl+J for Quick Launcher)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key === "j") {
        e.preventDefault();
        setIsQuickLauncherOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const togglePinModule = (module: WorkspaceModuleShortcut) => {
    setPinnedModules((prev) =>
      prev.some((m) => m.route === module.route)
        ? prev.filter((m) => m.route !== module.route)
        : [...prev, module]
    );
  };

  const toggleFavoriteModule = (module: WorkspaceModuleShortcut) => {
    setFavoriteModules((prev) =>
      prev.some((m) => m.route === module.route)
        ? prev.filter((m) => m.route !== module.route)
        : [...prev, module]
    );
  };

  const addRecentModule = (module: WorkspaceModuleShortcut) => {
    setRecentModules((prev) => [
      module,
      ...prev.filter((m) => m.route !== module.route).slice(0, 7),
    ]);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        sidebarMode,
        setSidebarMode,
        theme,
        setTheme,
        pinnedModules,
        recentModules,
        favoriteModules,
        togglePinModule,
        toggleFavoriteModule,
        addRecentModule,
        isSearchOpen,
        setIsSearchOpen,
        isQuickLauncherOpen,
        setIsQuickLauncherOpen,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};
