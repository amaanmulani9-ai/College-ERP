import React from "react";
import { BarChart3, RefreshCw } from "lucide-react";

interface ChartEmptyStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ChartEmptyState: React.FC<ChartEmptyStateProps> = ({
  message = "No data points available to render visualization",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center w-full h-full border border-dashed border-slate-800 rounded-xl bg-slate-900/40">
      <BarChart3 className="w-8 h-8 text-slate-600 mb-2" />
      <p className="text-xs text-slate-400 font-medium max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-md transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload Data</span>
        </button>
      )}
    </div>
  );
};
