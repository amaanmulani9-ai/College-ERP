import React, { createContext, useContext, useState, ReactNode } from "react";
import { LiveRegionPriority } from "./accessibilityTokens";

export interface Announcement {
  id: string;
  message: string;
  priority: LiveRegionPriority;
}

export interface AccessibilityContextType {
  announcements: Announcement[];
  announce: (message: string, priority?: LiveRegionPriority) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  showFocusInspector: boolean;
  setShowFocusInspector: (enabled: boolean) => void;
}

export const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [showFocusInspector, setShowFocusInspector] = useState<boolean>(false);

  const announce = (message: string, priority: LiveRegionPriority = "polite") => {
    const id = `announcement-${Date.now()}`;
    setAnnouncements((prev) => [...prev, { id, message, priority }]);
    setTimeout(() => {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    }, 5000);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        announcements,
        announce,
        highContrast,
        setHighContrast,
        showFocusInspector,
        setShowFocusInspector,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};
