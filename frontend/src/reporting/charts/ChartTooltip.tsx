import React from "react";

interface ChartTooltipProps {
  title?: string;
  items: { label: string; value: string | number; color?: string }[];
  position?: { x: number; y: number };
  visible?: boolean;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  title,
  items,
  position,
  visible = true,
}) => {
  if (!visible || !items || items.length === 0) return null;

  return (
    <div
      style={
        position
          ? {
              left: `${position.x}px`,
              top: `${position.y}px`,
              transform: "translate(-50%, -100%)",
            }
          : undefined
      }
      className="absolute z-50 pointer-events-none bg-slate-900/95 border border-slate-700/80 rounded-lg p-2.5 shadow-2xl text-xs backdrop-blur-md min-w-[140px]"
    >
      {title && (
        <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1.5 font-mono text-[11px]">
          {title}
        </div>
      )}
      <div className="space-y-1">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-slate-400">
              {item.color && (
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              )}
              <span>{item.label}</span>
            </div>
            <span className="font-mono font-bold text-slate-100">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
