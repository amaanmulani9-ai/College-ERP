import React, { ReactNode } from "react";
import { useResponsive } from "./ResponsiveContext";

interface SafeAreaProviderProps {
  children: ReactNode;
}

export const SafeAreaProvider: React.FC<SafeAreaProviderProps> = ({ children }) => {
  const { device } = useResponsive();

  const style: React.CSSProperties = {
    paddingTop: device.hasNotch ? `${device.safeAreaInsetTop}px` : "env(safe-area-inset-top, 0px)",
    paddingBottom: device.hasNotch ? `${device.safeAreaInsetBottom}px` : "env(safe-area-inset-bottom, 0px)",
    paddingLeft: "env(safe-area-inset-left, 0px)",
    paddingRight: "env(safe-area-inset-right, 0px)",
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-950 text-slate-100" style={style}>
      {children}
    </div>
  );
};
