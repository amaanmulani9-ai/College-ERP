import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DockZone = "left" | "right" | "top" | "bottom" | "center" | "floating";
export type SplitDirection = "horizontal" | "vertical" | "none";
export type WindowState = "normal" | "minimized" | "maximized";

export interface WindowPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WorkspaceWindowRecord {
  id: string;
  title: string;
  route: string;
  iconName?: string;
  state: WindowState;
  dockZone: DockZone;
  position: WindowPosition;
  isPinned: boolean;
  zIndex: number;
  splitRatio?: number;
  openedAt: number;
}

export type LayoutPreset =
  | "default"
  | "analytics"
  | "administration"
  | "academic"
  | "finance"
  | "library"
  | "custom";

export interface SavedLayout {
  id: string;
  name: string;
  preset: LayoutPreset;
  windows: WorkspaceWindowRecord[];
  createdAt: number;
}

interface WorkspaceManagerContextType {
  windows: WorkspaceWindowRecord[];
  activeWindowId: string | null;
  currentLayout: LayoutPreset;
  savedLayouts: SavedLayout[];
  openWindow: (opts: { title: string; route: string; iconName?: string; dockZone?: DockZone }) => string;
  closeWindow: (id: string) => void;
  closeOtherWindows: (id: string) => void;
  focusWindow: (id: string) => void;
  setWindowState: (id: string, state: WindowState) => void;
  setWindowDock: (id: string, zone: DockZone) => void;
  updateWindowPosition: (id: string, pos: Partial<WindowPosition>) => void;
  pinWindow: (id: string) => void;
  duplicateWindow: (id: string) => void;
  switchLayout: (preset: LayoutPreset) => void;
  saveLayout: (name: string) => void;
  deleteLayout: (id: string) => void;
  resetLayout: () => void;
  isSwitcherOpen: boolean;
  setSwitcherOpen: (v: boolean) => void;
}

const WorkspaceManagerContext = createContext<WorkspaceManagerContextType | undefined>(undefined);

const STORAGE_KEY = "college_erp_window_manager";
let zCounter = 100;

const defaultWindows: WorkspaceWindowRecord[] = [
  {
    id: "win-home",
    title: "Workspace Home",
    route: "/workspace",
    iconName: "Home",
    state: "normal",
    dockZone: "center",
    position: { x: 0, y: 0, width: 800, height: 500 },
    isPinned: true,
    zIndex: 100,
    openedAt: Date.now(),
  },
];

export const WorkspaceManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WorkspaceWindowRecord[]>(defaultWindows);
  const [activeWindowId, setActiveWindowId] = useState<string | null>("win-home");
  const [currentLayout, setCurrentLayout] = useState<LayoutPreset>("default");
  const [savedLayouts, setSavedLayouts] = useState<SavedLayout[]>([]);
  const [isSwitcherOpen, setSwitcherOpen] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.windows?.length) setWindows(parsed.windows);
        if (parsed.currentLayout) setCurrentLayout(parsed.currentLayout);
        if (parsed.savedLayouts) setSavedLayouts(parsed.savedLayouts);
        if (parsed.activeWindowId) setActiveWindowId(parsed.activeWindowId);
      }
    } catch (e) {
      console.error("Failed to load window manager state", e);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ windows, currentLayout, savedLayouts, activeWindowId })
      );
    } catch (e) {
      console.error("Failed to save window manager state", e);
    }
  }, [windows, currentLayout, savedLayouts, activeWindowId]);

  // Ctrl+Tab window switcher
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Tab") {
        e.preventDefault();
        setSwitcherOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openWindow = useCallback(
    (opts: { title: string; route: string; iconName?: string; dockZone?: DockZone }): string => {
      const existing = windows.find((w) => w.route === opts.route);
      if (existing) {
        focusWindow(existing.id);
        return existing.id;
      }
      const id = `win-${Date.now()}`;
      const zone = opts.dockZone ?? "center";
      const newWin: WorkspaceWindowRecord = {
        id,
        title: opts.title,
        route: opts.route,
        iconName: opts.iconName,
        state: "normal",
        dockZone: zone,
        position: { x: 80 + windows.length * 30, y: 80 + windows.length * 20, width: 720, height: 460 },
        isPinned: false,
        zIndex: ++zCounter,
        openedAt: Date.now(),
      };
      setWindows((prev) => [...prev, newWin]);
      setActiveWindowId(id);
      return id;
    },
    [windows]
  );

  const focusWindow = useCallback((id: string) => {
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: ++zCounter } : w))
    );
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const target = prev.find((w) => w.id === id);
      if (target?.isPinned) return prev;
      return prev.filter((w) => w.id !== id);
    });
    setActiveWindowId((prev) => {
      if (prev === id) {
        const remaining = windows.filter((w) => w.id !== id);
        return remaining.length > 0 ? remaining[remaining.length - 1].id : null;
      }
      return prev;
    });
  }, [windows]);

  const closeOtherWindows = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id === id || w.isPinned));
    setActiveWindowId(id);
  }, []);

  const setWindowState = useCallback((id: string, state: WindowState) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, state } : w)));
  }, []);

  const setWindowDock = useCallback((id: string, zone: DockZone) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, dockZone: zone } : w)));
  }, []);

  const updateWindowPosition = useCallback((id: string, pos: Partial<WindowPosition>) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, position: { ...w.position, ...pos } } : w))
    );
  }, []);

  const pinWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isPinned: !w.isPinned } : w))
    );
  }, []);

  const duplicateWindow = useCallback((id: string) => {
    const target = windows.find((w) => w.id === id);
    if (!target) return;
    const newId = `win-dup-${Date.now()}`;
    const dupWin: WorkspaceWindowRecord = {
      ...target,
      id: newId,
      title: `${target.title} (Copy)`,
      isPinned: false,
      zIndex: ++zCounter,
      openedAt: Date.now(),
      position: { ...target.position, x: target.position.x + 40, y: target.position.y + 40 },
    };
    setWindows((prev) => [...prev, dupWin]);
    setActiveWindowId(newId);
  }, [windows]);

  const switchLayout = useCallback((preset: LayoutPreset) => {
    setCurrentLayout(preset);
  }, []);

  const saveLayout = useCallback((name: string) => {
    const layout: SavedLayout = {
      id: `layout-${Date.now()}`,
      name,
      preset: "custom",
      windows: [...windows],
      createdAt: Date.now(),
    };
    setSavedLayouts((prev) => [...prev, layout]);
  }, [windows]);

  const deleteLayout = useCallback((id: string) => {
    setSavedLayouts((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const resetLayout = useCallback(() => {
    setWindows(defaultWindows);
    setCurrentLayout("default");
    setActiveWindowId("win-home");
  }, []);

  return (
    <WorkspaceManagerContext.Provider
      value={{
        windows,
        activeWindowId,
        currentLayout,
        savedLayouts,
        openWindow,
        closeWindow,
        closeOtherWindows,
        focusWindow,
        setWindowState,
        setWindowDock,
        updateWindowPosition,
        pinWindow,
        duplicateWindow,
        switchLayout,
        saveLayout,
        deleteLayout,
        resetLayout,
        isSwitcherOpen,
        setSwitcherOpen,
      }}
    >
      {children}
    </WorkspaceManagerContext.Provider>
  );
};

export const useWindowManager = () => {
  const ctx = useContext(WorkspaceManagerContext);
  if (!ctx) throw new Error("useWindowManager must be used within WorkspaceManagerProvider");
  return ctx;
};
