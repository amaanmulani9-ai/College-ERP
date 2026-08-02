import React from "react";

export const CardSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => (
  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 animate-pulse">
    <div className="h-4 bg-slate-800 rounded w-1/3" />
    <div className="space-y-2 pt-1">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-3 bg-slate-800/60 rounded w-full" />
      ))}
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => (
  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 animate-pulse">
    <div className="h-5 bg-slate-800 rounded w-1/4" />
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-2">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-8 bg-slate-800/50 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 animate-pulse">
    <div className="flex justify-between">
      <div className="h-4 bg-slate-800 rounded w-1/4" />
      <div className="h-4 bg-slate-800 rounded w-16" />
    </div>
    <div className="h-40 bg-slate-950 rounded-xl flex items-end justify-between p-3 gap-2">
      {[40, 65, 80, 55, 90, 100].map((h, i) => (
        <div key={i} className="w-full bg-slate-800 rounded-t" style={{ height: `${h}%` }} />
      ))}
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} rows={2} />
      ))}
    </div>
    <ChartSkeleton />
    <TableSkeleton rows={4} cols={5} />
  </div>
);

export const PageSkeleton: React.FC = () => (
  <div className="p-6 max-w-6xl mx-auto space-y-6">
    <div className="h-8 bg-slate-800 rounded w-1/3 animate-pulse" />
    <DashboardSkeleton />
  </div>
);
