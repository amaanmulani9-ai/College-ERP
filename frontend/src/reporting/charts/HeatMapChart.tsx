import React from "react";
import { ChartContainer, ChartContainerProps } from "./ChartContainer";
import { MOCK_HEATMAP_DATA } from "./mockAnalyticsData";

export interface HeatMapChartProps extends Omit<ChartContainerProps, "children"> {
  data?: typeof MOCK_HEATMAP_DATA;
}

export const HeatMapChart: React.FC<HeatMapChartProps> = ({
  data = MOCK_HEATMAP_DATA,
  ...containerProps
}) => {
  const hours = ["h8", "h10", "h12", "h14", "h16"];
  const hourLabels = ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM"];

  const getColorClass = (val: number) => {
    if (val > 90) return "bg-indigo-600 text-white font-bold";
    if (val > 80) return "bg-indigo-700/80 text-slate-100";
    if (val > 60) return "bg-indigo-900/60 text-slate-300";
    return "bg-slate-800 text-slate-400";
  };

  return (
    <ChartContainer {...containerProps}>
      <div className="w-full h-full flex flex-col justify-center overflow-x-auto">
        <div className="grid grid-cols-6 gap-2 text-center text-xs font-mono">
          <div className="text-slate-500 font-bold">Day/Time</div>
          {hourLabels.map((hl) => (
            <div key={hl} className="text-slate-400 font-semibold">{hl}</div>
          ))}

          {data.map((row) => (
            <React.Fragment key={row.day}>
              <div className="flex items-center justify-center font-bold text-slate-300 bg-slate-900 rounded py-1.5 border border-slate-800">
                {row.day}
              </div>
              {hours.map((hKey) => {
                const val = (row as any)[hKey] || 0;
                return (
                  <div
                    key={hKey}
                    className={`flex items-center justify-center rounded py-1.5 border border-slate-700/50 transition-all ${getColorClass(
                      val
                    )}`}
                    title={`${row.day} ${hKey}: ${val}%`}
                  >
                    {val}%
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </ChartContainer>
  );
};
