import React from "react";
import { ChartContainer, ChartContainerProps } from "./ChartContainer";
import { DataPoint } from "./types";
import { MOCK_BAR_DATA } from "./mockAnalyticsData";

export interface HorizontalBarChartProps extends Omit<ChartContainerProps, "children"> {
  data?: DataPoint[];
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  data = MOCK_BAR_DATA,
  ...containerProps
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 100);

  return (
    <ChartContainer {...containerProps}>
      <div className="w-full h-full space-y-3 overflow-y-auto pr-1">
        {data.map((d, i) => {
          const pct = Math.round((d.value / maxValue) * 100);
          return (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">{d.label}</span>
                <span className="font-mono text-indigo-400 font-bold">{d.value}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ChartContainer>
  );
};
