import React from "react";
import { useAccessibility } from "./useAccessibility";

export const TabOrderInspector: React.FC = () => {
  const { showFocusInspector } = useAccessibility();

  if (!showFocusInspector) return null;

  return (
    <div className="fixed bottom-3 right-3 z-50 p-2.5 bg-indigo-950 border border-indigo-800 rounded-xl text-indigo-300 text-[9px] font-mono shadow-2xl">
      Tab Order Inspector Active
    </div>
  );
};

export const FocusOutlineManager: React.FC = () => {
  return null;
};
