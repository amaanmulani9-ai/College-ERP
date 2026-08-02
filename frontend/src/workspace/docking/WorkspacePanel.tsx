import React from "react";

interface WorkspacePanelProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export const WorkspacePanel: React.FC<WorkspacePanelProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden h-full ${className}`}
    >
      {/* Panel Header */}
      <div className="h-8 px-3 flex items-center bg-slate-900 border-b border-slate-800 select-none">
        <span className="text-[11px] font-bold text-slate-400 truncate">{title}</span>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-auto p-4">
        {children ?? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500">
            Panel: <span className="font-mono text-indigo-400 ml-1">{title}</span>
          </div>
        )}
      </div>
    </div>
  );
};
