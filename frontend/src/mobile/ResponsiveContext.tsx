import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { detectDevice, DeviceInfo } from "./DeviceDetector";

export interface ResponsiveContextType {
  device: DeviceInfo;
  breakpoint: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  isMobileView: boolean;
  forceMobilePreview: boolean;
  toggleMobilePreview: () => void;
}

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined);

function getBreakpoint(width: number): ResponsiveContextType["breakpoint"] {
  if (width < 640) return "xs";
  if (width < 768) return "sm";
  if (width < 1024) return "md";
  if (width < 1280) return "lg";
  if (width < 1536) return "xl";
  return "2xl";
}

export const ResponsiveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [device, setDevice] = useState<DeviceInfo>(detectDevice());
  const [forceMobilePreview, setForceMobilePreview] = useState(false);

  useEffect(() => {
    const handleResize = () => setDevice(detectDevice());
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  const toggleMobilePreview = () => setForceMobilePreview((prev) => !prev);
  const isMobileView = device.isMobile || forceMobilePreview;
  const breakpoint = getBreakpoint(device.screenWidth);

  return (
    <ResponsiveContext.Provider
      value={{
        device,
        breakpoint,
        isMobileView,
        forceMobilePreview,
        toggleMobilePreview,
      }}
    >
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useResponsive = (): ResponsiveContextType => {
  const context = useContext(ResponsiveContext);
  if (!context) {
    // Fallback if rendered outside provider
    const dev = detectDevice();
    return {
      device: dev,
      breakpoint: getBreakpoint(dev.screenWidth),
      isMobileView: dev.isMobile,
      forceMobilePreview: false,
      toggleMobilePreview: () => {},
    };
  }
  return context;
};
