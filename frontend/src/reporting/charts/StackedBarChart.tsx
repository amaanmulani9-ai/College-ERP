import React from "react";
import { ChartContainer, ChartContainerProps } from "./ChartContainer";
import { DataPoint } from "./types";
import { MOCK_STACKED_BAR_DATA } from "./mockAnalyticsData";
import { ChartLegend } from "./ChartLegend";

export interface StackedBarChartProps extends Omit<ChartContainerProps, "children"> {
  data?: DataPoint[];
}

export const StackedBarChart: React.FC<StackedBarChartProps> = ({
  data = MOCK_STACKED_BAR_DATA,
  ...containerProps
}) => {
  const keys = ["CS", "ECE", "ME", "AI"];
  const colors: Record<string, string> = {
    CS: "#6366f1",
    ECE: "#06b6d4",
    ME: "#10b981",
    AI: "#a855f7",
  };

  const width = 500;
  const height = 200;
  const padding = 35;
  const barWidth = 40;

  return (
    <ChartContainer {...containerProps}>
      <div className="flex flex-col justify-between w-full h-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {data.map((d, i) => {
            const x = padding + i * 110 + 25;
            let currentY = height - padding;

            return (
              <g key={i}>
                {keys.map((k) => {
                  const val = (d[k] as number) || 0;
                  const segmentHeight = (val / 1000) * (height - padding * 2);
                  currentY -= segmentHeight;

                  return (
                    <rect
                      key={k}
                      x={x}
                      y={currentY}
                      width={barWidth}
                      height={segmentHeight}
                      fill={colors[k]}
                      rx="2"
                    />
                  );
                })}
                <text
                  x={x + barWidth / 2}
                  y={height - 10}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>

        <ChartLegend
          items={keys.map((k) => ({ id: k, name: k, color: colors[k] }))}
        />
      </div>
    </ChartContainer>
  );
};
