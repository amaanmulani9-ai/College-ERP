import { useContext } from "react";
import { PWAContext, PWAContextType } from "./PWAContext";

export const usePWA = (): PWAContextType => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error("usePWA must be used within a PWAProvider");
  }
  return context;
};
