import React from "react";
import { ChartContainer, ChartContainerProps } from "./ChartContainer";
import { DataPoint } from "./types";
import { MOCK_TREEMAP_DATA } from "./mockAnalyticsData";

export interface TreemapChartProps extends Omit<ChartContainerProps, "children"> {
  data?: DataPoint[];
}

export const TreemapChart: React.FC<TreemapChartProps> = ({
  data = MOCK_TREEMAP_DATA,
  ...containerProps
}) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <ChartContainer {...containerProps}>
      <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-2 p-1">
        {data.map((item, idx) => {
          const pct = Math.round((item.value / total) * 100);
          return (
            <div
              key={idx}
              style={{ backgroundColor: `${item.color}22`, borderColor: item.color }}
              className={`p-3 rounded-xl border flex flex-col justify-between hover:opacity-90 transition-opacity cursor-pointer ${
                idx === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
              }`}
            >
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  {pct}% Share
                </span>
                <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{item.label}</h4>
              </div>
              <div className="font-mono text-sm font-bold" style={{ color: item.color }}>
                {item.value} units
              </div>
            </div>
          );
        })}
      </div>
    </ChartContainer>
  );
};
