import React from "react";
import { ChartContainer, ChartContainerProps } from "./ChartContainer";
import { SeriesData } from "./types";
import { MOCK_LINE_SERIES } from "./mockAnalyticsData";

export interface AreaChartProps extends Omit<ChartContainerProps, "children"> {
  series?: SeriesData[];
}

export const AreaChart: React.FC<AreaChartProps> = ({
  series = MOCK_LINE_SERIES,
  ...containerProps
}) => {
  const primary = series[0] || MOCK_LINE_SERIES[0];
  const data = primary.data;
  const maxValue = Math.max(...data.map((d) => d.value), 100);

  const width = 500;
  const height = 200;
  const padding = 30;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (d.value / maxValue) * (height - padding * 2);
    return `${x},${y}`;
  });

  const areaPath = `M ${padding},${height - padding} L ${points.join(" L ")} L ${
    width - padding
  },${height - padding} Z`;

  return (
    <ChartContainer {...containerProps}>
      <div className="relative w-full h-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaPath} fill="url(#areaGradient)" />

          {/* Top Line */}
          <polyline
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            strokeLinecap="round"
            points={points.join(" ")}
          />

          {/* Dots */}
          {data.map((d, i) => {
            const x = padding + (i / (data.length - 1)) * (width - padding * 2);
            const y = height - padding - (d.value / maxValue) * (height - padding * 2);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill="#818cf8"
                stroke="#0f172a"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>
    </ChartContainer>
  );
};
