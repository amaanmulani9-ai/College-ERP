import React from "react";
import { ChartContainer, ChartContainerProps } from "./ChartContainer";
import { DataPoint } from "./types";
import { MOCK_SCATTER_DATA } from "./mockAnalyticsData";

export interface BubbleChartProps extends Omit<ChartContainerProps, "children"> {
  data?: DataPoint[];
}

export const BubbleChart: React.FC<BubbleChartProps> = ({
  data = MOCK_SCATTER_DATA,
  ...containerProps
}) => {
  const width = 500;
  const height = 200;
  const padding = 30;
  const colors = ["#6366f1", "#06b6d4", "#10b981", "#a855f7", "#f59e0b"];

  return (
    <ChartContainer {...containerProps}>
      <div className="relative w-full h-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {data.map((d, i) => {
            const x = padding + ((d.value || 50) / 100) * (width - padding * 2);
            const y = height - padding - ((d.secondaryValue || 50) / 100) * (height - padding * 2);
            const radius = 8 + (i % 4) * 6;

            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={radius}
                fill={colors[i % colors.length]}
                fillOpacity="0.6"
                stroke={colors[i % colors.length]}
                strokeWidth="2"
                className="hover:opacity-90 transition-all cursor-pointer"
              />
            );
          })}
        </svg>
      </div>
    </ChartContainer>
  );
};
