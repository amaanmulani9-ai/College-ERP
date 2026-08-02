import React from "react";
import { useWindowManager } from "./WorkspaceManager";
import { WorkspaceWindow } from "./WorkspaceWindow";
import { WorkspaceSplitter } from "./WorkspaceSplitter";

export const WorkspaceDock: React.FC = () => {
  const { windows } = useWindowManager();

  const leftWindows = windows.filter((w) => w.dockZone === "left" && w.state !== "minimized");
  const rightWindows = windows.filter((w) => w.dockZone === "right" && w.state !== "minimized");
  const topWindows = windows.filter((w) => w.dockZone === "top" && w.state !== "minimized");
  const bottomWindows = windows.filter((w) => w.dockZone === "bottom" && w.state !== "minimized");
  const centerWindows = windows.filter((w) => w.dockZone === "center" && w.state !== "minimized");

  const hasLeft = leftWindows.length > 0;
  const hasRight = rightWindows.length > 0;
  const hasTop = topWindows.length > 0;
  const hasBottom = bottomWindows.length > 0;

  const renderDockZone = (wins: typeof windows, label: string) => {
    if (wins.length === 0) return null;
    if (wins.length === 1) {
      return <WorkspaceWindow window={wins[0]} />;
    }
    // Stack multiple windows in same zone as vertical split panels
    return (
      <div className="flex flex-col h-full divide-y divide-slate-800">
        {wins.map((w) => (
          <div key={w.id} className="flex-1 min-h-0">
            <WorkspaceWindow window={w} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Top dock zone */}
      {hasTop && (
        <div className="h-48 flex-shrink-0 border-b border-slate-800">
          {renderDockZone(topWindows, "Top")}
        </div>
      )}

      {/* Middle row: Left + Center + Right */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left dock */}
        {hasLeft && (
          <div className="w-72 flex-shrink-0 border-r border-slate-800">
            {renderDockZone(leftWindows, "Left")}
          </div>
        )}

        {/* Center area */}
        <div className="flex-1 relative overflow-hidden">
          {centerWindows.map((w) => (
            <WorkspaceWindow key={w.id} window={w} />
          ))}
        </div>

        {/* Right dock */}
        {hasRight && (
          <div className="w-72 flex-shrink-0 border-l border-slate-800">
            {renderDockZone(rightWindows, "Right")}
          </div>
        )}
      </div>

      {/* Bottom dock zone */}
      {hasBottom && (
        <div className="h-48 flex-shrink-0 border-t border-slate-800">
          {renderDockZone(bottomWindows, "Bottom")}
        </div>
      )}
    </div>
  );
};
