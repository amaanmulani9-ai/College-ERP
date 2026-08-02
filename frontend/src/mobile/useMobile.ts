import { useContext } from "react";
import { MobileContext, MobileContextType } from "./MobileContext";

export const useMobile = (): MobileContextType => {
  const context = useContext(MobileContext);
  if (!context) {
    throw new Error("useMobile must be used within a MobileProvider");
  }
  return context;
};
