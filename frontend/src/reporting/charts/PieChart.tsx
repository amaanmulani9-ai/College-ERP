import React from "react";
import { ChartContainer, ChartContainerProps } from "./ChartContainer";
import { DataPoint } from "./types";
import { MOCK_PIE_DATA } from "./mockAnalyticsData";
import { ChartLegend } from "./ChartLegend";

export interface PieChartProps extends Omit<ChartContainerProps, "children"> {
  data?: DataPoint[];
}

export const PieChart: React.FC<PieChartProps> = ({
  data = MOCK_PIE_DATA,
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
        <div className="relative w-44 h-44 my-auto">
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
        </div>

        <ChartLegend
          items={data.map((d, i) => ({
            id: `pie-${i}`,
            name: `${d.label} (${d.value}%)`,
            color: d.color || "#6366f1",
          }))}
        />
      </div>
    </ChartContainer>
  );
};
