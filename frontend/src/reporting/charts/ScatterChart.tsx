import React from "react";
import { ChartContainer, ChartContainerProps } from "./ChartContainer";
import { DataPoint } from "./types";
import { MOCK_SCATTER_DATA } from "./mockAnalyticsData";

export interface ScatterChartProps extends Omit<ChartContainerProps, "children"> {
  data?: DataPoint[];
}

export const ScatterChart: React.FC<ScatterChartProps> = ({
  data = MOCK_SCATTER_DATA,
  ...containerProps
}) => {
  const width = 500;
  const height = 200;
  const padding = 30;

  return (
    <ChartContainer {...containerProps}>
      <div className="relative w-full h-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {/* Axis lines */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#334155"
            strokeWidth="1"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="#334155"
            strokeWidth="1"
          />

          {data.map((d, i) => {
            const x = padding + ((d.value || 50) / 100) * (width - padding * 2);
            const y = height - padding - ((d.secondaryValue || 50) / 100) * (height - padding * 2);

            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="#6366f1"
                  stroke="#818cf8"
                  strokeWidth="2"
                  className="hover:r-8 transition-all cursor-pointer opacity-80"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </ChartContainer>
  );
};
