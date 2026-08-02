import React, { ReactNode } from "react";
import { ResponsiveProvider } from "./ResponsiveContext";
import { MobileProvider } from "./MobileContext";
import { SafeAreaProvider } from "./SafeAreaProvider";

interface MobileShellProps {
  children: ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  return (
    <ResponsiveProvider>
      <MobileProvider>
        <SafeAreaProvider>{children}</SafeAreaProvider>
      </MobileProvider>
    </ResponsiveProvider>
  );
};
