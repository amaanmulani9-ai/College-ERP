import React from "react";

export const WidgetSkeleton: React.FC = () => (
  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 animate-pulse">
    <div className="h-3 bg-slate-800 rounded w-1/2" />
    <div className="h-6 bg-slate-800/80 rounded w-3/4" />
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3 animate-pulse">
    <div className="w-12 h-12 rounded-2xl bg-slate-800 shrink-0" />
    <div className="space-y-1.5 flex-1">
      <div className="h-4 bg-slate-800 rounded w-1/3" />
      <div className="h-3 bg-slate-800/60 rounded w-1/2" />
    </div>
  </div>
);

export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 4 }) => (
  <div className="space-y-2 animate-pulse">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center">
        <div className="h-3 bg-slate-800 rounded w-1/2" />
        <div className="h-3 bg-slate-800 rounded w-12" />
      </div>
    ))}
  </div>
);

export const TimelineSkeleton: React.FC = () => (
  <div className="space-y-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="flex items-start gap-3">
        <div className="w-3 h-3 rounded-full bg-slate-800 mt-1" />
        <div className="space-y-1 flex-1">
          <div className="h-3 bg-slate-800 rounded w-1/3" />
          <div className="h-2.5 bg-slate-800/60 rounded w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

export const StatisticSkeleton: React.FC = () => (
  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 animate-pulse">
    <div className="h-3 bg-slate-800 rounded w-1/3" />
    <div className="h-8 bg-slate-800/80 rounded w-1/2" />
  </div>
);

export const FormSkeleton: React.FC = () => (
  <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 animate-pulse">
    <div className="h-5 bg-slate-800 rounded w-1/4" />
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-1">
          <div className="h-3 bg-slate-800 rounded w-1/6" />
          <div className="h-10 bg-slate-950 rounded-xl" />
        </div>
      ))}
    </div>
  </div>
);
