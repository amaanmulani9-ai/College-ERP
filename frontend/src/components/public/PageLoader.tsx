import React from "react";
import { GraduationCap } from "lucide-react";

export const PageLoader: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center animate-pulse">
          <GraduationCap className="w-8 h-8 text-indigo-400" />
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
      <div className="text-center space-y-1">
        <span className="text-sm font-bold text-white tracking-wide">College ERP</span>
        <span className="block text-[11px] text-slate-400 font-mono">Loading module assets...</span>
      </div>
    </div>
  );
};
