import React, { useState } from "react";
import { ChartContainer, ChartContainerProps } from "./ChartContainer";
import { DataPoint } from "./types";
import { MOCK_BAR_DATA } from "./mockAnalyticsData";
import { ChartTooltip } from "./ChartTooltip";

export interface BarChartProps extends Omit<ChartContainerProps, "children"> {
  data?: DataPoint[];
}

export const BarChart: React.FC<BarChartProps> = ({
  data = MOCK_BAR_DATA,
  ...containerProps
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxValue = Math.max(...data.map((d) => d.value), 100);

  const width = 500;
  const height = 200;
  const padding = 35;
  const barWidth = ((width - padding * 2) / data.length) * 0.6;

  return (
    <ChartContainer {...containerProps}>
      <div className="relative w-full h-full flex flex-col justify-between">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {data.map((d, i) => {
            const x =
              padding +
              i * ((width - padding * 2) / data.length) +
              ((width - padding * 2) / data.length - barWidth) / 2;
            const barHeight = (d.value / maxValue) * (height - padding * 2);
            const y = height - padding - barHeight;

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="4"
                  fill={hoveredIndex === i ? "#818cf8" : "#6366f1"}
                  className="transition-colors cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                <text
                  x={x + barWidth / 2}
                  y={height - 10}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {d.category || d.label.substring(0, 4)}
                </text>
              </g>
            );
          })}
        </svg>

        {hoveredIndex !== null && (
          <ChartTooltip
            title={data[hoveredIndex].label}
            items={[{ label: "Volume", value: data[hoveredIndex].value, color: "#6366f1" }]}
          />
        )}
      </div>
    </ChartContainer>
  );
};
