import React from "react";

export interface LegendItem {
  id: string;
  name: string;
  color: string;
  hidden?: boolean;
}

interface ChartLegendProps {
  items: LegendItem[];
  onToggleItem?: (id: string) => void;
  className?: string;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({
  items,
  onToggleItem,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-300 ${className}`}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onToggleItem && onToggleItem(item.id)}
          className={`flex items-center gap-2 px-2.5 py-1 rounded-md transition-all ${
            item.hidden
              ? "opacity-40 line-through text-slate-500 hover:opacity-70"
              : "hover:bg-slate-800/60"
          }`}
          title={`Click to ${item.hidden ? "show" : "hide"} ${item.name}`}
        >
          <span
            className="w-3 h-3 rounded-full border border-slate-700 shadow-sm shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span>{item.name}</span>
        </button>
      ))}
    </div>
  );
};
