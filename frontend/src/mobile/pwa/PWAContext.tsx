import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface SyncItem {
  id: string;
  action: string;
  module: string;
  timestamp: string;
  status: "pending" | "syncing" | "completed" | "failed";
}

export interface PWAContextType {
  isOnline: boolean;
  effectiveType: string;
  latencyMs: number;
  isInstallable: boolean;
  isInstalled: boolean;
  installPWA: () => Promise<void>;
  updateAvailable: boolean;
  applyUpdate: () => void;
  syncQueue: SyncItem[];
  triggerManualSync: () => void;
  clearSyncQueue: () => void;
  autoSyncEnabled: boolean;
  setAutoSyncEnabled: (enabled: boolean) => void;
  wifiOnlySync: boolean;
  setWifiOnlySync: (wifiOnly: boolean) => void;
  cacheSizeMB: number;
  clearCache: () => void;
}

export const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const PWAProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [effectiveType, setEffectiveType] = useState<string>("4g");
  const [latencyMs, setLatencyMs] = useState<number>(32);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(true);
  const [wifiOnlySync, setWifiOnlySync] = useState<boolean>(false);
  const [cacheSizeMB, setCacheSizeMB] = useState<number>(42.8);

  const [syncQueue, setSyncQueue] = useState<SyncItem[]>([
    { id: "sq-1", action: "Attendance Record Scan", module: "Attendance", timestamp: "10:14 AM", status: "pending" },
    { id: "sq-2", action: "Fee Receipt Draft #841", module: "Fees",       timestamp: "10:28 AM", status: "pending" },
  ]);

  useEffect(() => {
    const handleOnline  = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Simulate network connection diagnostics
    const nav: any = navigator;
    if (nav.connection) {
      setEffectiveType(nav.connection.effectiveType || "4g");
      if (nav.connection.rtt) setLatencyMs(nav.connection.rtt);
    }

    // Simulate occasional service worker update trigger for demo
    const timer = setTimeout(() => setUpdateAvailable(true), 30000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    } else {
      alert("To install NITS ERP App: Tap 'Add to Home Screen' in your browser options menu.");
    }
  };

  const applyUpdate = () => {
    alert("Applying PWA Service Worker Update… App will refresh.");
    window.location.reload();
  };

  const triggerManualSync = () => {
    setSyncQueue((prev) =>
      prev.map((item) => ({ ...item, status: "syncing" }))
    );
    setTimeout(() => {
      setSyncQueue((prev) =>
        prev.map((item) => ({ ...item, status: "completed" }))
      );
    }, 1500);
  };

  const clearSyncQueue = () => {
    setSyncQueue([]);
  };

  const clearCache = () => {
    setCacheSizeMB(0.5);
    alert("PWA Offline Cache cleared successfully.");
  };

  return (
    <PWAContext.Provider
      value={{
        isOnline,
        effectiveType,
        latencyMs,
        isInstallable,
        isInstalled,
        installPWA,
        updateAvailable,
        applyUpdate,
        syncQueue,
        triggerManualSync,
        clearSyncQueue,
        autoSyncEnabled,
        setAutoSyncEnabled,
        wifiOnlySync,
        setWifiOnlySync,
        cacheSizeMB,
        clearCache,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
};
