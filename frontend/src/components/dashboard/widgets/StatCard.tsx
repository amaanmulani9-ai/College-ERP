import React from "react";

export interface StatCardProps {
  label: string;
  stat: string | number;
  description?: string;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, stat, description, badge }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">{label}</span>
        {badge && (
          <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono font-bold">
            {badge}
          </span>
        )}
      </div>
      <div className="text-xl font-bold text-white">{stat}</div>
      {description && <p className="text-[11px] text-slate-500">{description}</p>}
    </div>
  );
};
