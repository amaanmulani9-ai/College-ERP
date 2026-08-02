import React from "react";
import { RefreshCw } from "lucide-react";

export const LoadingSpinner: React.FC<{ size?: "sm" | "md" | "lg"; className?: string }> = ({
  size = "md",
  className = "",
}) => {
  const dim = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-8 h-8" : "w-6 h-6";
  return <RefreshCw className={`${dim} animate-spin text-indigo-400 ${className}`} />;
};

export const LoadingBar: React.FC<{ progress?: number; className?: string }> = ({
  progress = 75,
  className = "",
}) => (
  <div className={`w-full h-1 bg-slate-950 rounded-full overflow-hidden ${className}`}>
    <div
      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);

export const LoadingOverlay: React.FC<{ message?: string }> = ({ message = "Loading ERP Workspace Data…" }) => (
  <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center space-y-3 font-sans text-xs text-slate-200 select-none animate-in fade-in duration-150">
    <LoadingSpinner size="lg" />
    <p className="font-bold text-slate-100">{message}</p>
  </div>
);

export const ProgressOverlay: React.FC<{ progress: number; label?: string }> = ({
  progress,
  label = "Processing Operation…",
}) => (
  <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center space-y-3 font-sans text-xs text-slate-200 select-none animate-in fade-in duration-150">
    <div className="w-64 space-y-2">
      <div className="flex justify-between font-mono text-[10px]">
        <span>{label}</span>
        <span className="font-bold text-indigo-400">{progress}%</span>
      </div>
      <LoadingBar progress={progress} />
    </div>
  </div>
);
