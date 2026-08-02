import { useContext } from "react";
import { StateSystemContext, StateSystemContextType } from "./StateProvider";

export const useStateSystem = (): StateSystemContextType => {
  const context = useContext(StateSystemContext);
  if (!context) {
    throw new Error("useStateSystem must be used within a StateProvider");
  }
  return context;
};
