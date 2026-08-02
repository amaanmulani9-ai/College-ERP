import React from "react";
import { useAccessibility } from "./useAccessibility";

export const SkipNavigation: React.FC<{ mainId?: string }> = ({ mainId = "main-content" }) => {
  return (
    <a
      href={`#${mainId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white text-xs font-sans"
    >
      Skip to main content
    </a>
  );
};

export const LiveRegion: React.FC = () => {
  const { announcements } = useAccessibility();

  return (
    <div className="sr-only" aria-live="polite" aria-atomic="true">
      {announcements.map((a) => (
        <p key={a.id}>{a.message}</p>
      ))}
    </div>
  );
};
