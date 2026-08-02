import React from "react";
import { Map } from "lucide-react";
import { useWindowManager } from "./WorkspaceManager";

export const WorkspaceMiniMap: React.FC = () => {
  const { windows } = useWindowManager();

  return (
    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 select-none">
      <div className="flex items-center gap-2 mb-3">
        <Map className="w-4 h-4 text-indigo-400" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Workspace Mini-Map
        </span>
      </div>
      {/* Placeholder viewport */}
      <div className="w-full h-32 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden">
        {windows
          .filter((w) => w.state !== "minimized")
          .map((w) => (
            <div
              key={w.id}
              style={{
                position: "absolute",
                left: `${Math.min((w.position.x / 1440) * 100, 85)}%`,
                top: `${Math.min((w.position.y / 900) * 100, 80)}%`,
                width: `${Math.min((w.position.width / 1440) * 100, 25)}%`,
                height: `${Math.min((w.position.height / 900) * 100, 30)}%`,
              }}
              className="rounded bg-indigo-600/30 border border-indigo-500/40"
              title={w.title}
            />
          ))}
        <div className="absolute bottom-1.5 right-2 text-[9px] text-slate-600 font-mono">
          {windows.length} window{windows.length !== 1 ? "s" : ""}
        </div>
      </div>
      <div className="mt-2 text-[10px] text-slate-600 text-center">
        Full minimap navigation — Phase 4+
      </div>
    </div>
  );
};
