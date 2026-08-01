import React from "react";

export const SectionSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="h-4 bg-slate-800 rounded-full w-32 mx-auto" />
        <div className="h-8 bg-slate-800 rounded-xl w-3/4 mx-auto" />
        <div className="h-4 bg-slate-800 rounded-lg w-1/2 mx-auto" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 h-48 space-y-4">
            <div className="w-10 h-10 bg-slate-800 rounded-xl" />
            <div className="h-5 bg-slate-800 rounded w-2/3" />
            <div className="h-3 bg-slate-800 rounded w-full" />
            <div className="h-3 bg-slate-800 rounded w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
};
