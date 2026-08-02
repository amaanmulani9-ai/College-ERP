import React, { useState } from "react";
import {
  Maximize2,
  Minimize2,
  Star,
  Pin,
  RefreshCw,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ChartTheme } from "./types";
import { ChartExportMenu } from "./ChartExportMenu";

export interface ChartContainerProps {
  id?: string;
  title: string;
  subtitle?: string;
  height?: number | string;
  isLoading?: boolean;
  error?: string;
  theme?: ChartTheme;
  className?: string;
  children: React.ReactNode;
  onRefresh?: () => void;
  onOpenInWorkspace?: () => void;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  id,
  title,
  subtitle,
  height = 320,
  isLoading = false,
  error,
  theme = "dark",
  className = "",
  children,
  onRefresh,
  onOpenInWorkspace,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div
      id={id}
      tabIndex={0}
      role="region"
      aria-label={`Analytics chart: ${title}`}
      className={`group relative flex flex-col justify-between bg-slate-900/90 border border-slate-800 rounded-xl shadow-xl backdrop-blur-md transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none p-6 bg-slate-950 overflow-y-auto" : "p-5"
      } ${className}`}
    >
      {/* Header Bar */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-3 mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors flex items-center gap-2">
            <span>{title}</span>
            {isPinned && (
              <span className="text-[10px] font-mono font-medium text-indigo-400 bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-800/60">
                Pinned
              </span>
            )}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5 leading-normal">{subtitle}</p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-1.5 rounded-md hover:bg-slate-800 transition-colors ${
              isFavorite ? "text-amber-400 fill-amber-400" : "text-slate-500 hover:text-slate-300"
            }`}
            title={isFavorite ? "Remove Favorite" : "Favorite Chart"}
            aria-label="Toggle Favorite Chart"
          >
            <Star className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsPinned(!isPinned)}
            className={`p-1.5 rounded-md hover:bg-slate-800 transition-colors ${
              isPinned ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"
            }`}
            title={isPinned ? "Unpin Chart" : "Pin Chart"}
            aria-label="Toggle Pin Chart"
          >
            <Pin className="w-3.5 h-3.5" />
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 text-slate-500 hover:text-indigo-300 hover:bg-slate-800 rounded-md transition-colors"
              title="Refresh Chart Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="p-1.5 text-slate-500 hover:text-indigo-300 hover:bg-slate-800 rounded-md transition-colors"
              title="Export Chart"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            {isExportOpen && (
              <ChartExportMenu title={title} onClose={() => setIsExportOpen(false)} />
            )}
          </div>

          {onOpenInWorkspace && (
            <button
              onClick={onOpenInWorkspace}
              className="p-1.5 text-slate-500 hover:text-cyan-300 hover:bg-slate-800 rounded-md transition-colors"
              title="Open in Workspace Tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-md transition-colors"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-md transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Chart Body Content */}
      {!isCollapsed && (
        <div
          style={{ height: isFullscreen ? "calc(100vh - 120px)" : typeof height === "number" ? `${height}px` : height }}
          className="w-full flex items-center justify-center relative overflow-hidden"
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
              <span className="text-xs font-mono text-slate-400">Loading chart analytics...</span>
            </div>
          ) : error ? (
            <div className="text-center p-4 bg-rose-950/40 border border-rose-800/60 rounded-lg">
              <p className="text-xs text-rose-300 font-semibold">{error}</p>
            </div>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
};
