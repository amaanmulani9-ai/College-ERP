import { useContext } from "react";
import { MotionContext, MotionContextType } from "./MotionProvider";

export const useMotion = (): MotionContextType => {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error("useMotion must be used within a MotionProvider");
  }
  return context;
};
