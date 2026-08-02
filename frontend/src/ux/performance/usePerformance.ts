import { useContext } from "react";
import { PerformanceContext, PerformanceContextType } from "./PerformanceProvider";

export const usePerformance = (): PerformanceContextType => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
};
