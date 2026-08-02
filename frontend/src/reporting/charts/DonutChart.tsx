import React from "react";
import { ChartContainer, ChartContainerProps } from "./ChartContainer";
import { DataPoint } from "./types";
import { MOCK_PIE_DATA } from "./mockAnalyticsData";
import { ChartLegend } from "./ChartLegend";

export interface DonutChartProps extends Omit<ChartContainerProps, "children"> {
  data?: DataPoint[];
  centerLabel?: string;
  centerValue?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data = MOCK_PIE_DATA,
  centerLabel = "Total Share",
  centerValue = "100%",
  ...containerProps
}) => {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  let cumulativeAngle = 0;

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <ChartContainer {...containerProps}>
      <div className="flex flex-col items-center justify-between w-full h-full">
        <div className="relative w-44 h-44 my-auto flex items-center justify-center">
          <svg viewBox="-1 -1 2 2" className="w-full h-full transform -rotate-90">
            {data.map((d, i) => {
              const startPercent = cumulativeAngle / total;
              cumulativeAngle += d.value;
              const endPercent = cumulativeAngle / total;

              const [startX, startY] = getCoordinatesForPercent(startPercent);
              const [endX, endY] = getCoordinatesForPercent(endPercent);

              const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0;

              const pathData = [
                `M ${startX} ${startY}`,
                `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                `L 0 0`,
              ].join(" ");

              return (
                <path
                  key={i}
                  d={pathData}
                  fill={d.color || "#6366f1"}
                  stroke="#0f172a"
                  strokeWidth="0.02"
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              );
            })}
          </svg>
          {/* Donut Center Mask */}
          <div className="absolute w-28 h-28 bg-slate-950 rounded-full flex flex-col items-center justify-center text-center p-2 border border-slate-800 shadow-inner">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{centerLabel}</span>
            <span className="text-base font-bold text-slate-100 font-mono">{centerValue}</span>
          </div>
        </div>

        <ChartLegend
          items={data.map((d, i) => ({
            id: `donut-${i}`,
            name: `${d.label} (${d.value}%)`,
            color: d.color || "#6366f1",
          }))}
        />
      </div>
    </ChartContainer>
  );
};
