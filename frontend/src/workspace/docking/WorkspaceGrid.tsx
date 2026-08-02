import React from "react";
import { useWindowManager } from "./WorkspaceManager";
import { WorkspaceWindow } from "./WorkspaceWindow";
import { WorkspaceDock } from "./WorkspaceDock";

export const WorkspaceGrid: React.FC = () => {
  const { windows } = useWindowManager();

  // Minimized windows shown in a taskbar strip at bottom
  const minimizedWindows = windows.filter((w) => w.state === "minimized");
  const floatingWindows = windows.filter(
    (w) => w.dockZone === "floating" && w.state !== "minimized"
  );

  return (
    <div className="flex flex-col h-full bg-slate-950 relative overflow-hidden">
      {/* Main dock layout (left/right/top/bottom/center) */}
      <div className="flex-1 relative overflow-hidden">
        <WorkspaceDock />

        {/* Floating windows rendered on top */}
        {floatingWindows.map((w) => (
          <WorkspaceWindow key={w.id} window={w} />
        ))}
      </div>

      {/* Minimized taskbar */}
      {minimizedWindows.length > 0 && (
        <div className="h-10 flex-shrink-0 flex items-center gap-2 px-3 bg-slate-900 border-t border-slate-800 overflow-x-auto no-scrollbar">
          {minimizedWindows.map((w) => (
            <WorkspaceWindow key={w.id} window={w} />
          ))}
        </div>
      )}
    </div>
  );
};
