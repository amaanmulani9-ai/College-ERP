import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { isReducedMotionPreferred } from "./motionHelpers";

export interface MotionContextType {
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
  globalSpeed: number; // 1.0, 0.5, 0.0
  setGlobalSpeed: (speed: number) => void;
  hoverScaleEnabled: boolean;
  setHoverScaleEnabled: (enabled: boolean) => void;
}

export const MotionContext = createContext<MotionContextType | undefined>(undefined);

export const MotionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reducedMotion, setReducedMotion] = useState<boolean>(isReducedMotionPreferred());
  const [globalSpeed, setGlobalSpeed] = useState<number>(1.0);
  const [hoverScaleEnabled, setHoverScaleEnabled] = useState<boolean>(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setReducedMotion(media.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return (
    <MotionContext.Provider
      value={{
        reducedMotion,
        setReducedMotion,
        globalSpeed,
        setGlobalSpeed,
        hoverScaleEnabled,
        setHoverScaleEnabled,
      }}
    >
      {children}
    </MotionContext.Provider>
  );
};
